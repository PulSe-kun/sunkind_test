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
      <span>新建处置单</span>
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
          <a-form-model-item label="处置方式" prop="disposalWay">
            <a-radio-group
              v-model="form.disposalWay"
              button-style="solid"
              size="large"
              @change="changeType"
            >
              <a-radio-button :value="0" class="radioStyle"
                >报废</a-radio-button
              >
              <a-radio-button :value="1" class="radioStyle"
                >变卖</a-radio-button
              >
              <a-radio-button :value="2" class="radioStyle"
                >其他</a-radio-button
              >
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="处置原因" prop="why">
            <a-textarea
              size="large"
              v-model="form.why"
              placeholder="请输入处置原因"
            />
          </a-form-model-item>
          <a-form-model-item label="图片">
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
        <div class="footer-title">
          <span></span>
          <h3>审批信息</h3>
        </div>
        <div class="dialog-content">
          <a-steps direction="vertical" size="small" class="approval-steps">
            <a-step v-for="(item, index) in steps" :key="index">
              <span slot="icon" v-if="index == steps.length - 1">
                <a-icon type="plus-circle" @click="addApproval" />
              </span>

              <span slot="icon" v-if="index != steps.length - 1">
                <div class="step-process">
                  <span>{{ index + 1 }}</span>
                </div>
              </span>
              <span slot="description" v-if="index !== steps.length - 1">
                <a-select
                  label-in-value
                  show-search
                  allow-clear
                  placeholder="请选择审批人"
                  :filter-option="filterOption"
                  option-filter-prop="children"
                  style="width: 60%"
                  v-model="item.user"
                >
                  <a-select-option
                    v-for="option in mainteners"
                    :key="option.id"
                    :value="option.id"
                    :label="option.name"
                  >
                    {{ option.name }}
                  </a-select-option>
                </a-select>
                <span style="color: red; margin-left: 15px" v-if="index == 0"
                  >*</span
                >
                <img
                  style="cursor: pointer"
                  src="@/assets/img/trashbin1.png"
                  v-if="index !== 0"
                  class="trash-bin"
                  @click="deleteApproval(index)"
                />
              </span>
            </a-step>
          </a-steps>
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
          >提交审批</a-button
        >
      </div>
    </div>
  </a-drawer>
</template>
<script>
import {
  getBatchImages,
  uploadImages,
  addDisposition,
  copyPictures,
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
      steps: [],
      loading: false,
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      fileList: [],
      removedList: [], //删除文件的id
      previewVisible: false,
      previewImage: "",
      form: {
        selectDevice: undefined,
        why: "",
        disposalWay: 0,
      },
      selectedDevice: {
        cmNum: "",
        cmName: "",
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
        why: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "") {
                cbfn("请输入处置原因");
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
  methods: {
    moment,
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    addApproval() {
      this.steps.push({});
    },
    deleteApproval(index) {
      this.steps = this.steps.filter((item, i) => {
        return index !== i;
      });
    },
    disabledDate(current) {
      return current < moment().startOf("day");
    },
    beforeUpload(file) {
      return false;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      console.log(file, this.fileList);
      // if (!file.url && !file.preview) {
      //   file.preview = await getBase64(file.originFileObj);
      // }
      // this.previewImage = file.url || file.preview;
      // this.previewVisible = true;
      for (let i = 0; i < this.fileList.length; i++) {
        if (!this.fileList[i].type_value) {
          this.fileList[i].thumbUrl = await getBase64(
            this.fileList[i].originFileObj
          );
        }
      }
      let index = 0;
      index = this.fileList.findIndex((a) => a.uid === file.uid);
      this.$parent.watchViewImg(index, JSON.stringify(this.fileList));
    },
    changeFile({ file, fileList }) {
      // console.log(file, fileList);
      if (file.status === "removed" && file.type_value) {
        this.removedList.push(file.id);
      }
      this.fileList = fileList;
    },
    changeType(event) {
      // console.log(event);
      this.form.status = event.target.value;
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
    afterVisibleChange(val) {
      this.steps = [{}, {}];
      // console.log(this.item);
      this.$nextTick(function () {
        this.selectedDevice = {
          id: this.item.cmId,
          cmNum: this.item.cmNum,
          cmName: this.item.cmName,
          deptId: this.item.cmDeptId,
          deptName: this.item.cmDeptName,
        };
        this.form = {
          selectDevice: {
            key: this.item.cmId,
            label: this.item.cmName,
          },
          why: this.item.why,
          disposalWay: this.$utils.getStateId(
            "disposalWay",
            this.item.disposalWay
          ),
        };
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
              this.fileList = list;
            }
          });
        }
      });
    },
    onClose() {
      this.fileList = [];
      this.removedList = [];
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
          //校验是否选择审批人
          let persons = [];

          this.steps.map((step, index) => {
            // console.log(step, index);
            if (step.user) {
              persons.push({
                userId: step.user.key,
                userName: this.trim(step.user.label),
                sort: index + 1,
              });
            }
          });
          if (persons.length == 0) {
            this.$message.warning("请选择审批人");
            return;
          }
          let params = {
            cmId: this.selectedDevice.id,
            cmName: this.selectedDevice.cmName,
            cmNum: this.selectedDevice.cmNum,
            disposalWay: this.form.disposalWay,
            why: this.form.why,
            persons: persons,
            status: 4,
            deptId: this.selectedDevice.deptId,
            deptName: this.selectedDevice.deptName,
          };
          if (this.fileList.length > 0) {
            let list = [];
            for (let i = 0; i < this.fileList.length; i++) {
              if (!this.fileList[i].type_value) {
                list.push(this.fileList[i]);
              }
            }
            let img_params = {
              oldSearchId: this.item.attachmentSearchId,
              newSearchId: "",
              removeIdList: this.removedList,
            };
            if (list.length > 0) {
              let formData = new FormData();
              list.map((file) => {
                // console.log(file);
                formData.append("files", file.originFileObj);
              });
              uploadImages(formData).then((res) => {
                if (res.status == 200 && res.data && res.data !== "") {
                  console.log(res.data);
                  img_params.newSearchId = res.data;
                  copyPictures(img_params).then((res) => {
                    if (res.status === 200) {
                      params.attachment = true;
                      params.attachmentSearchId = res.data;
                      addDisposition(params).then((res) => {
                        if (res.status == 200) {
                          this.$message.success("保存成功！");
                          this.onClose();
                          this.$emit("refresh");
                        } else {
                          this.$message.error("保存失败！");
                        }
                      });
                    } else {
                      this.$message.error("图片上传失败");
                    }
                  });
                } else {
                  this.$message.error("图片上传失败");
                }
              });
            } else {
              /**如果有删除图片 */
              if (this.removedList.length > 0) {
                copyPictures(img_params).then((res) => {
                  if (res.status === 200) {
                    params.attachment = true;
                    params.attachmentSearchId = res.data;
                    addDisposition(params).then((res) => {
                      if (res.status == 200) {
                        this.$message.success("保存成功！");
                        this.onClose();
                        this.$emit("refresh");
                      } else {
                        this.$message.error("保存失败！");
                      }
                    });
                  } else {
                    this.$message.error("图片上传失败");
                  }
                });
              } else {
                copyPictures(img_params).then((res) => {
                  if (res.status === 200) {
                    params.attachment = true;
                    params.attachmentSearchId = res.data;
                    addDisposition(params).then((res) => {
                      if (res.status == 200) {
                        this.$message.success("保存成功！");
                        this.onClose();
                        this.$emit("refresh");
                      } else {
                        this.$message.error("保存失败！");
                      }
                    });
                  } else {
                    this.$message.error("图片上传失败");
                  }
                });
              }
            }
          } else {
            addDisposition(params).then((res) => {
              if (res.status == 200) {
                this.$message.success("保存成功！");
                this.onClose();
                this.$emit("refresh");
              } else {
                this.$message.error("保存失败！");
              }
            });
          }
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
<style lang='less' scoped>
.trash-bin {
  width: 16px;
  height: 16px;
  margin-left: 10px;
}

.approval-steps {
  padding: 30px 0 20px 25px;
}

/deep/ .ant-steps-small .ant-steps-item-icon {
  width: 32px;
  height: 32px;
  line-height: 32px;
}

.step-process {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: @theme-color;
  text-align: center;
  span {
    font-size: 14px;
    color: #fff;
    line-height: 22px;
  }
}

.add-approval-btn {
  width: 32px;
  height: 32px;
}

/deep/ .ant-steps-item-container {
  margin-bottom: 7px;
  height: 60px;
}
</style>