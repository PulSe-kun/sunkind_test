<template>
  <div class="in-out-warehouse-racord" @mousedown="btn_down">
    <a-tabs :activeKey="activeKey" @change="callback">
      <!-- <a-tab-pane v-for="item in tabs" :key="item.key">
        <span slot="tab">
          {{ item.title }}
        </span> -->
      <!-- <div class="header" v-if="activeKey == 0">
          <div>
            <ul>
              <li>
                <span>入库信息：</span>
                <a-input
                  placeholder="搜索托盘编码、物料名称或编码"
                  v-model="conditions"
                  style="width: 280px"
                />
              </li>
              <li>
                <span>入库仓库：</span>
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
                <span>入库日期：</span>
                <a-config-provider :locale="locale">
                  <a-range-picker v-model="timeData" @change="onChange_time" />
                </a-config-provider>
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
        <div class="header" v-else>
          <div>
            <ul>
              <li>
                <span>出库信息：</span>
                <a-input
                  placeholder="搜索托盘编码、物料名称或编码"
                  v-model="conditions"
                  style="width: 280px"
                />
              </li>
              <li>
                <span>出库仓库：</span>
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
                <span>出库日期：</span>
                <a-config-provider :locale="locale">
                  <a-range-picker v-model="timeData" @change="onChange_time" />
                </a-config-provider>
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
                :sortDirections="['descend', 'ascend']"
                @change="handleChange"
                :rowKey="
                  (record, index) => {
                    return record.warehousingId;
                  }
                "
              >
                <template slot="storagebinLine" slot-scope="text, obj">
                  <span>{{
                    obj.storagebinLine + "行" + obj.storagebinRow + "列"
                  }}</span>
                </template>
                <template slot="matterNum">
                  <span v-if="activeKey == 0">入库数量</span>
                  <span v-else>出库数量</span>
                </template>
                <template slot="title_time">
                  <span v-if="activeKey == 0">入库时间</span>
                  <span v-else>出库时间</span>
                </template>
                <template slot="title_slot">
                  <span style="margin-right: 8px">操作人</span>
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
                              item.dataIndex == 'createUser' ? 'none' : 'block',
                          }"
                          :key="index"
                        >
                          <a-checkbox
                            :checked="item.check"
                            @change="onChange(item)"
                          >
                            <span v-if="item.dataIndex == 'matterNum'">
                              <span v-if="activeKey == 0">入库数量</span>
                              <span v-else>出库数量</span>
                            </span>
                            <span
                              v-else-if="item.dataIndex == 'warehousingTime'"
                            >
                              <span v-if="activeKey == 0">入库时间</span>
                              <span v-else>出库时间</span>
                            </span>
                            <span v-else>{{ item.title }}</span>
                          </a-checkbox>
                        </a-col>
                      </a-row>
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
                <template slot="createUser" slot-scope="text">
                  <span>{{ text }}</span>
                </template>
              </a-table>
            </a-config-provider>
            <Empty text="暂无库存" v-else />
          </a-spin>
        </div> -->

      <!-- </a-tab-pane> -->
      <a-tab-pane :key="0" tab="入库记录">
        <div class="header">
          <div>
            <ul>
              <li>
                <span>入库信息：</span>
                <a-input
                  placeholder="搜索托盘编码、物料名称或编码"
                  v-model="conditions"
                  style="width: 280px"
                />
              </li>
              <li>
                <span>入库仓库：</span>
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
                <span>入库日期：</span>
                <a-config-provider :locale="locale">
                  <a-range-picker v-model="timeData" @change="onChange_time" />
                </a-config-provider>
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
                :columns="columns_in"
                :data-source="dataList"
                :pagination="pagination"
                :sortDirections="['descend', 'ascend']"
                @change="handleChange"
                :rowKey="
                  (record, index) => {
                    return record.warehousingId;
                  }
                "
              >
                <template slot="storagebinLine" slot-scope="text, obj">
                  <span>{{
                    obj.storagebinLine + "行" + obj.storagebinRow + "列"
                  }}</span>
                </template>
                <template slot="title_slot">
                  <span style="margin-right: 8px">操作人</span>
                  <a-dropdown
                    :trigger="['click']"
                    placement="bottomCenter"
                    :visible="isActive_in"
                  >
                    <a
                      class="ant-dropdown-link"
                      @click="
                        (e) => {
                          e.preventDefault();
                          isActive_in = true;
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
                          v-for="(item, index) in columnsAll_in"
                          :style="{
                            display:
                              item.dataIndex == 'createUser' ? 'none' : 'block',
                          }"
                          :key="index"
                        >
                          <a-checkbox
                            :checked="item.check"
                            @change="onChange(item)"
                          >
                            <span>{{ item.title }}</span>
                          </a-checkbox>
                        </a-col>
                      </a-row>
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
                <template slot="createUser" slot-scope="text">
                  <span>{{ text }}</span>
                </template>
              </a-table>
            </a-config-provider>
            <Empty text="暂无库存" v-else />
          </a-spin>
        </div>
      </a-tab-pane>
      <a-tab-pane :key="1" tab="出库记录">
        <div class="header">
          <div>
            <ul>
              <li>
                <span>出库信息：</span>
                <a-input
                  placeholder="搜索托盘编码、物料名称或编码"
                  v-model="conditions"
                  style="width: 280px"
                />
              </li>
              <li>
                <span>出库仓库：</span>
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
                <span>出库日期：</span>
                <a-config-provider :locale="locale">
                  <a-range-picker v-model="timeData" @change="onChange_time" />
                </a-config-provider>
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
                :columns="columns_out"
                :data-source="dataList"
                :pagination="pagination"
                :sortDirections="['descend', 'ascend']"
                @change="handleChange"
                :rowKey="
                  (record, index) => {
                    return record.warehousingId;
                  }
                "
              >
                <template slot="storagebinLine" slot-scope="text, obj">
                  <span>{{
                    obj.storagebinLine + "行" + obj.storagebinRow + "列"
                  }}</span>
                </template>
                <template slot="title_slot">
                  <span style="margin-right: 8px">操作人</span>
                  <a-dropdown
                    :trigger="['click']"
                    placement="bottomCenter"
                    :visible="isActive_out"
                  >
                    <a
                      class="ant-dropdown-link"
                      @click="
                        (e) => {
                          e.preventDefault();
                          isActive_out = true;
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
                          v-for="(item, index) in columnsAll_out"
                          :style="{
                            display:
                              item.dataIndex == 'createUser' ? 'none' : 'block',
                          }"
                          :key="index"
                        >
                          <a-checkbox
                            :checked="item.check"
                            @change="onChange(item)"
                          >
                            <span>{{ item.title }}</span>
                          </a-checkbox>
                        </a-col>
                      </a-row>
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
                <template slot="createUser" slot-scope="text">
                  <span>{{ text }}</span>
                </template>
              </a-table>
            </a-config-provider>
            <Empty text="暂无库存" v-else />
          </a-spin>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { page, getWareHouseList } from "@/services/api_statistical";
import Empty from "@/components/Empty/index";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { unit } from "@/utils/utils";
const columnsAll = [
  {
    title: "托盘编码",
    dataIndex: "palletCode",
    check: true,
    align: "center",
  },
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
    dataIndex: "matterNum",
    check: true,
    scopedSlots: { title: "matterNum" },
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "_matterUnit",
    check: true,
    align: "center",
  },
  {
    title: "仓库",
    dataIndex: "warehouseName",
    check: true,
    align: "center",
  },
  {
    title: "料架",
    dataIndex: "feederName",
    check: true,
    align: "center",
  },
  {
    title: "库位",
    dataIndex: "storagebinLine",
    check: true,
    scopedSlots: { customRender: "storagebinLine" },
    align: "center",
  },
  {
    dataIndex: "warehousingTime",
    sorter: true,
    check: true,
    scopedSlots: { title: "title_time" },
    align: "center",
  },
  {
    dataIndex: "createUser",
    scopedSlots: { title: "title_slot", customRender: "createUser" },
    align: "center",
    // check: true,
  },
  // {
  //   width: 150,dataIndex: "operate",
  //   scopedSlots: { title: "title_slot", customRender: "action" },
  // },
];
const columnsAll_in = [
  {
    title: "托盘编码",
    dataIndex: "palletCode",
    check: true,
    align: "center",
  },
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
    title: "入库数量",
    dataIndex: "matterNum",
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
    title: "仓库",
    dataIndex: "warehouseName",
    check: true,
    align: "center",
  },
  {
    title: "料架",
    dataIndex: "feederName",
    check: true,
    align: "center",
  },
  {
    title: "库位",
    dataIndex: "storagebinLine",
    check: true,
    scopedSlots: { customRender: "storagebinLine" },
    align: "center",
  },
  {
    title: "入库时间",
    dataIndex: "warehousingTime",
    sorter: true,
    check: true,
    align: "center",
  },
  {
    dataIndex: "createUser",
    scopedSlots: { title: "title_slot", customRender: "createUser" },
    align: "center",
  },
];
const columnsAll_out = [
  {
    title: "托盘编码",
    dataIndex: "palletCode",
    check: true,
    align: "center",
  },
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
    title: "出库数量",
    dataIndex: "matterNum",
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
    title: "仓库",
    dataIndex: "warehouseName",
    check: true,
    align: "center",
  },
  {
    title: "料架",
    dataIndex: "feederName",
    check: true,
    align: "center",
  },
  {
    title: "库位",
    dataIndex: "storagebinLine",
    check: true,
    scopedSlots: { customRender: "storagebinLine" },
    align: "center",
  },
  {
    title: "出库时间",
    dataIndex: "warehousingTime",
    sorter: true,
    check: true,
    align: "center",
  },
  {
    dataIndex: "createUser",
    scopedSlots: { title: "title_slot", customRender: "createUser" },
    align: "center",
  },
];
export default {
  data() {
    return {
      activeKey: 0,
      tabs: [
        { title: "入库记录", key: 0 },
        { title: "出库记录", key: 1 },
      ],
      conditions: "",
      warehouseId: [],
      WarehouseList: [],
      timeData: [],
      isActive: false,
      isActive_out: false,
      isActive_in: false,
      mattertypeId: undefined,
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
      columns_in: [],
      columns_out: [],
      columnsAll_in,
      columnsAll_out,
      columns: [],
      columnsAll,
    };
  },
  components: {
    Empty,
  },
  created() {
    // let list = [];
    // for (let i = 0; i < this.columnsAll.length; i++) {
    //   this.columnsAll[i].check = true;
    //   if (this.columnsAll[i].check) {
    //     list.push(this.columnsAll[i]);
    //   }
    // }
    // this.columns = list;
    this.$nextTick(() => {
      this.resetColumn();
      this.getWareHouseListData();
      this.pageData({
        conditions: this.conditions,
        startTime: this.timeData[0],
        endTime: this.timeData[1],
        warehousingType: this.activeKey,
        order: this.order,
        orderField: this.orderField,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      });
    });
  },
  mounted() {},
  methods: {
    btn_down() {
      if (this.activeKey == 0) {
        this.isActive_in = false;
      } else {
        this.isActive_out = false;
      }
    },
    resetColumn() {
      if (this.activeKey == 0) {
        let list = [];
        for (let i = 0; i < this.columnsAll_in.length; i++) {
          this.columnsAll_in[i].check = true;
          if (this.columnsAll_in[i].check) {
            list.push(this.columnsAll_in[i]);
          }
        }
        this.columns_in = list;
        this.isActive_in = false;
      } else {
        let list = [];
        for (let i = 0; i < this.columnsAll_out.length; i++) {
          this.columnsAll_out[i].check = true;
          if (this.columnsAll_out[i].check) {
            list.push(this.columnsAll_out[i]);
          }
        }
        this.columns_out = list;
        this.isActive_out = false;
      }
    },
    onChange_time(date, dateString) {
      this.timeData = dateString;
    },
    callback(key) {
      this.activeKey = key;
      this.resetColumn();
      this.resetData();
    },
    /**重置表格 */
    reset() {
      this.resetColumn();
    },
    /**确定更改的表格 */
    sure() {
      if (this.activeKey == 0) {
        let list = [];
        for (let i = 0; i < this.columnsAll_in.length; i++) {
          if (this.columnsAll_in[i].check) {
            list.push(this.columnsAll_in[i]);
          }
        }
        this.columns_in = list;
        this.isActive_in = false;
      } else {
        let list = [];
        for (let i = 0; i < this.columnsAll_out.length; i++) {
          if (this.columnsAll_out[i].check) {
            list.push(this.columnsAll_out[i]);
          }
        }
        this.columns_out = list;
        this.isActive_out = false;
      }
    },
    /**查询数据 */
    queryData() {
      // console.log(this.warehouseId);
      let params = {
        conditions: this.conditions,
        warehouseId: this.warehouseId.join(","),
        startTime: this.timeData[0],
        endTime: this.timeData[1],
        warehousingType: this.activeKey,
        order: this.order,
        orderField: this.orderField,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      };
      this.pageData(params);
    },
    /**重置数据 */
    resetData() {
      this.conditions = "";
      this.timeData = [];
      this.warehouseId = [];
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      let params = {
        conditions: this.conditions,
        warehouseId: this.warehouseId.join(","),
        startTime: this.timeData[0],
        endTime: this.timeData[1],
        warehousingType: this.activeKey,
        order: this.order,
        orderField: this.orderField,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      };
      this.pageData(params);
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
    pageData(params) {
      this.spinning = true;
      page(params).then((res) => {
        this.spinning = false;
        // console.log(res);
        if (res.code == 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i]["_matterUnit"] = unit(res.data.list[i].matterUnit);
          }
          this.dataList = res.data.list;
          this.pagination.total = res.data.total;
        }
      });
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
        this.orderField = "mt.matter_code";
      } else if (sorter.field == "warehousingTime") {
        this.orderField = "rd.warehousing_time";
      }
      this.pagination = pagination;
      let params = {
        conditions: this.conditions,
        warehouseId: this.warehouseId.join(","),
        startTime: this.timeData[0],
        endTime: this.timeData[1],
        warehousingType: this.activeKey,
        order: this.order,
        orderField: this.orderField,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      };
      this.pageData(params);
    },
  },
};
</script>

<style scoped lang="less">
.in-out-warehouse-racord {
  height: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  .ant-tabs {
    padding: 0 23px;
    height: 100%;
    /deep/.ant-tabs-content {
      padding-top: 5px;
      height: calc(100% - 60px);
      .header {
        padding: 5px 22px 36px 21px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > div:first-child {
          > ul {
            margin: 0;
            padding: 0;
            > li {
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
      .in-out-warehouse-racord-table {
        margin: 0 20px 20px 20px;
        border-radius: 5px;
        border: 1px solid #e6e6e6;
      }
    }
  }
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
/deep/.ant-tabs-tabpane {
  height: 100%;
  overflow: auto;
}
</style>
