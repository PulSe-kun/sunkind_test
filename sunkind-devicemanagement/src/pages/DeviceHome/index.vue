<template>
  <div class="homePage content-wrap">
    <a-row :gutter="35">
      <a-col class="gutter-row" :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
        <div class="equipment">
          <div class="border">
            <div>
              <img src="@/assets/img/in-use.png" alt="" />
            </div>
            <div class="title">
              <p>在用设备</p>
              <p>{{ device.activeEquipmentCount }}</p>
            </div>
          </div>
        </div>
      </a-col>
      <a-col class="gutter-row" :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
        <div class="maintenance">
          <div class="border">
            <div>
              <img src="@/assets/img/in-repair.png" alt="" />
            </div>
            <div class="title">
              <p>维修中</p>
              <p>{{ device.repairEquipmentCount }}</p>
            </div>
            <div>
              <a-icon
                type="right"
                style="font-size: 26px; cursor: pointer"
                @click="goto('maintainBill')"
              />
            </div>
          </div>
        </div>
      </a-col>
      <a-col class="gutter-row" :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
        <div class="downtime">
          <div class="border">
            <div>
              <img src="@/assets/img/shut-down.png" alt="" />
            </div>
            <div class="title">
              <p>停机</p>
              <p>{{ device.shutdownEquipmentCount }}</p>
            </div>
            <div>
              <a-icon
                type="right"
                style="font-size: 26px; cursor: pointer"
                @click="goto('shutdown')"
              />
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="homePage-data">
      <div class="homePage-data-left">
        <div @click="goto('repairTask')">
          <div>
            <img src="@/assets/img/tool1.png" alt="" />
          </div>
          <div class="title">
            <p
              :style="{
                color: order.repairOrderCount == 0 ? '#CCCCCC' : '#427DFF',
              }"
            >
              {{ order.repairOrderCount }}
            </p>
            <p>维修</p>
          </div>
        </div>

        <div @click="goto('maintainTask')">
          <div>
            <img src="@/assets/img/tool2.png" alt="" />
          </div>
          <div class="title">
            <p
              :style="{
                color: order.maintainOrderCount == 0 ? '#CCCCCC' : '#427DFF',
              }"
            >
              {{ order.maintainOrderCount }}
            </p>
            <p>保养</p>
          </div>
        </div>

        <div @click="goto('inspectionTask')">
          <div>
            <img src="@/assets/img/tool3.png" alt="" />
          </div>
          <div class="title">
            <p
              :style="{
                color: order.checkoutOrderCount == 0 ? '#CCCCCC' : '#427DFF',
              }"
            >
              {{ order.checkoutOrderCount }}
            </p>
            <p>点检</p>
          </div>
        </div>

        <div @click="goto('dispositionTask')">
          <div>
            <img src="@/assets/img/tool4.png" alt="" />
          </div>
          <div class="title">
            <p
              :style="{
                color: order.disposeOrderCount == 0 ? '#CCCCCC' : '#427DFF',
              }"
            >
              {{ order.disposeOrderCount }}
            </p>
            <p>处置</p>
          </div>
        </div>
      </div>
      <div class="homePage-data-right">
        <h3>近15天工单走势</h3>
        <div ref="myEcharts"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getOrdersNum,
  getEquipmentNum,
  getWorkOrderData,
} from "@/services/api";

export default {
  data() {
    return {
      myChart: null,
      order: {},
      device: {},
      checkoutOrderCount: {
        count: [],
        time: [],
      },
      maintainOrderCount: {
        count: [],
        time: [],
      },
      repairOrderCount: {
        count: [],
        time: [],
      },
    };
  },
  components: {},
  created() {
    this.$nextTick(function () {
      this.getData();
    });
  },
  mounted() {},
  methods: {
    getTime() {
      var myDate = new Date();
      var nowDate = myDate.getDate(); //今天的日子
      if (nowDate - 15 >= 0) {
        // console.log("1111");
        //起始日期
        var beginDate = nowDate - 14;
        var dateArray = [];
        for (var m = beginDate; m < nowDate + 1; m++) {
          dateArray.push(myDate.getMonth() + 1 + "-" + m);
        }
        // console.log(dateArray, "dateArray");
      } else {
        var val = 15 - nowDate;
        var beforeMonthMaxDate = new Date(
          myDate.getFullYear(),
          myDate.getMonth(),
          0
        ).getDate(); //确定上月的最大日期

        var beforeMonthBeginDate = beforeMonthMaxDate - val + 1; //确定上月的开始日期;
        var dateArray = [];
        for (var n = beforeMonthBeginDate; n < beforeMonthMaxDate + 1; n++) {
          dateArray.push(myDate.getMonth() + "-" + n);
        }
        setTimeout(function () {
          for (var q = 1; q < nowDate + 1; q++) {
            dateArray.push(myDate.getMonth() + 1 + "-" + q);
          }
        }, 300);
      }
      return dateArray;
      // console.log(dateArray, "dateArray");
    },
    goto(page) {
      let key = "";
      switch (page) {
        case "maintainBill":
          key = "/Repair/RepairBills";
          break;
        case "shutdown":
          key = "/Operation/Shutdown";
          break;
        case "repairTask":
          key = "/Repair/RepairTask";
          break;
        case "maintainTask":
          key = "/Maintenance/MaintenanceTask";
          break;
        case "inspectionTask":
          key = "/Inspection/InspectionTask";
          break;
        case "dispositionTask":
          key = "/Disposition/DispositionApproval";
          break;
        default:
          break;
      }
      if (key == "/Repair/RepairBills") {
        this.$router.push({
          path: key,
          params: {
            status: true,
          },
        });
      } else {
        this.$router.push({
          path: key,
        });
      }
    },
    getData() {
      getOrdersNum().then((res) => {
        // console.log(res)
        if (res.data) {
          this.order = res.data;
        }
      });
      getEquipmentNum().then((res) => {
        if (res.data) {
          this.device = res.data;
        }
      });
      getWorkOrderData().then((res) => {
        if (res.data) {
          let { checkoutOrderCount, maintainOrderCount, repairOrderCount } =
            res.data;
          for (let i = 0; i < checkoutOrderCount.length; i++) {
            this.checkoutOrderCount.count.push(checkoutOrderCount[i].count);
            this.checkoutOrderCount.time.push(
              checkoutOrderCount[i].time.split(" ")[0]
            );
          }
          for (let i = 0; i < maintainOrderCount.length; i++) {
            this.maintainOrderCount.count.push(maintainOrderCount[i].count);
            this.maintainOrderCount.time.push(
              maintainOrderCount[i].time.split(" ")[0]
            );
          }
          for (let i = 0; i < repairOrderCount.length; i++) {
            this.repairOrderCount.count.push(repairOrderCount[i].count);
            this.repairOrderCount.time.push(
              repairOrderCount[i].time.split(" ")[0]
            );
          }
          this.$nextTick(function () {
            this.initChart();
          });
        }
      });
    },
    initChart() {
      let _this = this;
      let option = {
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
            lineStyle: {
              type: "dashed",
            },
          },
        },
        grid: {
          left: "25",
          right: "25",
          bottom: "24",
          top: "75",
          containLabel: true,
        },
        legend: {
          data: ["维修", "保养", "点检"],
          right: 10,
          top: 10,
        },
        xAxis: {
          type: "category",
          data: _this.repairOrderCount.time,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#999",
            },
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#DDD",
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#333",
            },
          },
          nameTextStyle: {
            color: "#999",
          },
          splitArea: {
            show: false,
          },
        },
        series: [
          {
            name: "维修",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 13,
            lineStyle: {
              normal: {
                width: 3,
                shadowColor: "rgba(254, 80, 140, .4)",
                shadowBlur: 5,
                shadowOffsetY: 20,
                shadowOffsetX: 0,
                color: "#FE508C",
              },
            },
            itemStyle: {
              color: "#FE508C",
              borderColor: "#fff",
              borderWidth: 2,
            },
            data: _this.repairOrderCount.count,
          },
          {
            name: "保养",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 13,
            lineStyle: {
              normal: {
                width: 3,
                shadowColor: "rgba(39, 213, 155, .4)",
                shadowBlur: 5,
                shadowOffsetY: 20,
                shadowOffsetX: 0,
                color: "#27D59B",
              },
            },
            itemStyle: {
              color: "#27D59B",
              borderColor: "#fff",
              borderWidth: 2,
            },
            data: _this.maintainOrderCount.count,
          },
          {
            name: "点检",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 13,
            lineStyle: {
              normal: {
                width: 3,
                shadowColor: "rgba(255, 203, 62, .4)",
                shadowBlur: 5,
                shadowOffsetY: 20,
                shadowOffsetX: 0,
                color: "#FFCB3E",
              },
            },
            itemStyle: {
              color: "#FFCB3E",
              borderColor: "#fff",
              borderWidth: 2,
            },

            data: _this.checkoutOrderCount.count,
          },
        ],
      };
      this.myChart = this.$echarts.init(this.$refs.myEcharts);
      this.myChart.setOption(option);
      window.addEventListener("resize", this.resize, true);
    },
    resize() {
      this.myChart.resize();
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize, true);
  },
};
</script>

<style scoped lang="less">
.homePage {
  padding: 35px 32px 30px 30px;
  height: 100%;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  .gutter-row {
    margin-bottom: 28px;
    .equipment,
    .maintenance,
    .downtime {
      position: relative;
      // padding-top: 31px;
      // padding-left: 35px;
      border-radius: 13px;
      height: 152px;
      .border {
        padding: 28px 32px;
        position: absolute;
        left: 2px;
        top: 2px;
        border-radius: 13px;
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        display: flex;
        > div:nth-child(1) {
          width: 90px;
          height: 90px;
          margin-right: 40px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        > div:nth-child(2) {
          flex: 1;
          padding-top: 8px;
          padding-bottom: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          p {
            margin: 0;
            font-size: 24px;
            font-weight: 500;
            color: #ffffff;
          }
        }
        > div:nth-child(3) {
          width: 26px;
          margin-right: 9px;
          line-height: 90px;
          color: #fff;
        }
      }
    }
    .equipment {
      background: #27d59b;
    }
    .maintenance {
      background: #ff9437;
      .border {
        box-shadow: 0px 2px 4px 4px #ee7e1c;
        border: 1px solid #ffffff;
      }
    }
    .downtime {
      background: #a379f6;
      .border {
        box-shadow: 0px 2px 4px 4px #8754ec;
        border: 1px solid #ffffff;
      }
    }
  }
  .homePage-data {
    min-height: 732px;
    height: calc(100% - 180px);
    .homePage-data-left {
      float: left;
      width: 262px;
      height: 100%;
      padding-top: 33px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      > div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 72px;
        cursor: pointer;
        margin-bottom: 61px;
        > div:nth-child(1) {
          width: 61px;
          height: 61px;
          margin-right: 40px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        > div:nth-child(2) {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          p:first-child {
            margin: 0;
            margin-bottom: 12px;
            font-size: 34px;
            line-height: 34px;
            font-weight: 500;
            color: #427dff;
          }
          p:last-child {
            margin: 0;
            font-size: 26px;
            line-height: 26px;
            font-weight: 500;
            color: #000000;
          }
        }
      }
    }
    .homePage-data-right {
      margin-left: 262px;
      width: calc(100% - 262px);
      height: 100%;
      h3 {
        line-height: 22px;
        font-size: 22px;
        font-weight: 400;
        color: #000000;
        margin: 0;
      }
      div {
        width: 100%;
        height: calc(100% - 22px);
      }
    }
  }
}
</style>
