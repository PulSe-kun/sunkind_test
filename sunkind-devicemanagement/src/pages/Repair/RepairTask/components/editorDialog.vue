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
      <span>{{ type_value }}</span>
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
              维修单号
            </span>
            <span style="font-weight: bold" v-if="item">{{
              item.maintainId | emptyValue
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
        <div style="padding: 20px" v-if="item">
          <a-form-model-item label="故障描述">
            <span>{{ item.faultWhy | emptyValue }}</span>
          </a-form-model-item>
          <a-form-model-item label="故障图片">
            <span class="span-title" v-if="fileList_one.length == 0"
              >暂无图片</span
            >
            <div>
              <img
                style="width: 102px; height: 102px; margin: 0 10px 5px 0;cursor: pointer;"
                v-for="(image, i) in fileList_one"
                :key="i"
                :src="image.thumbUrl"
                :alt="image.name"
                @click="watchViewImg(i, fileList_one)"
              />
            </div>
          </a-form-model-item>
          <div v-if="type_value == '维修'">
            <a-form-model-item label="故障分类" prop="faultClass">
              <a-select
                label-in-value
                size="large"
                v-model="form.faultClass"
                placeholder="请选择"
              >
                <a-select-option
                  v-for="item in malfunctions"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.dictTitle }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="故障原因" prop="faultWhy">
              <a-textarea
                size="large"
                v-model="form.faultWhy"
                placeholder="请输入故障原因"
              />
            </a-form-model-item>
            <a-form-model-item label="解决方法" prop="methods">
              <a-textarea
                size="large"
                v-model="form.methods"
                placeholder="请输入解决方法"
              />
            </a-form-model-item>
            <a-form-model-item label="完工日期" prop="finishDate">
              <a-date-picker
                size="large"
                style="width: 100%"
                placeholder="请选择完工日期"
                v-model="form.finishDate"
                valueFormat="YYYY-MM-DD"
              />
            </a-form-model-item>
            <a-form-model-item label="维修工时" prop="workingHours">
              <a-input
                size="large"
                v-model="form.workingHours"
                placeholder="请输入维修工时"
                suffix="时"
              />
            </a-form-model-item>
          </div>
          <div v-if="type_value == '误报'">
            <a-form-model-item label="误报说明" prop="note">
              <a-textarea
                size="large"
                v-model="form.note"
                placeholder="请输入误报说明"
              />
            </a-form-model-item>
          </div>
          <div v-if="type_value == '转办'">
            <a-form-model-item label="转交给" prop="userId">
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
            <a-form-model-item label="备注" prop="notes">
              <a-textarea
                size="large"
                v-model="form.notes"
                placeholder="请输入备注"
              />
            </a-form-model-item>
          </div>
          <a-form-model-item
            label="图片"
            v-if="type_value == '维修' || type_value == '误报'"
          >
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
    </div>
  </a-drawer>
</template>
<script>
import {
  uploadImages,
  getBatchImages,
  addActivities,
  maintainRepairBill,
  falutRepairBill,
  transferRepairBill,
  getGzfl,
} from "@/services/api";
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
    mainteners: {
      type: Array,
      default: [],
    },
    type_value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      malfunctions: [],
      fileList_one: [],
      fileList: [],
      previewVisible: false,
      previewImage: "",
      form: {
        faultWhy: "",
        methods: "",
        faultClass: undefined,
        finishDate: undefined,
        workingHours: "",
        note: "",
        notes: "",
        userId: undefined,
      },
      rules: {
        faultClass: [
          {
            required: true,
            message: "请选择故障分类",
            trigger: "change",
          },
        ],
        userId: [
          {
            required: true,
            message: "请选择转办人",
            trigger: "change",
          },
        ],
        note: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "" || value == undefined) {
                cbfn("请输入误报说明");
              } else if (value.length > 100) {
                cbfn("最多可输入100个字");
              }
              cbfn();
            },
          },
        ],
        notes: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "" || value == undefined) {
                cbfn("请输入备注");
              } else if (value.length > 100) {
                cbfn("最多可输入100个字");
              }
              cbfn();
            },
          },
        ],
        faultWhy: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "" || value == undefined) {
                cbfn("请输入故障原因");
              } else if (value.length > 100) {
                cbfn("最多可输入100个字");
              }
              cbfn();
            },
          },
        ],
        methods: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "" || value == undefined) {
                cbfn("请输入解决方法");
              } else if (value.length > 100) {
                cbfn("最多可输入100个字");
              }
              cbfn();
            },
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
                cbfn("请输入维修工时（小时）");
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
  methods: {
    moment,
    //查看图片
    watchViewImg(i, pictures) {
      console.log(i, pictures);
      this.$parent.watchViewImg(i, JSON.stringify(pictures));
    },
    afterVisibleChange(val) {
      this.form.finishDate = this.$utils.getTime();
      this.fileList = [];
      if (this.item.attachmentSearchId) {
        getBatchImages(this.item.attachmentSearchId).then((res) => {
          console.log(res);
          let { data } = res;
          if (data.pictures && data.pictures.length > 0) {
            let list = [];
            let images = data.pictures;
            images.map((item) => {
              let image = {
                name: item.name,
                uid: item.id,
                id: item.id,
                type_value: true,
                thumbUrl: "data:image/png;base64," + item.previewImage,
              };
              list.push(image);
            });
            this.fileList_one = list;
          }
        });
      }
      getGzfl().then((res) => {
        // console.log(res);
        if (res.data) {
          this.malfunctions = res.data;
        }
      });
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
    onClose() {
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
    onSubmit() {
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          if (this.type_value == "维修") {
            let params = {
              faultClass: this.form.faultClass,
              faultWhy: this.form.faultWhy,
              methods: this.form.methods,
              workingHours: this.form.workingHours,
              finishDate: this.form.finishDate,
              result: "已维修",
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
                      //保养
                      maintainRepairBill(this.item.id).then((res) => {
                        if (res.status == 200) {
                          this.$message.success("该维修单已成功维修！");
                          this.onClose();
                          this.$emit("refresh");
                        } else {
                          this.$message.error("该维修单维修失败");
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
                  maintainRepairBill(this.item.id).then((res) => {
                    if (res.status == 200) {
                      this.$message.success("该维修单已成功维修！");
                      this.onClose();
                      this.$emit("refresh");
                    } else {
                      this.$message.error("该维修单维修失败");
                    }
                  });
                } else {
                  this.$message.error("该维修单维修失败");
                }
              });
            }
          }
          if (this.type_value == "误报") {
            let params = {
              note: this.form.note,
              result: "误报",
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
                      //保养
                      falutRepairBill(this.item.id).then((res) => {
                        if (res.status == 200) {
                          this.$message.success("该维修单已成功误报！");
                          this.onClose();
                          this.$emit("refresh");
                        } else {
                          this.$message.error("该维修单误报失败");
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
                  falutRepairBill(this.item.id).then((res) => {
                    if (res.status == 200) {
                      this.$message.success("该维修单已成功误报！");
                      this.onClose();
                      this.$emit("refresh");
                    } else {
                      this.$message.error("该维修单误报失败");
                    }
                  });
                } else {
                  this.$message.error("该维修单误报失败");
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
                transferRepairBill(this.item.id, transferParam).then((res) => {
                  if (res.status == 200) {
                    this.$message.success("该维修单已成功转办！");
                    this.onClose();
                    this.$emit("refresh");
                  } else {
                    this.$message.error("该维修单转办失败");
                  }
                });
              } else {
                this.$message.error("该维修单转办失败");
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
