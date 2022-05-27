<template>
  <div class="EquipmentUtilizationAnalysis">
    <div class="header" ref="header">
      <div>
        <ul>
          <li>
            <span>日期：</span>
            <a-select
              show-search
              placeholder="请选择"
              option-filter-prop="children"
              style="width: 100px; margin-right: 15px"
              v-model="obj.dateType"
              @change="SelectDate"
            >
              <a-select-option
                v-for="item in $state.date"
                :key="item.id"
                :value="item.id"
              >
                {{ item.value }}
              </a-select-option>
            </a-select>
            <a-config-provider :locale="locale" v-if="obj.dateType == 1">
              <a-range-picker
                style="width: 280px"
                format="YYYY-MM-DD"
                :value="obj.date"
                @change="onChangeTime"
                :allowClear="false"
              />
            </a-config-provider>
            <a-config-provider :locale="locale" v-if="obj.dateType == 2">
              <a-range-picker
                style="width: 280px"
                :placeholder="['开始日期', '结束日期']"
                format="YYYY-MM"
                :mode="mode"
                :value="obj.date"
                @panelChange="handlePanelChangeMonthTime"
                @change="onChangeMonthTime"
                :allowClear="false"
              />
            </a-config-provider>
            <a-config-provider :locale="locale" v-if="obj.dateType == 3">
              <a-range-picker
                style="width: 280px"
                :placeholder="['开始日期', '结束日期']"
                format="YYYY"
                :mode="modeYear"
                :value="obj.date"
                @panelChange="handlePanelChangeYearTime"
                @change="onChangeYearTime"
                :allowClear="false"
              />
            </a-config-provider>
          </li>
        </ul>
      </div>
      <div>
        <a-button class="default-style" @click="search">查询</a-button>
      </div>
    </div>
    <div class="checkbox-style">
      <a-checkbox-group v-model="checkedValues" @change="onChange">
        <a-checkbox value="A">图形</a-checkbox>
        <a-checkbox value="B">表格</a-checkbox>
      </a-checkbox-group>
    </div>
    <div class="echarts" v-show="checkedValues.indexOf('A') > -1">
      <h3>设备使用率排名(TOP10)</h3>
      <div class="echarts-style" ref="echarts_data"></div>
    </div>
    <div class="table-style" v-show="checkedValues.indexOf('B') > -1">
      <h3>设备使用率汇总</h3>
      <a-spin :spinning="spinning">
        <a-config-provider :locale="locale" v-if="dataList.length">
          <a-table
            :columns="columns"
            :sortDirections="['descend', 'ascend']"
            :data-source="dataList"
            :pagination="pagination"
            @change="handleChange"
            :rowKey="
              (record, index) => {
                return index;
              }
            "
          >
            <template slot="usage" slot-scope="text">
              <span>{{ text }}%</span>
            </template>
          </a-table>
        </a-config-provider>
        <Empty text="暂无数据" v-else />
      </a-spin>
    </div>
  </div>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import Empty from "@/components/Empty/index";
import {
  equipment_usage_total_top_10,
  equipment_usage_total_summary,
} from "@/services/api";
export default {
  data() {
    return {
      item: null,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      modeYear: ["year", "year"],
      mode: ["month", "month"],
      orderObj: {
        sort: "",
        column: "",
      },
      obj: {
        dateType: 1,
        date: [],
      },
      checkedValues: ["A", "B"],
      dataList: [],
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
      spinning: false,
      columns: [
        {
          title: "设备编号",
          dataIndex: "cmNum",
          align: "center",
        },
        {
          title: "设备名称",
          dataIndex: "cmName",
          align: "center",
        },
        {
          title: "运行时长（小时）",
          dataIndex: "runConsuming",
          align: "center",
          sorter: true,
        },
        {
          title: "生产时长（小时）",
          dataIndex: "workConsuming",
          align: "center",
          sorter: true,
        },
        {
          title: "使用率",
          dataIndex: "usage",
          align: "center",
          sorter: true,
          scopedSlots: { customRender: "usage" },
        },
      ],
      echarts_data: null,
    };
  },
  components: { Empty },
  created() {
    this.$nextTick(function () {
      this.ModifyTime(this.obj.dateType);
      this.equipment_usage_total_top_10Data();
      this.equipment_usage_total_summaryData();
    });
  },
  mounted() {
    // this.echartsData();
    // console.log(this.$utils.getYesterdayDate(), this.$utils.getDay(-31));
    // console.log(this.$utils.GetPreMonthDay(this.$utils.getTime(), 3));
  },
  methods: {
    editor_item(item) {
      // conosle.log(item);
      let item_obj = {
        name: item.workerName,
        workerId: item.workerId,
        dateType: this.obj.dateType,
        reportTimeSta: this.obj.date[0],
        reportTimeEnd: this.obj.date[1],
      };
      this.item = item_obj;
      this.$refs.editorDialog.visible = true;
    },
    details_item(item) {
      this.item = item;
      this.$refs.detailsDialog.visible = true;
    },
    //切换日期时改变开始日期和结束日期
    ModifyTime(value) {
      console.log(value);
      let date = [];
      switch (value) {
        case 1:
          date = [this.$utils.getDay(-31), this.$utils.getYesterdayDate()[0]];
          break;
        case 2:
          date = [
            this.$utils.GetPreMonthDay(this.$utils.getTime(), 3),
            this.$utils.GetPreMonthDay(this.$utils.getTime(), 1),
          ];
          break;
        default:
          date = [
            new Date().getFullYear().toString(),
            new Date().getFullYear().toString(),
          ];
          break;
      }
      console.log(date);
      this.obj.date = date;
    },
    //切换日期
    SelectDate(value) {
      // console.log(value);
      this.obj.dateType = value;
      this.obj.date = [];
      this.ModifyTime(this.obj.dateType);
    },
    search() {
      this.equipment_usage_total_top_10Data();
      this.equipment_usage_total_summaryData();
    },
    onChangeTime(date, dateString) {
      console.log(date, dateString);
      this.obj.date = dateString;
    },
    handlePanelChangeMonthTime(value, mode) {
      console.log(value, mode);
      this.obj.date = [
        this.$moment(value[0]._d).format("YYYY-MM"),
        this.$moment(value[1]._d).format("YYYY-MM"),
      ];
      // this.mode = [
      //   mode[0] === "date" ? "month" : mode[0],
      //   mode[1] === "date" ? "month" : mode[1],
      // ];
    },
    onChangeMonthTime(value) {
      console.log(value);
      this.obj.date = value;
    },
    handlePanelChangeYearTime(value, modeYear) {
      console.log(value, modeYear);
      this.obj.date = value;
      // this.modeYear = [
      //   mode[0] === "date" ? "year" : mode[0],
      //   mode[1] === "date" ? "year" : mode[1],
      // ];
    },
    onChangeYearTime(value) {
      console.log(value);
      this.obj.date = value;
    },
    /**查询人员不合格品数排名(Top10)数据 */
    equipment_usage_total_top_10Data() {
      let params = {
        dateType: this.obj.dateType,
        startTime: "",
        endTime: "",
      };
      if (this.obj.date.length > 0) {
        params["startTime"] = this.obj.date[0];
        params["endTime"] = this.obj.date[1];
      }
      equipment_usage_total_top_10(params).then((res) => {
        console.log(res);
        if (res.status === 200) {
          let name = [],
            num = [];
          for (let i = 0; i < res.data.length; i++) {
            name.push(res.data[i].cmUsageInfo.cmName);
            num.push(res.data[i].usage);
          }
          this.echartsData(name, num);
        }
      });
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
      this.equipment_usage_total_summaryData();
    },
    equipment_usage_total_summaryData() {
      let params = {
        dateType: this.obj.dateType,
        startTime: "",
        endTime: "",
        limit: this.pagination.pageSize,
        page: this.pagination.current,
        sort: this.orderObj.sort,
        column: this.orderObj.column,
      };
      if (this.obj.date.length > 0) {
        params["startTime"] = this.obj.date[0];
        params["endTime"] = this.obj.date[1];
      }
      this.spinning = true;
      equipment_usage_total_summary(params).then((res) => {
        console.log(res);
        this.spinning = false;
        if (res.status === 200) {
          if (res.data.rows.length > 0) {
            for (let i = 0; i < res.data.rows.length; i++) {
              res.data.rows[i] = {
                cmNum: res.data.rows[i].cmUsageInfo.cmNum,
                cmName: res.data.rows[i].cmUsageInfo.cmName,
                runConsuming: res.data.rows[i].runTime,
                workConsuming: res.data.rows[i].workTime,
                usage: res.data.rows[i].usage,
              };
            }
            this.pagination.total = res.data.total;
            this.dataList = res.data.rows;
          } else {
            this.pagination.total = 0;
            this.dataList = [];
          }
        }
      });
    },
    onChange(checkedValues) {
      console.log("checked = ", checkedValues);
      // this.checkedValues = checkedValues;
      console.log(this.checkedValues);
    },
    echartsData(name, num) {
      this.echarts_data = this.$echarts.init(this.$refs.echarts_data);
      let option = {
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          textStyle: {
            color: "#000",
          },
        },
        grid: {
          left: "0",
          right: "2%",
          top: "15%",
          bottom: "0",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#808eb7",
              width: 2,
            },
          },
          data: name,
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#808eb7",
                width: 2,
              },
            },
            splitLine: {
              //分割线配置
              lineStyle: {
                color: "#AAAAAA56",
              },
            },
          },
          // {
          //   type: "value",
          //   name: "百分比",
          //   nameTextStyle: {
          //     color: "#666666",
          //   },
          //   position: "right",
          //   axisLine: {
          //     lineStyle: {
          //       color: "#cdd5e2",
          //     },
          //   },
          //   splitLine: {
          //     show: false,
          //   },
          //   axisLabel: {
          //     show: true,
          //     formatter: "{value} %", //右侧Y轴文字显示
          //     textStyle: {
          //       color: "#666666",
          //     },
          //   },
          // },
        ],
        series: [
          {
            type: "bar",
            stack: "余额",
            barMaxWidth: 30,
            data: num,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 1,
                      color: "#00ffff", // 0% 处的颜色
                    },
                    {
                      offset: 0,
                      color: "#3893e5", // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
          },
          // {
          //   data: percentList,
          //   yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
          //   type: "line",
          //   itemStyle: {
          //     normal: {
          //       color: "#DB3233",
          //     },
          //   },
          // },
        ],
      };
      this.echarts_data.setOption(option);
      window.addEventListener("resize", this.resize, true);
    },
    resize() {
      this.echarts_data.resize();
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize, true);
  },
};
</script>

<style scoped lang="less">
.EquipmentUtilizationAnalysis {
  height: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  .header {
    padding: 26px 20px 20px 20px;
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
  .checkbox-style {
    padding: 0 20px;
    margin-bottom: 30px;
    text-align: right;
  }
  .echarts {
    margin: 0 20px 20px 20px;
    padding: 0 20px;
    height: 335px;
    h3 {
      font-size: 14px;
      line-height: 21px;
      padding-top: 13px;
      padding-bottom: 20px;
      color: #000;
    }
    .echarts-style {
      height: calc(100% - 54px);
      width: 100%;
    }
  }
  .table-style {
    margin: 0 20px 20px 20px;
    border-radius: 5px;
    border: 1px solid #e6e6e6;
    h3 {
      font-size: 14px;
      line-height: 21px;
      padding: 13px 20px 20px 20px;
      color: #000;
    }
  }
}
</style>
