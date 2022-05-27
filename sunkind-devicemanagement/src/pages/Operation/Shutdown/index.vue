<template>
  <div class="Shutdown">
    <a-tabs :default-active-key="activeKey" @change="callback">
      <a-tab-pane key="0">
        <span slot="tab">停机中</span>
        <div class="tab-content">
          <div class="header" ref="header">
            <div>
              <ul>
                <li>
                  <span>停机信息：</span>
                  <a-input
                    placeholder="搜索单号、设备编号、名称"
                    style="width: 280px"
                    v-model="likeSearch"
                  />
                </li>
              </ul>
            </div>
            <div>
              <a-button class="default-style" @click="search('0')"
                >查询</a-button
              >
            </div>
          </div>
          <div class="Shutdown-table">
            <div class="table-btn">
              <a-button
                class="primary-style"
                type="primary"
                style="margin-right: 20px"
                @click="newAdd"
                >新建停机</a-button
              >
            </div>
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
                    slot="runNo"
                    class="primary-a text-style"
                    slot-scope="text, item"
                    @click="details(item)"
                    >{{ text }}</a
                  >
                  <template slot="testResult" slot-scope="text">
                    <span
                      :style="{
                        color:
                          text == '不合格' ? '#A20000' : 'rgba(0, 0, 0, 0.65)',
                      }"
                      >{{ text }}</span
                    >
                  </template>
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
                    <div
                      style="
                        display: flex;
                        justify-content: space-evenly;
                        align-items: center;
                      "
                    >
                      <a class="link-style primary-a" @click="editor(item)"
                        >开机</a
                      >
                    </div>
                  </template>
                </a-table>
              </a-config-provider>
              <Empty text="暂无停机中的设备" v-else />
            </a-spin>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="1">
        <span slot="tab">停机记录</span>
        <div class="tab-content">
          <div class="header" ref="header">
            <div>
              <ul>
                <li>
                  <span>停机信息：</span>
                  <a-input
                    placeholder="搜索单号、设备编号、名称、故障"
                    v-model="likeSearch_two"
                    style="width: 280px"
                  />
                </li>
                <li>
                  <span>停机原因：</span>
                  <a-select
                    show-search
                    placeholder="请选择停机原因"
                    option-filter-prop="children"
                    style="width: 280px"
                    v-model="status"
                  >
                    <a-select-option
                      v-for="item in shutDownReason"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.dictTitle }}
                    </a-select-option>
                  </a-select>
                </li>
              </ul>
            </div>
            <div>
              <a-button class="default-style" @click="search('1')"
                >查询</a-button
              >
            </div>
          </div>
          <div class="Shutdown-table">
            <a-spin :spinning="spinning_two">
              <a-config-provider :locale="locale" v-if="dataList_two.length">
                <a-table
                  :columns="columns_two"
                  :data-source="dataList_two"
                  :pagination="pagination_two"
                  :sortDirections="['descend', 'ascend']"
                  @change="handleChange_two"
                  :rowKey="
                    (record, index) => {
                      return index;
                    }
                  "
                >
                  <a
                    slot="runNo"
                    class="primary-a text-style"
                    slot-scope="text, item"
                    @click="details(item)"
                    >{{ text }}</a
                  >
                  <span slot="title_slot" style="position: relative">
                    <span style="margin-right: 8px">实际开机时间</span>
                    <a-dropdown
                      :trigger="['click']"
                      placement="bottomCenter"
                      :visible="isActive_two"
                    >
                      <a
                        class="ant-dropdown-link"
                        @click="
                          (e) => {
                            e.preventDefault();
                            isActive_two = true;
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
                        <a-row>
                          <a-col
                            :span="24"
                            v-for="(item, index) in columnsAll_two"
                            :style="{
                              display:
                                item.dataIndex == 'bootTime' ? 'none' : 'block',
                            }"
                            :key="index"
                          >
                            <a-checkbox
                              :disabled="item.disabled"
                              :checked="item.check"
                              @change="onChange_two(item)"
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
                            @click="reset_two"
                            >重置</a-button
                          >
                          <a-button
                            type="link"
                            class="link-style primary-a"
                            @click="sure_two"
                            >确定</a-button
                          >
                        </div>
                      </div>
                    </a-dropdown>
                  </span>
                </a-table>
              </a-config-provider>
              <Empty text="暂无停机记录" v-else />
            </a-spin>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <template>
      <NewDialog ref="newDialog" :devices="devices" @refresh="refresh" />
      <EditorDialog ref="editorDialog" :item="item" @refresh="refresh" />
      <DetailsDialog ref="detailsDialog" />
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
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import Empty from "@/components/Empty/index";
import Img from "@/components/Img.vue";
import {
  getDeviceSelect,
  getShutdowningTable,
  getShutdownRecordTable,
  getTjyy,
} from "@/services/api";
import { NewDialog, EditorDialog, DetailsDialog } from "./components/index";
export default {
  data() {
    return {
        img_visible: false,
      currentIndex: 0,
      imgList: [],
      orderObj: {
        sort: "asc",
        column: "createTime",
      },
      orderObj_two: {
        sort: "desc",
        column: "bootTime",
      },
      item: null,
      devices: [],
      shutDownReason: [],
      activeKey: "0",
      likeSearch: "",
      likeSearch_two: "",
      status: undefined,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      dataList: [],
      spinning: false,
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
          title: "停机单号",
          dataIndex: "runNo",
          align: "center",
          scopedSlots: { customRender: "runNo" },
          check: true,
          disabled: true,
        },
        {
          title: "设备编号",
          dataIndex: "cmNum",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          title: "设备名称",
          dataIndex: "cmName",
          align: "center",
          check: true,
        },
        {
          title: "停机原因",
          dataIndex: "downtimeReasons",
          align: "center",
          check: true,
        },
        {
          title: "计划结束时间",
          dataIndex: "planEndTime",
          align: "center",
          check: true,
        },
        {
          title: "停机时长",
          dataIndex: "plannedDowntime",
          align: "center",
          check: true,
        },
        {
          title: "设备使用部门",
          dataIndex: "deptName",
          align: "center",
          check: false,
        },
        {
          title: "备注",
          dataIndex: "note",
          align: "center",
          check: false,
        },
        {
          title: "停机操作人",
          dataIndex: "createUserName",
          align: "center",
          check: false,
        },
        {
          title: "停机操作时间",
          dataIndex: "createTime",
          align: "center",
          sorter: true,
          check: false,
        },
        {
          dataIndex: "operate",
          scopedSlots: { title: "title_slot", customRender: "action" },
          align: "center",
          check: true,
        },
      ],
      isActive: false,
      isActive_two: false,
      dataList_two: [],
      spinning_two: false,
      pagination_two: {
        current: 1,
        pageSize: 10,
        total: 0,
        defaultPageSize: 10, // 每页显示几条数据
        showSizeChanger: true, // 显示下拉选项（每页几条）
        showTotal: (total) => `共 ${total} 条数据`,
        pageSizeOptions: ["10", "20", "30", "50", "80", "100"],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },
      columns_two: [],
      columnsAll_two: [
        {
          title: "停机单号",
          dataIndex: "runNo",
          align: "center",
          scopedSlots: { customRender: "runNo" },
          check: true,
          disabled: true,
        },
        {
          title: "设备编号",
          dataIndex: "cmNum",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          title: "设备名称",
          dataIndex: "cmName",
          align: "center",
          check: true,
        },
        {
          title: "停机原因",
          dataIndex: "downtimeReasons",
          align: "center",
          check: true,
        },
        {
          title: "设备使用部门",
          dataIndex: "deptName",
          align: "center",
          check: false,
        },
        {
          title: "备注",
          dataIndex: "note",
          align: "center",
          check: false,
        },
        {
          title: "开机操作人",
          dataIndex: "createUserName",
          align: "center",
          check: false,
        },

        {
          title: "开机操作时间",
          dataIndex: "createTime",
          align: "center",
          check: false,
        },
        {
          title: "实际停机时长",
          dataIndex: "outageTime",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          dataIndex: "bootTime",
          align: "center",
          scopedSlots: { title: "title_slot", customRender: "bootTime" },
          sorter: true,
          check: true,
          disabled: true,
        },
      ],
    };
  },
  components: {
    Empty,
    NewDialog,
    EditorDialog,
    DetailsDialog,
    Img
  },
  created() {
    this.$nextTick(() => {
      let list = [];
      for (let i = 0; i < this.columnsAll.length; i++) {
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i]);
        }
      }
      this.columns = list;

      let list_two = [];
      for (let i = 0; i < this.columnsAll_two.length; i++) {
        if (this.columnsAll_two[i].check) {
          list_two.push(this.columnsAll_two[i]);
        }
      }
      this.columns_two = list_two;

      getDeviceSelect().then((res) => {
        let { data } = res;
        let result = data.rows;
        if (result && result.length > 0) {
          this.devices = result;
        }
      });
      getTjyy().then((res) => {
        // console.log(res);
        if (res.data) {
          this.shutDownReason = res.data;
        }
      });
      this.getShutdowningTableData();
    });
  },
  mounted() {},
  methods: {
    //查看图片
    watchViewImg(index, pictures) {
      // console.log(index, JSON.parse(pictures));
      let list = JSON.parse(pictures);
      let _imgList = [];
      let _src = "";
      for (let i = 0; i < list.length; i++) {
        // console.log(list[i]);
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
    /**重置表格 */
    reset() {
      this.columnsAll = [
        {
          title: "停机单号",
          dataIndex: "runNo",
          align: "center",
          scopedSlots: { customRender: "runNo" },
          check: true,
          disabled: true,
        },
        {
          title: "设备编号",
          dataIndex: "cmNum",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          title: "设备名称",
          dataIndex: "cmName",
          align: "center",
          check: true,
        },
        {
          title: "停机原因",
          dataIndex: "downtimeReasons",
          align: "center",
          check: true,
        },
        {
          title: "计划结束时间",
          dataIndex: "planEndTime",
          align: "center",
          check: true,
        },
        {
          title: "停机时长",
          dataIndex: "plannedDowntime",
          align: "center",
          check: true,
        },
        {
          title: "设备使用部门",
          dataIndex: "deptName",
          align: "center",
          check: false,
        },
        {
          title: "备注",
          dataIndex: "note",
          align: "center",
          check: false,
        },
        {
          title: "停机操作人",
          dataIndex: "createUserName",
          align: "center",
          check: false,
        },
        {
          title: "停机操作时间",
          dataIndex: "createTime",
          align: "center",
          sorter: true,
          check: false,
        },
        {
          dataIndex: "operate",
          scopedSlots: { title: "title_slot", customRender: "action" },
          align: "center",
          check: true,
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

    /**重置表格 */
    reset_two() {
      this.columnsAll_two = [
        {
          title: "停机单号",
          dataIndex: "runNo",
          align: "center",
          scopedSlots: { customRender: "runNo" },
          check: true,
          disabled: true,
        },
        {
          title: "设备编号",
          dataIndex: "cmNum",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          title: "设备名称",
          dataIndex: "cmName",
          align: "center",
          check: true,
        },
        {
          title: "停机原因",
          dataIndex: "downtimeReasons",
          align: "center",
          check: true,
        },
        {
          title: "设备使用部门",
          dataIndex: "deptName",
          align: "center",
          check: false,
        },
        {
          title: "备注",
          dataIndex: "note",
          align: "center",
          check: false,
        },
        {
          title: "开机操作人",
          dataIndex: "createUserName",
          align: "center",
          check: false,
        },

        {
          title: "开机操作时间",
          dataIndex: "createTime",
          align: "center",
          check: false,
        },
        {
          title: "实际停机时长",
          dataIndex: "outageTime",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          dataIndex: "bootTime",
          align: "center",
          scopedSlots: { title: "title_slot", customRender: "bootTime" },
          sorter: true,
          check: true,
          disabled: true,
        },
      ];
      let list = [];
      for (let i = 0; i < this.columnsAll_two.length; i++) {
        // this.columnsAll[i].check = true;
        if (this.columnsAll_two[i].check) {
          list.push(this.columnsAll_two[i]);
        }
      }
      this.columns_two = list;
      this.isActive_two = false;
    },
    /**确定更改的表格 */
    sure_two() {
      let list = [];
      for (let i = 0; i < this.columnsAll_two.length; i++) {
        if (this.columnsAll_two[i].check) {
          list.push(this.columnsAll_two[i]);
        }
      }
      this.columns_two = list;
      this.isActive_two = false;
    },
    onChange_two(item) {
      // console.log(check);
      item.check = !item.check;
      this.$forceUpdate();
    },

    /**详情 */
    details(item) {
      this.item = item;
      this.$refs.detailsDialog.afterVisibleChange(this.activeKey, item);
    },
    /**新建 */
    newAdd() {
      this.$refs.newDialog.visible = true;
    },
    /**编辑 */
    editor(item) {
      // console.log(item)
      this.item = item;
      this.$refs.editorDialog.visible = true;
    },
    getShutdowningTableData() {
      let params = {
        page: this.pagination.current,
        limit: this.pagination.pageSize,
        like: this.likeSearch,
        sort: this.orderObj.sort,
        column: this.orderObj.column,
      };
      this.spinning = true;
      getShutdowningTable(params).then((res) => {
        this.spinning = false;
        console.log(res);
        if (res.status === 200) {
          let { rows, total } = res.data;
          this.pagination.total = total;
          for (let i = 0; i < rows.length; i++) {
            rows[i].downtimeReasons = rows[i].downtimeReasonsName;
            rows[i].plannedDowntime = !rows[i].plannedDowntime
              ? ""
              : rows[i].plannedDowntime + "小时";
          }
          this.dataList = rows;
        }
      });
    },
    getShutdownRecordTableData() {
      let params = {
        page: this.pagination_two.current,
        limit: this.pagination_two.pageSize,
        like: this.likeSearch_two,
        sort: this.orderObj_two.sort,
        column: this.orderObj_two.column,
      };
      if (this.status !== undefined) {
        params["downtimeReasons"] = this.status;
      }
      this.spinning_two = true;
      getShutdownRecordTable(params).then((res) => {
        this.spinning_two = false;
        console.log(res);
        if (res.status === 200) {
          let { rows, total } = res.data;
          this.pagination_two.total = total;
          for (let i = 0; i < rows.length; i++) {
            rows[i].downtimeReasons = rows[i].downtimeReasonsName;
            rows[i].outageTime = !rows[i].outageTime
              ? ""
              : rows[i].outageTime + "小时";
          }
          this.dataList_two = rows;
        }
      });
    },
    /**查询 */
    search(value) {
      if (value == "0") {
        this.getShutdowningTableData();
      } else {
        this.getShutdownRecordTableData();
      }
    },
    refresh() {
      this.init();
      this.getShutdowningTableData();
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
      this.getShutdowningTableData();
    },
    handleChange_two(pagination_two, filters, sorter) {
      this.orderObj_two.column = sorter.field;
      if (sorter.order == "descend") {
        this.orderObj_two.sort = "desc";
      } else {
        this.orderObj_two.sort = "asc";
      }
      this.pagination_two = pagination_two;
      this.getShutdownRecordTableData();
    },

    init() {
      this.code = "";
      this.likeSearch_two = "";
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.pagination_two.current = 1;
      this.pagination_two.pageSize = 10;
    },
    callback(key) {
      this.activeKey = key;
      this.likeSearch = "";
      this.likeSearch_two = "";
      this.status = undefined;
      if (this.activeKey == "0") {
        this.init();
        this.getShutdowningTableData();
      } else {
        this.init();
        this.getShutdownRecordTableData();
      }
    },
  },
};
</script>

<style scoped lang="less">
.Shutdown {
  height: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  .ant-tabs {
    padding: 0 23px;
    height: 100%;
    /deep/.ant-tabs-bar {
      margin: 0 0 10px 0;
    }
    /deep/.ant-tabs-content {
      height: calc(100% - 54px);
      .tab-content {
        padding-bottom: 20px;
        height: 100%;
        position: relative;
        overflow: auto;
        .header {
          padding: 26px 20px 30px 20px;
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
                  color: #000000;
                  margin-right: 15px;
                }
              }
            }
          }
        }
        .Shutdown-table {
          margin: 0 20px 20px 20px;
          border-radius: 5px;
          border: 1px solid #e6e6e6;
          .table-btn {
            padding: 22px 0 18px 30px;
            button {
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
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