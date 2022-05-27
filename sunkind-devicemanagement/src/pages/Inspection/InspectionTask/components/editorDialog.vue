<template>
  <a-drawer
    :closable="false"
    placement="top"
    :visible="visible"
    wrapClassName="dialog"
    :maskClosable="false"
  >
    <div class="header">
      <span v-if="type_value">{{ type_value }}</span>
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
          v-if="type_value != '点检'"
          :detail-data="drawerDetailData"
          @showDeviceDetail="showDeviceDetail"
          tableName="点检"
        ></maintain-items>
        <div
          style="margin-top: 21px; background: #fff"
          v-if="type_value == '点检'"
        >
          <a-table
            :columns="maintainColumns"
            :data-source="drawerDetailData"
            :pagination="false"
            :row-key="(record) => record.id"
          >
            <span slot="maintainName" slot-scope="text, record, index">
              <a @click="showDeviceDetail(index)" class="device-name">{{
                text
              }}</a>
            </span>
            <span slot="completeTitle">
              <span style="color: red">*</span>完成
            </span>
            <span slot="complete" slot-scope="text, record">
              <a-checkbox v-model="record.completed"></a-checkbox>
            </span>

            <span slot="remark" slot-scope="text, record">
              <a-form-model-item>
                <a-textarea
                  max="100"
                  size="large"
                  v-model="record.note_value"
                  @change="changeNote(record.note_value)"
                  placeholder="请输入备注"
                />
              </a-form-model-item>
            </span>
          </a-table>
        </div>
        <div style="padding: 20px" v-if="item">
          <a-form-model-item
            label="完工日期"
            prop="finishDate"
            v-if="type_value == '点检'"
          >
            <a-date-picker
              size="large"
              style="width: 100%"
              placeholder="请选择完工日期"
              v-model="form.finishDate"
              valueFormat="YYYY-MM-DD"
            />
          </a-form-model-item>
          <a-form-model-item
            label="点检工时"
            prop="workingHours"
            v-if="type_value == '点检'"
          >
            <a-input
              size="large"
              v-model="form.workingHours"
              placeholder="请输入点检工时"
              suffix="时"
            />
          </a-form-model-item>
          <a-form-model-item
            label="转交给"
            prop="userId"
            v-if="type_value == '转办'"
          >
            <a-select
              show-search
              option-filter-prop="children"
              label-in-value
              size="large"
              v-model="form.userId"
              placeholder="请选择转办人"
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
          <a-form-model-item
            label="备注"
            prop="notes"
            v-if="type_value == '转办' || type_value == '点检'"
          >
            <a-textarea
              size="large"
              v-model="form.notes"
              placeholder="请输入备注"
            />
          </a-form-model-item>
          <a-form-model-item label="图片说明" v-if="type_value == '点检'">
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :file-list="fileList"
              :multiple="false"
              @preview="handlePreview"
              @change="changeFile"
              :before-upload="beforeUpload"
            >
              <div v-if="fileList.length < 8">
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
            <a-modal
              :visible="previewVisible"
              :footer="null"
              @cancel="handleCancel"
            >
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
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
import {
  uploadImages,
  addActivities,
  inspectionBill,
  transferInspectionBill,
} from "@/services/api";
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
    type_value: {
      type: String,
      default: "",
    },
    mainteners: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      item: null,
      loading: false,
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      fileList: [],
      previewVisible: false,
      previewImage: "",
      maintainItem: {},
      drawerDetailData: [],
      maintainColumns: [
        {
          title: "行号",
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "点检项名称",
          dataIndex: "name",
          key: "name",
          scopedSlots: { customRender: "maintainName" },
        },
        {
          title: "点检内容",
          dataIndex: "content",
          key: "content",
        },
        {
          key: "complete",
          slots: { title: "completeTitle" },
          scopedSlots: { customRender: "complete" },
        },
        {
          title: "备注",
          key: "remark",
          scopedSlots: { customRender: "remark" },
        },
      ],
      form: {
        finishDate: undefined,
        workingHours: "",
        note: "",
        notes: "",
        userId: undefined,
      },
      rules: {
        note: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "" || value == undefined) {
                cbfn("请输入不点检原因");
              } else if (value.length > 100) {
                cbfn("最多可输入100个字");
              }
              cbfn();
            },
          },
        ],
        notes: [
          {
            max: 100,
            message: "最多可输入100个字",
          },
        ],
        userId: [
          {
            required: true,
            message: "请选择转办人",
            trigger: "change",
          },
        ],
        finishDate: [
          {
            required: true,
            message: "请选择完工日期",
            trigger: "change",
          },
        ],
        workingHours: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "" || value == undefined) {
                cbfn("请输入点检工时（小时）");
              } else if (value < 0.1 || value > 99.9) {
                cbfn("请输入0.1 ~ 99.9的整数或1位小数");
              } else {
                if (value.indexOf(".") > -1 && value.split(".").length > 2) {
                  cbfn("请输入0.1 ~ 99.9的整数或1位小数");
                } else {
                  if (
                    value.indexOf(".") > -1 &&
                    value.split(".")[1].length > 1
                  ) {
                    cbfn("请输入0.1 ~ 99.9的整数或1位小数");
                  } else {
                    cbfn();
                  }
                }
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
    changeNote(note_value) {
      if (note_value !== undefined) {
        if (note_value.length > 50) {
          this.$message.warning("备注最多可输入50个字");
        }
      }
    },
    showDeviceDetail(index) {
      let obj = {};
      obj = JSON.parse(JSON.stringify(this.drawerDetailData[index]));
      obj.status = this.$utils.getStateName("status", obj.status);
      this.maintainItem = obj;
      this.$refs.maintainModel.showMaterialModal = true;
    },
    beforeUpload(file) {
      return false;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      // console.log(file, this.fileList);
      // if (!file.url && !file.preview) {
      //   file.preview = await getBase64(file.originFileObj);
      // }
      // this.previewImage = file.url || file.preview;
      // this.previewVisible = true;
      for (let i = 0; i < this.fileList.length; i++) {
        this.fileList[i].thumbUrl = await getBase64(
          this.fileList[i].originFileObj
        );
      }
      let index = 0;
      index = this.fileList.findIndex((a) => a.uid === file.uid);
      this.$parent.watchViewImg(index, JSON.stringify(this.fileList));
    },
    changeFile({ fileList }) {
      console.log(fileList);
      this.fileList = fileList;
    },
    afterVisibleChange(item) {
      this.visible = true;
      this.item = JSON.parse(item);
      this.drawerDetailData = this.item.cmCheckouts;
      this.form.finishDate = this.$utils.getTime();
    },
    onClose() {
      this.fileList = [];
      this.drawerDetailData = [];
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
    onSubmit() {
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          if (this.type_value == "点检") {
            let checkboxSelected = true;
            let flag = true;
            this.drawerDetailData.map((item) => {
              if (!item.completed) {
                checkboxSelected = false;
              }

              if (item.note_value !== undefined) {
                if (item.note_value.length > 50) {
                  flag = false;
                }
              }
            });
            if (!checkboxSelected) {
              this.$message.error("存在未完成的点检项");
              return;
            }
            if (!flag) {
              this.$message.warning("备注最多可输入50个字");
              return;
            }

            let params = {
              note: this.form.notes,
              workingHours: this.form.workingHours,
              finishDate: this.form.finishDate,
              maintainItems: this.drawerDetailData,
              result: "已点检",
            };

            if (this.fileList.length > 0) {
              //上传图片
              let formData = new FormData();
              this.fileList.map((file) => {
                formData.append("files", file.originFileObj);
              });
              uploadImages(formData).then((res) => {
                if (res.status == 200 && res.data && res.data !== "") {
                  params.attachment = true;
                  params.attachmentSearchId = res.data;
                  let addParam = {
                    kfId: this.item.id,
                    attachment: params.attachment,
                    attachmentSearchId: params.attachmentSearchId,
                    extension: JSON.stringify(params),
                  };
                  //更新节点
                  addActivities(addParam).then((res) => {
                    if (res.status == 200) {
                      //点检
                      inspectionBill(this.item.id).then((res) => {
                        if (res.status == 200) {
                          this.$message.success("保存成功！");
                          this.onClose();
                          this.$emit("refresh");
                        } else {
                          this.$message.error("点检失败！");
                        }
                      });
                    }
                  });
                } else {
                  this.$message.error("图片上传失败");
                }
              });
            } else {
              let addParam = {
                kfId: this.item.id,
                attachment: false,
                extension: JSON.stringify(params),
              };
              addActivities(addParam).then((res) => {
                if (res.status == 200) {
                  inspectionBill(this.item.id).then((res) => {
                    if (res.status == 200) {
                      this.$message.success("保存成功！");
                      this.onClose();
                      this.$emit("refresh");
                    } else {
                      this.$message.error("点检失败！");
                    }
                  });
                } else {
                  this.$message.error("点检失败！");
                }
              });
            }
          }
          if (this.type_value == "转办") {
            let params = {
              note: this.form.notes,
              userId: this.form.userId.key,
              userName: this.form.userId.label,
              result: "转办",
            };
            let addParam = {
              kfId: this.item.id,
              attachment: false,
              extension: JSON.stringify(params),
            };
            console.log(params, addParam);
            addActivities(addParam).then((res) => {
              if (res.status == 200) {
                let transferParam = {
                  userId: this.form.userId.key,
                };
                transferInspectionBill(this.item.id, transferParam).then(
                  (res) => {
                    if (res.status == 200) {
                      this.$message.success("该点检单已成功转办！");
                      this.onClose();
                      this.$emit("refresh");
                    } else {
                      this.$message.error("转办失败！");
                    }
                  }
                );
              } else {
                this.$message.error("转办失败！");
              }
            });
          }
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
