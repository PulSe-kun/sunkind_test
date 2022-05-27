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
      <span>编辑物料类型</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="上级类型" :label-col="{ span: 4 }" prop="mattertype">
            <a-tree-select
              size="large"
              v-model="form.mattertype"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              :replaceFields="{
                children: 'children',
                title: 'mattertypeName',
                value: 'id',
                key: 'id',
              }"
              placeholder="请选择上级类型"
              :treeDefaultExpandedKeys="expandedRowKeys"
            ></a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="类型名称" :label-col="{ span: 4 }" prop="mattertypeName">
            <a-input size="large" v-model="form.mattertypeName" placeholder="请输入类型名称" />
          </a-form-model-item>
        </a-form-model>
      </div>
      <div style="display: flex; justify-content: space-between; padding-top: 26px">
        <a-button class="danger-style" type="danger" @click="del_visible = true" ghost>删除</a-button>
        <div>
          <a-button class="cancel-style" @click="onClose" style="margin-right: 20px">取消</a-button>
          <a-button class="primary-style" type="primary" @click="onSubmit">保存</a-button>
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
        <div v-if="dataList.length == 0" class="state_content">确认删除物料类型？</div>
        <template v-if="dataList.length == 0" slot="footer">
          <div class="footer_btn">
            <span style="color: #ed0000" @click="delData">确认删除</span>
          </div>
          <div class="footer_btn">
            <span @click="del_visible = false">取消</span>
          </div>
        </template>
        <div v-if="dataList.length > 0" class="state_content" style="font-size: 20px">
          <span style="font-weight: bold">{{ form.mattertypeName }}</span>或该类型下存在子类型或物料，无法删除
        </div>
        <template v-if="dataList.length > 0" slot="footer">
          <div class="footer_btns">
            <a-button class="primary-style" type="primary" @click="del_visible = false">确认</a-button>
          </div>
        </template>
      </a-modal>
    </template>
  </a-drawer>
</template>
<script>
import { compile_mattertype, isDelete_mattertype } from '@/services/api_basis'
export default {
  props: {
    treeData: {
      type: Array,
      default: []
    },
    expandedRowKeys: {
      type: Array,
      default: []
    },
    current: {
      type: Object,
      default: {}
    },
    dataList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      del_visible: false,
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      list: [],
      form: {
        mattertypeName: '',
        mattertype: undefined
      },
      rules: {
        mattertypeName: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == '') {
                cbfn('请输入类型名称')
              } else if (value.length > 20) {
                cbfn('最多可输入20个字')
              }
              cbfn()
            }
          }
        ],
        mattertype: [
          {
            required: true,
            message: '请选择上级类型',
            trigger: 'change'
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
        console.log(this.dataList)
        this.form.mattertypeName = this.current.name
        if (this.current.parentId == '') {
          this.form.mattertype = undefined
        } else {
          this.form.mattertype = this.current.parentId
        }
      }
    },
    delData() {
      // console.log(删除);
      isDelete_mattertype(this.current.id).then(res => {
        if (res.code === 0) {
          this.del_visible = false
          this.visible = false
          this.$message.success('删除成功')
          this.$emit('refreshtree')
        }
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
            id: this.current.id,
            pid: this.form.mattertype,
            mattertypeName: this.form.mattertypeName
          }
          // console.log(params);
          compile_mattertype(params).then(res => {
            // console.log(res);
            if (res.code === 0) {
              this.visible = false
              this.$message.success('物料编辑成功')
              this.$emit('refreshtree')
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
  .footer_btns {
    width: 100%;
    height: 75px;
    text-align: right;
    padding-right: 20px;
    line-height: 75px;
  }
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