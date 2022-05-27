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
      <span>开机</span>
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
              停机单号
            </span>
            <span style="font-weight: bold" v-if="item">{{ item.runNo }}</span>
          </a-form-model-item>
        </div>
        <div style="padding: 20px" v-if="item">
          <a-form-model-item label="停机原因">
            <span>{{ item.downtimeReasons | emptyValue }}</span>
          </a-form-model-item>
          <a-form-model-item label="计划结束时间">
            <span>{{ item.planEndTime | emptyValue }}</span>
          </a-form-model-item>
          <a-form-model-item label="计划停机时长">
            <span>{{ item.plannedDowntime | emptyValue }}</span>
          </a-form-model-item>
          <a-form-model-item label="备注">
            <span>{{ item.note | emptyValue }}</span>
          </a-form-model-item>
          <a-form-model-item label="图片">
            <span class="span-title" v-if="fileList.length == 0">暂无图片</span>
            <div>
              <img
                style="
                  width: 102px;
                  height: 102px;
                  margin: 0 10px 5px 0;
                  cursor: pointer;
                "
                v-for="(image, i) in fileList"
                :key="i"
                :src="image.thumbUrl"
                :alt="image.name"
                @click="watchViewImg(i, fileList)"
              />
            </div>
          </a-form-model-item>
          <a-form-model-item label="实际开机时间" prop="bootTime">
            <a-date-picker
              size="large"
              style="width: 100%"
              placeholder="请选择实际开机时间"
              v-model="form.bootTime"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
            />
          </a-form-model-item>
          <a-form-model-item label="实际停机时长" prop="outageTime">
            <a-input
              size="large"
              v-model="form.outageTime"
              placeholder="请输入实际停机时长"
              suffix="时"
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
import { getBatchImages, powerOn } from "@/services/api";
import moment from "moment";
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
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      fileList: [],
      form: {
        bootTime: undefined,
        outageTime: "",
      },
      rules: {
        bootTime: [
          {
            required: true,
            message: "请选择实际开机时间",
            trigger: "change",
          },
        ],
        outageTime: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "") {
                cbfn("请输入实际停机时长（小时）");
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
      },
    };
  },
  components: {},
  methods: {
    moment,
    //查看图片
    watchViewImg(i, pictures) {
      console.log(i, pictures);
      this.$parent.watchViewImg(i, JSON.stringify(pictures));
    },
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        console.log(this.item);
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
      }
    },
    onClose() {
      this.fileList = [];
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
    onSubmit() {
      this.$refs.ruleForm.validate().then((valid) => {
        if (valid) {
          let params = {
            bootTime: this.form.bootTime,
            outageTime: this.form.outageTime,
          };
          powerOn(this.item.id, params).then((res) => {
            if (res.status == 200) {
              this.$message.success("保存成功！");
              this.onClose();
              this.$emit("refresh");
            } else {
              this.$message.error("保存失败");
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
</style>
