<template>
  <a-drawer
    :closable="false"
    placement="top"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog"
  >
    <div class="header">
      <span>编辑系统</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item
            label="系统名称"
            :label-col="{ span: 4 }"
            prop="system_name"
          >
            <a-input
              size="large"
              v-model="form.system_name"
              placeholder="请输入系统名称"
            />
          </a-form-model-item>
          <a-form-model-item
            label="系统地址"
            :label-col="{ span: 4 }"
            prop="system_url"
          >
            <a-input
              size="large"
              v-model="form.system_url"
              placeholder="请输入系统地址"
            />
          </a-form-model-item>
          <a-form-model-item
            label="系统描述"
            :label-col="{ span: 4 }"
            prop="system_describe"
          >
            <a-input
              size="large"
              v-model="form.system_describe"
              placeholder="请输入系统描述"
            />
          </a-form-model-item>
          <a-form-model-item
            label="排序号"
            :label-col="{ span: 4 }"
            prop="system_sort"
          >
            <a-input
              size="large"
              style="width: 100%"
              v-model="form.system_sort"
              placeholder="请输入排序号"
            />
          </a-form-model-item>
          <a-form-model-item
            label="图标"
            :label-col="{ span: 4 }"
            prop="system_icon"
          >
            <a-select
              size="large"
              v-model="form.system_icon"
              placeholder="请选择图标"
              option-label-prop="label"
              :disabled="form.system_name == ''"
            >
              <a-select-option
                v-for="item in system_icon_list"
                :key="item.id"
                :label="item.imgUrl"
                :value="item.imgUrl"
              >
                <div class="select_style" @click="handleChange(item)">
                  <div class="icon_style">
                    <img
                      :src="
                        require('@/assets/systemIcon/' + item.imgUrl + '.png')
                      "
                      alt=""
                    />
                  </div>
                  <span :title="form.system_name">{{ form.system_name }}</span>
                </div>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <!-- <a-form-model-item label="图标" :label-col="{ span: 4 }">
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :multiple="false"
              @change="changeFile"
              :before-upload="beforeUpload"
            >
              <img
                style="width: 102px; height: 102px"
                v-if="imageUrl"
                :src="imageUrl"
                alt="avatar"
              />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
          </a-form-model-item> -->
        </a-form-model>
      </div>
      <div
        style="display: flex; justify-content: space-between; padding-top: 26px"
      >
        <a-button class="danger-style" type="danger" @click="del_Dialog" ghost>
          删除系统
        </a-button>
        <div>
          <a-button
            @click="onClose"
            class="cancel-style"
            style="
              margin-right: 20px;
              color: #b5b5b5;
              border: 1px solid #b4b4b4;
            "
          >
            取消
          </a-button>
          <a-button class="primary-style" type="primary" @click="onSubmit"
            >保存</a-button
          >
        </div>
      </div>
    </div>
    <template>
      <a-modal
        v-model="del_visible"
        :closable="false"
        centered
        :bodyStyle="{
          padding: '0px',
          width: '530px',
          height: '274px',
        }"
        wrapClassName="state_dialog"
      >
        <div class="state_content">确认删除该系统？</div>
        <template slot="footer">
          <div class="footer_btn">
            <span style="color: #ed0000" @click="delData">确认删除</span>
          </div>
          <div class="footer_btn">
            <span @click="del_visible = false">取消</span>
          </div>
        </template>
      </a-modal>
    </template>
  </a-drawer>
</template>
<script>
import {
  compileSysMenus,
  inquerySysMenus,
  deleteSysMenus,
} from "@/services/api_system";
import { getUserPermission } from "@/services/api_user";
function getBase64(img, callback) {
  console.log(img);
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  props: {
    system_id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      menuTree: [],
      del_visible: false,
      selectId: "",
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      roleData: [],
      loading: false,
      imageUrl: "",
      system_icon_list: [
        {
          id: 1,
          imgUrl: "system_1",
        },
        {
          id: 2,
          imgUrl: "system_2",
        },
        {
          id: 3,
          imgUrl: "system_3",
        },
        {
          id: 4,
          imgUrl: "system_4",
        },
        {
          id: 5,
          imgUrl: "system_5",
        },
        {
          id: 6,
          imgUrl: "system_6",
        },
        {
          id: 7,
          imgUrl: "system_7",
        },
        {
          id: 8,
          imgUrl: "system_8",
        },
        {
          id: 9,
          imgUrl: "system_9",
        },
        {
          id: 10,
          imgUrl: "system_10",
        },
        {
          id: 11,
          imgUrl: "system_11",
        },
        {
          id: 12,
          imgUrl: "system_12",
        },
      ],
      form: {
        system_name: "",
        system_url: "",
        system_describe: "",
        system_sort: "",
        system_icon: undefined,
      },
      rules: {
        system_name: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "" || value == undefined) {
                cbfn("请输入系统名称");
              } else if (value.length > 20) {
                cbfn("最多可输入20个字");
              }
              cbfn();
            },
          },
        ],
        system_url: [
          {
            required: true,
            message: "请输入系统地址",
            trigger: "blur",
          },
        ],
        system_describe: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "" || value == undefined) {
                cbfn("请输入系统描述");
              } else if (value.length > 30) {
                cbfn("最多可输入30个字");
              }
              cbfn();
            },
          },
        ],
        system_sort: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              let reg = /^\+?[1-9]\d{0,3}(\.\d*)?$/;
              if (value == "") {
                cbfn("请输入排序号");
              } else if (
                !reg.test(value) ||
                value.toString().indexOf(".") > -1
              ) {
                cbfn("请输入1-9999的整数");
              }
              cbfn();
            },
          },
        ],
        system_icon: [
          {
            required: true,
            message: "请选择图标",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    // 自定义校验函数，
    checkUserName(rule, value, callback) {
      // console.log(value);
      let reg = /^(\w){2,10}$/;
      if (!reg.test(value)) {
        callback("由2~10位英文、数字组成");
      } else {
        // 如果通过校验，调用无参数的 `callback()` 即可
        callback();
      }
    },
    handleChange(item) {
      console.log(item);
      this.form.system_icon = item.imgUrl;
    },
    beforeUpload(file) {
      return false;
    },
    changeFile(info) {
      // 上传文件=
      this.loading = true;
      getBase64(info.fileList[0].originFileObj, (imageUrl) => {
        this.imageUrl = imageUrl;
        this.loading = false;
      });
    },
    afterVisibleChange(val) {
      //   console.log("visible", val);
      if (val) {
        this.inquerySysMenusData(this.system_id);
        this.getUserPermissionData();
      }
    },
    getUserPermissionData() {
      getUserPermission().then((res) => {
        // console.log(res);
        if (res.status == 200) {
          this.menuTree = res.data.menuTree;
        }
      });
    },
    /**查询当前系统的数据 */
    inquerySysMenusData(id) {
      // console.log(id);
      inquerySysMenus(id).then((res) => {
        console.log(res);
        if (res.status == 200) {
          this.form = {
            system_name: res.data.menuTitle,
            system_url: res.data.menuPath,
            system_sort: res.data.orderNum,
            system_describe: res.data.description,
            system_icon: res.data.menuIcon,
          };
          this.selectId = res.data.id;
        }
      });
    },
    onClose() {
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
    del_Dialog() {
      let list = [];
      for (let i = 0; i < this.menuTree.length; i++) {
        if (this.selectId == this.menuTree[i].id) {
          list = this.menuTree[i].children;
        }
      }
      // console.log(list);
      if (list.length == 0) {
        this.del_visible = true;
      } else {
        this.$message.warning("系统下存在菜单，不可删除");
      }
    },
    delData() {
      //   console.log(删除);
      deleteSysMenus(this.selectId).then((res) => {
        if (res.status == 200) {
          this.visible = false;
          this.del_visible = false;
          this.$message.success("删除成功");
          this.$emit("refresh");
        }
      });
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.selectId,
            parentId: "root",
            menuType: 2,
            menuTitle: this.form.system_name,
            menuPath: this.form.system_url,
            orderNum: this.form.system_sort,
            description: this.form.system_describe,
            menuIcon: this.form.system_icon,
          };
          // console.log(params);
          compileSysMenus(this.selectId, params).then((res) => {
            // console.log(res);
            if (res.status === 200) {
              this.visible = false;
              this.$refs.ruleForm.resetFields();
              this.$message.success("保存成功");
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
        background: @theme-color  ;
        box-shadow: 0px 0px 5px 0px rgba(110, 110, 110, 0.36);
        padding-left: 20px;
        text-align: left;
        span {
          font-size: 22px;
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
        max-height: 863px;
        overflow: auto;
        .model {
          background: #ffffff;
          box-shadow: -2px 2px 7px 0px rgba(179, 179, 179, 0.4);
          border-radius: 5px;
          padding: 29px 20px 23px 17px;
          .ant-form-item {
            .ant-form-item-control {
              width: 438px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
/deep/.ant-modal {
  max-width: 530px !important;
  max-height: 350px;
  .state_content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    font-weight: 400;
    color: #000000;
    span {
      font-weight: bold;
    }
  }
}
/deep/.ant-modal-footer {
  overflow: hidden;
  padding: 0;
  .footer_btn {
    width: 260px;
    height: 75px;
    text-align: center;
    line-height: 75px;
    float: left;
    span {
      cursor: pointer;
      font-size: 18px;
      font-weight: 400;
    }
  }
  .footer_btn:first-child {
    border-right: 1px solid #f2f2f2;
  }
}
</style>
<style lang="less" scoped>
/deep/.avatar-uploader {
  .ant-upload {
    width: 102px;
    height: 102px;
  }
}
.select_style {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .icon_style {
    width: 25px;
    height: 25px;
    text-align: center;
    vertical-align: middle;
    background: #000;
    img {
      width: 20px;
      height: 20px;
    }
  }
  span {
    display: inline-block;
    text-align: right;
    width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #ccc;
  }
}
</style>
<style lang="less" scoped>
/deep/.ant-form-item-label > label {
  font-size: 16px;
  font-weight: 400;
  color: #999999 !important;
}
</style>