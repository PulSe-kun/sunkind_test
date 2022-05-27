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
      <span>新建点检单</span>
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
          <a-form-model-item label="设备名称" prop="selectDevice">
            <a-select
              size="large"
              show-search
              :filter-option="filterOption"
              option-filter-prop="children"
              v-model="form.selectDevice"
              placeholder="请选择设备名称"
              @change="changeDevice"
              label-in-value
              option-label-prop="label"
            >
              <a-select-option
                v-for="item in devices"
                :key="item.id"
                :value="item.id"
                :label="item.cmName"
              >
                {{ item.cmNum }} &nbsp;{{ item.cmName }}&nbsp;{{
                  item.deptName
                }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="设备编号">
            <span>{{ selectedDevice.cmNum }}</span>
          </a-form-model-item>

          <a-form-model-item label="使用部门">
            <span>{{ selectedDevice.deptName }}</span>
          </a-form-model-item>
          <a-form-model-item label="点检人" prop="userId">
            <a-select
              show-search
              option-filter-prop="children"
              size="large"
              v-model="form.userId"
              placeholder="请选择点检人"
            >
              <a-select-option
                v-for="item in mainteners"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </div>

        <!-- 点检项的操作table -->
        <maintain-table
          ref="maintain_table"
          table-name="点检"
          @getData="getData"
          @showMaintainDetail="showMaintainDetail"
        ></maintain-table>
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
import {
  addInspectionBill,
  updateInspectionMaintainItems,
} from "@/services/api";
import MaintainTable from "@/components/MiantainTable.vue";
import MaintainModal from "@/components/MaintainModal.vue";
import moment from "moment";
export default {
  props: {
    devices: {
      type: Array,
      default: [],
    },
    mainteners: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      detailData: [],
      maintainItem: {},
      form: {
        selectDevice: undefined,
        userId: undefined,
      },
      selectedDevice: {
        cmNum: "",
        cmName: "",
      },
      rules: {
        selectDevice: [
          {
            required: true,
            message: "请选择设备",
            trigger: "change",
          },
        ],
        userId: [
          {
            required: true,
            message: "请选择点检人",
            trigger: "change",
          },
        ],
      },
    };
  },
  components: { MaintainTable, MaintainModal },
  methods: {
    moment,
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    getData(list) {
      this.detailData = JSON.parse(list);
    },
    disabledDate(current) {
      return current < moment().startOf("day");
    },
    changeDevice(value) {
      if (value) {
        this.devices.map((item) => {
          if (item.id == value.key) {
            this.selectedDevice = item;
            this.form.selectDevice = {
              key: this.selectedDevice.id,
              label: this.selectedDevice.cmName,
            };
          }
        });
      } else {
        this.selectedDevice = {};
      }
    },
    showMaintainDetail(data) {
      let obj = {};
      obj = JSON.parse(JSON.stringify(data));
      obj.status = this.$utils.getStateName("status", obj.status);
      this.maintainItem = obj;
      this.$refs.maintainModel.showMaterialModal = true;
    },
    afterVisibleChange(val) {
      // console.log(this.devices);
      if (val) {
        let list = [
          {
            content: "",
            name: "",
            id: "",
          },
        ];
        this.detailData = list;
        this.$refs.maintain_table.getData(JSON.stringify(list));
      }
    },
    onClose() {
      this.selectedDevice = {
        cmNum: "",
        cmName: "",
      };
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            cmId: this.selectedDevice.id,
            cmName: this.selectedDevice.cmName,
            cmNum: this.selectedDevice.cmNum,
            userId: this.form.userId,
            status: 0,
          };
          let maintainItemsParam = {
            cmItemIds: [],
            planId: "",
          };
          if (this.detailData.length > 0) {
            this.detailData.map((item) => {
              if (item.id) {
                maintainItemsParam.cmItemIds.push(item.id);
              }
            });
          }
          if (maintainItemsParam.cmItemIds.length == 0) {
            this.$message.error("请至少选择一个点检项");
            return;
          }
          addInspectionBill(params).then((res) => {
            let { data } = res;
            if (data && res.status == 200) {
              if (data.id) {
                //更新关联的点检项table
                maintainItemsParam.planId = data.id;
                updateInspectionMaintainItems(data.id, maintainItemsParam).then(
                  (res) => {
                    if (res.status == 200 && res.data) {
                      this.$message.success("保存成功！");
                      this.onClose();
                      this.$emit("refresh");
                    } else {
                      this.$message.error("点检项数据列保存失败！");
                    }
                  }
                );
              }
            } else {
              this.$message.error("保存失败！");
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

<style lang="less" scoped>
/deep/.ant-input-lg {
  font-size: 14px !important;
}
</style>