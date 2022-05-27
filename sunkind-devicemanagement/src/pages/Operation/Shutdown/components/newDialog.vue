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
      <span>新建停机项</span>
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
        <!-- <div class="footer-title">
          <span></span>
          <h3>基本信息</h3>
        </div> -->
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
          <a-form-model-item label="停机原因" prop="downtimeReasons">
            <a-select
              size="large"
              label-in-value
              option-label-prop="label"
              v-model="form.downtimeReasons"
              placeholder="请选择停机原因"
            >
              <a-select-option
                v-for="item in shutDownReason"
                :key="item.id"
                :value="item.id"
                :label="item.dictTitle"
              >
                {{ item.dictTitle }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="计划结束时间" prop="planEndTime">
            <a-date-picker
              size="large"
              style="width: 100%"
              placeholder="请选择计划结束时间"
              v-model="form.planEndTime"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
            />
          </a-form-model-item>
          <a-form-model-item label="计划停机时长" prop="plannedDowntime">
            <a-input
              size="large"
              v-model="form.plannedDowntime"
              placeholder="请输入计划停机时长"
              suffix="时"
            />
          </a-form-model-item>
          <a-form-model-item label="备注" prop="note">
            <a-textarea
              size="large"
              v-model="form.note"
              placeholder="请输入备注"
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
import { uploadImages, addShutDown, getTjyy } from "@/services/api";
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
    devices: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      shutDownReason: [],
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      fileList: [],
      previewVisible: false,
      previewImage: "",
      form: {
        selectDevice: undefined,
        downtimeReasons: undefined,
        planEndTime: undefined,
        plannedDowntime: "",
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
        downtimeReasons: [
          {
            required: true,
            message: "请选择停机原因",
            trigger: "change",
          },
        ],
        plannedDowntime: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "") {
                cbfn("请输入计划停机时长（小时）");
              } else if (value < 0.1 || value > 999.9) {
                cbfn("请输入0.1~999.9之间的数字");
              } else {
                if (value.indexOf(".") > -1 && value.split(".").length > 2) {
                  cbfn("请输入0.1~999.9之间的数字");
                } else {
                  if (
                    value.indexOf(".") > -1 &&
                    value.split(".")[1].length > 1
                  ) {
                    cbfn("请输入0.1~999.9之间的数字");
                  } else {
                    cbfn();
                  }
                }
              }
              cbfn();
            },
          },
        ],
        note: [
          {
            max: 100,
            message: "最多可输入100个字",
          },
        ],
      },
    };
  },
  components: {},
  methods: {
    moment,
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    changeDevice(value) {
      if (value) {
        this.devices.map((item) => {
          if (item.id == value.key) {
            this.selectedDevice = item;
            this.form.selectDevice = {
              key: this.selectedDevice.cmNum,
              label: this.selectedDevice.cmName,
            };
          }
        });
      } else {
        this.selectedDevice = {};
      }
    },
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        getTjyy().then((res) => {
          console.log(res);
          if (res.data) {
            this.shutDownReason = res.data;
          }
        });
        // console.log(this.devices);
      }
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
      this.fileList = [];
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
            // downtimeReasons: this.form.downtimeReasons,
            downtimeReasonsId: this.form.downtimeReasons.key,
            downtimeReasonsName: this.form.downtimeReasons.label,
            planEndTime: this.form.planEndTime,
            plannedDowntime: this.form.plannedDowntime,
            note: this.form.note,
            status: 0,
          };
          console.log(params);
          if (this.fileList.length > 0) {
            //上传图片
            let formData = new FormData();
            this.fileList.map((file) => {
              // console.log(file);
              formData.append("files", file.originFileObj);
            });
            uploadImages(formData).then((res) => {
              console.log(res);
              if (res.status === 200 && res.data && res.data !== "") {
                params.attachment = true;
                params.attachmentSearchId = res.data;
                addShutDown(params).then((res) => {
                  if (res.status == 200) {
                    this.$message.success("保存成功！");
                    this.onClose();
                    this.$emit("refresh");
                  } else {
                    this.$message.error(res.message);
                  }
                });
              } else {
                this.$message.error("图片上传失败");
              }
            });
          } else {
            params.attachment = false;
            addShutDown(params).then((res) => {
              if (res.status == 200) {
                this.$message.success("保存成功！");
                this.onClose();
                this.$emit("refresh");
              } else {
                this.$message.error(res.message);
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
        // padding-top: 0;
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
