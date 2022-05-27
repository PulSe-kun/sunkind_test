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
      <span>编辑设备</span>
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
        <div class="footer-title">
          <span></span>
          <h3>基本信息</h3>
        </div>
        <div class="dialog-content">
          <a-form-model-item label="设备编号" prop="cmNum">
            <a-input
              size="large"
              v-model="form.cmNum"
              placeholder="请输入设备编号"
              disabled
            />
          </a-form-model-item>
          <a-form-model-item label="设备名称" prop="cmName">
            <a-input
              size="large"
              v-model="form.cmName"
              placeholder="请输入设备名称"
            />
          </a-form-model-item>
          <a-form-model-item label="设备类型" prop="cmTypeId">
            <a-tree-select
              size="large"
              v-model="form.cmTypeId"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              :replaceFields="{
                children: 'children',
                title: 'name',
                value: 'id',
                key: 'id',
              }"
              allow-clear
              tree-default-expand-all
              placeholder="请选择设备类型"
            >
            </a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="使用组织" prop="deptData">
            <a-tree-select
              size="large"
              labelInValue
              v-model="form.deptData"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="deptTreeData"
              :replaceFields="{
                children: 'children',
                title: 'deptName',
                value: 'id',
                key: 'id',
              }"
              allow-clear
              tree-default-expand-all
              placeholder="请选择使用组织"
            >
            </a-tree-select>
          </a-form-model-item>
        </div>

        <div class="footer-title">
          <span></span>
          <h3>折旧信息</h3>
        </div>
        <div class="dialog-content">
          <a-form-model-item label="折旧状态" prop="status">
            <a-radio-group
              v-model="form.status"
              button-style="solid"
              size="large"
              @change="changeType"
            >
              <a-radio-button :value="1" class="radioStyle"
                >开启</a-radio-button
              >
              <a-radio-button :value="0" class="radioStyle"
                >关闭</a-radio-button
              >
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item label="购置金额" prop="purchaseAmount">
            <a-input
              size="large"
              placeholder="请输入购置金额"
              suffix="元"
              v-model="form.purchaseAmount"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="净残值" prop="netSalvage">
            <a-input
              size="large"
              placeholder="请输入净残值"
              suffix="元"
              v-model="form.netSalvage"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="使用寿命" prop="operatingLife">
            <a-input
              size="large"
              placeholder="请输入使用寿命"
              suffix="年"
              v-model="form.operatingLife"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="报废日期" prop="expiredDate">
            <a-date-picker
              size="large"
              style="width: 100%"
              placeholder="请选择报废日期"
              v-model="form.expiredDate"
              valueFormat="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-model-item>
        </div>

        <div class="footer-title">
          <span></span>
          <h3>扩展信息</h3>
        </div>
        <div class="dialog-content">
          <a-form-model-item label="设备型号" prop="cmModel">
            <a-input
              size="large"
              v-model="form.cmModel"
              placeholder="请输入设备型号"
            />
          </a-form-model-item>
          <a-form-model-item label="生产厂商" prop="vendor">
            <a-input
              size="large"
              v-model="form.vendor"
              placeholder="请输入生产厂商"
            />
          </a-form-model-item>
          <a-form-model-item label="出厂编号" prop="factoryNum">
            <a-input
              size="large"
              v-model="form.factoryNum"
              placeholder="请输入出厂编号"
            />
          </a-form-model-item>
          <a-form-model-item label="购置日期">
            <a-date-picker
              size="large"
              style="width: 100%"
              placeholder="请选择购置日期"
              v-model="form.purchaseDate"
              valueFormat="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-model-item>
          <a-form-model-item label="启用日期">
            <a-date-picker
              size="large"
              style="width: 100%"
              placeholder="请选择启用日期"
              v-model="form.enableDate"
              valueFormat="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-model-item>
          <a-form-model-item label="保修截止日期">
            <a-date-picker
              size="large"
              style="width: 100%"
              placeholder="请选择保修截止日期"
              v-model="form.endDate"
              valueFormat="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-model-item>
          <a-form-model-item label="设备参数" prop="cmParameters">
            <a-textarea
              size="large"
              v-model="form.cmParameters"
              placeholder="请输入设备参数"
            />
          </a-form-model-item>
          <a-form-model-item label="备注" prop="note">
            <a-textarea
              size="large"
              v-model="form.note"
              placeholder="请输入备注"
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
    </div>
  </a-drawer>
</template>
<script>
import { getDepartments, updateDevice } from "@/services/api";
export default {
  props: {
    treeData: {
      type: Array,
      default: [],
    },
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      itemObj: null,
      deptTreeData: [],
      deptDataKeys: [],
      form: {
        cmNum: "",
        cmName: "",
        deptData: undefined,
        cmTypeId: undefined,
        status: 0,
        purchaseAmount: "",
        netSalvage: "",
        operatingLife: "",
        expiredDate: "",
        cmModel: "",
        vendor: "",
        factoryNum: "",
        purchaseDate: "",
        enableDate: "",
        endDate: "",
        cmParameters: "",
        note: "",
      },
      rules: {
        cmNum: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              let reg = /^[A-Za-z0-9]{2,20}$/;
              if (value == "") {
                cbfn("请输入设备编号");
              } else if (!reg.test(value)) {
                cbfn("请输入2~20位英文或数字");
              }
              cbfn();
            },
          },
        ],
        cmName: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "") {
                cbfn("请输入设备名称");
              } else if (value.length > 20) {
                cbfn("最多可输入20个字");
              }
              cbfn();
            },
          },
        ],
        cmTypeId: [
          {
            required: true,
            message: "请选择设备类型",
            trigger: "change",
          },
        ],
        deptData: [
          {
            required: true,
            message: "请选择使用组织",
            trigger: "change",
          },
        ],
        purchaseAmount: [
          {
            required: false,
            validator: (rule, value, cbfn) => {
              if (this.form.status === 1) {
                let reg = /^[1-9]\d{0,7}$/;
                if (value == "") {
                  cbfn("请输入购置金额");
                } else if (!reg.test(value)) {
                  cbfn("请输入1 ~ 99999999的整数");
                }
                cbfn();
              } else {
                cbfn();
              }
            },
          },
        ],
        netSalvage: [
          {
            required: false,
            validator: (rule, value, cbfn) => {
              if (this.form.status === 1) {
                let reg = /^[1-9]\d{0,7}$/;
                if (value == "") {
                  cbfn("请输入净残值");
                } else if (!reg.test(value)) {
                  cbfn("请输入1 ~ 99999999的整数");
                }
                cbfn();
              } else {
                cbfn();
              }
            },
          },
        ],
        operatingLife: [
          {
            required: false,
            validator: (rule, value, cbfn) => {
              if (this.form.status === 1) {
                let reg = /^[1-9]\d{0,2}$/;
                if (value == "") {
                  cbfn("请输入使用寿命");
                } else if (!reg.test(value)) {
                  cbfn("请输入1 ~ 999的整数");
                }
                cbfn();
              } else {
                cbfn();
              }
            },
          },
        ],
        expiredDate: [
          {
            required: false,
            validator: (rule, value, cbfn) => {
              if (this.form.status === 1) {
                if (value == "") {
                  cbfn("请选择报废日期");
                }
                cbfn();
              } else {
                cbfn();
              }
            },
            trigger: "change",
          },
        ],
        cmModel: [
          {
            max: 20,
            message: "最多可输入20个字",
          },
        ],
        vendor: [
          {
            max: 20,
            message: "最多可输入20个字",
          },
        ],
        factoryNum: [
          {
            required: false,
            validator: (rule, value, cbfn) => {
              let reg = /^[A-Za-z0-9]{2,20}$/;
              if (value == "") {
                cbfn();
              } else if (!reg.test(value)) {
                cbfn("请输入2~20位英文或数字");
              }
              cbfn();
            },
          },
        ],
        cmParameters: [
          {
            max: 100,
            message: "最多可输入100个字",
          },
        ],
        note: [
          {
            max: 100,
            message: "最多可输入100个字",
          },
        ],
      },
      draggingIndex: 0, //拖动div的下标
      dropIndex: 0, //拖到那个div的下标
    };
  },
  components: {},
  methods: {
    afterVisibleChange(val) {
      console.log("visible", val);
      if (val) {
        getDepartments().then((res) => {
          let { data } = res;
          this.deptTreeData = data;
        });

        this.$nextTick(function () {
          this.form = {
            cmNum: this.item.cmNum,
            cmName: this.item.cmName,
            deptData: {
              value: this.item.deptId,
              label: this.item.deptName,
            },
            cmTypeId: this.item.cmTypeId,
            status: this.item.status == "开启" ? 1 : 0,
            purchaseAmount: this.item.purchaseAmount
              ? this.item.purchaseAmount
              : "",
            netSalvage: this.item.netSalvage ? this.item.netSalvage : "",
            operatingLife: this.item.operatingLife
              ? this.item.operatingLife
              : "",
            expiredDate: this.item.expiredDate ? this.item.expiredDate : "",
            cmModel: this.item.cmModel ? this.item.cmModel : "",
            vendor: this.item.vendor ? this.item.vendor : "",
            factoryNum: this.item.factoryNum ? this.item.factoryNum : "",
            purchaseDate: this.item.purchaseDate ? this.item.purchaseDate : "",
            enableDate: this.item.enableDate ? this.item.enableDate : "",
            endDate: this.item.endDate ? this.item.endDate : "",
            cmParameters: this.item.cmParameters ? this.item.cmParameters : "",
            note: this.item.note ? this.item.note : "",
          };
          this.changeStatus();
        });
      }
    },
    changeType(event) {
      // console.log(event);
      this.form.status = event.target.value;
      this.changeStatus();
    },
    changeStatus() {
      if (this.form.status === 1) {
        this.rules.purchaseAmount[0].required = true;
        this.rules.netSalvage[0].required = true;
        this.rules.operatingLife[0].required = true;
        this.rules.expiredDate[0].required = true;
      } else {
        this.rules.purchaseAmount[0].required = false;
        this.rules.netSalvage[0].required = false;
        this.rules.operatingLife[0].required = false;
        this.rules.expiredDate[0].required = false;
      }
      this.$refs.ruleForm.clearValidate("purchaseAmount");
      this.$refs.ruleForm.clearValidate("netSalvage");
      this.$refs.ruleForm.clearValidate("operatingLife");
      this.$refs.ruleForm.clearValidate("expiredDate");
    },
    onClose() {
      this.form.status = 0;
      this.rules.purchaseAmount[0].required = false;
      this.rules.netSalvage[0].required = false;
      this.rules.operatingLife[0].required = false;
      this.rules.expiredDate[0].required = false;
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.form);
          let params = {
            id: this.item.id,
            cmNum: this.form.cmNum,
            cmName: this.form.cmName,
            cmTypeId: this.form.cmTypeId,
            deptId: this.form.deptData.value,
            deptName: this.form.deptData.label,
            status: this.form.status,
          };
          if (
            this.form.purchaseAmount !== "" &&
            this.form.purchaseAmount !== undefined
          ) {
            params["purchaseAmount"] = this.form.purchaseAmount;
          }
          if (
            this.form.netSalvage !== "" &&
            this.form.netSalvage !== undefined
          ) {
            params["netSalvage"] = this.form.netSalvage;
          }
          if (
            this.form.operatingLife !== "" &&
            this.form.operatingLife !== undefined
          ) {
            params["operatingLife"] = this.form.operatingLife;
          }
          if (
            this.form.expiredDate !== "" &&
            this.form.expiredDate !== undefined
          ) {
            params["expiredDate"] = this.form.expiredDate;
          }
          if (this.form.cmModel !== "" && this.form.cmModel !== undefined) {
            params["cmModel"] = this.form.cmModel;
          }
          if (this.form.vendor !== "" && this.form.vendor !== undefined) {
            params["vendor"] = this.form.vendor;
          }

          if (
            this.form.factoryNum !== "" &&
            this.form.factoryNum !== undefined
          ) {
            params["factoryNum"] = this.form.factoryNum;
          }
          if (
            this.form.purchaseDate !== "" &&
            this.form.purchaseDate !== undefined
          ) {
            params["purchaseDate"] = this.form.purchaseDate;
          }
          if (
            this.form.enableDate !== "" &&
            this.form.enableDate !== undefined
          ) {
            params["enableDate"] = this.form.enableDate;
          }
          if (this.form.endDate !== "" && this.form.endDate !== undefined) {
            params["endDate"] = this.form.endDate;
          }
          if (
            this.form.cmParameters !== "" &&
            this.form.cmParameters !== undefined
          ) {
            params["cmParameters"] = this.form.cmParameters;
          }
          if (this.form.note !== "" && this.form.note !== undefined) {
            params["note"] = this.form.note;
          }
          updateDevice(this.item.id, params).then((res) => {
            let { data } = res;
            if (data && res.status == 200) {
              this.$message.success("保存成功！");
              this.onClose();
              this.$emit("refresh");
            }
          });
        } else {
          // console.log("error submit!!");
          return false;
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
        padding-top: 0;
        max-height: 863px;
        overflow: auto;
        .footer-title {
          padding-top: 21px;
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
          margin-top: 11px;
          padding: 20px;
          background: #fff;
          box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
