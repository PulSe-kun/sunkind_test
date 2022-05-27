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
      <span>新建仓库</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="仓库名称" :label-col="{ span: 4 }" prop="warehouseName">
            <a-input size="large" v-model="form.warehouseName" placeholder="请输入仓库名称" />
          </a-form-model-item>
          <a-form-model-item label="仓库类型" :label-col="{ span: 4 }" prop="warehouseType">
            <a-select size="large" v-model="form.warehouseType" placeholder="请选择仓库类型">
              <a-select-option v-for="item in warehouseType_list" :key="item.id" :value="item.id">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <!-- <a-form-model-item
            label="仓库管理员"
            :label-col="{ span: 4 }"
            prop="warehouseAdmin"
          >
            <a-select
              size="large"
              v-model="form.warehouseAdmin"
              placeholder="请选择仓库管理员"
            >
              <a-select-option
                v-for="item in warehouseAdmin_list"
                :key="item.id"
                :value="item.id"
                >{{ item.realName }}</a-select-option
              >
            </a-select>
          </a-form-model-item>-->
          <a-form-model-item label="备注" prop="warehouseRemark">
            <a-input v-model="form.warehouseRemark" type="textarea" />
          </a-form-model-item>
        </a-form-model>
      </div>
      <div style="display: flex; justify-content: flex-end; padding-top: 26px">
        <a-button class="cancel-style" @click="onClose" style="margin-right: 20px">取消</a-button>
        <a-button class="primary-style" type="primary" @click="onSubmit">保存</a-button>
      </div>
    </div>
  </a-drawer>
</template>
<script>
import { add_warehouse, getUserList } from '@/services/api_basis'
export default {
  data() {
    return {
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      warehouseType_list: [
        {
          id: 1,
          label: '自动仓库'
        },
        {
          id: 2,
          label: '半自动仓库'
        },
        {
          id: 3,
          label: '普通仓库'
        },
        {
          id: 4,
          label: '虚拟仓库'
        }
      ],
      warehouseAdmin_list: [],
      form: {
        warehouseName: '',
        warehouseType: undefined,
        warehouseAdmin: undefined,
        warehouseRemark: ''
      },
      rules: {
        warehouseName: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == '') {
                cbfn('请输入仓库名称')
              } else if (value.length > 20) {
                cbfn('最多可输入20个字')
              }
              cbfn()
            }
          }
        ],
        warehouseType: [
          {
            required: true,
            message: '请选择仓库类型',
            trigger: 'change'
          }
        ],
        // warehouseAdmin: [
        //   {
        //     required: true,
        //     message: '请选择仓库管理员',
        //     trigger: 'change'
        //   }
        // ],
        warehouseRemark: [
          {
            max: 100,
            message: '最多可输入100个字'
          }
        ]
      }
    }
  },
  methods: {
    // 自定义校验函数，
    // checkUserName(rule, value, callback) {
    //   // console.log(value);
    //   let reg = /^(\w){2,10}$/;
    //   if (!reg.test(value)) {
    //     callback("由2~10位英文、数字组成");
    //   } else {
    //     // 如果通过校验，调用无参数的 `callback()` 即可
    //     callback();
    //   }
    // },
    // checkName(rule, value, callback) {
    //   console.log(value);
    // },
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        this.getUserListData()
      }
    },
    /** 获取仓库管理员列表 */
    // getUserListData() {
    //   getUserList().then(res => {
    //     if (res.code === 0) {
    //       this.warehouseAdmin_list = res.data
    //     }
    //   })
    // },
    onClose() {
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // alert("submit!");
          // console.log(this.form);
          const params = {
            warehouseName: this.form.warehouseName,
            warehouseType: this.form.warehouseType,
            warehouseAdmin: this.form.warehouseAdmin,
            warehouseRemark: this.form.warehouseRemark
          }
          console.log(params)
          add_warehouse(params).then(res => {
            // console.log(res);
            if (res.code === 0) {
              this.onClose()
              this.$message.success('保存成功')
              this.$emit('refresh')
            }
          })
        } else {
          // console.log("error submit!!");
          return false
        }
      })
    }
  }
}
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
        background: #2964ff;
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
