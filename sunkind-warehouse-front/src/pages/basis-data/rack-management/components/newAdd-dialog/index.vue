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
      <span>新建料架</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="所属仓库" :label-col="{ span: 4 }" prop="warehouseId">
            <a-select size="large" v-model="form.warehouseId" placeholder="请选择所属仓库">
              <a-select-option v-for="item in warehouseId_list" :key="item.warehouseId" :value="item.warehouseId">{{ item.warehouseName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="料架名称" :label-col="{ span: 4 }" prop="feederName">
            <a-input size="large" v-model="form.feederName" placeholder="请输入料架名称" />
          </a-form-model-item>

          <a-form-model-item label="行数" :label-col="{ span: 4 }" prop="feederLine">
            <a-input-number size="large" id="inputNumber" v-model="form.feederLine" style="width: 100%" placeholder="请输入料架行数" />
          </a-form-model-item>
          <a-form-model-item label="列数" :label-col="{ span: 4 }" prop="feederRow">
            <a-input-number size="large" id="inputNumber" v-model="form.feederRow" style="width: 100%" placeholder="请输入料架列数" />
          </a-form-model-item>
          <a-form-model-item label="备注" prop="feederNote">
            <a-input v-model="form.feederNote" type="textarea" />
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
import { getWareHouseList } from '@/services/api_statistical'
import { add_feeder } from '@/services/api_basis'
export default {
  data() {
    return {
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      warehouseId_list: [],
      form: {
        feederName: '',
        feederLine: '',
        feederRow: '',
        warehouseId: undefined,
        feederNote: ''
      },
      rules: {
        feederName: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == '') {
                cbfn('请输入料架名称')
              } else if (value.length > 20) {
                cbfn('最多可输入20个字')
              }
              cbfn()
            }
          }
        ],
        warehouseId: [
          {
            required: true,
            message: '请选择所属仓库',
            trigger: 'change'
          }
        ],
        feederLine: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              let reg = /^[1-9][0-9]{0,1}$/
              if (value == '' || value == undefined) {
                cbfn('请输入料架行数')
              } else if (!reg.test(value)) {
                cbfn('请输入1-99的整数')
              }
              cbfn()
            }
          }
        ],
        feederRow: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              let reg = /^[1-9][0-9]{0,1}$/
              if (value == '' || value == undefined) {
                cbfn('请输入料架列数')
              } else if (!reg.test(value)) {
                cbfn('请输入1-99的整数')
              }
              cbfn()
            }
          }
        ],
        feederNote: [
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
        this.getWareHouseListData()
      }
    },
    /**获取所有仓库 */
    getWareHouseListData() {
      getWareHouseList().then(res => {
        // console.log(res);
        this.warehouseId_list = res.data
      })
    },
    onClose() {
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            feederName: this.form.feederName,
            feederLine: this.form.feederLine,
            feederRow: this.form.feederRow,
            warehouseId: this.form.warehouseId,
            feederNote: this.form.feederNote
          }
          console.log(params)
          add_feeder(params).then(res => {
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
