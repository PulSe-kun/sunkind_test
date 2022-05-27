<template>
  <a-drawer
    :closable="false"
    placement="right"
    :zIndex="999"
    :visible="visible"
    width="620"
    :mask="false"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog-right"
  >
    <div class="header">
      <div class="header-title">
        <span>编辑库位</span>
        <a-icon type="close" @click="onClose" />
      </div>
    </div>
    <div class="footer">
      <div class="footer-title">
        <div class="footer-title-model">
          <a-descriptions :column="1">
            <a-descriptions-item label="仓库"></a-descriptions-item>
              <span>{{ warehouseName }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="料架">
              <span>{{ feederName }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="库位">
              <span v-if="card">
                {{
                card.storagebinLine + "行" + card.storagebinRow + "列"
                }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="可存放物料">
              <a-tree-select
                v-model="value"
                style="width: 450px"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="treeData"
                :replaceFields="{
                  children: 'children',
                  title: 'mattertypeName',
                  value: 'id',
                  key: 'id',
                }"
                tree-checkable
                :show-checked-strategy="SHOW_PARENT"
                placeholder="请选择物料类型"
              />
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
      <div
        style="
          width: 100%;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          position: absolute;
          right: 0;
          bottom: 40px;
        "
      >
        <a-button class="cancel-style" size="large" style="width: 90px" @click="onClose">取消</a-button>
        <a-button class="primary-style" type="primary" size="large" style="width: 90px" @click="submit">保存</a-button>
      </div>
    </div>
  </a-drawer>
</template>
<script>
import { typeTree } from '@/services/api_statistical'
import { storagebin } from '@/services/api_basis'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
export default {
  data() {
    return {
      visible: false,
      feederName: '',
      warehouseName: '',
      card: null,
      value: [],
      SHOW_PARENT,
      treeData: []
    }
  },
  components: {},
  methods: {
    afterVisibleChange(val) {},
    getCardTitle(feederName, card, warehouseName) {
      console.log(feederName, card, warehouseName)
      this.feederName = feederName
      this.warehouseName = warehouseName
      this.card = card
      this.typeTreeData()
    },
    /** 获取可存放物料树形结构 */
    typeTreeData() {
      typeTree().then(res => {
        // console.log(res);
        if (res.code == 0) {
          this.treeData = res.data
          if (this.card.mattertypeId == null) {
            this.value = []
          } else {
            this.value = this.card.mattertypeId.split(',')
          }
        }
      })
    },
    submit() {
      const params = {
        feederId: this.card.feederId,
        mattertypeId: this.value.length == 0 ? '' : this.value.join(','),
        storagebinId: this.card.storagebinId
      }
      console.log(params)
      storagebin(params).then(res => {
        console.log(res)
        if (res.code == 0) {
          this.visible = false
          this.$message.success('保存成功')
          this.$emit('refresh')
        }
      })
    },
    onClose() {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.dialog-right {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /deep/.ant-drawer-content-wrapper {
    .ant-drawer-body {
      height: 100%;
      padding: 0;
      .header {
        padding: 35px;
        height: 153px;
        background: #2964ff;
        box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
        border-radius: 3px;
        .header-title {
          position: relative;
          height: 20px;
          margin-bottom: 39px;
          span {
            font-size: 20px;
            font-weight: 500;
            color: #ffffff;
            line-height: 20px;
          }
          i {
            position: absolute;
            top: 5px;
            right: -5px;
            color: #ffffff;
            font-size: 15px;
          }
        }
        .header-btn {
          height: 20px;
          display: flex;
          justify-content: flex-start;
          align-content: center;
          a {
            margin-right: 56px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            img {
              width: 20px;
              height: 20px;
              vertical-align: text-top;
            }
          }
        }
      }
      .footer {
        height: calc(100% - 153px);
        background: #f5f4f4;
        padding: 20px;
        overflow: auto;
        position: relative;
        .footer-title {
          .footer-title-header {
            height: 20px;
            margin-bottom: 10px;
            span:first-child {
              display: inline-block;
              width: 5px;
              height: 20px;
              background: #2964ff;
              margin-right: 15px;
            }
            span:last-child {
              height: 20px;
              line-height: 20px;
              font-size: 18px;
              font-weight: 500;
              color: #818181;
              vertical-align: top;
            }
          }
          .footer-title-model {
            background: #ffffff;
            box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
            border-radius: 3px;
            padding: 20px;
            margin-bottom: 20px;
            p {
              margin-bottom: 0;
              padding: 5px 3px;
            }
            .ant-descriptions-row > td {
              padding-bottom: 30px !important;
              .ant-descriptions-item-content {
                font-size: 16px;
                font-weight: 600;
                color: #000000;
              }
            }
          }
        }
      }
    }
  }
}
</style>
