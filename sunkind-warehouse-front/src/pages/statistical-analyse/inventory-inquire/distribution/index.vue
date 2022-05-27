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
      <span v-if="itemData" :title="itemData.matterName">
        {{
        itemData.matterName
        }}
      </span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="dialog-footer">
      <a-spin :spinning="spinning_dialog">
        <div v-for="(data, index) in list_dialog" :key="index" style="margin-bottom: 15px">
          <div class="footer-title">
            <span></span>
            <h3>{{ data.warehouseName }}</h3>
          </div>
          <div v-if="data.mrList.length" style="border: 1px solid #e6e6e6">
            <a-config-provider :locale="locale_dialog">
              <a-table
                :columns="columns_dialog"
                :data-source="data.mrList"
                :pagination="false"
                :rowKey="
                  (record, index) => {
                    return index;
                  }
                "
              >
                <template slot="storagebinLine" slot-scope="text, obj">
                  <span v-if="
                      obj.storagebinLine !== null || obj.storagebinRow !== null
                    ">
                    {{
                    obj.storagebinLine + "行" + obj.storagebinRow + "列"
                    }}
                  </span>
                </template>
              </a-table>
            </a-config-provider>
          </div>
          <Empty text="暂无库存" v-else />
        </div>
        <Empty text="暂无库存" v-if="list_dialog.length == 0" />
      </a-spin>
    </div>
  </a-drawer>
</template>
<script>
import { getDistribution } from '@/services/api_statistical'
import Empty from '@/components/Empty/index'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  props: {
    itemData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      visible: false,
      spinning_dialog: false,
      locale_dialog: zhCN,
      list_dialog: [],
      columns_dialog: [
        {
          title: '料架名称',
          dataIndex: 'feederName',
          align: 'center'
        },
        {
          title: '库位',
          dataIndex: 'storagebinLine',
          scopedSlots: { customRender: 'storagebinLine' },
          align: 'center'
        },
        {
          title: '托盘编号',
          dataIndex: 'pallerCode',
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'matterNum',
          align: 'center'
        },
        {
          title: '入库时间',
          dataIndex: 'warehousingTime',
          align: 'center'
        }
      ]
    }
  },
  components: {
    Empty
  },
  methods: {
    afterVisibleChange(val) {
      //   console.log("visible", val);
      if (val) {
        console.log(this.itemData)
        this.spinning_dialog = true
        getDistribution(this.itemData.matterId).then(res => {
          console.log(res)
          this.spinning_dialog = false
          if (res.code == 0) {
            // this.columns_dialog = ;
            this.list_dialog = res.data
            console.log(this.list_dialog)
          }
        })
      }
    },
    onClose() {
      this.list_dialog = []
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
          display: inline-block;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
        padding: 20px;
        max-height: 863px;
        overflow: auto;
        background: #ffffff;
        box-shadow: -2px 2px 7px 0px rgba(179, 179, 179, 0.4);
        border-radius: 5px;
        .footer-title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 10px;
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
      }
    }
  }
}
/deep/.ant-steps-item-icon {
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 25px;
}
/deep/.ant-steps-item-title {
  line-height: 50px;
}
/deep/.ant-steps-item-title::after {
  top: 25px;
}
/deep/.ant-modal {
  width: 620px !important;
  left: 640px;
}
</style>