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
      <span>新建物料类型</span>
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
              @change="changeTree"
            ></a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="类型名称" :label-col="{ span: 4 }" prop="mattertypeName">
            <a-input size="large" v-model="form.mattertypeName" placeholder="请输入类型名称" />
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
import { add_mattertype } from '@/services/api_basis'
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
    }
  },
  data() {
    return {
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
    /**选择菜单 */
    changeTree(value, label, extra) {
      // console.log(this.form.parentId);
      if (extra.triggerNode['$vnode'].data.props.level > 7) {
        this.$message.warning('类型最多只能创建8层!')
        this.form = {
          mattertype: undefined
        }
      }
    },
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        // console.log(this.current.parentId);
        this.form.mattertype = this.current.id
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
            id: '',
            pid: this.form.mattertype,
            mattertypeName: this.form.mattertypeName
          }
          // console.log(params);
          add_mattertype(params).then(res => {
            // console.log(res);
            if (res.code === 0) {
              this.onClose()
              this.$message.success('保存成功')
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
