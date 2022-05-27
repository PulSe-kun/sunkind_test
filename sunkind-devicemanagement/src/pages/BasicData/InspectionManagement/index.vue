<template>
  <div class="InspectionManagement">
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
    <div class="InspectionManagement-content">
      <div class="header">
        <div>
          <ul>
            <li>
              <span>点检项信息：</span>
              <a-input
                v-model="obj.likeSearch"
                placeholder="搜索点检项名称、点检内容"
                style="width: 280px"
              />
            </li>
            <li>
              <span>状态：</span>
              <a-select
                show-search
                placeholder="请选择"
                option-filter-prop="children"
                style="width: 280px"
                v-model="obj.status"
              >
                <a-select-option
                  v-for="item in $state.status"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </li>
          </ul>
        </div>
        <div>
          <a-button class="default-style" @click="query_data">查询</a-button>
        </div>
      </div>
      <div class="InspectionManagement-table">
        <div class="table-btn">
          <a-button class="primary-style" type="primary" @click="newAdd"
            >新建点检项</a-button
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
                :rowKey="
                  (record, index) => {
                    return index;
                  }
                "
              >
                <a
                  slot="deviceName"
                  class="primary-a text-style"
                  slot-scope="text, item"
                  @click="details(item)"
                  >{{ text }}</a
                >
                <span slot="statusFont" slot-scope="text">
                  <div>
                    <img
                      v-show="text == '停用'"
                      src="@/assets/img/dot.png"
                      class="stop-use"
                    />{{ text }}
                  </div>
                </span>
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
                  <a class="link-style primary-a" @click="compile(item)"
                    >编辑</a
                  >
                </template>
              </a-table>
            </a-config-provider>
            <Empty text="暂无点检项" v-else />
          </a-spin>
        </div>
      </div>
    </div>
    <template>
      <NewDialog
        ref="newDialog"
        :treeData="treeData"
        @refreshTree="refreshTree"
      />
      <EditorDialog
        ref="editorDialog"
        :treeData="treeData"
        :item="dataObj"
        @refreshTree="refreshTree"
      />
      <DetailsDialog ref="detailsDialog" />
      <Del_dialog ref="del_dialog" />
      <Img
        @close="img_visible = false"
        :filePreviewShow="img_visible"
        :currentIndex="currentIndex"
        :imgList="imgList"
      />
    </template>
  </div>
</template>

<script>
import {
  NewDialog,
  EditorDialog,
  DetailsDialog,
  Del_dialog,
} from "./components/index";
import Empty from "@/components/Empty/index";
import Img from "@/components/Img.vue";
import {
  getDeviceTree,
  getDeviceData,
  getInspectionTable,
} from "@/services/api";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
export default {
  data() {
    return {
      img_visible: false,
      currentIndex: 0,
      imgList: [],
      orderObj: {
        sort: "",
        column: "",
      },
      pid: "",
      level: 0,
      spinning: false,
      treeData: [],
      expandedRowKeys: [],
      selectedKeys: [], //选中的节点
      treeId: "", //代表唯一标识的id
      count: 0,
      list: [],
      // tree_id: "", //代表唯一标识的id
      isActive: false,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      dataList: [],
      devices: [],
      dataObj: {},
      obj: {
        status: "",
        likeSearch: "",
      },
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
          title: "点检项名称",
          dataIndex: "name",
          align: "center",
          check: true,
          disabled: true,
          sorter: true,
          scopedSlots: { customRender: "deviceName" },
        },
        {
          title: "适用设备类型",
          dataIndex: "deviceTypeName",
          align: "center",
          check: true,
        },
        {
          title: "点检内容",
          dataIndex: "content",
          align: "center",
          check: true,
        },
        {
          title: "状态",
          dataIndex: "status",
          align: "center",
          check: true,
          scopedSlots: { customRender: "statusFont" },
        },

        {
          title: "判定标准",
          dataIndex: "criteria",
          align: "center",
          check: false,
        },
        {
          title: "创建人",
          dataIndex: "createUserName",
          align: "center",
          check: false,
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          align: "center",
          sorter: true,
          check: false,
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
  components: {
    NewDialog,
    EditorDialog,
    DetailsDialog,
    Del_dialog,
    Empty,
    Img,
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
    this.getDeviceTreeData();
    this.getDeviceDataList();
  },
  methods: {
    //查看图片
    watchViewImg(index, pictures) {
      // console.log(index, JSON.parse(pictures));

      let list = JSON.parse(pictures);
      let _imgList = [];
      let _src = "";
      for (let i = 0; i < list.length; i++) {
        if (list[i]["thumbUrl"]) {
          _src = list[i].thumbUrl;
        }
        if (list[i]["previewImage"]) {
          _src = "data:image/png;base64," + list[i].previewImage;
        }
        _imgList.push(_src);
      }
      this.imgList = _imgList;
      this.currentIndex = index;
      this.img_visible = true;
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
        // console.log(data[i]);
        data[i]["names"] = data[i].name;
        if (data[i].djxAmount !== 0) {
          data[i].names = data[i].name + "( " + data[i].djxAmount + " )";
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
        this.getInspectionTableData();
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
      this.getInspectionTableData();
    },
    getDeviceDataList() {
      getDeviceData().then((res) => {
        let { data } = res;
        let result = data.rows;
        if (result && result.length > 0) {
          this.devices = result;
        }
      });
    },
    /**查询 筛选 */
    query_data() {
      this.getInspectionTableData();
    },
    /**
     * 获取点检项信息数据
     */
    getInspectionTableData() {
      let params = {
        limit: this.pagination.pageSize,
        page: this.pagination.current,
        like: this.obj.likeSearch,
        status: this.obj.status,
        sort: this.orderObj.sort,
        column: this.orderObj.column,
      };
      if (this.treeId !== "root") {
        params["typeId"] = this.treeId;
      }
      this.spinning = true;
      getInspectionTable(params).then((res) => {
        console.log(res);
        this.spinning = false;
        if (res.status === 200) {
          if (res.data.rows && res.data.rows.length > 0) {
            res.data.rows.map((item) => {
              // console.log(item.status)
              item.status = this.$utils.getStateName("status", item.status);
              if (item.typeId) {
                this.devices.map((device) => {
                  if (device.id == item.typeId) {
                    item.deviceTypeName = device.name;
                  }
                });
              }
            });
          }
          this.dataList = res.data.rows;
          this.pagination.total = res.data.total;
        }
      });
    },
    /**刷新列表 */
    refresh() {
      this.getInspectionTableData();
    },
    refreshTree() {
      this.getDeviceTreeData();
    },
    /**新增点检项 */
    newAdd() {
      this.$refs.newDialog.visible = true;
    },
    /**详情 */
    details(item) {
      // console.log(item);
      this.dataObj = item;
      this.$refs.detailsDialog.afterVisibleChange(item);
    },
    /**编辑 */
    compile(item) {
      // console.log(item);
      this.dataObj = item;
      this.$refs.editorDialog.visible = true;
    },
    /**
     * 删除点检项
     */
    del_device(id) {
      this.$refs.del_dialog.openDialog(id);
    },
    /**重置表格 */
    reset() {
      this.columnsAll = [
        {
          title: "点检项名称",
          dataIndex: "name",
          align: "center",
          check: true,
          disabled: true,
          sorter: true,
          scopedSlots: { customRender: "deviceName" },
        },
        {
          title: "适用设备类型",
          dataIndex: "deviceTypeName",
          align: "center",
          check: true,
        },
        {
          title: "点检内容",
          dataIndex: "content",
          align: "center",
          check: true,
        },
        {
          title: "状态",
          dataIndex: "status",
          align: "center",
          check: true,
          scopedSlots: { customRender: "statusFont" },
        },

        {
          title: "判定标准",
          dataIndex: "criteria",
          align: "center",
          check: false,
        },
        {
          title: "创建人",
          dataIndex: "createUserName",
          align: "center",
          check: false,
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          align: "center",
          sorter: true,
          check: false,
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
      console.log(pagination, filters, sorter);
      this.orderObj.column = sorter.field;
      if (sorter.order == "descend") {
        this.orderObj.sort = "desc";
      } else {
        this.orderObj.sort = "asc";
      }
      this.pagination = pagination;
      this.getInspectionTableData();
    },
  },
};
</script>

<style lang="less" scoped >
.InspectionManagement {
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
  .InspectionManagement-content {
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
    .InspectionManagement-table {
      // height: calc(100% - 133px);
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
.InspectionManagement .InspectionManagement-content {
  overflow: auto;
}

.stop-use {
  width: 8px;
  height: 8px;
  margin-right: 6px;
}
</style>