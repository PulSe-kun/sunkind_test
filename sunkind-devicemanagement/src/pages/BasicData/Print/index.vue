<template>
  <div class="Print">
    <div class="left-sider">
      <div class="left-sider-tree">
        <img
          style="
            position: absolute;
            left: 0;
            top: 0;
            width: 220px;
            height: 63px;
            border-bottom: 1px dashed #979797;
          "
          src="@/assets/img/treeImg.png"
          alt=""
        />
        <a-tree
          v-if="treeData.length"
          :tree-data="treeData"
          :replaceFields="{
            children: 'children',
            title: 'names',
            key: 'id',
          }"
          :selectedKeys="selectedKeys"
          @select="select_tree"
          :defaultExpandedKeys="expandedRowKeys"
        >
          <template slot="name" slot-scope="item" style="color: #08c">
            <p class="tree-font">
              <span class="dot"></span>
              <span>{{ item.names }}</span>
            </p>
          </template>
        </a-tree>
      </div>
    </div>

    <div class="Print-content">
      <div class="header">
        <div>
          <ul>
            <li>
              <span>设备信息：</span>
              <a-input
                v-model="like"
                placeholder="搜索设备编号、名称"
                style="width: 280px"
              />
            </li>
          </ul>
        </div>
        <div>
          <a-button class="default-style" @click="query_data">查询</a-button>
        </div>
      </div>
      <div class="Print-table">
        <div class="table-btn">
          <a-button class="primary-style" type="primary" @click="printMulti"
            >批量打印</a-button
          >
        </div>
        <div class="table-wrap">
          <a-spin :spinning="spinning">
            <a-config-provider :locale="locale" v-if="dataList.length">
              <a-table
                :columns="columns"
                :data-source="dataList"
                :pagination="pagination"
                :sortDirections="['descend', 'ascend']"
                @change="handleChange"
                :row-selection="rowSelection"
                :rowKey="
                  (record, index) => {
                    return record.id;
                  }
                "
              >
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
                            :disabled="item.disabled"
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
                          class="primary-a"
                          style="color: #999"
                          @click="reset"
                          >重置</a-button
                        >
                        <a-button
                          type="link"
                          class="link-style primary-a"
                          @click="sure"
                          >确定</a-button
                        >
                      </div>
                    </div>
                  </a-dropdown>
                </template>
                <template slot="action" slot-scope="text, item">
                  <a class="link-style primary-a" @click="printSingle(item)"
                    >打印</a
                  >
                </template>
              </a-table>
            </a-config-provider>
            <Empty text="暂无设备" v-else />
          </a-spin>
        </div>
      </div>
    </div>
    <!-- 单个打印 -->
    <iframe
      ref="printIframe1"
      frameborder="0"
      scrolling="no"
      style="margin: 0px; padding: 0px; width: 0px; height: 0px"
    >
      <div style="display: none" ref="odiv1">
        <div
          style="
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          "
          id="printSingle"
          ref="printSingle"
        ></div>
        <div style="text-align: center; font-size: 12px; margin: 0; padding: 0">
          <p>{{ this.selectedRow.cmNum }}</p>
          <p>{{ this.selectedRow.cmName }}</p>
          <p>{{ this.selectedRow.deptName }}</p>
        </div>
      </div>
    </iframe>

    <!-- 批量打印 -->
    <iframe
      ref="printIframeMulti"
      frameborder="0"
      scrolling="no"
      style="margin: 0px; padding: 0px; width: 0px; height: 0px"
    >
      <div style="display: none" ref="odivMulti"></div>
    </iframe>
  </div>
</template>

<script>
import Empty from "@/components/Empty/index";
import { getDeviceTree, getDeviceTable } from "@/services/api";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import QRCode from "qrcodejs2";
export default {
  data() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRows = selectedRows;
      },
      onSelect: (record, selected, selectedRows) => {
        this.selectedRows = selectedRows;
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.selectedRows = selectedRows;
      },
    };
    return {
      orderObj: {
        sort: "",
        column: "",
      },
      pid: "",
      level: 0,
      treeData: [],
      expandedRowKeys: [],
      selectedKeys: [], //选中的节点
      treeId: "", //代表唯一标识的id
      count: 0,
      list: [],
      spinning: false,
      rowSelection,
      selectedRows: [],
      selectedRow: {},
      isActive: false,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      dataList: [],
      like: "",
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        defaultPageSize: 10, // 每页显示几条数据
        showSizeChanger: true, // 显示下拉选项（每页几条）
        showTotal: (total) => `共 ${total} 条数据`,
        pageSizeOptions: ["10", "20", "30", "50", "80", "100"],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },
      columns: [],
      columnsAll: [
        {
          title: "设备编号",
          dataIndex: "cmNum",
          check: true,
          disabled: true,
          align: "center",
          sorter: true,
          scopedSlots: { customRender: "cmNum" },
        },
        {
          title: "设备名称",
          dataIndex: "cmName",
          align: "center",
          check: true,
        },
        {
          title: "设备类型",
          dataIndex: "cmTypeName",
          align: "center",
          check: true,
        },
        {
          title: "使用部门",
          dataIndex: "deptName",
          align: "center",
          check: true,
        },
        {
          title: "折旧状态",
          dataIndex: "status",
          align: "center",
          check: true,
        },
        {
          width: 150,
          dataIndex: "operate",
          align: "center",
          check: true,
          scopedSlots: { title: "title_slot", customRender: "action" },
        },
      ],
    };
  },
  components: { Empty },
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
    this.getDeviceTreeData();
    // this.getDeviceTableData();
  },
  methods: {
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
        // console.log(data[i]);
        data[i]["names"] = data[i].name;
        if (data[i].sbAmount !== 0) {
          data[i].names = data[i].name + "( " + data[i].sbAmount + " )";
        }
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
        this.treeId = this.treeData[0].id;
        this.selectedKeys = [this.treeData[0].id];
        this.getDeviceTableData();
      });
    },
    /**
     *
     *点击树节点
     */
    select_tree(selectedKeys, { selectedNodes }) {
      console.log(selectedKeys, selectedNodes);
      this.selectedKeys = selectedKeys;
      this.treeId = selectedKeys[0];
      this.getDeviceTableData();
    },

    /**查询 筛选 */
    query_data() {
      this.getDeviceTableData();
    },
    /**
     * 获取设备信息数据
     */
    getDeviceTableData() {
      let params = {
        limit: this.pagination.pageSize,
        page: this.pagination.current,
        like: this.like,
        sort: this.orderObj.sort,
        column: this.orderObj.column,
      };
      if (this.treeId !== "root") {
        params["cmTypeId"] = this.treeId;
      }
      this.spinning = true;
      getDeviceTable(params).then((res) => {
        console.log(res);
        this.spinning = false;
        if (res.status === 200) {
          if (res.data.rows && res.data.rows.length > 0) {
            res.data.rows.map((item) => {
              item.status = this.$utils.getStateName(
                "depreciationStatus",
                item.status
              );
            });
          }
          this.dataList = res.data.rows;
          this.pagination.total = res.data.total;
        }
      });
    },
    /**刷新列表 */
    refresh() {
      this.getDeviceTableData();
    },
    /**重置表格 */
    reset() {
      this.columnsAll = [
        {
          title: "设备编号",
          dataIndex: "cmNum",
          check: true,
          disabled: true,
          align: "center",
          sorter: true,
          scopedSlots: { customRender: "cmNum" },
        },
        {
          title: "设备名称",
          dataIndex: "cmName",
          align: "center",
          check: true,
        },
        {
          title: "设备类型",
          dataIndex: "cmTypeName",
          align: "center",
          check: true,
        },
        {
          title: "使用部门",
          dataIndex: "deptName",
          align: "center",
          check: true,
        },
        {
          title: "折旧状态",
          dataIndex: "status",
          align: "center",
          check: true,
        },
        {
          width: 150,
          dataIndex: "operate",
          align: "center",
          check: true,
          scopedSlots: { title: "title_slot", customRender: "action" },
        },
      ];
      let list = [];
      for (let i = 0; i < this.columnsAll.length; i++) {
        // this.columnsAll[i].check = true;
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
    onChange(item) {
      // console.log(check);
      item.check = !item.check;
      this.$forceUpdate();
    },
    handleChange(pagination, filters, sorter) {
      // console.log(pagination, filters, sorter);
      this.orderObj.column = sorter.field;
      if (sorter.order == "descend") {
        this.orderObj.sort = "desc";
      } else {
        this.orderObj.sort = "asc";
      }
      this.pagination = pagination;
      this.getDeviceTableData();
    },
    printMulti() {
      if (this.selectedRows.length > 0) {
        //获取指定打印区域
        let printContent = "";
        for (let i = 0; i < this.selectedRows.length; i++) {
          printContent +=
            "<div><div id='prts" +
            i +
            "' style='margin:0;padding:0;display: flex; justify-content: center;align-items: center;'></div><div style='font-size:10px;margin:0 0 2px 0;padding:0;text-align:center;'><p>" +
            this.selectedRows[i].cmNum +
            "</p><p>" +
            this.selectedRows[i].cmName +
            "</p><p>" +
            this.selectedRows[i].deptName +
            "</p></div></div>";
        }
        console.log("打印内容：" + printContent);
        //构建新网页
        this.$refs.odivMulti.innerHTML = printContent;
        this.$nextTick(() => {
          for (let i = 0; i < this.selectedRows.length; i++) {
            new QRCode(document.getElementById("prts" + i), {
              text: this.selectedRows[i].cmNum,
              height: 100,
              // textAlign: "center",
              // fontSize: 10,
              // textMargin: 0,
              // displayValue: false,
              width: 100,
              // margin: 1,
            });
          }
          setTimeout(() => {
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
          }, 300);
        });
      } else {
        this.$message.error("请选择需要打印的设备");
      }
    },
    printSingle(selectedRow) {
      this.selectedRow = selectedRow;
      this.$refs.printSingle.innerHTML = "";
      this.$nextTick(() => {
        new QRCode(this.$refs.printSingle, {
          text: this.selectedRow.cmNum,
          height: 100,
          width: 100,
          colorDark: "#000000",
          colorLight: "#ffffff",
        });
        setTimeout(() => {
          var printIframe = this.$refs.printIframe1;
          var newstr = this.$refs.odiv1.innerHTML;
          printIframe.setAttribute("srcdoc", newstr);
          printIframe.onload = function () {
            console.log(printIframe.contentWindow);
            // 去掉iframe里面的dom的body的padding margin的默认数值
            printIframe.contentWindow.document.body.style.padding = "0px";
            printIframe.contentWindow.document.body.style.margin = "0px";
            // printIframe.contentWindow.document.body.style.textAlign = "center";
            // 开始打印
            printIframe.contentWindow.focus();
            printIframe.contentWindow.print();
          };
        }, 300);
      });
    },
  },
};
</script>

<style scoped lang="less">
.Print {
  height: 100%;
  background: #ffffff;
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
      position: relative;
      height: 100%;
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
  .Print-content {
    flex: 1;
    height: 100%;
    margin-left: 41px;

    .header {
      padding: 45px 20px 35px 1px;
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
    .Print-table {
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
    }
  }
}
</style>
<style lang="less" scoped>
.ant-tree {
  overflow: auto;
  max-width: 180px;
  margin-top: 68px;
  height: calc(100% - 68px);
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
<style lang="less" scoped>
.Print .Print-content {
  overflow: auto;
}
</style>