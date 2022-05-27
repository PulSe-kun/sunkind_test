<template>
  <div class="inventory-inquire" @mousedown="isActive = false">
    <div class="header">
      <div>
        <ul>
          <li>
            <span>仓库：</span>
            <a-select
              mode="tags"
              show-search
              placeholder="请选择仓库"
              option-filter-prop="children"
              style="width: 280px"
              :filter-option="filterOption"
              v-model="warehouseId"
            >
              <a-select-option
                v-for="item in WarehouseList"
                :key="item.warehouseId"
                :value="item.warehouseId"
              >
                {{ item.warehouseName }}
              </a-select-option>
            </a-select>
          </li>
          <li>
            <span>物料信息：</span>
            <a-input
              placeholder="搜索物料名称、编码、型号"
              v-model="conditions"
              style="width: 280px"
            />
          </li>
          <li>
            <span>物料类型：</span>
            <a-tree-select
              v-model="mattertypeId"
              style="width: 280px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              :replaceFields="{
                children: 'children',
                title: 'mattertypeName',
                value: 'id',
                key: 'id',
              }"
              placeholder="请选择物料类型"
              :treeDefaultExpandedKeys="expandedRowKeys"
            >
            </a-tree-select>
          </li>
        </ul>
      </div>
      <div>
        <a-button
          class="primary-style"
          type="primary"
          style="margin-right: 20px"
          @click="resetData"
        >
          重置
        </a-button>
        <a-button class="default-style" @click="queryData"> 查询 </a-button>
      </div>
    </div>
    <div class="inventory-inquire-table">
      <a-spin :spinning="spinning">
        <a-config-provider :locale="locale" v-if="dataList.length">
          <a-table
            :columns="columns"
            :data-source="dataList"
            :pagination="pagination"
            @change="handleChange"
            :rowKey="
              (record, index) => {
                return record.matterId;
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
                  <a-row>
                    <a-col
                      :span="24"
                      v-for="(item, index) in columnsAll"
                      :style="{
                        display: item.dataIndex == 'operate' ? 'none' : 'block',
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
                      class="primary-a link-style"
                      @click="sure"
                      >确定</a-button
                    >
                  </div>
                </div>
              </a-dropdown>
            </template>
            <template slot="action" slot-scope="text, item">
              <a class="primary-a link-style" @click="distribution(item)"
                >分布</a
              >
            </template>
          </a-table>
        </a-config-provider>
        <Empty text="暂无库存" v-else />
      </a-spin>
    </div>
    <template>
      <Distribution ref="distribution" :itemData="itemData" />
    </template>
  </div>
</template>

<script>
import {
  getWareHouseList,
  typeTree,
  pageMatter,
} from "@/services/api_statistical";
import Empty from "@/components/Empty/index";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { unit } from "@/utils/utils";
import Distribution from "./distribution/index";
const columnsAll = [
  // {
  //   title: "行号",
  //   dataIndex: "index",
  //   check: true,
  //   align: "center",
  // },
  {
    title: "物料名称",
    dataIndex: "matterName",
    check: true,
    align: "center",
  },
  {
    title: "物料编码",
    dataIndex: "matterCode",
    sorter: true,
    check: true,
    align: "center",
  },
  {
    title: "物料型号",
    dataIndex: "matterMarking",
    check: true,
    align: "center",
  },
  {
    title: "物料类型",
    dataIndex: "matterType",
    check: true,
    align: "center",
  },
  {
    title: "库存数量",
    dataIndex: "matterNum",
    sorter: true,
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
    title: "最近一次库存变动",
    dataIndex: "updateDate",
    sorter: true,
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
      itemData: null,
      conditions: "",
      warehouseId: [],
      WarehouseList: [],
      isActive: false,
      mattertypeId: undefined,
      treeData: [],
      expandedRowKeys: [],
      list: [],
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      spinning: false,
      dataList: [],
      order: "asc",
      orderField: "",
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
  components: { Empty, Distribution },
  computed: {},
  created() {
    let list = [];
    for (let i = 0; i < this.columnsAll.length; i++) {
      // this.columnsAll[i].check = true;
      if (this.columnsAll[i].check) {
        list.push(this.columnsAll[i]);
      }
    }
    this.columns = list;
    this.$nextTick(function () {
      this.getWareHouseListData();
      this.typeTreeData();
      this.pageMatterData({
        conditions: this.conditions,
        warehouseId: this.warehouseId.join(","),
        mattertypeId: "",
        order: this.order,
        orderField: this.orderField,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      });
    });
  },
  mounted() {},
  methods: {
    /**展示树形结构 三层 */
    getAllTreeList(list) {
      list.map((item) => {
        // console.log(item);
        if (item.pid == "0" || item.pid == "1") {
          this.count = 0;
        }
        if (this.count <= 2) {
          if (this.list.length == 0) {
            this.list.push(item.id);
          } else {
            this.list.forEach((obj, index) => {
              if (obj == item.id) {
                this.list.splice(index, 1);
              }
            });
            this.list.push(item.id);
          }
        }
        if (item.hasOwnProperty("children") && item.children.length > 0) {
          this.count++;
          this.getAllTreeList(item.children);
        }
        if (
          (item.children.length == 0 && item.pid !== "0") ||
          (item.children.length == 0 && item.pid !== "1")
        ) {
          item.scopedSlots = { title: "mattertypeName" };
        }
        return item;
      });
    },
    /**重置表格 */
    reset() {
      let list = [];
      for (let i = 0; i < columnsAll.length; i++) {
        this.columnsAll[i].check = true;
        if (this.columnsAll[i].dataIndex == "updateDate") {
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
    /**查询数据 */
    queryData() {
      console.log(this.mattertypeId, this.mattertypeId ? undefined : "");
      let params = {
        conditions: this.conditions,
        warehouseId: this.warehouseId.join(","),
        mattertypeId: this.mattertypeId == undefined ? "" : this.mattertypeId,
        order: this.order,
        orderField: this.orderField,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      };
      // console.log(params);
      this.pageMatterData(params);
    },
    /**重置数据 */
    resetData() {
      this.conditions = "";
      this.warehouseId = [];
      this.mattertypeId = undefined;
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      let params = {
        conditions: this.conditions,
        warehouseId: this.warehouseId.join(","),
        mattertypeId: this.mattertypeId == undefined ? "" : this.mattertypeId,
        order: this.order,
        orderField: this.orderField,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      };
      // console.log(params);
      this.pageMatterData(params);
    },
    /**获取所有仓库 */
    getWareHouseListData() {
      getWareHouseList().then((res) => {
        // console.log(res);
        let list = [];
        list = res.data;
        list.unshift({
          warehouseName: "所有仓库",
          warehouseId: "",
        });
        this.WarehouseList = list;
      });
    },
    /**获取物料类型树形结构 */
    typeTreeData() {
      typeTree().then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.getAllTreeList(res.data);
          this.expandedRowKeys = this.list;
          this.treeData = res.data;
        }
      });
    },
    /**库存查询 */
    pageMatterData(params) {
      // console.log(params);
      this.spinning = true;
      pageMatter(params).then((res) => {
        // console.log(res);
        this.spinning = false;
        if (res.code == 0) {
          // console.log(this.pagination);
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i]["_matterUnit"] = unit(res.data.list[i].matterUnit);
            // res.data.list[i]["index"] =
            //   (this.pagination.current - 1) * this.pagination.pageSize +
            //   parseInt(i) +
            //   1;
          }
          // console.log(res.data.list);
          this.dataList = res.data.list;
          this.pagination.total = res.data.total;
        }
      });
    },
    /**分布 */
    distribution(item) {
      this.itemData = item;
      this.$refs.distribution.visible = true;
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
    handleChange(pagination, filters, sorter) {
      // console.log(pagination, sorter);
      if (sorter.order == "descend") {
        this.order = "desc";
      } else {
        this.order = "asc";
      }
      if (sorter.field == "matterCode") {
        this.orderField = "mr.matter_code";
      } else if (sorter.field == "matterNum") {
        this.orderField = "mr.matter_num";
      } else if (sorter.field == "updateDate") {
        this.orderField = "mr.update_date";
      }
      this.pagination = pagination;
      let params = {
        conditions: this.conditions,
        warehouseId: this.warehouseId.join(","),
        mattertypeId: this.mattertypeId == undefined ? "" : this.mattertypeId,
        order: this.order,
        orderField: this.orderField,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      };
      // console.log(params);
      this.pageMatterData(params);
    },
  },
};
</script>

<style scoped lang="less">
.inventory-inquire {
  height: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  .header {
    padding: 46px 22px 36px 21px;
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
  .inventory-inquire-table {
    margin: 0 20px 20px 20px;
    border-radius: 5px;
    border: 1px solid #e6e6e6;
  }
}
.more {
  max-width: 160px;
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
