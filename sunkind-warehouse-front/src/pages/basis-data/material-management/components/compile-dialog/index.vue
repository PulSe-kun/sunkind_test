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
      <span>编辑物料</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="类型" :label-col="{ span: 4 }" prop="mattertype">
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
              placeholder="请选择类型"
              :treeDefaultExpandedKeys="expandedRowKeys"
            ></a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="编码" :label-col="{ span: 4 }" prop="matterCode">
            <a-input size="large" v-model="form.matterCode" placeholder="请输入编码" />
          </a-form-model-item>
          <a-form-model-item label="名称" :label-col="{ span: 4 }" prop="matterName">
            <a-input size="large" v-model="form.matterName" placeholder="请输入名称" />
          </a-form-model-item>
          <a-form-model-item label="型号" :label-col="{ span: 4 }" prop="matterMarking">
            <a-input size="large" v-model="form.matterMarking" placeholder="请输入型号" />
          </a-form-model-item>
          <a-form-model-item label="单位" :label-col="{ span: 4 }" prop="matterUnit">
            <a-select size="large" v-model="form.matterUnit" placeholder="请选择单位">
              <a-select-option v-for="item in matterUnit_list" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="品牌" :label-col="{ span: 4 }" prop="matterBrand">
            <a-input size="large" v-model="form.matterBrand" placeholder="请输入品牌" />
          </a-form-model-item>
          <a-form-model-item label="扩展信息" prop="matterExtend">
            <a-input v-model="form.matterExtend" type="textarea" placeholder="请输入扩展信息" />
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
        <div class="state_content" v-if="item">确认删除{{ item.matterName }}？</div>
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
import { compile_matter, isDelete_matter } from '@/services/api_basis'
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
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      del_visible: false,
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      matterUnit_list: [
        { id: 0, name: '个' },
        { id: 1, name: '支' },
        { id: 2, name: '把' },
        { id: 3, name: '颗' },
        { id: 4, name: '块' },
        { id: 5, name: '张' },
        { id: 6, name: '包' },
        { id: 7, name: '本' },
        { id: 8, name: '次' },
        { id: 9, name: '袋' },
        { id: 10, name: '千克' },
        { id: 11, name: '双' },
        { id: 12, name: '台' },
        { id: 13, name: '套' },
        { id: 14, name: '组' },
        { id: 15, name: '对' },
        { id: 16, name: '副' },
        { id: 17, name: '根' },
        { id: 18, name: '盒' },
        { id: 19, name: '件' },
        { id: 20, name: '节' },
        { id: 21, name: '斤' },
        { id: 22, name: '卷' },
        { id: 23, name: '辆' },
        { id: 24, name: '米' },
        { id: 25, name: '盘' },
        { id: 26, name: '批' },
        { id: 27, name: '片' },
        { id: 28, name: '瓶' },
        { id: 29, name: '提' },
        { id: 30, name: '条' },
        { id: 31, name: '桶' },
        { id: 32, name: '箱' },
        { id: 33, name: '只' },
        { id: 34, name: 'PCS' }
      ],
      form: {
        mattertype: undefined,
        matterCode: '',
        matterName: '',
        matterMarking: '',
        matterUnit: undefined,
        matterBrand: '',
        matterExtend: ''
      },
      rules: {
        mattertype: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ],
        matterCode: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              const reg = /^[a-zA-Z0-9_]{0,}$/
              if (value == '') {
                cbfn('请输入编码')
              } else if (value.length > 10 || value.length < 2) {
                cbfn('编码长度为2~10个字')
              } else if (!reg.test(value)) {
                cbfn('编码不能含有中文或特殊字符')
              }
              cbfn()
            }
          }
        ],
        matterName: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == '') {
                cbfn('请输入名称')
              } else if (value.length > 20) {
                cbfn('最多可输入20个字')
              }
              cbfn()
            }
          }
        ],
        matterMarking: [
          {
            max: 20,
            message: '最多可输入20个字'
          }
        ],
        matterUnit: [
          {
            required: true,
            message: '请选择单位',
            trigger: 'change'
          }
        ],
        matterBrand: [
          // {
          //   required: true,
          //   validator: (rule, value, cbfn) => {
          //     if (value == "") {
          //       cbfn("请输入品牌");
          //     } else if (value.length > 20) {
          //       cbfn("最多可输入20个字");
          //     }
          //     cbfn();
          //   },
          // },
          {
            max: 20,
            message: '最多可输入20个字'
          }
        ],
        matterExtend: [
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
        // console.log(this.item);
        this.form.mattertype = this.item.mattertypeId
        this.form.matterCode = this.item.matterCode
        this.form.matterName = this.item.matterName
        this.form.matterMarking = this.item.matterMarking
        this.form.matterUnit = this.item.matterUnit
        this.form.matterBrand = this.item.matterBrand
        this.form.matterExtend = this.item.matterExtend
      }
    },
    onClose() {
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    delData() {
      // console.log(删除);
      isDelete_matter(this.item.matterId).then(res => {
        if (res.code === 0) {
          this.del_visible = false
          this.visible = false
          this.$message.success('删除成功')
          this.$emit('refresh')
        }
      })
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {
            matterId: this.item.matterId,
            matterType: '',
            mattertypeId: this.form.mattertype,
            matterCode: this.form.matterCode,
            matterName: this.form.matterName,
            matterMarking: this.form.matterMarking,
            matterUnit: this.form.matterUnit,
            matterBrand: this.form.matterBrand,
            matterExtend: this.form.matterExtend
          }
          // console.log(params);
          compile_matter(params).then(res => {
            // console.log(res);
            if (res.code === 0) {
              this.visible = false
              this.$message.success('编辑成功')
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
