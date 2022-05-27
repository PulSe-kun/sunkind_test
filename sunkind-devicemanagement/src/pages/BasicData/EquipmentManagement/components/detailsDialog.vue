<template>
  <a-drawer
    :closable="false"
    placement="right"
    :zIndex="999"
    width="620"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog-right"
    :mask="false"
  >
    <div class="header">
      <div class="header-title">
        <span v-if="item">{{
          item.cmName
        }}</span>
        <a-icon type="close" @click="onClose" />
      </div>
      <div class="header-state"></div>
      <div class="header-btn" v-if="item">
        <a @click="editor(item)">
          <img src="../../../../assets/img/editor.png" alt="" />
          <span>编辑</span>
        </a>
        <a @click="del(item)">
          <img src="../../../../assets/img/delete.png" alt="" />
          <span>删除</span>
        </a>
      </div>
    </div>
    <div class="footer" v-if="item">
      <div class="footer-title">
        <span></span>
        <h3>基本信息</h3>
      </div>
      <div class="dialog-content">
        <div>
          <a-descriptions :column="1">
            <a-descriptions-item label="设备编号">
              <span>{{ item.cmNum | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="设备类型">
              <span>{{ item.deviceTypeName | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="使用组织">
              <span>{{ item.deptName | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              <span>{{ item.createTime | emptyValue }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>

      <div class="footer-title">
        <span></span>
        <h3>折旧信息</h3>
      </div>
      <div class="dialog-content">
        <div>
          <a-descriptions :column="1">
            <a-descriptions-item label="折旧状态">
              <span>{{ item.status | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="购置金额">
              <span>{{ item.purchaseAmount | emptyValue }}元</span>
            </a-descriptions-item>
            <a-descriptions-item label="净残值">
              <span>{{ item.netSalvage | emptyValue }}元</span>
            </a-descriptions-item>
            <a-descriptions-item label="使用寿命">
              <span>{{ item.operatingLife | emptyValue }}年</span>
            </a-descriptions-item>
            <a-descriptions-item label="报废日期">
              <span>{{ item.expiredDate | emptyValue }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>

      <div class="footer-title">
        <span></span>
        <h3>扩展信息</h3>
      </div>
      <div class="dialog-content">
        <div>
          <a-descriptions :column="1">
            <a-descriptions-item label="设备型号">
              <span>{{ item.cmModel | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="生产厂商">
              <span>{{ item.vendor | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="出厂编号">
              <span>{{ item.factoryNum | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="购置日期">
              <span>{{ item.purchaseDate | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="启用日期">
              <span>{{ item.enableDate | emptyValue }}</span>
            </a-descriptions-item>

            <a-descriptions-item label="保修截止日期">
              <span>{{ item.endDate | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="设备参数">
              <span>{{ item.cmParameters | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="备注">
              <span>{{ item.note | emptyValue }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </div>
  </a-drawer>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        // console.log(this.item);
      }
    },
    /**编辑 */
    editor(item) {
      this.visible = false;
      this.$parent.compile(item);
    },
    del(item) {
      this.visible = false;
      this.$parent.del_device(item.id);
    },
    onClose() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.dialog-right {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /deep/.ant-drawer-content-wrapper {
    // width: 100% !important;
    // max-width: 620px;
    .ant-drawer-body {
      height: 100%;
      padding: 0;
      .header {
        padding: 20px;
        height: 100px;
        background: #2964ff;
        box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
        border-radius: 3px 3px 0px 0px;
        .header-title {
          position: relative;
          height: 20px;
          // margin-bottom: 10px;
          span {
            font-size: 18px;
            color: #ffffff;
            line-height: 20px;
          }
          i {
            position: absolute;
            top: 3px;
            right: 0;
            color: #ffffff;
            font-size: 15px;
          }
        }
        .header-state {
          height: 20px;
          line-height: 20px;
          color: #fff;
          font-size: 16px;
          // margin-bottom: 30px;
        }
        .header-btn {
          height: 16px;
          display: flex;
          justify-content: flex-start;
          align-content: center;
          a {
            margin-right: 20px;
            display: flex;
            justify-items: flex-start;
            align-items: center;
            img {
              width: 16px;
              height: 16px;
              margin-right: 5px;
            }
            span {
              font-size: 16px;
              line-height: 16px;
              color: #ffffff;
            }
          }
        }
      }
      .footer {
        height: calc(100% - 100px);
        background: #f5f4f4;
        padding: 20px;
        padding-top: 0;
        overflow: auto;
        .footer-title {
          padding-top: 21px;
          padding-bottom: 11px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span {
            display: inline-block;
            width: 5px;
            height: 20px;
            margin-right: 10px;
            background: #585858;
          }
          h3 {
            margin: 0;
            height: 20px;
            line-height: 20px;
            font-size: 16px;
            font-weight: 500;
            color: #818181;
          }
        }
        .dialog-content,
        .dialog-contents {
          padding: 20px;
          background: #fff;
          box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
          border-radius: 3px;
          .ant-descriptions-row > td {
            line-height: 16px;
            padding: 0;
            padding-bottom: 18px !important;
            .ant-descriptions-item-label {
              float: left;
              display: inline-block;
              font-size: 16px;
              height: 16px;
              line-height: 16px;
              width: 130px;
              text-align: right;
            }
            .ant-descriptions-item-content {
              margin-left: 130px;
              display: block;
              // height: 16px;
              line-height: 16px;
              font-size: 16px;
              font-family: "SourceHanSansSC-Medium";
              color: #000000;
            }
          }
        }
        .dialog-contents {
          margin-bottom: 1px;
          padding: 20px 30px;
          .footer-icon {
            padding-bottom: 20px;
            img {
              width: 32px;
              height: 32px;
              vertical-align: bottom;
            }
            span {
              font-size: 20px;
              line-height: 32px;
              color: @theme-color;
            }
          }
        }
      }
    }
  }
}
</style>