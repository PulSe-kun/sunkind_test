<template>
  <div class="warehouse-management-home">
    <a-row>
      <a-col style="margin-bottom: 30px; text-align: center" :span="24">
        <a-dropdown :trigger="['hover']">
          <a class="ant-dropdown-link">
            {{ warehouseName }}
            <a-icon type="caret-down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item
              :class="{ isactive: warehouseName == item.warehouseName }"
              v-for="item in warehouseList"
              :key="item.warehouseId"
              @click="onClick(item)"
            >
              <a>{{ item.warehouseName }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-col>
    </a-row>
    <a-row :gutter="30">
      <a-col class="gutter-row" :xs="24" :sm="24" :md="24" :lg="24" :xl="10">
        <div class="warehouse-usage">
          <Title :title="'仓库使用率'"></Title>
          <div class="echarts" ref="warehouse-usage-echarts"></div>
        </div>
      </a-col>
      <a-col class="gutter-row" :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
        <div class="failure-warning">
          <Title :title="'故障报警'"></Title>
          <div class="faultStyle" v-if="faultList.length > 0">
            <div
              style="
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 80px;
                background: rgb(241, 241, 241);
                border-radius: 3px;
                margin: 0px 30px 10px;
                padding: 20px 0 20px 40px;
              "
              v-for="(item, ind) in faultList"
              :key="ind"
            >
              <img style="width: 32px; height: 31px; margin-right: 21px" src="../../assets/img/warning.png" alt="预警" />
              <div>
                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    color: #000;
                    width: 327px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                  :title="
                    item.conveyerName +
                    '--' +
                    item.feederName +
                    '--' +
                    item.storagebinLine +
                    '行' +
                    item.storagebinRow +
                    '列' +
                    '--' +
                    item.palletCode +
                    '(' +
                    item.palletName +
                    ')'
                  "
                >
                  {{
                  item.conveyerName +
                  "--" +
                  item.feederName +
                  "--" +
                  item.storagebinLine +
                  "行" +
                  item.storagebinRow +
                  "列" +
                  "--" +
                  item.palletCode +
                  "(" +
                  item.palletName +
                  ")"
                  }}
                </p>
                <p
                  style="
                    color: #cb1818;
                    margin: 0;
                    width: 327px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                  :title="item.errorMsg"
                >{{ item.errorMsg }}</p>
              </div>
            </div>
          </div>
          <div class="failure-warning-empty" v-else>
            <img src="../../assets/img/empty.png" alt />
            <span>暂无故障</span>
          </div>
        </div>
      </a-col>
      <a-col class="gutter-row" :xs="0" :sm="0" :md="0" :lg="0" :xl="6">
        <div class="gutter-box">
          <div class="placeholder-img">
            <img src="../../assets/img/placeholder.png" alt />
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col class="gutter-row" :span="24">
        <div class="movements-figure">
          <Title :title="'出入库走势图'"></Title>
          <div class="echarts" ref="movements-figure-echarts"></div>
        </div>
      </a-col>
    </a-row>
    <a-row class="row-put-out" :gutter="30">
      <a-col class="gutter-row" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
        <div class="put-queue">
          <Title :title="'入库队列'"></Title>
          <Index :typeValue="'put'" ref="put" />
        </div>
      </a-col>
      <a-col class="gutter-row" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
        <div class="out-queue">
          <Title :title="'出库队列'"></Title>
          <Index :typeValue="'out'" ref="out" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Title from '../../components/title'
import Index from './components/index'
import { getUseBasic, getWarehouse, getchart, getPutOrOut, getFaultList } from '@/services/api_home'
export default {
  name: 'warehouse-management-home',
  data() {
    return {
      movements_figure: null,
      warehouse_usage: null,
      warehouseName: '', // 仓库名称
      warehouseList: [],
      faultList: []
    }
  },
  components: {
    Title,
    Index
  },
  created() {},
  mounted() {
    this.getWarehouseData()
  },
  methods: {
    /** 获取仓库数据 */
    getWarehouseData() {
      getWarehouse().then(res => {
        // console.log(res);
        this.warehouseList = res.data
        /** 存储仓库的信息 */
        if (sessionStorage.getItem('warehouseName')) {
          this.warehouseName = JSON.parse(sessionStorage.getItem('warehouseName')).warehouseName
          this.changeWarehouse(JSON.parse(sessionStorage.getItem('warehouseName')).warehouseId)
        } else {
          sessionStorage.setItem('warehouseName', JSON.stringify(this.warehouseList[0]))
          this.warehouseName = this.warehouseList[0].warehouseName
          this.changeWarehouse(this.warehouseList[0].warehouseId)
        }
      })
    },
    /** 点击选择仓库 */
    onClick(item) {
      // console.log(item);
      this.warehouseName = item.warehouseName
      sessionStorage.setItem('warehouseName', JSON.stringify(item))
      this.changeWarehouse(item.warehouseId)
    },
    /** 切换仓库 */
    changeWarehouse(id) {
      this.getUseBasicData(id)
      this.getchartData(id)
      this.getPutOrOutData(id, 0)
      this.getPutOrOutData(id, 1)
      this.getFaultListData(id)
    },
    getFaultListData(id) {
      getFaultList({ warehouseId: id }).then(res => {
        console.log(res)
        if (res.code === 0 && res.data !== null) {
          this.faultList = res.data
        } else {
          this.faultList = []
        }
      })
    },
    /** 获取仓库使用率 */
    getUseBasicData(id) {
      getUseBasic(id).then(res => {
        // console.log(res);
        const data = [
          {
            name: '满载',
            value: res.data.fullNum
          },
          {
            name: '无托盘',
            value: res.data.isNoNum
          },
          {
            name: '有空余',
            value: res.data.notFullNum
          },
          {
            name: '入库锁定',
            value: res.data.lockNum
          }
        ]
        /** 饼图 */
        this.warehouse_usage = this.$echarts.init(this.$refs['warehouse-usage-echarts'])
        var colorList = ['#ff9437', '#f5f5f5', '#27d59b', '#a379f6']
        var warehouse_usage_option = {
          title: {
            text: '仓库使用率',
            x: 'center',
            y: 'center',
            textStyle: {
              fontSize: 14
            }
          },
          legend: {
            icon: 'circle',
            itemWidth: 10,
            data: ['满载', '无托盘', '有空余', '入库锁定'],
            orient: 'vertical',
            right: 20
          },
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              type: 'pie',
              center: ['50%', '50%'],
              radius: ['30%', '60%'],
              clockwise: true,
              avoidLabelOverlap: true,
              hoverOffset: 30,
              emphasis: {
                itemStyle: {
                  borderColor: '#f3f3f3',
                  borderWidth: 10
                }
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    return colorList[params.dataIndex]
                  }
                }
              },
              label: {
                show: true,
                position: 'outside',
                formatter: '{a|{b}：{d}%}\n{hr|}',
                rich: {
                  hr: {
                    backgroundColor: 't',
                    borderRadius: 3,
                    width: 3,
                    height: 3,
                    padding: [3, 3, 0, -12]
                  },
                  a: {
                    padding: [-30, 15, -20, 15]
                  }
                }
              },
              labelLine: {
                normal: {
                  length: 20,
                  length2: 30,
                  lineStyle: {
                    width: 1
                  }
                }
              },
              data: data
            }
          ]
        }
        this.warehouse_usage.setOption(warehouse_usage_option)
        window.addEventListener('resize', this.warehouse_usageResize, true)
      })
    },
    /** 出入库走势图 */
    getchartData(id) {
      getchart(id).then(res => {
        console.log(res)
        const line = {}
        line.date = this.handle_list(res.data.outList, 'date') // 时间
        line.putList = this.handle_list(res.data.putList, 'data') // 入库
        line.outList = this.handle_list(res.data.outList, 'data') // 出库
        /** 折线图 */
        this.movements_figure = this.$echarts.init(this.$refs['movements-figure-echarts'])
        var option = {
          backgroundColor: '#fff',
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['出库', '入库'],
            left: 'right'
          },
          grid: {
            top: 'middle',
            left: '3%',
            right: '4%',
            bottom: '5%',
            top: '15%',
            height: '80%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: line.date,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#999'
              }
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#DDD'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333'
              }
            },
            nameTextStyle: {
              color: '#999'
            },
            splitArea: {
              show: false
            }
          },
          series: [
            {
              name: '出库',
              type: 'line',
              data: line.outList,
              color: '#A63DFF',
              lineStyle: {
                normal: {
                  width: 2,
                  color: {
                    type: 'linear',
                    colorStops: [
                      {
                        offset: 0,
                        color: '#A63DFF' // 0% 处的颜色
                      },
                      {
                        offset: 0.4,
                        color: '#A63DFF' // 100% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#A63DFF' // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  },
                  shadowColor: 'rgba(166,61,255, 0.5)',
                  shadowBlur: 10,
                  shadowOffsetY: 7
                }
              },
              itemStyle: {
                normal: {
                  color: '#A63DFF',
                  borderWidth: 10,
                  /* shadowColor: 'rgba(72,216,191, 0.3)',
                     shadowBlur: 100, */
                  borderColor: '#A63DFF'
                }
              },
              smooth: true
            },
            {
              name: '入库',
              type: 'line',
              data: line.putList,
              lineStyle: {
                normal: {
                  width: 2,
                  color: {
                    type: 'linear',
                    colorStops: [
                      {
                        offset: 0,
                        color: '#FFBC4B' // 0% 处的颜色
                      },
                      {
                        offset: 0.4,
                        color: '#FFBC4B' // 100% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#FFBC4B' // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  },
                  shadowColor: 'rgba(255,188,75, 0.5)',
                  shadowBlur: 10,
                  shadowOffsetY: 7
                }
              },
              itemStyle: {
                normal: {
                  color: '#FFBC4B',
                  borderWidth: 10,
                  /* shadowColor: 'rgba(72,216,191, 0.3)',
                     shadowBlur: 100, */
                  borderColor: '#FFBC4B'
                }
              },
              smooth: true
            }
          ]
        }
        this.movements_figure.setOption(option)
        window.addEventListener('resize', this.movements_figureResize, true)
      })
    },
    /** 处理数组结构 */
    handle_list(list, type) {
      const arr = []
      switch (type) {
        case 'data':
          for (let i = 0; i < list.length; i++) {
            arr.push(list[i].total)
          }
          break
        default:
          for (let i = 0; i < list.length; i++) {
            arr.push(list[i].date)
          }
      }

      return arr
    },
    /** 获取出入库数据 */
    /** 0代表入库 1代表出库 */
    getPutOrOutData(wareHouseId, type) {
      getPutOrOut({ warehouseId: wareHouseId, warehousingType: type }).then(res => {
        // console.log(res, "=============");
        if (type === 0) {
          // this.putQueue = res.data;
          this.$refs.put.getPut(res.data)
        } else {
          // this.outQueue = res.data;
          this.$refs.out.getOut(res.data)
        }
      })
    },
    warehouse_usageResize() {
      this.warehouse_usage.resize()
    },
    movements_figureResize() {
      this.movements_figure.resize()
    },
    fun(warehouse_usage) {
      //  console.log(warehouse_usage,'11111111')
      let index = 0
      var timer = setInterval(function () {
        warehouse_usage.dispatchAction({
          type: 'hideTip',
          seriesIndex: 0,
          dataIndex: index
        })
        // 显示提示框
        warehouse_usage.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: index
        })
        // 取消高亮指定的数据图形
        warehouse_usage.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: index == 0 ? 2 : index - 1
        })
        warehouse_usage.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: index
        })
        index++
        if (index > 2) {
          index = 0
        }
      }, 3000)
    },
    resize() {
      this.warehouse_usage.resize()
      this.movements_figure.resize()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.warehouse_usageResize, true)
    window.removeEventListener('resize', this.movements_figureResize, true)
    sessionStorage.removeItem('warehouseName')
  }
}
</script>

<style scoped lang="less">
.warehouse-management-home {
  padding: 2px;
  padding-left: 3px;
  padding-right: 3px;
  height: calc(100% - 2px);
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  /deep/.ant-row > div {
    background: transparent;
    border: 0;
  }

  .gutter-row {
    margin-bottom: 20px;
  }

  .warehouse-usage,
  .failure-warning,
  .movements-figure,
  .put-queue,
  .out-queue {
    position: relative;
    padding-top: 20px;
    padding-left: 30px;
    background: #ffffff;
    box-shadow: 0px 1px 6px 0px rgba(115, 115, 115, 0.43);
    border-radius: 5px;
  }
  .warehouse-usage {
    height: 342px;
    .echarts {
      height: 100%;
    }
  }
  .failure-warning {
    height: 342px;
    .faultStyle {
      position: absolute;
      top: 64px;
      left: 0;
      width: 100%;
      height: calc(100% - 64px);
      overflow: auto;
    }
    .failure-warning-empty {
      margin: 64px auto 78px;
      width: 177px;
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      img {
        width: 177px;
        height: 128px;
      }
      span {
        display: inline-block;
        height: 21px;
        font-size: 22px;
        font-weight: 500;
        color: #c8c8c8;
      }
    }
  }
  .placeholder-img {
    height: 342px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 320px;
      height: 297px;
    }
  }
  .movements-figure {
    height: 280px;
    .echarts {
      height: 100%;
    }
  }
  .row-put-out {
    min-height: 240px;
    height: calc(100% - 725px);
    .ant-col {
      height: 100%;
      .put-queue,
      .out-queue {
        height: calc(100% - 3px);
      }
    }
  }
}
.ant-dropdown-link {
  font-size: 22px;
}
.ant-dropdown-menu-item {
  font-size: 18px;
  line-height: 30px;
}
.isactive a {
  color: #1890ff;
}
</style>
