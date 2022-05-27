<template>
  <div class="system-management">
    <div class="system-management-model">
      <div>
        <a-button
          class="primary-style"
          type="primary"
          size="large"
          @click="addSystem"
          >新建系统</a-button
        >
      </div>
      <div class="model-footer">
        <div
          v-for="(item, index) in cardList"
          :key="index"
          class="model-card"
          :style="{ background: item.background }"
        >
          <div class="cards" title="编辑系统" @click="compileSystem(item)">
            <a-icon class="cards_icon" type="edit" />
          </div>
          <div class="logo-img" :style="{ background: item.logo_background }">
            <img
              v-if="item.menuIcon"
              :src="require('@/assets/systemIcon/' + item.menuIcon + '.png')"
              alt=""
            />
          </div>
          <div class="logo-title">
            <h3>{{ item.menuTitle }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <template>
      <NewAdd_dialog
        ref="newAdd_dialog"
        :maxSort="maxSort"
        @refresh="refresh"
      />
      <Compile_dialog
        ref="compile_dialog"
        :system_id="system_id"
        @refresh="refresh"
      />
    </template>
  </div>
</template>

<script>
import { getroot, refresh } from "@/services/api_system";
import { NewAdd_dialog, Compile_dialog } from "./components/index";
let colorList = [
  {
    background: "#50A9FF",
    logo_background: "#5898FD",
  },
  {
    background: "#FE508C",
    logo_background: "#F63A6F",
  },
  {
    background: "#FF9437",
    logo_background: "#FB7F31",
  },
];
export default {
  data() {
    return {
      maxSort: 0,
      system_id: "",
      cardList: [],
    };
  },
  components: { NewAdd_dialog, Compile_dialog },
  created() {
    this.$nextTick(() => {
      this.getrootData();
      this.refreshData();
    });
  },
  methods: {
    /**获取系统列表 */
    getrootData() {
      getroot().then((res) => {
        console.log(res);
        if (res.status == 200) {
          for (let i = 0; i < res.data.length; i++) {
            if (i / colorList.length >= 1) {
              res.data[i]["background"] =
                colorList[i % colorList.length].background;
              res.data[i]["logo_background"] =
                colorList[i % colorList.length].logo_background;
            } else {
              res.data[i]["background"] = colorList[i].background;
              res.data[i]["logo_background"] = colorList[i].logo_background;
            }
          }
          this.cardList = res.data;
        }
      });
    },
    /**刷新 */
    refresh() {
      this.getrootData();
      this.refreshData();
    },
    /**刷新角色权限缓存 */
    refreshData() {
      // refresh().then((res) => {
      //   // console.log(res, 1111);
      // });
    },
    /**新建系统 */
    addSystem() {
      if (this.cardList.length > 0) {
        this.maxSort = this.cardList[0].maxSort + 10;
      } else {
        this.maxSort = 10;
      }
      this.$refs.newAdd_dialog.visible = true;
    },
    /**编辑系统 */
    compileSystem(item) {
      // console.log(item);
      this.system_id = item.id;
      this.$refs.compile_dialog.visible = true;
    },
  },
};
</script>

<style scoped lang="less">
.system-management {
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  .system-management-model {
    height: 100%;
    padding: 31px 50px;
    .model-footer {
      margin-top: 35px;
      height: calc(100% - 75px);
      overflow: auto;
      .model-card:hover {
        .cards {
          opacity: 0.4;
          -webkit-transition: opacity 0.2s;
          -moz-transition: opacity 0.2s;
          transition: opacity 0.2s;
        }
        .logo-img {
          img {
            opacity: 0.4;
            -webkit-transition: opacity 0.2s;
            -moz-transition: opacity 0.2s;
            transition: opacity 0.2s;
          }
        }
      }
      .model-card {
        margin-right: 35px;
        margin-bottom: 35px;
        padding: 31px 40px;
        width: 437px;
        height: 152px;
        border-radius: 13px;
        float: left;
        position: relative;
        .cards {
          cursor: pointer;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          text-align: center;
          line-height: 152px;
          border-radius: 13px;
          background-color: #000;
          opacity: 0;
          -webkit-transition: opacity 0.2s;
          -moz-transition: opacity 0.2s;
          transition: opacity 0.2s;
          .cards_icon {
            font-size: 28px;
            color: #fff;
          }
        }
        > div {
          float: left;
        }
        .logo-img {
          width: 90px;
          height: 90px;
          border-radius: 45px;
          margin-right: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          img {
            opacity: 1;
            -webkit-transition: opacity 0.2s;
            -moz-transition: opacity 0.2s;
            transition: opacity 0.2s;
            width: 100%;
            height: 100%;
            // transform: scale(0.6);
          }
        }
        .logo-title {
          width: 227px;
          height: 90px;
          padding: 10px 0;
          h3 {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            height: 24px;
            font-size: 24px;
            font-weight: 500;
            color: #ffffff;
            line-height: 24px;
            margin-bottom: 20px;
          }
          p {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            height: 18px;
            font-size: 18px;
            font-weight: 400;
            color: #ffffff;
            line-height: 18px;
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
