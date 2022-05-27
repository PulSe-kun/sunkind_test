<template>
  <div class="EquipmentTypes">
    <div class="left-sider">
      <div class="left-sider-btn">
        <a-button
          class="primary-style"
          type="primary"
          style="width: 220px"
          size="large"
          @click="add_types"
          >新建类型</a-button
        >
      </div>
      <div class="left-sider-tree">
        <a-tree
          v-if="treeData.length"
          :tree-data="treeData"
          :replaceFields="{
            children: 'children',
            title: 'name',
            key: 'id',
          }"
          :selectedKeys="selectedKeys"
          @select="select_tree"
          :defaultExpandedKeys="expandedRowKeys"
        >
          <template slot="name" slot-scope="item" style="color: #08c">
            <p class="tree-font">
              <span class="dot"></span>
              <span>{{ item.name }}</span>
            </p>
          </template>
        </a-tree>
      </div>
    </div>
    <div
      class="EquipmentTypes-content"
      v-if="type == 'add' || type == 'compile'"
    >
      <div class="content-img">
        <img
          v-if="type == 'add'"
          src="../../../assets/img/add-type.png"
          style="width: 114px; height: 114px"
          alt=""
        />
        <img
          v-if="type == 'compile'"
          src="../../../assets/img/edit-type.png"
          style="width: 114px; height: 114px"
          alt=""
        />
      </div>
      <div class="content-form">
        <a-form-model
          v-if="type == 'add'"
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item
            label="上级类型"
            :label-col="{ span: 3 }"
            prop="types"
          >
            <a-tree-select
              size="large"
              v-model="form.types"
              style="width: 370px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              :replaceFields="{
                children: 'children',
                title: 'name',
                value: 'id',
                key: 'id',
              }"
              placeholder="请选择上级类型"
              :treeDefaultExpandedKeys="expandedRowKeys"
              @change="changeTree"
            >
            </a-tree-select>
          </a-form-model-item>
          <a-form-model-item
            ref="name"
            label="类型名称"
            :label-col="{ span: 3 }"
            prop="types_name"
          >
            <a-input
              size="large"
              style="width: 370px"
              placeholder="请输入类型名称"
              v-model="form.types_name"
            />
          </a-form-model-item>
          <a-form-model-item
            label="排序号"
            :label-col="{ span: 3 }"
            prop="sort"
          >
            <a-input-number
              size="large"
              style="width: 370px"
              v-model="form.sort"
              placeholder="请输入排序号"
            />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
            <div
              style="
                width: 370px;
                display: flex;
                justify-content: center;
                padding-top: 57px;
              "
            >
              <a-button
                class="primary-style"
                type="primary"
                style="width: 220px"
                size="large"
                @click="onSubmit('add')"
                >保存</a-button
              >
            </div>
          </a-form-model-item>
        </a-form-model>
        <a-form-model
          v-if="type == 'compile'"
          ref="ruleForm_compile"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item
            label="上级类型"
            :label-col="{ span: 3 }"
            prop="types_compile"
          >
            <a-tree-select
              size="large"
              v-model="form.types_compile"
              style="width: 370px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              :replaceFields="{
                children: 'children',
                title: 'name',
                value: 'id',
                key: 'id',
              }"
              :disabled="form_disabled"
              placeholder="请选择上级类型"
              :treeDefaultExpandedKeys="expandedRowKeys"
            >
            </a-tree-select>
          </a-form-model-item>
          <a-form-model-item
            ref="name"
            label="类型名称"
            :label-col="{ span: 3 }"
            prop="types_name_compile"
          >
            <a-input
              size="large"
              style="width: 370px"
              placeholder="请输入类型名称"
              v-model="form.types_name_compile"
              :disabled="form_disabled"
            />
          </a-form-model-item>
          <a-form-model-item
            label="排序号"
            :label-col="{ span: 3 }"
            prop="sort_compile"
          >
            <a-input-number
              size="large"
              style="width: 370px"
              v-model="form.sort_compile"
              :disabled="form_disabled"
              placeholder="请输入排序号"
            />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
            <div
              style="
                width: 370px;
                display: flex;
                justify-content: space-between;
                padding-top: 57px;
              "
            >
              <a-button
                size="large"
                type="danger"
                ghost
                class="danger-style"
                style="width: 130px"
                @click="del_types"
                :disabled="form_disabled"
                >删除类型</a-button
              >
              <a-button
                class="primary-style"
                type="primary"
                style="width: 130px"
                size="large"
                @click="onSubmit('compile')"
                :disabled="form_disabled"
                >保存</a-button
              >
            </div>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <template>
      <Del_dialog ref="del_dialog" />
      <DelTitle_dialog ref="delTitle_dialog" />
    </template>
  </div>
</template>

<script>
import Del_dialog from "./components/del_dialog";
import DelTitle_dialog from "@/components/delTitle_dialog.vue";
import { getDeviceTree, addDeviceType, ediDeviceType } from "@/services/api";
export default {
  data() {
    return {
      maxSort: 0,
      treeLevel: 0,
      pid: "",
      level: 0,
      form_disabled: false,
      type: "",
      treeData: [],
      expandedRowKeys: [], //控制展开几层
      selectId: "",
      count: 0,
      selectedKeys: [], //选中的节点
      list: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: "",
      form: {
        types: undefined,
        types_name: "",
        sort: "",
        types_compile: undefined,
        types_name_compile: "",
        sort_compile: "",
      },
      rules: {
        types: [
          {
            required: true,
            message: "请选择上级类型",
            trigger: "change",
          },
        ],
        types_name: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "" || value == undefined) {
                cbfn("请输入类型名称");
              } else if (value.length > 20) {
                cbfn("最多可输入20个字");
              }
              cbfn();
            },
          },
        ],
        sort: [
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
        types_compile: [
          {
            required: true,
            message: "请选择上级类型",
            trigger: "change",
          },
        ],
        types_name_compile: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == "" || value == undefined) {
                cbfn("请输入类型名称");
              } else if (value.length > 20) {
                cbfn("最多可输入20个字");
              }
              cbfn();
            },
          },
        ],
        sort_compile: [
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
      },
    };
  },
  components: {
    Del_dialog,
    DelTitle_dialog,
  },
  created() {},
  mounted() {
    this.getDeviceTreeData();
  },
  methods: {
    delTitle(data) {
      this.$refs.delTitle_dialog.openDialog({
        equipmentManagement: false,
        hasCm: data.hasCm,
        hasChildren: data.hasChildren,
      });
    },
    /**选择菜单 */
    changeTree(value, label, extra) {
      console.log(this.form.parentId);
      this.maxSort = extra.triggerNode["$vnode"].data.props.maxSort;
      this.form.sort = this.maxSort + 10;
      if (extra.triggerNode["$vnode"].data.props.level > 4) {
        this.$message.warning("类型最多只能创建5层!");
        this.form = {
          types: undefined,
        };
      }
    },
    /**展示树形结构 三层 */
    getAllTreeList(list) {
      if (this.count > 3) {
        return;
      } else {
        list.map((item) => {
          this.list.push(item.id);
          if (item.hasOwnProperty("children") && item.children.length > 0) {
            this.count++;
            this.getAllTreeList(item.children);
          }
        });
      }
    },
    /**加点 */
    setNode(data, parentId) {
      if (this.pid != parentId) {
        this.level++;
      }
      this.pid == parentId;
      var num;
      for (var i = 0; i < data.length; i++) {
        num = i;
        // data[i].parentId = parentId;
        data[i].level = this.level;
        // console.log(this.level, "!!!!!!!!!!", data[i]);
        if (data[i].children && data[i].children.length > 0) {
          if (this.level <= 2) {
            this.list.push(data[i].id);
          }
          this.setNode(data[i].children, data[i].id);
        } else {
          data[i]["scopedSlots"] = { title: "name" };
        }
      }
      if (num === data.length - 1) {
        // console.log(this.level, data);
        this.level = data[0].level - 1;
      }
      return data;
    },
    /**获取类型树 */
    async getDeviceTreeData() {
      await getDeviceTree().then((res) => {
        console.log(res);
        this.setNode(res.data);
        this.expandedRowKeys = this.list;
        this.treeData = res.data;
      });
    },
    /**
     *
     *点击树节点
     */
    select_tree(selectedKeys, { selectedNodes }) {
      console.log(selectedKeys, selectedNodes);
      if (selectedNodes.length == 0) {
        this.type = "";
        this.treeLevel = 0;
        this.selectedKeys = [];
      } else {
        this.treeLevel = selectedNodes[0].data.props.level;
        this.form_disabled = false;
        if (selectedNodes[0].data.props.level == 1) {
          this.form_disabled = true;
          this.$message.warning("第一层不可编辑");
        }
        this.selectedKeys = selectedKeys;
        this.maxSort = selectedNodes[0].data.props.maxSort;
        if (this.type == "add") {
          this.$refs.ruleForm.resetFields();
        }
        this.type = "compile";
        this.inqueryBaseDeptsData(selectedNodes[0].data.props);
      }
    },
    /**添加类型 */
    add_types() {
      if (this.treeLevel > 4) {
        this.$message.warning("类型最多只能创建5层!");
      } else {
        if (this.type == "compile") {
          this.$refs.ruleForm_compile.resetFields();
          this.form.types_desc_compile = "";
        }
        this.type = "add";
        this.form = {
          types:
            this.selectedKeys.length > 0 ? this.selectedKeys[0] : undefined,
          sort: this.selectedKeys.length > 0 ? this.maxSort + 10 : "",
        };
      }
    },
    /**查询当前类型的数据 */
    inqueryBaseDeptsData(obj) {
      console.log(obj);
      this.form = {
        types_compile: obj.pid,
        types_name_compile: obj.name,
        sort_compile: obj.sort,
      };
      this.selectId = obj.id;
    },
    onSubmit(type) {
      if (type == "add") {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // console.log(this.form);
            let params = {
              pid: this.form.types,
              name: this.form.types_name,
              sort: this.form.sort,
            };
            console.log(params);
            addDeviceType(params).then((res) => {
              // console.log(res);
              if (res.status === 200) {
                this.$refs.ruleForm.resetFields();
                this.$message.success("保存成功");
                this.refresh();
              }
            });
          } else {
            // console.log("error submit!!");
            return false;
          }
        });
      } else if (type == "compile") {
        this.$refs.ruleForm_compile.validate((valid) => {
          if (valid) {
            let params = {
              id: this.selectId,
              pid: this.form.types_compile,
              name: this.form.types_name_compile,
              sort: this.form.sort_compile,
            };
            console.log(params);
            ediDeviceType(this.form.types_compile, params).then((res) => {
              console.log(res);
              if (res.status === 200) {
                this.$message.success("保存成功");
                this.refresh();
              }
            });
          } else {
            // console.log("error submit!!");
            return false;
          }
        });
      }
    },
    /**当删除类型时还原页面状态 */
    refresh() {
      this.selectId = "";
      this.type = "";
      this.selectedKeys = [];
      this.getDeviceTreeData();
    },
    /**
     * 删除类型
     */
    del_types() {
      // console.log("删除类型");
      this.$refs.del_dialog.openDialog(this.selectId);
    },
  },
};
</script>

<style lang="less" scoped >
.EquipmentTypes {
  height: 100%;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  display: flex;
  .left-sider {
    height: calc(100% - 42px);
    margin-left: 20px;
    margin-top: 20px;
    margin-bottom: 22px;
    background: #ffffff;
    flex: 0 0 220px;
    .left-sider-btn {
      padding: 10px 0 20px 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .left-sider-tree {
      height: calc(100% - 62px);
      padding: 25px 20px;
      border: 1px dashed #979797;
      .tree-font {
        display: flex;
        flex-direction: row;
        align-items: center;
        .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          background-color: #595959;
          border-radius: 50%;
          margin-left: -4px;
          margin-right: 9px;
        }
        span:last-child {
          font-size: 14px;
          font-weight: 400;
          // color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }
  .EquipmentTypes-content {
    flex: 1;
    height: 100%;
    padding-top: 82px;
    margin-left: 41px;
    overflow: auto;
    .content-img {
      padding-left: 29px;
      padding-bottom: 20px;
      float: left;
      height: 100%;
    }
    .content-form {
      margin-left: 170px;
      padding-bottom: 20px;
      overflow: hidden;
    }
  }
}
.ant-tree {
  overflow: auto;
  max-width: 180px;
  height: 100%;
}
</style>