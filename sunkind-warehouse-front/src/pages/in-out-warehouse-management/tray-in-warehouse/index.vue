<template>
  <div class="tray-in-warehouse">
    <div class="header">
      <div class="header-title">
        <span>{{ warehouseName }}</span>
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            切换仓库<a-icon type="caret-down" />
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
      </div>
      <div class="header-btn">
        <a-button
          class="default-style"
          style="margin-right: 19px"
          @click="empty_dialog"
          >空托盘入库</a-button
        >
        <a-button class="primary-style" type="primary" @click="cargo_dialog"
          >载物托盘入库</a-button
        >
      </div>
    </div>
    <a-spin :spinning="spinning">
      <div class="tray-in-warehouse-content">
        <a-row class="row-in" v-for="(item, index) in list" :key="index">
          <div class="state-img">
            <img :src="item.src" alt="" />
          </div>
          <a-col
            class="gutter-row"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="20"
          >
            <div class="col-title">
              <p>{{ item.palletCode + "(" + item.palletName + ")" }}</p>
              <p>
                {{
                  item.conveyerName +
                  "--" +
                  item.feederName +
                  "--" +
                  item.storagebinLine +
                  "行" +
                  item.storagebinRow +
                  "列"
                }}
              </p>
              <p>{{ item.errorMsg }}</p>
            </div>
          </a-col>
          <a-col class="gutter-row" :xs="24" :sm="24" :md="24" :lg="24" :xl="4">
            <div class="col-btn" v-if="item.warehousingStatus == 3">
              <a-button
                type="link"
                @click="fun_state(2, 4, item)"
                >删除入库队列</a-button
              >
              <a-button
                class="link-style"
                type="link"
                @click="fun_state(3, 0, item)"
                >完成入库</a-button
              >
            </div>
            <div class="col-btns" v-if="item.warehousingStatus == 1">
              <a-button
                class="link-style"
                type="link"
                @click="fun_state(1, 4, item)"
                >取消入库</a-button
              >
            </div>
            <div v-else></div>
          </a-col>
        </a-row>
        <div style="text-align: center" v-if="list.length == 0">
          <img src="../../../assets/img/empty2.png" alt="" />
          <p style="font-size: 28px; color: #ccc">暂无入库队列</p>
        </div>
      </div>
    </a-spin>
    <template>
      <Empty_tray ref="empty_tray" @reload="reload" />
      <Cargo_tray ref="cargo_tray" @reload="reload" />
      <state_dialog
        ref="state_dialog"
        :state_name="state_name"
        :warehousingStatus="warehousingStatus"
        :item="item"
        @reload="reload"
      />
    </template>
  </div>
</template>

<script>
import { getWarehouse } from "@/services/api_home";
import { getPutList } from "@/services/api_in_out";
import { Empty_tray, Cargo_tray } from "./components/index";
import state_dialog from "../../../components/state_dialog";
export default {
  name: "tray-in-warehouse",
  data() {
    return {
      spinning: false,
      warehouseName: "",
      warehouseList: [],
      warehousingStatus: null,
      state_name: null,
      item: null,
      list: [],
    };
  },
  components: {
    Empty_tray,
    Cargo_tray,
    state_dialog,
  },
  created() {
    this.$nextTick(function () {
      this.getWarehouseData();
    });
  },
  mounted() {},
  methods: {
    reload() {
      this.$nextTick(function () {
        this.getWarehouseData();
      });
    },
    /**获取仓库数据 */
    getWarehouseData() {
      getWarehouse().then((res) => {
        // console.log(res);
        this.warehouseList = res.data;
        /**存储仓库的信息 */
        if (sessionStorage.getItem("warehouseput")) {
          this.warehouseName = JSON.parse(
            sessionStorage.getItem("warehouseput")
          ).warehouseName;
          this.changeWarehouse(
            JSON.parse(sessionStorage.getItem("warehouseput")).warehouseId
          );
        } else {
          sessionStorage.setItem(
            "warehouseput",
            JSON.stringify(this.warehouseList[0])
          );
          this.warehouseName = this.warehouseList[0].warehouseName;
          this.changeWarehouse(this.warehouseList[0].warehouseId);
        }
      });
    },
    /**点击选择仓库 */
    onClick(item) {
      // console.log(item);
      this.warehouseName = item.warehouseName;
      sessionStorage.setItem("warehouseput", JSON.stringify(item));
      this.changeWarehouse(item.warehouseId);
    },
    /**切换仓库 获取数据 */
    changeWarehouse(id) {
      // console.log(id);
      this.spinning = true;
      getPutList(id).then((res) => {
        this.spinning = false;
        console.log(res);
        for (let i = 0; i < res.data.length; i++) {
          switch (res.data[i].warehousingStatus) {
            case 1:
              res.data[i]["src"] = require("../../../assets/img/put_await.png");
              break;
            case 2:
              res.data[i]["src"] = require("../../../assets/img/put_in.png");
              break;
            case 3:
              res.data[i][
                "src"
              ] = require("../../../assets/img/put_suspended.png");
              break;
            default:
              break;
          }
        }
        this.list = res.data;
      });
    },
    fun_state(id, warehousingStatus, item) {
      this.state_name = id;
      this.warehousingStatus = warehousingStatus;
      this.item = item;
      this.$refs.state_dialog.visible = true;
    },
    empty_dialog() {
      // console.log(this.$refs.empty_tray);
      this.$refs.empty_tray.visible = true;
    },
    cargo_dialog() {
      this.$refs.cargo_tray.visible = true;
    },
  },
  beforeDestroy() {
    sessionStorage.removeItem("warehouseput");
  },
};
</script>

<style scoped lang="less">
.tray-in-warehouse {
  height: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  .header {
    padding: 30px 23px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-title {
      & > span {
        font-size: 18px;
        font-weight: 500;
        color: #1b1b1b;
      }
      .ant-dropdown-link {
        font-size: 16px;
        font-weight: 400;
        color: #385cef;
      }
    }
    .header-btn {
      padding-right: 4px;
    }
  }
  .tray-in-warehouse-content {
    // height: calc(100% - 92px);
    // overflow: auto;
    .row-in {
      // height: 118px;
      background: #f6f6f6;
      padding-left: 112px;
      position: relative;
      margin-bottom: 10px;
      .state-img {
        position: absolute;
        left: 28px;
        height: 0;
        img {
          width: 61px;
          height: 64px;
        }
      }
      .gutter-row {
        .col-title,
        .col-btn,
        .col-btns {
          height: 118px;
        }
        .col-title {
          p:nth-child(1) {
            font-size: 20px;
            font-weight: 400;
            color: #000000;
            margin: 0;
            padding-top: 10px;
          }
          p:nth-child(2) {
            font-size: 16px;
            font-weight: 400;
            height: 16px;
            color: #999999;
            margin-top: 12px;
            margin-bottom: 12px;
          }
          p:nth-child(3) {
            font-size: 16px;
            font-weight: 400;
            height: 18px;
            color: #ed0000;
            margin-bottom: 0;
          }
        }
        .col-btn {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .ant-btn-link:first-child {
            color: #ed0000;
          }
        }
        .col-btns {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
      }
    }
  }
}
.isactive a {
  color: #1890ff;
}
</style>
