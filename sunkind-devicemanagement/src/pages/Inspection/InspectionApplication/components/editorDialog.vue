<template>
  <a-drawer
    :closable="false"
    placement="top"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog"
    :maskClosable="false"
  >
    <div class="header">
      <span>作废</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :validateOnRuleChange="true"
      >
        <div class="dialog-content">
          <a-form-model-item>
            <span slot="label">
              <img
                style="width: 16px; height: 16px; vertical-align: sub"
                src="../../../../assets/img/device.png"
                alt=""
              />
              设备信息
            </span>
            <span style="font-weight: bold" v-if="item">{{
              item.cmName + " " + item.cmNum + " " + item.deptName
            }}</span>
          </a-form-model-item>

          <a-form-model-item>
            <span slot="label">
              <img
                style="width: 16px; height: 16px; vertical-align: sub"
                src="../../../../assets/img/maintain.png"
                alt=""
              />
              点检单号
            </span>
            <span style="font-weight: bold" v-if="item">{{
              item.checkoutNo | emptyValue
            }}</span>
          </a-form-model-item>

          <a-form-model-item>
            <span slot="label">
              <img
                style="width: 16px; height: 16px; vertical-align: sub"
                src="../../../../assets/img/state.png"
                alt=""
              />
              状态
            </span>
            <span style="font-weight: bold" v-if="item">{{
              item.status | emptyValue
            }}</span>
          </a-form-model-item>
        </div>
        <!-- 点检项的table数据列-->
        <maintain-items
          :detail-data="drawerDetailData"
          @showDeviceDetail="showDeviceDetail"
          tableName="点检"
        ></maintain-items>
        <div style="padding: 20px" v-if="item">
          <a-form-model-item label="作废原因" prop="note">
            <a-textarea
              size="large"
              v-model="form.note"
              placeholder="请输入作废原因"
            />
          </a-form-model-item>
        </div>
      </a-form-model>
      <div style="display: flex; justify-content: flex-end; padding-top: 26px">
        <a-button
          class="cancel-style"
          @click="onClose"
          style="margin-right: 20px"
        >
          取消
        </a-button>
        <a-button class="primary-style" type="primary" @click="onSubmit"
          >保存</a-button
        >
      </div>
      <maintain-modal
        ref="maintainModel"
        :maintainItem="maintainItem"
        tableName="点检"
      ></maintain-modal>
    </div>
  </a-drawer>
</template>
<script>
import { addActivities, removeInspectionBill } from "@/services/api";
import MaintainItems from "@/components/MaintainItems.vue";
import MaintainModal from "@/components/MaintainModal.vue";
import moment from "moment";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      maintainItem: {},
      drawerDetailData: [],
      form: {
        note: "",
      },
      rules: {
        note: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "" || value == undefined) {
                cbfn("请输入作废原因");
              } else if (value.length > 100) {
                cbfn("最多可输入100个字");
              }
              cbfn();
            },
          },
        ],
      },
    };
  },
  components: {
    MaintainItems,
    MaintainModal,
  },
  methods: {
    moment,
    showDeviceDetail(index) {
      let obj = {};
      obj = JSON.parse(JSON.stringify(this.drawerDetailData[index]));
      obj.status = this.$utils.getStateName("status", obj.status);
      this.maintainItem = obj;
      this.$refs.maintainModel.showMaterialModal = true;
    },
    afterVisibleChange(val) {
      console.log(this.item);
      this.drawerDetailData = this.item.cmCheckouts;
    },
    onClose() {
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
    onSubmit() {
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          let params = {
            note: this.form.note,
            result: "作废",
          };
          let addParam = {
            kfId: this.item.id,
            attachment: false,
            extension: JSON.stringify(params),
          };
          addActivities(addParam).then((res) => {
            if (res.status == 200) {
              removeInspectionBill(this.item.id).then((res) => {
                if (res.status == 200) {
                  this.$message.success("该点检单已作废！");
                  this.onClose();
                  this.$emit("refresh");
                } else {
                  this.$message.error("该点检单作废失败");
                }
              });
            } else {
              this.$message.error("该点检单作废失败");
            }
          });
        } else {
          return;
        }
      });
    },
  },
};
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
      height: 100%;
      padding: 0;
      .header {
        position: relative;
        max-width: 620px;
        height: 67px;
        line-height: 67px;
        background: @theme-color;
        box-shadow: 0px 0px 5px 0px rgba(110, 110, 110, 0.36);
        padding-left: 20px;
        text-align: left;
        span {
          font-size: 18px;
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
      .footer {
        background: #f5f4f4;
        padding: 20px;
        // padding-top: 0;
        max-height: 863px;
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
        .dialog-content {
          padding: 20px;
          background: #fff;
          box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
          border-radius: 3px;
          .ant-form-item {
            margin-bottom: 0 !important;
          }
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
/deep/.ant-input-lg {
  font-size: 14px !important;
}
/deep/td .ant-form-item {
  margin-bottom: 0;
}
</style>
