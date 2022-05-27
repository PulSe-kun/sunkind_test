<template>
  <a-drawer
    placement="top"
    :closable="false"
    :maskClosable="false"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog"
  >
    <div class="dialog-header">
      <span>空托盘入库</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="dialog-footer">
      <a-steps :current="current" labelPlacement="vertical">
        <a-step title="扫描托盘" />
        <a-step title="绑定物料" />
      </a-steps>
      <div class="dialog-content" v-if="current == 0">
        <a-input
          placeholder="请扫码或输入托盘条码"
          ref="input"
          @pressEnter="pressEnter"
          @focus="focusInput"
          v-model="palletName"
          style="width: 240px"
        />
      </div>
      <div class="dialog-contents" v-if="current == 1">
        <div>
          <span>托盘：</span>
          <span>{{ form.palletCode }}</span>
        </div>
        <div>
          <span>料架和库位：</span>
          <span @click="visible_dialog = true">{{ form.strongebinInfo }}</span>
        </div>
        <div>
          <span>传送线：</span>
          <span
            v-for="(item, index) in conveyers"
            :key="index"
            class="span_btn"
            :title="item.conveyerName"
            :style="{
              background: item.state ? '#385CEF' : '#FFFFFF',
              color: item.state ? '#FFFFFF' : '#3A5EEF',
            }"
            @click="changeConveyes(index, item)"
          >{{ item._conveyerName }}</span>
        </div>
        <div>
          <span>托盘状态：</span>
          <span>空盘</span>
        </div>
      </div>
      <div class="dialog-btn" :style="{
          'justify-content': current == 0 ? 'flex-end' : 'space-between',
        }">
        <a-button class="btn-prev cancel-style" v-if="current == 1" @click="prev">上一步</a-button>
        <a-button class="btn primary-style" v-if="current == 1" type="primary" @click="put_inStorage">入库</a-button>
        <a-button class="btn primary-style" v-else type="primary" @click="next">下一步</a-button>
      </div>
    </div>
    <a-modal
      v-model="visible_dialog"
      :closable="false"
      :bodyStyle="{
        padding: '0px',
        width: '620px',
        height: '667px',
      }"
      :mask="false"
      wrapClassName="visible_dialog"
      :footer="null"
    >
      <div class="visible_dialog-header">
        <span>选择库位</span>
        <a-icon type="close" @click="visible_dialog = false" />
      </div>
      <div class="tab-content">
        <div class="tab-content-type">
          <ul>
            <li>
              <span></span>
              <span>有托盘或入库锁定</span>
            </li>
            <li>
              <span></span>
              <span>无托盘</span>
            </li>
          </ul>
        </div>
        <div class="tab-content-model" v-for="(item, index) in list" :key="index">
          <div class="model-title">{{ item.feederName }}</div>
          <div class="model-wrap">
            <ul>
              <li
                v-for="(card, ind) in item.storagebinDTOS"
                :key="ind"
                :class="{ isActive: card.storagebinStatus !== 0 }"
                :style="{
                  background:
                    card.storagebinStatus == 0 ? '#f5f5f5' : '#ff9437',
                }"
                @click="changeCard(card, ind, index)"
              >
                <span>{{ card.storagebinName }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </a-modal>
  </a-drawer>
</template>
<script>
import { findPalletCode, getFeederAndStragebin, findFeeders, findConveyers, putStorage } from '../../../../services/api_in_out'
import { getSubStr } from '@/utils/utils'
export default {
  data() {
    return {
      palletName: '',
      visible: false,
      visible_dialog: false,
      current: 0,
      conveyers: [],
      feederId: '', // 料架
      storagebinId: '', // 库位
      palletStatusId: '0', //0空盘 1有空余 2满盘
      conveyerId: '', //传送线
      palletTitle: null,
      form: {
        palletCode: '',
        strongebinInfo: ''
      },
      list: []
    }
  },
  methods: {
    focusInput() {
      // console.log("获取焦点");
      this.$refs.input.focus()
    },
    /**回车 */
    pressEnter() {
      // console.log("回车");
      this.next()
    },
    /**选择传送线 */
    changeConveyes(index, item) {
      for (let i = 0; i < this.conveyers.length; i++) {
        this.conveyers[i].state = false
      }
      this.conveyerId = item.conveyerId
      this.conveyers[index].state = true
      this.$forceUpdate()
    },
    /**入库 */
    put_inStorage() {
      if (this.conveyerId == '') {
        this.$message.warning('请选择传送线')
        return
      }
      let params = {
        palletCode: this.palletTitle.palletCode,
        conveyerId: this.conveyerId,
        feederId: this.feederId,
        palletStatus: this.palletStatusId,
        storagebinId: this.storagebinId,
        warehouseId: JSON.parse(sessionStorage.getItem('warehouseput')).warehouseId
      }
      // console.log(params);
      putStorage(params).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.$message.success('入库成功')
          this.palletName = ''
          this.visible = false
          this.current = 0
          this.$emit('reload')
        }
      })
    },
    next() {
      if (this.current == 0) {
        /**根据托盘拿到物料得数据 */
        if (this.palletName == '') {
          this.$message.warning('托盘条码不能为空！')
          return
        }
        findPalletCode(this.palletName, 1).then(res => {
          console.log(res.data)
          if (res.code === 0) {
            this.palletTitle = res.data
            this.form.palletCode = this.palletTitle.palletCode + '(' + this.palletTitle.palletName + ')'
            getFeederAndStragebin(JSON.parse(sessionStorage.getItem('warehouseput')).warehouseId).then(res => {
              console.log(res)
              this.form.strongebinInfo = res.data.name
              this.storagebinId = res.data.storagebinId
              this.feederId = res.data.name.split(',')[0]
            })
            /**获取传送线 */
            findConveyers({
              conveyerType: 0,
              warehouseId: JSON.parse(sessionStorage.getItem('warehouseput')).warehouseId
            }).then(res => {
              // console.log(res);
              res.data.map(v => {
                v['state'] = false
                v['_conveyerName'] = getSubStr(v.conveyerName)
              })
              this.conveyers = res.data
            })
            findFeeders(JSON.parse(sessionStorage.getItem('warehouseput')).warehouseId).then(res => {
              console.log(res)
              this.list = res.data
            })
            this.current = 1
          }
        })
      }
    },
    /**选择库位 */
    changeCard(card, ind, index) {
      if (card.storagebinStatus == 0) {
        this.form.strongebinInfo = this.list[index].feederName + '，' + card.storagebinLine + '行' + card.storagebinRow + '列'
        this.storagebinId = card.storagebinId
        this.feederId = card.feederId
        this.visible_dialog = false
      } else {
        this.$message.warning('该库位有托盘或入库锁定，请选择白色区域库位')
      }
    },
    prev() {
      this.current = 0
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.focusInput()
      }, 100)
    },
    afterVisibleChange(val) {
      console.log('visible', val)
      if (val) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.focusInput()
        }, 100)
      }
    },
    onClose() {
      this.current = 0
      this.palletName = ''
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.dialog {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /deep/.ant-drawer-content-wrapper {
    max-width: 620px;
    height: auto !important;
    background: #f5f4f4;
    border-radius: 5px;
    overflow: hidden;
    .ant-drawer-body {
      padding: 0;
      .dialog-header {
        position: relative;
        max-width: 620px;
        height: 67px;
        line-height: 66px;
        background: #2964ff;
        box-shadow: 0px 0px 5px 0px rgba(110, 110, 110, 0.36);
        padding-left: 20px;
        text-align: left;
        span {
          font-size: 22px;
          font-weight: 500;
          color: #ffffff;
        }
        i {
          position: absolute;
          top: 29px;
          right: 20px;
          font-size: 15px;
          color: #fff;
          cursor: pointer;
        }
      }
      .dialog-footer {
        position: relative;
        margin: 20px;
        max-height: 863px;
        overflow: auto;
        background: #ffffff;
        box-shadow: -2px 2px 7px 0px rgba(179, 179, 179, 0.4);
        border-radius: 5px;
        .ant-steps {
          padding: 50px 101px 0 115px;
        }
        .dialog-content {
          height: 110px;
          background: #ffffff;
          border: 1px solid #cecece;
          border-radius: 3px;
        }
        .dialog-content {
          margin: 31px 100px 260px 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          .ant-input {
            font-size: 20px;
            font-weight: 400;
            border: none;
            box-shadow: none;
          }
        }
        .dialog-contents {
          margin: 61px 121px 149px 114px;
          > div {
            margin-bottom: 29px;
            overflow: hidden;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            span:first-child {
              display: inline-block;
              text-align: right;
              width: 120px;
              font-size: 18px;
              font-weight: 400;
              color: #999;
            }
          }
          > div:nth-child(1) {
            span:last-child {
              font-size: 18px;
              font-weight: 600;
              color: #000000;
            }
          }
          > div:nth-child(2) {
            span:first-child {
              &:before {
                display: inline-block;
                margin-right: 4px;
                color: #f5222d;
                font-size: 14px;
                font-family: SimSun, sans-serif;
                line-height: 1;
                content: '*';
              }
            }
            span:last-child {
              font-size: 18px;
              font-weight: 600;
              text-decoration: underline;
              color: #3a5eef;
              cursor: pointer;
            }
          }
          > div:nth-child(3) {
            span:first-child {
              &:before {
                display: inline-block;
                margin-right: 4px;
                color: #f5222d;
                font-size: 14px;
                font-family: SimSun, sans-serif;
                line-height: 1;
                content: '*';
              }
            }
            .span_btn {
              display: inline-block;
              // max-width: 50px;
              height: 40px;
              text-align: center;
              line-height: 40px;
              border-radius: 3px;
              color: #3a5eef;
              border: 1px solid;
              border-color: #3a5eef;
              cursor: pointer;
              margin-right: 10px;
              padding: 0 5px;
              margin-top: 5px;
              float: left;
            }
          }
          > div:nth-child(4) {
            span:last-child {
              font-size: 18px;
              font-weight: 600;
              color: #000000;
            }
          }
        }
        .dialog-btn {
          // position: absolute;
          // bottom: 27px;
          // left: 0;
          margin-bottom: 27px;
          padding-left: 59px;
          padding-right: 50px;
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
      }
    }
  }
}
.visible_dialog {
  .visible_dialog-header {
    position: relative;
    width: 620px;
    height: 48px;
    line-height: 48px;
    background: #fff;
    padding-left: 21px;
    span {
      font-size: 22px;
      font-weight: 500;
      color: #000;
    }
    i {
      position: absolute;
      top: 18px;
      right: 26px;
      font-size: 12px;
      color: #000;
      cursor: pointer;
    }
  }
  .tab-content {
    height: calc(100% - 48px);
    padding: 0 14px;
    position: relative;
    overflow: auto;
    .tab-content-type {
      position: absolute;
      right: 5px;
      top: 0;
      & > ul {
        li {
          list-style: none;
          float: left;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-right: 30px;
          span:first-child {
            display: inline-block;
            width: 17px;
            height: 17px;
            border-radius: 2px;
            margin-right: 5px;
          }
          span:last-child {
            font-size: 18px;
            font-weight: 400;
            color: #070707;
          }
        }
        li:nth-child(1) {
          span:first-child {
            background: #ff9437;
          }
        }
        li:nth-child(2) {
          span:first-child {
            background: #f5f5f5;
          }
        }
      }
    }
    > div:nth-child(2) {
      padding-top: 0;
    }
    .tab-content-model {
      padding-top: 21px;
      .model-title {
        font-size: 18px;
        font-weight: 400;
        color: #070707;
      }
      .model-wrap {
        margin-top: 11px;
        overflow: hidden;
        & > ul {
          margin: 0;
          padding: 0;
          .isActive {
            span:first-child {
              color: #ffffff;
            }
            span:last-child {
              color: #ffffff;
            }
          }
          li {
            width: 110px;
            height: 80px;
            text-align: center;
            line-height: 80px;
            border-radius: 3px;
            margin-right: 5px;
            margin-bottom: 4px;
            list-style: none;
            float: left;
            cursor: pointer;
            span {
              font-size: 18px;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
}
/deep/.ant-steps-item-process .ant-steps-item-icon {
  background: #385cef;
  border-color: #385cef;
}
/deep/.ant-steps-item-finish .ant-steps-item-icon {
  border-color: #385cef;
}
/deep/.ant-steps-item-icon {
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 25px;
}
/deep/.ant-steps-item-content {
  margin-left: 10px;
}
/deep/.ant-steps-label-vertical .ant-steps-item-tail {
  top: 21px;
  margin-left: 68px;
}
/deep/.ant-modal {
  width: 620px !important;
  left: 640px;
}
</style>