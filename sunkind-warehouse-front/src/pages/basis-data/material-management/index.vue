<template>
  <div class="material-management" @mousedown="isActive = false">
    <div class="left-sider">
      <div class="left-sider-btn">
        <a-button class="primary-style" type="primary" @click="newType"
          >新增类型</a-button
        >
        <a-button class="primary-style" type="primary" @click="compileType"
          >编辑类型</a-button
        >
      </div>
      <div class="left-sider-tree">
        <a-tree
          ref="tree"
          v-if="treeData.length"
          :tree-data="treeData"
          :replaceFields="{
            children: 'children',
            title: 'mattertypeName',
            key: 'id',
          }"
          :selectedKeys="selectedKeys"
          @select="select_tree"
          :defaultExpandedKeys="expandedRowKeys"
        >
          <template slot="mattertypeName" slot-scope="item" style="color: #08c">
            <p class="tree-font">
              <span class="dot"></span>
              <span>{{ item.mattertypeName }}</span>
            </p>
          </template>
        </a-tree>
      </div>
    </div>
    <div class="material-management-content">
      <div class="header">
        <div>
          <ul>
            <li>
              <span>物料信息：</span>
              <a-input
                placeholder="搜索物料编码、名称、型号"
                v-model="conditions"
                style="width: 280px"
              />
            </li>
          </ul>
        </div>
        <div>
          <a-button class="default-style" @click="queryData">查询</a-button>
        </div>
      </div>
      <div class="material-management-table">
        <div class="table-btn">
          <a-button class="primary-style" type="primary" @click="addmaterial"
            >新建物料</a-button
          >
          <a-button class="primary-style" type="primary" @click="importMaterial"
            >导入物料</a-button
          >
          <a-button class="primary-style" type="primary" @click="print_more"
            >批量打印标签</a-button
          >
        </div>
        <div class="table-wrap">
          <a-spin :spinning="spinning">
            <a-config-provider :locale="locale" v-if="dataList.length">
              <a-table
                :columns="columns"
                :data-source="dataList"
                :pagination="pagination"
                :row-selection="rowSelection"
                :sortDirections="['descend', 'ascend']"
                @change="handleChange"
                :rowKey="
                  (record, index) => {
                    return record.matterId;
                  }
                "
              >
                <a
                  slot="name"
                  class="primary-a link-style"
                  slot-scope="text, item"
                  @click="details(item)"
                  >{{ text }}</a
                >
                <span slot="username" slot-scope="item">{{ item }}</span>
                <div slot="isDeleted" slot-scope="item">
                  <span v-if="item == 0">正常</span>
                  <span style="color: #ff0000" v-if="item == 1">停用</span>
                </div>
                <div slot="roles" slot-scope="item">
                  <span v-for="(roleName, i) in item" :key="i">{{
                    roleName.roleName
                  }}</span>
                </div>
                <span slot="depts" slot-scope="item">{{
                  item.mattertypeName
                }}</span>
                <template slot="title_slot">
                  <span style="margin-right: 8px">操作</span>
                  <a-dropdown
                    :trigger="['click']"
                    placement="bottomCenter"
                    :visible="isActive"
                  >
                    <a
                      class="ant-dropdown-link"
                      @click="
                        (e) => {
                          e.preventDefault();
                          isActive = true;
                        }
                      "
                    >
                      <img
                        style="width: 16px; height: 16px; margin-top: -3px"
                        src="../../../assets/img/More.png"
                        alt=""
                      />
                    </a>
                    <div class="more" slot="overlay">
                      <!-- <a-checkbox-group @change="onChange"> -->
                      <a-row>
                        <a-col
                          :span="24"
                          v-for="(item, index) in columnsAll"
                          :style="{
                            display:
                              item.dataIndex == 'operate' ? 'none' : 'block',
                          }"
                          :key="index"
                        >
                          <a-checkbox
                            :checked="item.check"
                            @change="onChange(item)"
                            >{{ item.title }}</a-checkbox
                          >
                        </a-col>
                      </a-row>
                      <!-- </a-checkbox-group> -->
                      <div style="padding: 14px 0; text-align: center">
                        <a-button
                          type="link"
                          size="small"
                          class="primary-a"
                          style="color: #999"
                          @click="reset"
                          >重置</a-button
                        >
                        <a-button
                          type="link"
                          size="small"
                          class="link-style primary-a"
                          @click="sure"
                          >确定</a-button
                        >
                      </div>
                    </div>
                  </a-dropdown>
                </template>
                <template slot="action" slot-scope="text, item">
                  <a
                    class="link-style primary-a"
                    style="margin-right: 20px"
                    @click="compilematerial(item)"
                    >编辑</a
                  >
                  <a class="link-style primary-a" @click="print_one(item)"
                    >打印</a
                  >
                </template>
              </a-table>
            </a-config-provider>
            <Empty text="暂无物料" v-else />
          </a-spin>
        </div>
      </div>
    </div>
    <template>
      <NewAdd_dialog
        ref="newAdd_dialog"
        :treeData="treeData"
        :expandedRowKeys="expandedRowKeys"
        :current="current"
        @refresh="refresh"
      />
      <Compile_dialog
        ref="compile_dialog"
        :treeData="treeData"
        :expandedRowKeys="expandedRowKeys"
        :current="current"
        @refresh="refresh"
        :item="item"
      />
      <New_material_type
        ref="new_material_type"
        :treeData="treeData"
        :expandedRowKeys="expandedRowKeys"
        :current="current"
        @refreshtree="refreshtree"
      />
      <Compile_material_type
        ref="compile_material_type"
        :treeData="treeData"
        :expandedRowKeys="expandedRowKeys"
        :current="current"
        :dataList="dataList"
        @refreshtree="refreshtree"
      />
      <Import_material
        ref="import_material"
        @import_materialData="import_materialData"
      />
      <Import_materialData
        ref="import_materialData"
        @uploadAgain="uploadAgain"
      />
      <!-- 托盘单个打印 -->
      <iframe
        ref="printIframe1"
        frameborder="0"
        scrolling="no"
        style="margin: 0px; padding: 0px; width: 0px; height: 0px"
      >
        <div style="display: none" ref="odiv1">
          <p
            style="
              text-align: center;
              font-size: 12px;
              margin: 0 0 4px 0;
              padding: 0;
            "
          >
            {{ this.matterName }} &nbsp;&nbsp; {{ this.matterMarking }}
          </p>
          <svg style="margin: 0; padding: 0" id="prtMental" />
          <div
            style="text-align: center; font-size: 12px; margin: 0; padding: 0"
          >
            {{ this.matterCode }}
          </div>
        </div>
      </iframe>
      <!-- 多个打印 -->
      <iframe
        ref="printIframeMulti"
        frameborder="0"
        scrolling="no"
        style="margin: 0px; padding: 0px; width: 0px; height: 0px"
      >
        <div style="display: none" ref="odivMulti"></div>
      </iframe>
    </template>
  </div>
</template>

<script>
import jsbarcode from "jsbarcode";
import { typeTree } from "@/services/api_statistical";
import { matterPage } from "@/services/api_basis";
import { unit } from "@/utils/utils";
import Empty from "@/components/Empty/index";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import {
  NewAdd_dialog,
  Compile_dialog,
  New_material_type,
  Compile_material_type,
  Import_material,
  Import_materialData,
} from "./components/index";
const columnsAll = [
  {
    title: "行号",
    dataIndex: "index",
    check: true,
    align: "center",
  },
  {
    title: "名称",
    dataIndex: "matterName",
    check: true,
    align: "center",
  },
  {
    title: "编码",
    dataIndex: "matterCode",
    sorter: true,
    check: true,
    align: "center",
  },
  {
    title: "型号",
    dataIndex: "matterMarking",
    check: true,
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "matterType",
    check: true,
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "_matterUnit",
    check: true,
    align: "center",
  },
  {
    title: "品牌",
    dataIndex: "matterBrand",
    check: false,
    align: "center",
  },
  {
    title: "拓展信息",
    dataIndex: "matterExtend",
    check: false,
    align: "center",
  },
  {
    width: 150,
    dataIndex: "operate",
    check: true,
    scopedSlots: { title: "title_slot", customRender: "action" },
    align: "center",
  },
];
export default {
  data() {
    return {
      treeLevel: "",
      pid: "",
      level: 0,
      item: null,
      conditions: "",
      spinning: false,
      parentId: "",
      current: {
        id: undefined,
        name: "",
        parentId: "root",
      },
      treeData: [],
      expandedRowKeys: [], //控制展开几层
      matterName: "",
      matterCode: "",
      matterMarking: "",
      selectedRows: [],
      count: 0,
      selectedKeys: ["0"], //选中的节点
      list: [],
      isActive: false,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      dataList: [],
      order: "asc",
      orderField: "matterCode",
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        defaultPageSize: 10, // 每页显示几条数据
        showSizeChanger: true, // 显示下拉选项（每页几条）
        showTotal: (total) => `共 ${total} 条数据`,
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },
      columns: [],
      columnsAll,
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(selectedRowKeys, selectedRows);
          this.selectedRows = selectedRows;
        },
      };
    },
  },
  components: {
    Empty,
    NewAdd_dialog,
    Compile_dialog,
    New_material_type,
    Compile_material_type,
    Import_material,
    Import_materialData,
  },
  created() {
    let list = [];
    for (let i = 0; i < this.columnsAll.length; i++) {
      // this.columnsAll[i].check = true;
      if (this.columnsAll[i].check) {
        list.push(this.columnsAll[i]);
      }
    }
    this.columns = list;
  },
  mounted() {
    this.typeTreeData();
  },
  methods: {
    /**打印多个 */
    print_more() {
      if (this.selectedRows.length > 0) {
        //获取指定打印区域
        let printContent = "";
        for (let i = 0; i < this.selectedRows.length; i++) {
          printContent +=
            "<div><p style='font-size:10px;margin:0 0 4px 0;padding:0;text-align:cetner;'>" +
            this.selectedRows[i].matterName +
            "&nbsp;&nbsp;" +
            this.selectedRows[i].matterMarking +
            "</p><svg id='prts" +
            i +
            "' style='margin:0;padding:0;'/><div style='font-size:10px;margin:0 0 2px 0;padding:0;text-align:center;'>" +
            this.selectedRows[i].matterCode +
            "</div></div>";
        }
        // console.log("打印内容：" + printContent);

        //构建新网页
        this.$refs.odivMulti.innerHTML = printContent;
        for (let i = 0; i < this.selectedRows.length; i++) {
          jsbarcode(
            document.getElementById("prts" + i),
            this.selectedRows[i].matterCode,
            {
              height: 52,
              textAlign: "center",
              fontSize: 10,
              textMargin: 0,
              displayValue: false,
              width: 1,
              margin: 1,
            }
          );
        }
        var printIframe = this.$refs.printIframeMulti;
        var newstr = this.$refs.odivMulti.innerHTML;
        printIframe.setAttribute("srcdoc", newstr);
        printIframe.onload = function () {
          // 去掉iframe里面的dom的body的padding margin的默认数值
          printIframe.contentWindow.document.body.style.padding = "0px";
          printIframe.contentWindow.document.body.style.margin = "0px";
          // 开始打印
          printIframe.contentWindow.focus();
          printIframe.contentWindow.print();
        };
      } else {
        this.$message.warning("请勾选需打印标签的物料！");
      }
    },
    /**打印当前 */
    print_one(item) {
      console.log(item);
      this.matterName = item.matterName;
      this.matterMarking = item.matterMarking;
      this.matterCode = item.matterCode;
      setTimeout(() => {
        jsbarcode("#prtMental", this.matterCode, {
          height: 50,
          textAlign: "center",
          fontSize: 12,
          textMargin: 0,
          displayValue: false,
          width: 1,
          margin: 2,
        });
        var printIframe = this.$refs.printIframe1;
        var newstr = this.$refs.odiv1.innerHTML;
        printIframe.setAttribute("srcdoc", newstr);
        printIframe.onload = function () {
          console.log(printIframe.contentWindow);
          // 去掉iframe里面的dom的body的padding margin的默认数值
          printIframe.contentWindow.document.body.style.padding = "0px";
          printIframe.contentWindow.document.body.style.margin = "0px";
          // 开始打印
          printIframe.contentWindow.focus();
          printIframe.contentWindow.print();
        };
      }, 300);
    },
    /**重置表格 */
    reset() {
      let list = [];
      for (let i = 0; i < this.columnsAll.length; i++) {
        this.columnsAll[i].check = true;
        if (
          this.columnsAll[i].dataIndex == "matterBrand" ||
          this.columnsAll[i].dataIndex == "matterExtend"
        ) {
          this.columnsAll[i].check = false;
        }
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i]);
        }
      }
      this.columns = list;
      this.isActive = false;
    },
    /**确定更改的表格 */
    sure() {
      let list = [];
      for (let i = 0; i < this.columnsAll.length; i++) {
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i]);
        }
      }
      this.columns = list;
      this.isActive = false;
    },
    /**导入物料具体数据 */
    import_materialData(data) {
      this.$refs.import_materialData.getData(data);
      this.$refs.import_materialData.visible = true;
    },
    /**重新导入 */
    uploadAgain() {
      this.$refs.import_material.visible = true;
    },
    /**导入物料 */
    importMaterial() {
      this.$refs.import_material.visible = true;
    },
    /**新增类型 */
    newType() {
      if (this.treeLevel > 7) {
        this.$message.warning("类型最多只能创建8层!");
        return;
      }
      this.$refs.new_material_type.visible = true;
    },
    /**编辑类型 */
    compileType() {
      if (this.current.name == "") {
        this.$message.warning("请选择物料类型");
        return;
      }
      if (this.current.parentId == "root") {
        this.$message.warning("第一层不可编辑");
        return;
      }
      this.$refs.compile_material_type.visible = true;
    },
    /**加点 展示树形结构 三层*/
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
        if (data[i].children && data[i].children.length > 0) {
          if (this.level <= 1) {
            this.list.push(data[i].id);
          }
          this.setNode(data[i].children, data[i].id);
        } else {
          data[i]["scopedSlots"] = { title: "mattertypeName" };
        }
      }
      if (num === data.length - 1) {
        this.level = data[0].level - 1;
      }
      return data;
    },
    /*
     *@param  需要遍历的数组
     *@param  查询所需要的id
     */
    getObjById(list, id) {
      //判断list是否是数组
      if (!list instanceof Array) {
        return null;
      }
      //遍历数组
      for (let i in list) {
        let item = list[i];
        if (item.id === id) {
          return item;
        } else {
          //查不到继续遍历
          if (item.children) {
            let value = this.getObjById(item.children, id);
            //查询到直接返回
            if (value) {
              return value;
            }
          }
        }
      }
    },
    getChildren(list, returnValue = []) {
      for (let i in list) {
        //把元素都存入returnValue
        returnValue.push(list[i].id);
        if (list[i].children) {
          this.getChildren(list[i].children, returnValue);
        }
      }
      return returnValue;
    },
    /**获取物料管理树 */
    async typeTreeData() {
      await typeTree().then((res) => {
        console.log(res);
        if (res.code == 0) {
          let firstNode = [
            {
              pid: "root",
              mattertypeName: "物料类型",
              id: "0",
              children: res.data,
              mattertypeCode: "",
            },
          ];
          this.setNode(firstNode);
          this.expandedRowKeys = this.list;
          this.treeData = firstNode;
          this.matterPageData({
            conditions: this.conditions,
            page: this.pagination.current,
            limit: this.pagination.pageSize,
            order: this.order,
            orderField: this.orderField,
          });
        }
      });
    },
    /**点击树 */
    select_tree(selectedKeys, { bool, selectedNodes }) {
      // console.log(selectedKeys, bool, selectedNodes[0].data);
      this.treeLevel = selectedNodes[0].data.props.level;
      //获取节点信息
      this.current = {
        id: selectedNodes[0].data.props.id,
        name: selectedNodes[0].data.props.mattertypeName,
        parentId: selectedNodes[0].data.props.pid,
      };
      this.selectedKeys = selectedKeys;
      let list = [];
      let objId = this.getObjById(this.treeData, this.selectedKeys[0]);
      // console.log(objId);
      // list.push(objId.id);
      if (objId && objId.children.length > 0) {
        let childrenList = this.getChildren(objId.children);
        // console.log(childrenList);
        list = childrenList;
      } else {
        list = [];
        // console.log("没有该节点或者没有子元素");
      }
      list.unshift(objId.id);
      let params = {};
      if (selectedKeys[0] == "0") {
        params = {
          conditions: this.conditions,
          page: this.pagination.current,
          limit: this.pagination.pageSize,
          order: this.order,
          orderField: this.orderField,
        };
      } else {
        params = {
          conditions: this.conditions,
          page: this.pagination.current,
          limit: this.pagination.pageSize,
          mattertypeId: list.join(","),
          order: this.order,
          orderField: this.orderField,
        };
      }
      this.matterPageData(params);
    },
    refreshtree() {
      this.conditions = "";
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.selectedKeys = ["0"];
      this.parentId = "";
      this.typeTreeData();
    },
    /**新增物料 */
    addmaterial() {
      this.$refs.newAdd_dialog.visible = true;
    },
    /**编辑物料 */
    compilematerial(item) {
      // console.log(item);
      this.item = item;
      this.$refs.compile_dialog.visible = true;
    },
    queryData() {
      if (this.selectedKeys.length == 0) {
        let params = {
          conditions: this.conditions,
          page: this.pagination.current,
          limit: this.pagination.pageSize,
          order: this.order,
          orderField: this.orderField,
        };
        this.matterPageData(params);
      } else {
        let list = [];
        let objId = this.getObjById(this.treeData, this.selectedKeys[0]);
        if (objId && objId.children.length > 0) {
          let childrenList = this.getChildren(objId.children);
          // console.log(childrenList);
          list = childrenList;
        } else {
          list = [];
          // console.log("没有该节点或者没有子元素");
        }
        list.unshift(objId.id);
        let params = {};
        if (this.selectedKeys[0] == "0") {
          params = {
            conditions: this.conditions,
            page: this.pagination.current,
            limit: this.pagination.pageSize,
            order: this.order,
            orderField: this.orderField,
          };
        } else {
          params = {
            conditions: this.conditions,
            page: this.pagination.current,
            limit: this.pagination.pageSize,
            mattertypeId: list.join(","),
            order: this.order,
            orderField: this.orderField,
          };
        }
        this.matterPageData(params);
      }
    },
    /**获取物料数据 */
    matterPageData(params) {
      this.spinning = true;
      matterPage(params).then((res) => {
        this.spinning = false;
        console.log(res);
        if (res.code == 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i]["index"] =
              (this.pagination.current - 1) * this.pagination.pageSize +
              parseInt(i) +
              1;
            res.data.list[i]["_matterUnit"] = unit(res.data.list[i].matterUnit);
          }
          this.dataList = res.data.list;
          this.pagination.total = res.data.total;
        }
      });
    },
    handleChange(pagination, filters, sorter) {
      // console.log(pagination, sorter);
      if (sorter.order == "descend") {
        this.order = "desc";
      } else {
        this.order = "asc";
      }
      // this.order = sorter.order;
      this.pagination = pagination;
      let list = [];
      // console.log(this.treeData, this.selectedKeys[0]);
      let objId = this.getObjById(this.treeData, this.selectedKeys[0]);
      if (objId && objId.children.length > 0) {
        let childrenList = this.getChildren(objId.children);
        // console.log(childrenList);
        list = childrenList;
      } else {
        list = [];
        // console.log("没有该节点或者没有子元素");
      }
      list.unshift(objId.id);
      let params = {};
      if (this.selectedKeys[0] == "0") {
        params = {
          conditions: this.conditions,
          page: this.pagination.current,
          limit: this.pagination.pageSize,
          order: this.order,
          orderField: this.orderField,
        };
      } else {
        params = {
          conditions: this.conditions,
          page: this.pagination.current,
          limit: this.pagination.pageSize,
          mattertypeId: list.join(","),
          order: this.order,
          orderField: this.orderField,
        };
      }
      this.matterPageData(params);
    },
    refresh() {
      this.conditions = "";
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.queryData();
    },
    onChange(item) {
      // console.log(check);
      item.check = !item.check;
      this.$forceUpdate();
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>

<style lang="less" scoped >
.material-management {
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
        }
      }
    }
  }
  .material-management-content {
    flex: 1;
    height: 100%;
    overflow: auto;
    margin-left: 41px;
    .header {
      padding: 45px 7px 35px 1px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div:first-child {
        ul {
          margin: 0;
          padding: 0;
          li {
            list-style: none;
            float: left;
            margin-right: 60px;
            span:first-child {
              margin-right: 20px;
            }
          }
        }
      }
    }
    .material-management-table {
      margin-right: 20px;
      margin-bottom: 21px;
      border-radius: 5px;
      border: 1px solid #e6e6e6;
      .table-btn {
        padding: 21px 0 33px 30px;
        button {
          margin-right: 20px;
        }
      }
      .table-wrap {
      }
    }
  }
}
.ant-tree {
  overflow: auto;
  max-width: 180px;
  height: 100%;
}
.more {
  max-width: 150px;
  background: #ffffff;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  .ant-col-24 {
    height: 32px;
    line-height: 32px;
    padding-left: 12px;
  }
}
</style>
