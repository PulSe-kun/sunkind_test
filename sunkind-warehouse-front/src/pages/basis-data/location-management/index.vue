<template>
  <div class="location-management">
    <a-tabs :default-active-key="activeKey" @change="callback">
      <a-tab-pane v-for="item in tabs" :key="item.warehouseId">
        <span slot="tab">
          {{ item.warehouseName }}
        </span>
        <div class="tab-content">
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
                    @click="cardTitle(item.feederName, card)"
                  >
                    <span>{{ card.storagebinName }}</span>
                    <div class="matterStyle">
                      <!-- <span
                        v-for="(matter, i) in card.mattertypeDTOList"
                        :key="i"
                        >{{ matter.mattertypeName
                        }}{{
                          i + 1 == card.mattertypeDTOList.length ? "" : "，"
                        }}</span
                      > -->
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
      <Details_dialog ref="details_dialog" @refresh="refresh" />
    </template>
  </div>
</template>

<script>
import Empty from "@/components/Empty/index";
import { getWareHouseList, findFeeders } from "@/services/api_statistical";
import { Details_dialog } from "./components/index";
export default {
  name: "location-management",
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
    refresh() {
      this.findFeedersData(this.activeKey);
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
.location-management {
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
                background: #f5f5f5;
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
                  overflow: hidden;
                  text-overflow: ellipsis;
                  text-align: center;
                  white-space: nowrap;
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
</style>
