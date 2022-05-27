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
      <span>编辑保养计划</span>
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

          <a-form-model-item label="保养周期" prop="cycle">
            <a-input
              size="large"
              placeholder="请输入保养周期"
              style="width: calc(80% - 5px)"
              v-model="form.cycle"
            />
            <a-select
              size="large"
              defaultValue="0"
              style="width: 20%; margin-left: 5px"
              v-model="form.cycleType"
            >
              <a-select-option
                v-for="cycleType in $state.cycleType"
                :key="cycleType.id"
                :value="cycleType.id"
              >
                {{ cycleType.value }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="下次保养日期" prop="nextDate">
            <a-date-picker
              size="large"
              placeholder="请选择下次保养日期"
              style="width: 100%"
              v-model="form.nextDate"
              :disabledDate="disabledDate"
              :disabled="disabled"
              valueFormat="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-model-item>
          <a-form-model-item label="提前提醒天数" prop="remindDays">
            <a-input
              size="large"
              placeholder="请输入提前提醒天数"
              v-model="form.remindDays"
            />
          </a-form-model-item>

          <a-form-model-item label="保养人" prop="userId">
            <a-select
              show-search
              option-filter-prop="children"
              size="large"
              v-model="form.userId"
              placeholder="请选择保养人"
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
          <a-form-model-item label="计划描述" prop="description">
            <a-textarea
              size="large"
              v-model="form.description"
              placeholder="请输入计划描述"
            />
          </a-form-model-item>
          <a-form-model-item label="状态" prop="status">
            <a-radio-group
              v-model="form.status"
              button-style="solid"
              size="large"
              @change="changeType"
            >
              <a-radio-button :value="0" class="radioStyle"
                >正常</a-radio-button
              >
              <a-radio-button :value="1" class="radioStyle"
                >停用</a-radio-button
              >
            </a-radio-group>
          </a-form-model-item>
        </div>

        <!-- 保养项的操作table -->
        <maintain-table
          table-name="保养"
          ref="maintain_table"
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
        tableName="保养"
      ></maintain-modal>
    </div>
  </a-drawer>
</template>
<script>
import {
  getCmPlanBuildRule,
  editMaintainPlan,
  updateMaintainItems,
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
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      disabled: false,
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      detailData: [],
      maintainItem: {},
      form: {
        selectDevice: undefined,
        cycle: "",
        cycleType: 0,
        nextDate: undefined,
        remindDays: "2",
        userId: undefined,
        description: "",
        status: 0,
      },
      selectedDevice: {
        cmNum: "",
        deptName: "",
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
            message: "请选择保养人",
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change",
          },
        ],
        nextDate: [
          {
            required: true,
            message: "请选择下次保养日期",
            trigger: "change",
          },
        ],
        cycle: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "") {
                cbfn("请输入保养周期");
              } else {
                if (value.indexOf(".") > -1) {
                  cbfn("请输入1~9999之间的数字");
                } else if (value >= 1 && value <= 9999) {
                  cbfn();
                } else {
                  cbfn("请输入1~9999之间的数字");
                }
              }
              cbfn();
            },
          },
        ],
        remindDays: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "") {
                cbfn("请输入提前提醒天数");
              } else {
                if (value.indexOf(".") > -1) {
                  cbfn("请输入1~999之间的整数");
                } else if (value >= 1 && value <= 999) {
                  cbfn();
                } else {
                  cbfn("请输入1~999之间的整数");
                }
              }
              cbfn();
            },
          },
        ],
        description: [
          {
            max: 20,
            message: "最多可输入20个字",
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
    changeType(event) {
      // this.form = {
      //   status: event.target.value,
      // };
      this.form["status"] = event.target.value;
      this.$forceUpdate();
    },
    afterVisibleChange(val) {
      // console.log(this.item);
      if (val) {
        getCmPlanBuildRule().then((res) => {
          // console.log(22222222222, res);
          if (res.data == 2) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
        });
        this.$nextTick(function () {
          this.form = {
            selectDevice: {
              key: this.item.cmId,
              label: this.item.cmName,
            },
            cycle: this.item.cycle + "",
            cycleType: this.item.cycleType,
            nextDate: this.item.nextDate,
            remindDays: this.item.remindDays + "",
            userId: this.item.userId,
            description: this.item.description,
          };
          this.selectedDevice = {
            cmNum: this.item.cmNum,
            deptName: this.item.deptName,
          };
          // this.devices.map((device) => {
          //   if (device.id == this.item.cmId) {
          //     this.selectedDevice = device;
          //   }
          // });
          // this.form.selectDevice = {
          //   key: this.selectedDevice.id,
          //   label: this.selectedDevice.cmName,
          // };
          this.form.status = this.$utils.getStateId("status", this.item.status);
          if (this.item["cmItems"]) {
            this.detailData = this.item.cmItems;
            this.$refs.maintain_table.getData(
              JSON.stringify(this.item.cmItems)
            );
          } else {
            this.detailData = [];
          }
        });
      }
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
    onClose() {
      this.selectedDevice = {};
      this.disabled = false;
      this.detailData = [];
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
            cycle: Number(this.form.cycle),
            cycleType: this.form.cycleType,
            nextDate: this.form.nextDate,
            remindDays: Number(this.form.remindDays),
            userId: this.form.userId,
            description: this.form.description,
            status: this.form.status,
            planNo: this.item.planNo,
            id: this.item.id,
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
            this.$message.error("请至少选择一个保养项");
            return;
          }
          console.log(params);
          editMaintainPlan(params.id, params).then((res) => {
            let { data } = res;
            if (data && res.status == 200) {
              if (data.id) {
                //更新关联的保养项table
                maintainItemsParam.planId = data.id;
                updateMaintainItems(params.id, maintainItemsParam).then(
                  (res) => {
                    console.log(res);
                    if (res.status == 200) {
                      this.$message.success("保存成功！");
                      this.onClose();
                      this.$parent.refreshTable();
                    } else {
                      this.$message.error("更新失败！");
                    }
                  }
                );
              }
            } else {
              this.$message.error("更新失败！");
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