<template>
  <div class="DispositionApproval">
    <a-tabs :default-active-key="activeKey" @change="callback">
      <a-tab-pane key="0">
        <span slot="tab">待审批</span>
        <div class="tab-content">
          <div class="header" ref="header">
            <div>
              <ul>
                <li>
                  <span>处置信息：</span>
                  <a-input
                    placeholder="搜索单号、设备编号、名称、处置原因"
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
          <div class="DispositionApproval-table">
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
                    slot="disposeNo"
                    class="primary-a text-style"
                    slot-scope="text, item"
                    @click="details(item)"
                    >{{ text }}</a
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
                        >审批</a
                      >
                    </div>
                  </template>
                </a-table>
              </a-config-provider>
              <Empty text="暂无待审批的处置单" v-else />
            </a-spin>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="1">
        <span slot="tab">已审批</span>
        <div class="tab-content">
          <div class="header" ref="header">
            <div>
              <ul>
                <li>
                  <span>处置信息：</span>
                  <a-input
                    placeholder="搜索单号、设备编号、名称、处置原因"
                    v-model="likeSearch_two"
                    style="width: 280px"
                  />
                </li>
              </ul>
            </div>
            <div>
              <a-button class="default-style" @click="search('1')"
                >查询</a-button
              >
            </div>
          </div>
          <div class="DispositionApproval-table">
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
                    slot="disposeNo"
                    class="primary-a text-style"
                    slot-scope="text, item"
                    @click="details(item)"
                    >{{ text }}</a
                  >

                  <span slot="title_slot" style="position: relative">
                    <span style="margin-right: 8px">状态</span>
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
                                item.dataIndex == 'status' ? 'none' : 'block',
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
                  <template slot="status" slot-scope="text">
                    {{ text }}
                  </template>
                </a-table>
              </a-config-provider>
              <Empty text="暂无已审批的处置单" v-else />
            </a-spin>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <template>
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
  getRemainingDispositionTable,
  getFinishedDispositionTable,
} from "@/services/api";
import { DetailsDialog, EditorDialog } from "./components/index";

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
      orderObj_two: {
        sort: "",
        column: "",
      },
      item: {},
      activeKey: "0",
      likeSearch: "",
      likeSearch_two: "",
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
          title: "处置单号",
          dataIndex: "disposeNo",
          align: "center",
          scopedSlots: { customRender: "disposeNo" },
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
          title: "处置方式",
          dataIndex: "disposalWay",
          align: "center",
          check: true,
        },
        {
          title: "处置原因",
          dataIndex: "why",
          align: "center",
          check: true,
        },
        {
          title: "申请时间",
          dataIndex: "createTime",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          title: "申请人",
          dataIndex: "createUserName",
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
          dataIndex: "operate",
          align: "center",
          check: true,
          scopedSlots: { title: "title_slot", customRender: "action" },
        },
      ],
      isActive: false,
      isActive_two: false,
      columns_two: [],
      columnsAll_two: [
        {
          title: "处置单号",
          dataIndex: "disposeNo",
          align: "center",
          scopedSlots: { customRender: "disposeNo" },
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
          title: "处置方式",
          dataIndex: "disposalWay",
          align: "center",
          check: true,
        },
        {
          title: "处置原因",
          dataIndex: "why",
          align: "center",
          check: true,
        },
        {
          title: "申请人",
          dataIndex: "createUserName",
          align: "center",
          check: true,
        },
        {
          title: "申请时间",
          dataIndex: "createTime",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          title: "处理时间",
          dataIndex: "updateTime",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          title: "设备使用部门",
          dataIndex: "deptName",
          align: "center",
          check: false,
        },
        {
          dataIndex: "status",
          align: "center",
          scopedSlots: { title: "title_slot", customRender: "status" },
          check: true,
          disabled: true,
        },
      ],
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
    };
  },
  components: {
    Empty,
    DetailsDialog,
    EditorDialog,
    Img,
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
    });
  },
  mounted() {
    this.getRemainingDispositionTableData();
  },
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
          title: "处置单号",
          dataIndex: "disposeNo",
          align: "center",
          scopedSlots: { customRender: "disposeNo" },
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
          title: "处置方式",
          dataIndex: "disposalWay",
          align: "center",
          check: true,
        },
        {
          title: "处置原因",
          dataIndex: "why",
          align: "center",
          check: true,
        },
        {
          title: "申请时间",
          dataIndex: "createTime",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          title: "申请人",
          dataIndex: "createUserName",
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

    /**重置表格 */
    reset_two() {
      this.columnsAll_two = [
        {
          title: "处置单号",
          dataIndex: "disposeNo",
          align: "center",
          scopedSlots: { customRender: "disposeNo" },
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
          title: "处置方式",
          dataIndex: "disposalWay",
          align: "center",
          check: true,
        },
        {
          title: "处置原因",
          dataIndex: "why",
          align: "center",
          check: true,
        },
        {
          title: "申请人",
          dataIndex: "createUserName",
          align: "center",
          check: true,
        },
        {
          title: "申请时间",
          dataIndex: "createTime",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          title: "处理时间",
          dataIndex: "updateTime",
          align: "center",
          sorter: true,
          check: true,
        },
        {
          title: "设备使用部门",
          dataIndex: "deptName",
          align: "center",
          check: false,
        },
        {
          dataIndex: "status",
          align: "center",
          scopedSlots: { title: "title_slot", customRender: "status" },
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
      this.$refs.detailsDialog.afterVisibleChange(item);
    },
    /**编辑 */
    editor(item) {
      this.item = item;
      this.$refs.editorDialog.visible = true;
    },
    getRemainingDispositionTableData() {
      let params = {
        page: this.pagination.current,
        limit: this.pagination.pageSize,
        like: this.likeSearch,
        sort: this.orderObj.sort,
        column: this.orderObj.column,
      };
      this.spinning = true;
      getRemainingDispositionTable(params).then((res) => {
        this.spinning = false;
        console.log(res);
        if (res.status === 200) {
          let { rows, total } = res.data;
          for (let i = 0; i < rows.length; i++) {
            rows[i].status = this.$utils.getStateName(
              "dispositionStatus",
              rows[i].status
            );
            rows[i].disposalWay = this.$utils.getStateName(
              "disposalWay",
              rows[i].disposalWay
            );
          }
          this.dataList = rows;
          this.pagination.total = total;
        }
      });
    },
    getFinishedDispositionTableData() {
      let params = {
        page: this.pagination_two.current,
        limit: this.pagination_two.pageSize,
        like: this.likeSearch_two,
        sort: this.orderObj_two.sort,
        column: this.orderObj_two.column,
      };
      this.spinning_two = true;
      getFinishedDispositionTable(params).then((res) => {
        this.spinning_two = false;
        console.log(res);
        if (res.status === 200) {
          let { rows, total } = res.data;
          this.pagination_two.total = total;
          for (let i = 0; i < rows.length; i++) {
            rows[i].status = this.$utils.getStateName(
              "dispositionStatus",
              rows[i].status
            );
            rows[i].disposalWay = this.$utils.getStateName(
              "disposalWay",
              rows[i].disposalWay
            );
          }
          this.dataList_two = rows;
        }
      });
    },
    /**查询 */
    search(value) {
      if (value == "0") {
        this.getRemainingDispositionTableData();
      } else {
        this.getFinishedDispositionTableData();
      }
    },
    refresh() {
      this.init();
      this.getRemainingDispositionTableData();
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
      this.getRemainingDispositionTableData();
    },
    handleChange_two(pagination_two, filters, sorter) {
      this.orderObj_two.column = sorter.field;
      if (sorter.order == "descend") {
        this.orderObj_two.sort = "desc";
      } else {
        this.orderObj_two.sort = "asc";
      }
      this.pagination_two = pagination_two;
      this.getFinishedDispositionTableData();
    },

    init() {
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
      if (this.activeKey == "0") {
        this.init();
        this.getRemainingDispositionTableData();
      } else {
        this.init();
        this.getFinishedDispositionTableData();
      }
    },
  },
};
</script>

<style scoped lang="less">
.DispositionApproval {
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
        .DispositionApproval-table {
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