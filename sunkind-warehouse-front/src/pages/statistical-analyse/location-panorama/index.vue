<template>
  <div class="location-panorama">
    <a-tabs :default-active-key="activeKey" @change="callback">
      <a-tab-pane v-for="item in tabs" :key="item.warehouseId">
        <span slot="tab">
          {{ item.warehouseName }}
        </span>
        <div class="tab-content">
          <div class="tab-content-type">
            <ul>
              <li>
                <span></span>
                <span>入库锁定</span>
              </li>
              <li>
                <span></span>
                <span>满盘</span>
              </li>
              <li>
                <span></span>
                <span>有空余</span>
              </li>
              <li>
                <span></span>
                <span>无物料</span>
              </li>
            </ul>
          </div>
          <a-spin :spinning="spinning">
            <div
              class="tab-content-model"
              v-for="(item, index) in list"
              :key="index"
            >
              <div class="model-title">{{ item.feederName }}</div>
              <div class="model-wrap">
                <ul>
                  <li
                    v-for="(card, ind) in item.storagebinDTOS"
                    :key="ind"
                    :class="{ isActive: card.background !== '#f5f5f5' }"
                    :style="{ background: card.background }"
                    @click="cardTitle(item.feederName, card)"
                  >
                    <span>{{ card.storagebinName }}</span>
                    <div class="matterStyle">
                      <!-- <span
                        v-for="(matter, i) in card.mattertypeDTOList"
                        :key="i"
                      >
                        <span
                          >{{ matter.mattertypeName
                          }}{{
                            i + 1 == card.mattertypeDTOList.length ? "" : "，"
                          }}</span
                        >
                      </span> -->
                      <span v-if="card.str">
                        <span v-if="card.str.length > 10">{{
                          card.str.slice(0, 10) + "..."
                        }}</span>
                        <span v-else>{{ card.str }}</span>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <Empty text="暂无数据" v-if="list.length == 0" />
          </a-spin>
        </div>
      </a-tab-pane>
    </a-tabs>
    <template>
      <Details_dialog ref="details_dialog" />
    </template>
  </div>
</template>

<script>
import Empty from "@/components/Empty/index";
import { getWareHouseList, findFeeders } from "@/services/api_statistical";
import { Details_dialog } from "./components/index";
export default {
  name: "location-panorama",
  data() {
    return {
      spinning: false,
      activeKey: "",
      warehouseName: "",
      tabs: [],
      list: [],
    };
  },
  components: { Details_dialog, Empty },
  created() {
    this.$nextTick(function () {
      this.getWareHouseListData();
    });
  },
  mounted() {},
  methods: {
    /**点击料架 */
    cardTitle(feederName, card) {
      // console.log(feederName, card, this.warehouseName);
      this.$refs.details_dialog.visible = true;
      this.$refs.details_dialog.getCardTitle(
        feederName,
        card,
        this.warehouseName
      );
    },
    /**所属仓库下拉选项 */
    getWareHouseListData() {
      getWareHouseList().then((res) => {
        // console.log(res);
        if (res.code === 0) {
          this.activeKey = res.data[0].warehouseId;
          this.warehouseName = res.data[0].warehouseName;
          this.tabs = res.data;
          this.findFeedersData(this.activeKey);
        }
      });
    },
    /**加载所有料架和对应的库位 */
    findFeedersData(id) {
      this.spinning = true;
      findFeeders(id).then((res) => {
        // console.log(res);
        this.spinning = false;
        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < res.data[i].storagebinDTOS.length; j++) {
            let obj = res.data[i].storagebinDTOS[j];
            if (obj.mattertypeDTOList) {
              // obj["str"] = obj.mattertypeDTOList.join(",");
              let list = [];
              for (let k = 0; k < obj.mattertypeDTOList.length; k++) {
                list.push(obj.mattertypeDTOList[k].mattertypeName);
              }
              obj["str"] = list.join(",");
            } else {
              obj["str"] = "";
            }
            // console.log(obj["str"]);
            switch (res.data[i].storagebinDTOS[j].status) {
              case 0:
                res.data[i].storagebinDTOS[j]["background"] = "#f5f5f5";
                break;
              case 1:
                res.data[i].storagebinDTOS[j]["background"] = "#27d59b";
                break;
              case 2:
                res.data[i].storagebinDTOS[j]["background"] = "#ff9437";
                break;
              case 3:
                res.data[i].storagebinDTOS[j]["background"] = "#a379f6";
                break;
              default:
                break;
            }
          }
        }
        this.list = res.data;
      });
    },
    callback(key) {
      // console.log(key);
      for (let i = 0; i < this.tabs.length; i++) {
        if (key == this.tabs[i].warehouseId) {
          this.warehouseName = this.tabs[i].warehouseName;
        }
      }
      this.activeKey = key;
      this.findFeedersData(this.activeKey);
    },
  },
};
</script>

<style scoped lang="less">
.location-panorama {
  height: 100%;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);

  .ant-tabs {
    padding: 0 23px;
    height: 100%;
    /deep/.ant-tabs-content {
      padding-top: 5px;
      height: calc(100% - 60px);
      .tab-content {
        height: 100%;
        position: relative;
        overflow: auto;
        .tab-content-type {
          position: absolute;
          right: 5px;
          top: 0;
          & > ul {
            li {
              list-style: none;
              float: left;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              margin-right: 25px;
              span:first-child {
                display: inline-block;
                width: 17px;
                height: 17px;
                border-radius: 2px;
                margin-right: 5px;
              }
              span:last-child {
                font-size: 16px;
                font-weight: 400;
                color: #070707;
              }
            }
            li:nth-child(1) {
              span:first-child {
                background: #a379f6;
              }
            }
            li:nth-child(2) {
              span:first-child {
                background: #ff9437;
              }
            }
            li:nth-child(3) {
              span:first-child {
                background: #27d59b;
              }
            }
            li:nth-child(4) {
              span:first-child {
                background: #f5f5f5;
              }
            }
          }
        }
        > div:nth-child(2) {
          padding-top: 0;
        }
        .tab-content-model {
          padding-top: 21px;
          .model-title {
            padding-left: 8px;
            font-size: 20px;
            font-weight: 400;
            color: #070707;
          }
          .model-wrap {
            margin-top: 19px;
            overflow: hidden;
            & > ul {
              margin: 0;
              padding: 0;
              .isActive {
                > span:first-child {
                  color: #ffffff;
                }
                .matterStyle {
                  span {
                    color: #ffffff;
                  }
                }
              }
              li {
                cursor: pointer;
                position: relative;
                width: 201px;
                height: 69px;
                border-radius: 3px;
                margin-right: 5px;
                margin-bottom: 5px;
                list-style: none;
                float: left;
                // span {
                //   font-size: 16px;
                //   font-weight: 400;
                //   color: #000000;
                // }
                // span:first-child {
                //   position: absolute;
                //   left: 20px;
                //   top: 10px;
                // }
                // span:last-child {
                //   position: absolute;
                //   left: 46px;
                //   top: 27px;
                //   color: #999999;
                // }
                > span {
                  font-size: 16px;
                  font-weight: 400;
                  color: #000000;
                }
                > span:first-child {
                  position: absolute;
                  left: 20px;
                  top: 5px;
                }
                .matterStyle {
                  width: calc(100% - 40px);
                  height: 22px;
                  line-height: 22px;
                  // overflow: hidden;
                  // text-overflow: ellipsis;
                  // white-space: nowrap;
                  text-align: center;
                  position: absolute;
                  left: 20px;
                  top: 27px;
                  > span {
                    font-size: 16px;
                    font-weight: 400;
                    color: #999999;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

// /deep/.ant-radio-button-wrapper {
//   margin-right: 20px;
//   border-radius: 4px;
//   border: 1px solid @radioColor;
//   box-shadow: none !important;
//   color: @radioColor;
// }

// /deep/.ant-radio-button-wrapper:not(:first-child)::before {
//   display: none;
// }

// /deep/.ant-radio-group-solid
//   .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active,
// /deep/.ant-radio-group-solid
//   .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
//   color: #fff !important;
//   background: @radioColor;
//   border-color: @radioColor;
// }

// /deep/.ant-radio-group-solid
//   .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
//   color: #fff !important;
//   background: @radioColor;
//   border-color: @radioColor;
// }

// /deep/.ant-radio-button-wrapper:hover {
//   color: @radioColor;
// }

// /deep/.ant-form label {
//   font-size: 18px !important;
//   font-weight: 400 !important;
// }
// .ant-btn-primary-disabled,
// .ant-btn-primary.disabled,
// .ant-btn-primary[disabled],
// .ant-btn-primary-disabled:hover,
// .ant-btn-primary.disabled:hover,
// .ant-btn-primary[disabled]:hover,
// .ant-btn-primary-disabled:focus,
// .ant-btn-primary.disabled:focus,
// .ant-btn-primary[disabled]:focus,
// .ant-btn-primary-disabled:active,
// .ant-btn-primary.disabled:active,
// .ant-btn-primary[disabled]:active,
// .ant-btn-primary-disabled.active,
// .ant-btn-primary.disabled.active,
// .ant-btn-primary[disabled].active {
//   color: #fff !important ;
// }
</style>


