<template>
  <div class="InspectionBills">
    <div class="header" ref="header">
      <div>
        <ul>
          <li>
            <span>点检信息：</span>
            <a-input
              v-model="obj.likeSearch"
              placeholder="搜索单号、设备编号、名称、点检项"
              style="width: 280px"
            />
          </li>
          <li>
            <span>点检人：</span>
            <a-select
              allow-clear
              show-search
              placeholder="请选择"
              option-filter-prop="children"
              style="width: 280px"
              v-model="obj.status"
            >
              <a-select-option v-for="option in mainteners" :key="option.id">
                {{ option.name }}
              </a-select-option>
            </a-select>
          </li>
        </ul>
      </div>
      <div>
        <a-button class="default-style" @click="query_data">查询</a-button>
      </div>
    </div>
    <div class="InspectionBills-table">
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
                slot="checkoutNo"
                class="primary-a text-style"
                slot-scope="text, item"
                @click="details(item)"
                >{{ text }}</a
              >
              <template slot="title_slot">
                <span style="margin-right: 8px">状态</span>
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
                            item.dataIndex == 'status' ? 'none' : 'block',
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
              <template slot="status" slot-scope="text">
                {{ text }}
              </template>
            </a-table>
          </a-config-provider>
          <Empty text="暂无点检单" v-else />
        </a-spin>
      </div>
    </div>
    <template>
      <template>
        <DetailsDialog ref="detailsDialog" />
        <Img
          @close="img_visible = false"
          :filePreviewShow="img_visible"
          :currentIndex="currentIndex"
          :imgList="imgList"
        />
      </template>
    </template>
  </div>
</template>

<script>
import { DetailsDialog } from "./components/index";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import Empty from "@/components/Empty/index";
import { getUsers_xj, getInspectionBillsTable } from "@/services/api";
import Img from "@/components/Img.vue";
export default {
  data() {
    return {
      img_visible: false,
      currentIndex: 0,
      imgList: [],
      orderObj: {
        sort: "desc",
        column: "createTime",
      },
      item: null,
      mainteners: [],
      isActive: false,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      obj: {
        status: undefined,
        likeSearch: "",
      },
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
          title: "点检单号",
          dataIndex: "checkoutNo",
          align: "center",
          check: true,
          disabled: true,
          scopedSlots: { customRender: "checkoutNo" },
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
          title: "点检项",
          dataIndex: "maintenanceItem",
          align: "center",
          check: true,
        },
        {
          title: "来源",
          dataIndex: "source",
          align: "center",
          check: true,
        },
        {
          title: "点检人",
          dataIndex: "userName",
          align: "center",
          check: true,
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
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
          title: "计划单号",
          dataIndex: "planNo",
          align: "center",
          checked: false,
        },
        {
          dataIndex: "status",
          align: "center",
          scopedSlots: { title: "title_slot", customRender: "status" },
          check: true,
          disabled: true,
        },
      ],
    };
  },
  components: {
    Empty,
    DetailsDialog,
    Img,
  },
  created() {
    getUsers_xj().then((res) => {
      let { data } = res;
      let result = data.rows;
      if (result && result.length > 0) {
        this.mainteners = result;
      }
    });
    this.$nextTick(function () {
      let list = [];
      for (let i = 0; i < this.columnsAll.length; i++) {
        // this.columnsAll[i].check = true;
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i]);
        }
      }
      this.columns = list;
    });
  },
  mounted() {
    this.getInspectionBillsTableData();
  },
  methods: {
    //查看图片
    watchViewImg(index, pictures) {
      // console.log(index, JSON.parse(pictures));

      let list = JSON.parse(pictures);
      let _imgList = [];
      let _src = "";
      for (let i = 0; i < list.length; i++) {
        _src = "data:image/png;base64," + list[i].previewImage;
        _imgList.push(_src);
      }
      this.imgList = _imgList;
      this.currentIndex = index;
      this.img_visible = true;
    },
    /**查询 筛选 */
    query_data() {
      this.getInspectionBillsTableData();
    },
    /**
     * 获取点检计划信息数据
     */
    getInspectionBillsTableData() {
      let params = {
        limit: this.pagination.pageSize,
        page: this.pagination.current,
        like: this.obj.likeSearch,
        userId: this.obj.status,
        sort: this.orderObj.sort,
        column: this.orderObj.column,
      };
      this.spinning = true;
      getInspectionBillsTable(params).then((res) => {
        console.log(res);
        this.spinning = false;
        if (res.status === 200) {
          if (res.data.rows && res.data.rows.length > 0) {
            res.data.rows.map((item) => {
              if (item.userId) {
                this.mainteners.map((maintener) => {
                  if (maintener.id == item.userId) {
                    item.userName = maintener.name;
                  }
                });
              }
              item.status = this.$utils.getStateName(
                "inspectionStatus",
                item.status
              );
              item.maintenanceItem = "";
              if (item.cmCheckouts && item.cmCheckouts.length > 0) {
                item.cmCheckouts.map((cmCheckouts, index) => {
                  if (index == item.cmCheckouts.length - 1) {
                    item.maintenanceItem += cmCheckouts.name;
                  } else {
                    item.maintenanceItem += cmCheckouts.name + " 、 ";
                  }
                });
              }
              if (item.taskType == 0) {
                item.source = "计划生成";
              } else {
                item.source = item.createUserName + "生成";
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
      this.getInspectionBillsTableData();
    },
    refreshTable() {
      this.getDeviceTreeData();
    },
    /**详情 */
    details(item) {
      // console.log(item);
      this.item = item;
      // this.$refs.detailsDialog.visible = true;
      this.$refs.detailsDialog.afterVisibleChange(item);
    },
    /**重置表格 */
    reset() {
      this.columnsAll = [
        {
          title: "点检单号",
          dataIndex: "checkoutNo",
          align: "center",
          check: true,
          disabled: true,
          scopedSlots: { customRender: "checkoutNo" },
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
          title: "点检项",
          dataIndex: "maintenanceItem",
          align: "center",
          check: true,
        },
        {
          title: "来源",
          dataIndex: "source",
          align: "center",
          check: true,
        },
        {
          title: "点检人",
          dataIndex: "userName",
          align: "center",
          check: true,
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
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
          title: "计划单号",
          dataIndex: "planNo",
          align: "center",
          checked: false,
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
      this.getInspectionBillsTableData();
    },
  },
};
</script>

<style scoped lang="less">
.InspectionBills {
  height: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
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
  .InspectionBills-table {
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