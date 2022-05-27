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
      <span>解绑物料</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="dialog-footer">
      <div class="dialog-content">
        <span v-if="itemData">
          {{
          itemData.palletCode + "(" + itemData.palletName + ")"
          }}
        </span>
        <div class="table">
          <a-spin :spinning="spinning">
            <a-config-provider :locale="locale" v-if="dataList.length">
              <a-table
                :rowKey="
                  (record, index) => {
                    return record.matterbindingId;
                  }
                "
                :pagination="false"
                :columns="columns"
                :data-source="dataList"
                :row-selection="rowSelection"
              >
                <template slot="_matterNum" slot-scope="text, item">
                  <a-input-number
                    id="inputNumber"
                    v-model="item._matterNum"
                    :min="1"
                    :max="item.matterNum"
                    :disabled="item.check"
                    @change="changeCheck"
                  />
                </template>
              </a-table>
            </a-config-provider>
            <a-empty description="暂无数据" v-else />
          </a-spin>
        </div>
        <div class="content-btn">
          <a-button class="btn cancel-style" @click="onClose">取消</a-button>
          <div>
            <span>已选：{{ changeObj.type_sum }}，合计{{ changeObj.sum }}件</span>
            <a-button class="btn primary-style" type="primary" @click="unbundling">确定解绑</a-button>
          </div>
        </div>
      </div>
    </div>
    <template>
      <a-modal
        v-model="visible_one"
        :closable="false"
        centered
        :bodyStyle="{
          padding: '0px',
          width: '530px',
          height: '274px',
        }"
        wrapClassName="state_dialog"
      >
        <div class="state_content">解绑成功，是否将此托盘回库？</div>
        <template slot="footer">
          <div class="footer_btn">
            <span @click="closeReturnMessage">不回库</span>
          </div>
          <div class="footer_btn">
            <span style="color: #1890ff" @click="visible_one_dialog">回库</span>
          </div>
        </template>
      </a-modal>
      <a-drawer
        placement="top"
        width="320"
        :closable="false"
        :maskClosable="false"
        :visible="visible_two"
        wrapClassName="visible_two_dialog"
      >
        <div class="dialog-header">
          <span>托盘回库</span>
          <a-icon type="close" @click="onChildrenDrawerClose" />
        </div>
        <div class="dialog-footer">
          <div class="footer-title-model" v-if="returnData">
            <a-descriptions :column="1">
              <a-descriptions-item label="托盘">
                <span>
                  {{
                  itemData.palletCode + "(" + itemData.palletName + ")"
                  }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="料架和库位">
                <span>
                  {{ this.returnData.feederName }},{{
                  this.returnData.storagebinLine
                  }}行{{ this.returnData.storagebinRow }}列
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="传送线">
                <span>
                  {{
                  this.returnData.conveyerName
                  }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="托盘载物状态">
                <span>{{ this.returnData.palletState }}</span>
              </a-descriptions-item>
            </a-descriptions>
            <div class="content-btn">
              <a-button class="btn cancel-style" @click="onChildrenDrawerClose">取消</a-button>
              <a-button class="btn primary-style" type="primary" @click="returnStore">回库</a-button>
            </div>
          </div>
        </div>
      </a-drawer>
    </template>
  </a-drawer>
</template>
<script>
import { getMatterbindings, getReturnStoragebinInof, putStorage, unbundlingNew } from '@/services/api_in_out'
import { getPalletState } from '@/utils/utils'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
const columnsAll = [
  {
    title: '物料名称',
    dataIndex: 'matterName',
    check: true,
    align: 'center'
  },
  {
    title: '物料型号',
    dataIndex: 'matterMarking',
    check: true,
    align: 'center'
  },
  {
    title: '物料编码',
    dataIndex: 'matterCode',
    check: true,
    align: 'center'
  },
  {
    title: '现有数量',
    dataIndex: 'matterNum',
    check: true,
    align: 'center'
  },
  {
    title: '解绑数量',
    dataIndex: '_matterNum',
    check: true,
    scopedSlots: { customRender: '_matterNum' },
    align: 'center'
  }
]

export default {
  props: {
    itemData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      conditions: '',
      conveyers: [],
      visible: false,
      visible_one: false,
      visible_two: false,
      spinning: false,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      dataList: [],
      columns: [],
      columnsAll,
      changeObj: {
        type_sum: 0,
        sum: 0
      },
      returnData: null
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          let _this = this
          // _this.changeData = {
          //   type_sum: 0,
          //   sum: 0,
          // };
          //   console.log(selectedRowKeys, selectedRows);
          if (selectedRows.length == _this.dataList.length) {
            for (let i = 0; i < selectedRows.length; i++) {
              selectedRows[i].check = false
              // _this.changeData.sum += selectedRows[i]["_matterNum"];
            }
            // _this.changeData.type_sum = selectedRows.length;
            this.$nextTick(function () {
              _this.changeData()
            })
          } else {
            if (selectedRows.length > 0) {
              for (let i = 0; i < _this.dataList.length; i++) {
                _this.dataList[i].check = true
                _this.$forceUpdate()
              }
              for (let i = 0; i < selectedRows.length; i++) {
                selectedRows[i].check = false
                // _this.changeData.sum += selectedRows[i]["_matterNum"];
              }
              // _this.changeData.type_sum = selectedRows.length;
              this.$nextTick(function () {
                _this.changeData()
              })
            } else if (selectedRows.length == 0) {
              for (let i = 0; i < _this.dataList.length; i++) {
                _this.dataList[i].check = true
                _this.$forceUpdate()
              }
              this.$nextTick(function () {
                _this.changeData()
              })
            }
          }
        }
      }
    }
  },
  methods: {
    /**改变数据 */
    changeData() {
      // console.log(this.dataList);
      let count = 0,
        sum = 0
      for (let i = 0; i < this.dataList.length; i++) {
        if (!this.dataList[i].check) {
          count++
          sum += this.dataList[i]._matterNum
        }
      }
      // console.log(count, sum);
      this.changeObj = {
        type_sum: count,
        sum: sum
      }
    },
    changeCheck() {
      this.$nextTick(function () {
        this.changeData()
      })
    },
    afterVisibleChange(val) {
      //   console.log("visible", val);
      if (val) {
        let list = []
        for (let i = 0; i < this.columnsAll.length; i++) {
          this.columnsAll[i].check = true
          if (this.columnsAll[i].check) {
            list.push(this.columnsAll[i])
          }
        }
        this.columns = list
        this.getMatterbindingsData(this.itemData.palletCode)
      }
    },
    /**获取载物托盘出库得数据 */
    getMatterbindingsData(palletCode) {
      this.spinning = true
      getMatterbindings(palletCode).then(res => {
        console.log(res)
        this.spinning = false
        for (let i = 0; i < res.data.length; i++) {
          res.data[i]['_matterNum'] = res.data[i].matterNum
          res.data[i]['check'] = true
        }
        this.dataList = res.data
      })
    },
    /**解绑物料 */
    unbundling() {
      let list = []
      let flag = false
      for (let i = 0; i < this.dataList.length; i++) {
        if (!this.dataList[i].check) {
          list.push(this.dataList[i])
          flag = true
        }
      }
      if (flag) {
        for (let i = 0; i < list.length; i++) {
          list[i].untieNum = list[i]._matterNum
        }
        let params = {
          matterbindingDTOS: list,
          warehousingId: this.itemData.warehousingId
        }
        // console.log(params);
        unbundlingNew(params).then(res => {
          // console.log(res);
          if (res.code === 0) {
            this.visible_one = true
          }
        })
      } else {
        this.$message.warning('请选择托盘！')
      }
    },
    closeReturnMessage() {
      this.visible = false
      this.visible_one = false
    },
    visible_one_dialog() {
      this.visible_one = false
      getReturnStoragebinInof(this.itemData.warehousingId).then(res => {
        if (res.code == 0) {
          this.returnData = res.data
          this.returnData.palletState = getPalletState(res.data.palletStatus)
          this.visible_two = true
        }
      })
    },
    returnStore() {
      let params = {
        conveyerId: this.returnData.conveyerId,
        feederId: this.returnData.feederId,
        palletCode: this.itemData.palletCode,
        palletStatus: this.returnData.palletStatus,
        warehouseId: this.returnData.warehouseId,
        storagebinId: this.returnData.storagebinId
      }
      //   console.log(params);
      putStorage(params).then(res => {
        console.log(res)
        if (res.code == 0) {
          this.visible_two = false
          this.visible_one = false
          this.visible = false
          this.$emit('reload')
          this.$message.success('已创建入库队列！')
        }
      })
    },
    onChildrenDrawerClose() {
      this.visible_two = false
      this.visible_one = false
      this.visible = false
      this.$emit('reload')
    },
    changeConveyer(item, value) {
      //   console.log(item, value);
      item.conveyerId = value
    },
    onClose() {
      this.changeObj = {
        type_sum: 0,
        sum: 0
      }
      this.dataList = []
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
        padding: 20px;
        max-height: 863px;
        overflow: auto;
        background: #f7f6fa;
        .dialog-content {
          padding: 20px;
          background: #fff;
          .content-btn {
            margin-top: 20px;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            div {
              > span {
                margin-right: 20px;
              }
            }
          }
          .table {
            min-height: 230px;
            margin-top: 20px;
            border-radius: 5px;
            border: 1px solid #e6e6e6;
          }
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
/deep/.ant-modal {
  width: 530px !important;
  height: 350px;
  .state_content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    font-weight: 400;
    color: #000000;
    span {
      font-weight: bold;
    }
  }
}
/deep/.ant-modal-footer {
  overflow: hidden;
  padding: 0;
  .footer_btn {
    width: 260px;
    height: 75px;
    text-align: center;
    line-height: 75px;
    float: left;
    span {
      cursor: pointer;
      font-size: 18px;
      font-weight: 400;
    }
  }
  .footer_btn:first-child {
    border-right: 1px solid #f2f2f2;
  }
}
</style>
<style lang="less" scoped>
.visible_two_dialog {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /deep/.ant-drawer-content-wrapper {
    width: 620px;
    height: auto !important;
    max-height: 960px;
    background: #f5f4f4;
    border-radius: 5px;
    overflow: hidden;
    .ant-drawer-body {
      padding: 0;
      .dialog-header {
        position: relative;
        width: 620px;
        height: 67px;
        line-height: 66px;
        background: #2964ff;
        box-shadow: 0px 0px 5px 0px rgba(110, 110, 110, 0.36);
        text-align: center;
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
        padding: 20px;
        overflow: auto;
        background: #f7f6fa;
        .footer-title-model {
          background: #ffffff;
          box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
          border-radius: 3px;
          padding: 20px;
          .ant-descriptions-row > td {
            padding-bottom: 30px !important;
            .ant-descriptions-item-content {
              font-size: 16px;
              font-weight: 600;
              color: #000000;
            }
          }
          .content-btn {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      }
    }
  }
}
/deep/.ant-drawer-mask {
  min-height: auto;
}
</style>