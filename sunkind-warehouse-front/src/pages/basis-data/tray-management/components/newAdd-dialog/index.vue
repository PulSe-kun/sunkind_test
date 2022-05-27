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
      <span>新建托盘</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="托盘编码" :label-col="{ span: 4 }" prop="palletCode">
            <a-input size="large" v-model="form.palletCode" placeholder="请输入托盘编码" disabled />
          </a-form-model-item>
          <a-form-model-item label="托盘名称" :label-col="{ span: 4 }" prop="palletName">
            <a-input size="large" v-model="form.palletName" placeholder="请输入托盘名称" />
          </a-form-model-item>
          <a-form-model-item label="托盘类型" :label-col="{ span: 4 }" prop="palletType">
            <a-select size="large" v-model="form.palletType" placeholder="请选择托盘类型">
              <a-select-option v-for="item in palletType_list" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="托盘规格" prop="palletSpecs">
            <a-input v-model="form.palletSpecs" type="textarea" placeholder="请输入托盘规格" />
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
import { add_pallet, findRandomNumber } from '@/services/api_basis'
export default {
  data() {
    return {
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      palletType_list: [
        {
          id: 1,
          name: '平托盘'
        },
        {
          id: 2,
          name: '柱式托盘'
        },
        {
          id: 3,
          name: '箱式托盘'
        },
        {
          id: 4,
          name: '轮式托盘'
        },
        {
          id: 5,
          name: '专用托盘'
        }
      ],
      form: {
        palletCode: '',
        palletName: '',
        palletType: undefined,
        palletSpecs: ''
      },
      rules: {
        palletCode: [
          {
            required: true,
            message: '请输入托盘编码',
            trigger: 'blur'
          }
        ],
        palletName: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == '') {
                cbfn('请输入托盘名称')
              } else if (value.length > 20) {
                cbfn('最多可输入20个字')
              }
              cbfn()
            }
          }
        ],
        palletType: [
          {
            required: true,
            message: '请选择托盘类型',
            trigger: 'change'
          }
        ],
        palletSpecs: [
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
        findRandomNumber().then(res => {
          // console.log(res);
          if (res.code === 0) {
            this.form.palletCode = res.data
          }
        })
      }
    },
    onClose() {
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            palletCode: this.form.palletCode,
            palletName: this.form.palletName,
            palletType: this.form.palletType,
            palletSpecs: this.form.palletSpecs
          }
          // console.log(params);
          add_pallet(params).then(res => {
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
