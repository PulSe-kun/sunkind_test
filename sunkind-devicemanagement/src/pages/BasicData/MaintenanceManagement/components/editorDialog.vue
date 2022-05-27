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
      <span>编辑保养项</span>
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
          <a-form-model-item label="适用设备类型" prop="typeData">
            <a-tree-select
              size="large"
              labelInValue
              v-model="form.typeData"
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
              placeholder="请选择适用设备类型"
            >
            </a-tree-select>
          </a-form-model-item>

          <a-form-model-item label="保养项名称" prop="name">
            <a-input
              size="large"
              v-model="form.name"
              placeholder="请输入保养项名称"
            />
          </a-form-model-item>
          <a-form-model-item label="保养内容" prop="content">
            <a-textarea
              size="large"
              v-model="form.content"
              placeholder="请输入保养内容"
            />
          </a-form-model-item>
          <a-form-model-item label="状态" prop="status">
            <a-radio-group
              v-model="form.status"
              button-style="solid"
              size="large"
            >
              <a-radio-button :value="0" class="radioStyle"
                >正常</a-radio-button
              >
              <a-radio-button :value="1" class="radioStyle"
                >停用</a-radio-button
              >
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="保养方法" prop="method">
            <a-textarea
              size="large"
              v-model="form.method"
              placeholder="请输入保养方法"
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
import {
  getBatchImages,
  delByIdsImages,
  updateImages,
  editMaintainItem,
} from "@/services/api";
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
      loading: false,
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      fileList: [],
      removedList: [], //删除文件的id
      previewVisible: false,
      previewImage: "",
      form: {
        name: "",
        typeData: undefined,
        status: undefined,
        content: "",
        method: "",
      },
      rules: {
        name: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "") {
                cbfn("请输入保养项名称");
              } else if (value.length > 20) {
                cbfn("最多可输入20个字");
              }
              cbfn();
            },
          },
        ],
        typeData: [
          {
            required: true,
            message: "请选择适用设备类型",
            trigger: "change",
          },
        ],
        content: [
          {
            max: 100,
            message: "最多可输入100个字",
          },
        ],
        method: [
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
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        this.$nextTick(function () {
          console.log(this.item);
          this.form = {
            name: this.item.name,
            typeData: {
              value: this.item.typeId,
              label: this.item.typeName,
            },
            status: this.item.status == "停用" ? 1 : 0,
            content: this.item.content,
            method: this.item.method,
          };
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
      // let imageUrl = "";
      // if (file.type_value) {
      //   imageUrl = file.thumbUrl;
      // } else if (!file.url && !file.preview) {
      //   imageUrl = await getBase64(file.originFileObj);
      // }
      // this.previewImage = imageUrl;
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
    onClose() {
      this.form.status = 0;
      this.fileList = [];
      this.removedList = [];
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.item.id,
            status: this.form.status,
            name: this.form.name,
            content: this.form.content,
            method: this.form.method,
            typeId: this.form.typeData.value,
            typeName: this.form.typeData.label,
            attachmentSearchId: this.item.attachmentSearchId,
            attachment: true,
          };
          if (this.fileList.length > 0) {
            console.log(this.removedList);
            let list = [];
            for (let i = 0; i < this.fileList.length; i++) {
              if (!this.fileList[i].type_value) {
                list.push(this.fileList[i]);
              }
            }
            if (this.removedList.length > 0) {
              delByIdsImages(this.removedList).then((res) => {
                console.log(res);
                if (res.data) {
                  // //上传图片
                  let formData = new FormData();
                  list.map((file) => {
                    // console.log(file);
                    formData.append("files", file.originFileObj);
                  });
                  updateImages(this.item.attachmentSearchId, formData).then(
                    (res) => {
                      console.log(res);
                      if (res.status === 200) {
                        editMaintainItem(this.item.id, params).then((res) => {
                          if (res.status == 200) {
                            this.$message.success("保存成功！");
                            this.onClose();
                            this.$emit("refreshTree");
                          } else {
                            this.$message.error(res.message);
                          }
                        });
                      } else {
                        this.$message.error("图片上传失败");
                      }
                    }
                  );
                }
              });
            } else {
              if (list.length > 0) {
                // //上传图片
                let formData = new FormData();
                list.map((file) => {
                  // console.log(file);
                  formData.append("files", file.originFileObj);
                });
                updateImages(this.item.attachmentSearchId, formData).then(
                  (res) => {
                    console.log(res);
                    if (res.status === 200) {
                      editMaintainItem(this.item.id, params).then((res) => {
                        if (res.status == 200) {
                          this.$message.success("保存成功！");
                          this.onClose();
                          this.$emit("refreshTree");
                        } else {
                          this.$message.error(res.message);
                        }
                      });
                    } else {
                      this.$message.error("图片上传失败");
                    }
                  }
                );
              } else {
                editMaintainItem(this.item.id, params).then((res) => {
                  if (res.status == 200) {
                    this.$message.success("保存成功！");
                    this.onClose();
                    this.$emit("refreshTree");
                  } else {
                    this.$message.error(res.message);
                  }
                });
              }
            }
          } else {
            params.attachment = false;
            editMaintainItem(this.item.id, params).then((res) => {
              if (res.status == 200) {
                this.$message.success("保存成功！");
                this.onClose();
                this.$emit("refreshTree");
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
