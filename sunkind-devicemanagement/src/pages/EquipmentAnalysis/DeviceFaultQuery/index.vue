<template>
  <div class="DeviceFaultQuery">
    <div class="header" ref="header">
      <div>
        <ul>
          <li>
            <span>设备信息：</span>
            <a-input
              placeholder="搜索设备编号、名称"
              v-model="obj.searchValue"
              style="width: 280px"
            />
          </li>
          <li>
            <span>故障信息：</span>
            <a-input
              placeholder="搜索故障名称"
              v-model="obj.faultName"
              style="width: 280px"
            />
          </li>
          <li>
            <span>故障等级：</span>
            <a-select
              show-search
              placeholder="请选择"
              option-filter-prop="children"
              style="width: 280px"
              v-model="obj.level"
            >
              <a-select-option value=""> 全部 </a-select-option>
              <a-select-option value="1"> 高 </a-select-option>
              <a-select-option value="2"> 低 </a-select-option>
            </a-select>
          </li>

          <li>
            <span>上报日期：</span>
            <a-config-provider :locale="locale">
              <a-range-picker style="width: 280px" @change="onChangeDate" />
            </a-config-provider>
          </li>
        </ul>
      </div>
      <div>
        <a-button class="default-style" @click="search">查询</a-button>
      </div>
    </div>
    <div class="DeviceFaultQuery-table">
      <a-spin :spinning="spinning">
        <a-config-provider :locale="locale" v-if="dataList.length">
          <a-table
            :columns="columns"
            :data-source="dataList"
            :pagination="pagination"
            @change="handleChange"
            :rowKey="
              (record, index) => {
                return index;
              }
            "
          >
            <template slot="level" slot-scope="text">
              <span v-if="text == '1'">高</span>
              <span v-if="text == '2'">低</span>
            </template>
            <template slot="consuming" slot-scope="text">
              <span>{{ text | emptyValue }}</span>
            </template>
            <template slot="faultType" slot-scope="text">
              <span>{{ text | emptyValue }}</span>
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
                        display: item.dataIndex == 'operate' ? 'none' : 'block',
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
                <a class="link-style primary-a" @click="details(item)">详情</a>
              </div>
            </template>
          </a-table>
        </a-config-provider>
        <Empty text="暂无数据" v-else></Empty>
      </a-spin>
    </div>
    <template>
      <DetailsDialog ref="detailsDialog" :item="item" />
    </template>
  </div>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import Empty from "@/components/Empty/index";
import { equipment_fault } from "@/services/api";
import DetailsDialog from "./detailsDialog.vue";
export default {
  data() {
    return {
      item: null,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      obj: {
        searchValue: "",
        faultName: "",
        level: undefined,
        date: [],
      },
      productionLine_list: [],
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
      isActive: false,
      columns: [],
      columnsAll: [
        {
          title: "设备编号",
          dataIndex: "cmNum",
          check: true,
          disabled: true,
          align: "center",
        },
        {
          title: "设备名称",
          dataIndex: "cmName",
          check: true,
          align: "center",
        },
        {
          title: "故障名称",
          dataIndex: "faultName",
          check: true,
          align: "center",
        },
        {
          title: "故障等级",
          dataIndex: "level",
          check: true,
          align: "center",
          scopedSlots: { customRender: "level" },
        },
        {
          title: "上报时间",
          dataIndex: "startTime",
          check: true,
          align: "center",
        },
        {
          title: "恢复时间",
          dataIndex: "endTime",
          check: true,
          align: "center",
        },
        {
          title: "故障时长",
          dataIndex: "consuming",
          check: true,
          align: "center",
          scopedSlots: { customRender: "consuming" },
        },
        {
          title: "设备使用部门",
          dataIndex: "deptName",
          align: "center",
          check: false,
        },
        {
          title: "故障代码",
          dataIndex: "faultType",
          check: false,
          scopedSlots: { customRender: "faultType" },
          align: "center",
        },
        {
          dataIndex: "operate",
          scopedSlots: { title: "title_slot", customRender: "action" },
          check: true,
          align: "center",
        },
      ],
    };
  },
  components: { Empty, DetailsDialog },
  created() {
    this.$nextTick(() => {
      let list = [];
      for (let i = 0; i < this.columnsAll.length; i++) {
        // this.columnsAll[i].check = true;
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i]);
        }
      }
      this.columns = list;
      this.equipment_faultData();
    });
  },
  mounted() {},
  methods: {
    /**重置表格 */
    reset() {
      this.columnsAll = [
        {
          title: "设备编号",
          dataIndex: "cmNum",
          check: true,
          disabled: true,
          align: "center",
        },
        {
          title: "设备名称",
          dataIndex: "cmName",
          check: true,
          align: "center",
        },
        {
          title: "故障名称",
          dataIndex: "faultName",
          check: true,
          align: "center",
        },
        {
          title: "故障等级",
          dataIndex: "level",
          check: true,
          align: "center",
          scopedSlots: { customRender: "level" },
        },
        {
          title: "上报时间",
          dataIndex: "startTime",
          check: true,
          align: "center",
        },
        {
          title: "恢复时间",
          dataIndex: "endTime",
          check: true,
          align: "center",
        },
        {
          title: "故障时长",
          dataIndex: "consuming",
          check: true,
          align: "center",
          scopedSlots: { customRender: "consuming" },
        },
        {
          title: "设备使用部门",
          dataIndex: "deptName",
          align: "center",
          check: false,
        },
        {
          title: "故障代码",
          dataIndex: "faultType",
          check: false,
          scopedSlots: { customRender: "faultType" },
          align: "center",
        },
        {
          dataIndex: "operate",
          scopedSlots: { title: "title_slot", customRender: "action" },
          check: true,
          align: "center",
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

    /**详情 */
    details(item) {
      this.item = item;
      this.$refs.detailsDialog.visible = true;
    },
    onChangeDate(date, dateString) {
      console.log(date, dateString);
      this.obj.date = dateString;
    },
    /**查询 */
    search() {
      this.equipment_faultData();
    },
    handleChange(pagination) {
      // console.log(pagination);
      this.pagination = pagination;
      this.equipment_faultData();
    },

    equipment_faultData() {
      let params = {
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      };
      if (this.obj.searchValue !== "") {
        params["like"] = this.obj.searchValue;
      }
      if (this.obj.faultName !== "") {
        params["faultName"] = this.obj.faultName;
      }
      if (this.obj.level !== undefined && this.obj.level !== "") {
        params["level"] = this.obj.level;
      }
      if (this.obj.date.length !== 0) {
        params["startTime"] = this.obj.date[0];
        params["endTime"] = this.obj.date[1];
      }
      this.spinning = true;
      console.log(params);
      equipment_fault(params).then((res) => {
        this.spinning = false;
        // console.log(res);
        if (res.status === 200) {
          let { rows, total } = res.data;
          this.pagination.total = total;
          this.dataList = rows;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.DeviceFaultQuery {
  height: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  .header {
    padding: 26px 20px 30px 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    div:first-child {
      ul {
        margin: 0;
        padding: 0;
        li {
          list-style: none;
          float: left;
          margin-right: 60px;
          margin-bottom: 20px;
          span:first-child {
            color: #000000;
            margin-right: 15px;
          }
        }
      }
    }
  }
  .DeviceFaultQuery-table {
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