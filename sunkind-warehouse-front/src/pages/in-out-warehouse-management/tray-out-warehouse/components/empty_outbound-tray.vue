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
      <span>空托盘出库</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="dialog-footer">
      <div class="footer-title">
        <span></span>
        <h3>选择出库托盘</h3>
      </div>
      <div class="dialog-content">
        <div class="content-btn">
          <div>
            <span style="margin-right: 20px; color: #000000; font-weight: 600">选择出库托盘</span>
            <a-input-search v-model="conditions" placeholder="搜索托盘信息" style="width: 400px; text-align: center" @search="onSearch" />
          </div>
          <a-button class="btn primary-style" type="primary" @click="outbound">出库</a-button>
        </div>
        <div class="table">
          <a-spin :spinning="spinning">
            <a-config-provider :locale="locale" v-if="dataList.length">
              <a-table
                :rowKey="
                  (record, index) => {
                    return record.palletId;
                  }
                "
                :columns="columns"
                :data-source="dataList"
                :pagination="pagination"
                :row-selection="rowSelection"
                @change="handleChange"
              >
                <span slot="storagebinRow" slot-scope="text, item">{{ item.storagebinLine + "行" + item.storagebinRow + "列" }}</span>
                <template slot="mattertypeDTOList" slot-scope="text, item">
                  <div v-if="text == null">所有类型</div>
                  <div v-else>
                    <span v-for="(mattertype, ind) in item.mattertypeDTOList" :key="ind">
                      {{ mattertype.mattertypeName
                      }}{{
                      ind + 1 == item.mattertypeDTOList.length ? "" : "，"
                      }}
                    </span>
                  </div>
                </template>
                <template slot="conveyerId" slot-scope="text, item">
                  <a-select :default-value="text" style="width: 200px" placeholder="请选择传送线" :disabled="item.conveyer_check">
                    <a-select-option v-for="conve in conveyers" :key="conve.conveyerId" @click="changeConveyer(item, conve.conveyerId)">
                      <span :title="conve.conveyerName">
                        {{
                        conve._conveyerName
                        }}
                      </span>
                    </a-select-option>
                  </a-select>
                </template>
                <!-- <div
                  slot="expandedRowRender"
                  slot-scope="record"
                  style="margin: 0"
                >
                  <h3>物料信息：</h3>
                  <ul>
                    <li
                      v-for="(matter, ind) in record.outMatterDTOS"
                      :key="ind"
                    >
                      {{
                        matter.matterCode +
                        " " +
                        matter.matterName +
                        " " +
                        matter.matterMarking +
                        " " +
                        "*" +
                        matter.matterNum +
                        matter._matterUnit
                      }}
                    </li>
                  </ul>
                </div>-->
              </a-table>
            </a-config-provider>
            <Empty text="未找到合适的托盘" v-else />
          </a-spin>
        </div>
      </div>
    </div>
  </a-drawer>
</template>
<script>
import Empty from '@/components/Empty/index'
import { pagePallet, findConveyers, outbound, canPallent } from '@/services/api_in_out'
import { getSubStr } from '@/utils/utils'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
const columnsAll = [
  {
    title: '托盘编码',
    dataIndex: 'palletCode',
    check: true,
    align: 'center'
  },
  {
    title: '料架',
    dataIndex: 'feederName',
    check: true,
    align: 'center'
  },
  {
    title: '库位',
    dataIndex: 'storagebinRow',
    check: true,
    scopedSlots: { customRender: 'storagebinRow' },
    align: 'center'
  },
  {
    title: '库位可存放',
    dataIndex: 'mattertypeDTOList',
    check: true,
    scopedSlots: { customRender: 'mattertypeDTOList' },
    align: 'center'
  },
  {
    title: '传送线',
    dataIndex: 'conveyerId',
    check: true,
    scopedSlots: { customRender: 'conveyerId' },
    align: 'center'
  }
]

export default {
  data() {
    return {
      conditions: '',
      conveyers: [],
      visible: false,
      spinning: false,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      dataList: [],
      pagination: {
        total: 0,
        defaultPageSize: 10, // 每页显示几条数据
        showSizeChanger: true, // 显示下拉选项（每页几条）
        showTotal: total => `共 ${total} 条数据`,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
      },
      columns: [],
      columnsAll
    }
  },
  components: {
    Empty
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(selectedRowKeys, selectedRows)
          let _this = this
          if (selectedRows.length == this.dataList.length) {
            for (let i = 0; i < selectedRows.length; i++) {
              selectedRows[i].conveyer_check = false
            }
          } else {
            if (selectedRows.length > 0) {
              //   console.log(this.dataList.indexOf(selectedRows));
              //   for (let i = 0; i < this.dataList.length; i++) {
              //     if (selectedRowKeys == this.dataList[i].palletId) {
              //       this.dataList[i].conveyer_check = !this.dataList[i]
              //         .conveyer_check;
              //       this.$forceUpdate();
              //     }
              //   }
              for (let i = 0; i < _this.dataList.length; i++) {
                _this.dataList[i].conveyer_check = true
                _this.$forceUpdate()
              }
              for (let j = 0; j < selectedRows.length; j++) {
                selectedRows[j].conveyer_check = false
                _this.$forceUpdate()
              }
            } else if (selectedRows.length == 0) {
              for (let i = 0; i < this.dataList.length; i++) {
                this.dataList[i].conveyer_check = true
                this.$forceUpdate()
              }
            }
          }
        }
      }
    }
  },
  methods: {
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
        /**获取传送线 */
        findConveyers({
          conveyerType: 1,
          warehouseId: JSON.parse(sessionStorage.getItem('warehouseout')).warehouseId
        }).then(res => {
          // console.log(res);
          res.data.map(v => {
            v['_conveyerName'] = getSubStr(v.conveyerName)
          })
          this.conveyers = res.data
        })
        let params = {
          conditions: this.conditions,
          palletStatus: 0,
          page: 1,
          limit: this.pagination.pageSize,
          warehouseId: JSON.parse(sessionStorage.getItem('warehouseout')).warehouseId
        }
        this.pagePalletData(params)
      }
    },
    /**查询 */
    onSearch(value) {
      let params = {
        conditions: value,
        palletStatus: 0,
        page: 1,
        limit: this.pagination.pageSize,
        warehouseId: JSON.parse(sessionStorage.getItem('warehouseout')).warehouseId
      }
      this.pagePalletData(params)
    },
    handleChange(pagination) {
      //   console.log(pagination);
      let params = {
        conditions: this.conditions,
        palletStatus: 0,
        limit: pagination.pageSize,
        page: pagination.current,
        warehouseId: JSON.parse(sessionStorage.getItem('warehouseout')).warehouseId
      }
      this.pagePalletData(params)
    },
    /**获取载物托盘出库得数据 */
    pagePalletData(params) {
      this.spinning = true
      pagePallet(params).then(res => {
        // console.log(res);
        this.spinning = false
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i]['conveyerId'] = undefined
          res.data.list[i]['conveyer_check'] = true
          // if (res.data.list[i].mattertypeDTOList == null) {
          //   res.data.list[i].matterTypes = "所有类型";
          // }
          let item = res.data.list[i]
          for (let j = 0; j < item.outMatterDTOS.length; j++) {
            item.outMatterDTOS[j]['_matterUnit'] = getSubStr(item.outMatterDTOS[j].matterUnit)
          }
        }
        this.dataList = res.data.list
        this.pagination.total = res.data.total
      })
    },
    changeConveyer(item, value) {
      //   console.log(item, value);
      item.conveyerId = value
    },
    /**出库 */
    outbound() {
      console.log(this.dataList)
      let list = []
      for (let i = 0; i < this.dataList.length; i++) {
        if (!this.dataList[i].conveyer_check) {
          list.push(this.dataList[i])
        }
      }
      console.log(list)
      if (list.length == 0) {
        this.$message.warning('请选择托盘')
      } else {
        for (let j = 0; j < list.length; j++) {
          if (list[j].conveyerId == undefined) {
            // console.log(list[j].palletCode);
            this.$message.warning(list[j].palletCode + '未选择传送线')
            return
          }
        }
        // console.log("成功");
        let ids = []
        for (let i = 0; i < list.length; i++) {
          ids.push(list[i].palletId)
        }
        // console.log(ids, ids.join(","));
        canPallent({ ids: ids.join(',') }).then(res => {
          // console.log(res);
          if (res.code === 0) {
            if (res.data.canPallet) {
              outbound(list).then(res => {
                //   console.log(res);
                this.conditions = ''
                this.dataList = []
                this.visible = false
                this.$message.success('成功进入出库队列！')
                this.$emit('reload')
              })
            } else {
              // console.log(res.data.list);
              this.$message.warning(res.data.list.join(','))
            }
          }
        })
      }
    },
    onClose() {
      this.conditions = ''
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
        .footer-title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span {
            display: inline-block;
            width: 5px;
            height: 20px;
            margin-right: 10px;
            background: #cb9657;
          }
          h3 {
            height: 20px;
            font-size: 20px;
            font-weight: 500;
            color: #818181;
          }
        }
        .dialog-content {
          margin-top: 19px;
          padding: 20px;
          background: #fff;
          .content-btn {
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .table {
            min-height: 230px;
            margin-top: 20px;
            border-radius: 5px;
            border: 1px solid #e6e6e6;
          }
        }
        // position: relative;
        // margin: 20px;
        // width: 580px;
        // overflow: auto;
        // background: #ffffff;
        // box-shadow: -2px 2px 7px 0px rgba(179, 179, 179, 0.4);
        // border-radius: 5px;
        // .dialog-content {
        //   padding: 20px;
        //   .dialog-btn {
        //     margin-bottom: 27px;
        //     padding-left: 59px;
        //     padding-right: 50px;
        //     width: 100%;
        //     height: 40px;
        //     display: flex;
        //     justify-content: space-between;
        //     align-items: flex-start;
        //   }
        // }
      }
    }
  }
}
/deep/.ant-table-body {
  color: #999;
  .ant-select-selection__placeholder,
  .ant-select-search__field__placeholder {
    color: #999;
  }
}
</style>