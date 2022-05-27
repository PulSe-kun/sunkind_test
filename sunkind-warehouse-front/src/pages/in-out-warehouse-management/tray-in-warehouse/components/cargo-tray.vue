<template>
  <a-drawer
    placement="top"
    :closable="false"
    :maskClosable="false"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog"
    @close="onClose"
  >
    <div class="dialog-header">
      <span>载物托盘入库</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="dialog-footer">
      <a-steps :current="current" labelPlacement="vertical">
        <a-step title="扫描托盘" />
        <a-step title="绑定物料" />
        <a-step title="入库" />
      </a-steps>
      <div class="dialog-content" v-if="current == 0">
        <div class="input_style">
          <a-input
            size="large"
            ref="input"
            @pressEnter="pressEnter"
            @focus="focusInput"
            v-model="palletName"
            placeholder="请扫码或输入托盘条码"
            style="width: 240px"
          />
        </div>
      </div>
      <div class="dialog-content-two" v-if="current == 1">
        <div class="header">
          <div>
            <span>{{ palletTitle.palletCode }}</span>
            <span style="margin-left: 15px; color: #999">
              {{
              palletTitle.palletName
              }}
            </span>
          </div>
          <a-select
            :allowClear="true"
            show-search
            :value="value"
            placeholder="请扫描或输入物料编码、名称、型号"
            style="width: 400px"
            @search="handleSearch"
            @change="handleChange_code"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :autoFocus="true"
          >
            <a-icon slot="suffixIcon" type="search" />
            <a-select-option v-for="d in data" :key="d.matterId">{{ d.extendA }}</a-select-option>
          </a-select>
        </div>
        <div class="table">
          <a-spin :spinning="spinning">
            <a-config-provider :locale="locale" v-if="dataList.length">
              <a-table
                :columns="columnsAll"
                :data-source="dataList"
                :pagination="pagination"
                @change="handleChange"
                :rowKey="
                  (record, index) => {
                    return record.matterId;
                  }
                "
              >
                <template slot="matterNum" slot-scope="text, item">
                  <a-input-number v-model="item.matterNum" :min="1" :max="100000" @change="onChange(item)" />
                </template>
                <template slot="title_slot">
                  <span style="margin-right: 8px">操作</span>
                </template>
                <template slot="action" slot-scope="text, item">
                  <!-- <a-popconfirm
                    v-if="dataList.length"
                    title="确定移除该物料?"
                    @confirm="() => delmatter(item.matterId)"
                  >-->
                  <a @click="delmatter(item.matterId)" title="移除">
                    <img style="width: 25px; height: 28px" src="@/assets/img/remove.png" alt />
                  </a>
                  <!-- </a-popconfirm> -->
                </template>
              </a-table>
            </a-config-provider>
            <Empty text="暂无数据" v-else />
          </a-spin>
        </div>
      </div>
      <div class="dialog-contents" v-if="current == 2">
        <div>
          <span>托盘：</span>
          <span>{{ form.palletCode }}</span>
        </div>
        <div>
          <span>物料：</span>
          <span>{{ form.material }}</span>
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
          <span>载物托盘状态：</span>
          <span
            v-for="(item, index) in palletStatus"
            :key="index"
            class="span_btn"
            :style="{
              background: item.state ? '#385CEF' : '#FFFFFF',
              color: item.state ? '#FFFFFF' : '#3A5EEF',
            }"
            @click="changePalletStatus(index, item)"
          >{{ item.name }}</span>
        </div>
      </div>
      <div class="dialog-btn" :style="{
          'justify-content': current == 0 ? 'flex-end' : 'space-between',
        }">
        <a-button class="btn-prev cancel-style" v-if="current == 1 || current == 2" @click="prev">上一步</a-button>
        <a-button class="btn primary-style" v-if="current == 2" type="primary" @click="put_inStorage">入库</a-button>
        <a-button class="btn primary-style" v-if="current == 0" type="primary" @click="next">下一步</a-button>
        <a-button class="btn primary-style" v-if="current == 1" type="primary" @click="next">绑定物料，下一步</a-button>
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
import Empty from '@/components/Empty/index'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { unit, getSubStr } from '@/utils/utils'
import {
  findPalletCode,
  getMatterbindings,
  getMatters,
  matterBindingNew,
  findConveyers,
  findFeeders,
  putStorage
} from '../../../../services/api_in_out'
const columnsAll = [
  {
    title: '名称',
    dataIndex: 'matterName',
    check: true,
    align: 'center'
  },
  {
    title: '编码',
    dataIndex: 'matterCode',
    check: true,
    align: 'center'
  },
  {
    title: '型号',
    dataIndex: 'matterMarking',
    check: true,
    align: 'center'
  },
  {
    title: '数量',
    dataIndex: 'matterNum',
    check: true,
    scopedSlots: { customRender: 'matterNum' },
    align: 'center'
  },
  {
    title: '单位',
    dataIndex: '_matterUnit',
    check: true,
    align: 'center'
  },
  {
    width: 150,
    dataIndex: 'operate',
    scopedSlots: { title: 'title_slot', customRender: 'action' },
    align: 'center'
  }
]
export default {
  data() {
    return {
      value: undefined,
      data: [],
      visible: false,
      visible_dialog: false,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      dataList: [],
      spinning: false,
      pagination: {
        total: 0,
        defaultPageSize: 10, // 每页显示几条数据
        showSizeChanger: true, // 显示下拉选项（每页几条）
        showTotal: total => `共 ${total} 条数据`,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
      },
      columnsAll,
      current: 0,
      palletName: '',
      palletTitle: null,
      form: {
        palletCode: '',
        material: '',
        warehouseName: '',
        strongebinInfo: ''
      },
      conveyers: [],
      palletStatus: [
        {
          name: '满盘',
          state: false,
          id: '2'
        },
        {
          name: '有空余',
          state: false,
          id: '1'
        }
      ],
      feederId: '', // 料架
      storagebinId: '', // 库位
      palletStatusId: '', //0空盘 1有空余 2满盘
      conveyerId: '', //传送线
      list: []
    }
  },
  components: {
    Empty
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
    /**查询物料 */
    handleSearch(value) {
      // console.log(1, value);
      getMatters(value).then(res => {
        // console.log(res);
        this.data = res.data
      })
    },
    /**选择物料 */
    handleChange_code(value) {
      getMatters(value, 'matterId').then(res => {
        console.log(res)
        let flag = true
        // for (let i = 0; i < res.data.length; i++) {
        res.data[0]['_matterUnit'] = unit(res.data[0].matterUnit)
        for (let j = 0; j < this.dataList.length; j++) {
          if (res.data[0].matterId == this.dataList[j].matterId) {
            this.dataList[j].matterNum = this.dataList[j].matterNum + 1
            flag = false
          }
        }
        // }
        if (flag) {
          this.dataList.push(res.data[0])
        }
        this.value = undefined
        this.data = []
      })
    },
    /**移除物料 */
    delmatter(matterId) {
      const dataList = [...this.dataList]
      this.dataList = dataList.filter(item => item.matterId !== matterId)
    },
    onChange(item) {
      console.log(item)
    },
    handleChange(pagination) {
      // console.log(pagination);
      let params = {
        limit: pagination.pageSize,
        page: pagination.current
      }
      this.getLog_data(params)
    },
    getMatterbindingsData(id) {
      getMatterbindings(id).then(res => {
        console.log(res)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i]['_matterUnit'] = unit(res.data[i].matterUnit)
        }
        this.dataList = res.data
      })
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
    /**选择托盘状态 */
    changePalletStatus(index, item) {
      for (let i = 0; i < this.palletStatus.length; i++) {
        this.palletStatus[i].state = false
      }
      this.palletStatusId = item.id
      this.palletStatus[index].state = true
      this.$forceUpdate()
    },
    next() {
      // this.current++;
      if (this.current == 0) {
        /**根据托盘拿到物料得数据 */
        if (this.palletName == '') {
          this.$message.warning('托盘条码不能为空！')
          return
        }
        findPalletCode(this.palletName, 1).then(res => {
          if (res.code === 0) {
            this.palletTitle = res.data
            this.current = 1
            this.getMatterbindingsData(this.palletTitle.palletCode)
          }
        })
      } else if (this.current == 1) {
        console.log(this.dataList)
        if (this.dataList.length == 0) {
          this.$message.warning('请至少绑定1个物料！')
          return
        }
        for (let i = 0; i < this.dataList.length; i++) {
          this.dataList[i]['palletCode'] = this.palletTitle.palletCode
          this.dataList[i]['palletId'] = this.palletTitle.palletId
        }
        /** 绑定物料并返回自动匹配的料架和库位*/
        let params = {
          matterbindingDTOS: this.dataList,
          warehouseId: JSON.parse(sessionStorage.getItem('warehouseput')).warehouseId
        }
        matterBindingNew(params).then(res => {
          // console.log(res);
          if (res.code === 0) {
            this.form.strongebinInfo = res.data.name
            this.storagebinId = res.data.storagebinId
            console.log(res.data.name.split(','))
            this.feederId = res.data.name.split(',')[0]
            let sum = 0
            for (let i = 0; i < this.dataList.length; i++) {
              sum += this.dataList[i].matterNum
            }
            this.form.palletCode = this.palletTitle.palletCode
            this.form.material = '共' + this.dataList.length + '种，合计' + sum + '件'
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
            this.$message.success('物料绑定成功!')
            this.current = 2
          }
        })
      }
    },
    prev() {
      this.current--
      if (this.current == 0) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.focusInput()
        }, 100)
      }
    },
    /**选择库位 */
    changeCard(card, ind, index) {
      if (card.storagebinStatus == 0) {
        // this.$set(this.list[index].storagebinDTOS[ind], "storagebinStatus", 1);
        // this.$forceUpdate(this.list[index].storagebinDTOS, ind);
        this.form.strongebinInfo = this.list[index].feederName + '，' + card.storagebinLine + '行' + card.storagebinRow + '列'
        this.storagebinId = card.storagebinId
        this.feederId = card.feederId
        this.visible_dialog = false
      } else {
        this.$message.warning('该库位有托盘或入库锁定，请选择白色区域库位')
      }
    },
    /**入库 */
    put_inStorage() {
      if (this.conveyerId == '') {
        this.$message.warning('请选择传送线')
        return
      }
      if (this.palletStatusId == '') {
        this.$message.warning('请选择托盘状态')
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
          this.current = 0
          this.visible = false
          this.$emit('reload')
        }
      })
    },
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.focusInput()
        }, 100)
      }
    },
    /**判断是否获取焦点 */
    focus(e) {
      // console.log("获取焦点");
    },
    /**判断是否失去焦点 */
    blur(e) {
      if (this.current == 0) {
        setTimeout(() => {
          document.getElementsByTagName('input')[0].focus()
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
    max-width: 1040px;
    height: auto !important;
    background: #f5f4f4;
    border-radius: 5px;
    overflow: hidden;
    .ant-drawer-body {
      padding: 0;
      .dialog-header {
        position: relative;
        max-width: 1040px;
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
          padding: 50px 40px 0 40px;
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
          .input_style {
            position: relative;
            width: 240px;
            height: 40px;
            .ant-input {
              position: absolute;
              left: 0;
              top: 0;
              font-size: 20px;
              font-weight: 400;
              // color: #cccccc;
              border: none;
              box-shadow: none;
            }
          }
        }
        .dialog-content-two {
          padding: 20px;
          margin-bottom: 67px;
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .table {
            background: #ffffff;
            border: 1px solid #dedddd;
          }
        }
        .dialog-contents {
          //   margin: 61px 121px 149px 114px;
          width: 400px;
          margin: 61px auto 149px;
          > div {
            margin-bottom: 29px;
            overflow: hidden;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            span:first-child {
              display: inline-block;
              text-align: right;
              width: 140px;
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
            span:last-child {
              font-size: 18px;
              font-weight: 600;
              color: #000000;
            }
          }
          > div:nth-child(3) {
            span:first-child {
              &:before {
                display: inline-block;
                margin-right: 4px;
                color: #f5222d;
                font-size: 14px;
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
          > div:nth-child(4) {
            span:first-child {
              &:before {
                display: inline-block;
                margin-right: 4px;
                color: #f5222d;
                font-size: 14px;
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
          > div:nth-child(5) {
            span:first-child {
              &:before {
                display: inline-block;
                margin-right: 4px;
                color: #f5222d;
                font-size: 14px;
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
        }
        .dialog-btn {
          //   position: absolute;
          //   bottom: 27px;
          //   left: 0;
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