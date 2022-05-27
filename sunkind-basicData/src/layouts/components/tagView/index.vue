<template>
  <div class="tabs-head">
    <contextmenu
      :itemList="menuItemList"
      :visible.sync="menuVisible"
      @select="onMenuSelect"
    />
    <a-tabs
      class="tabs-container"
      type="editable-card"
      :active-key="active"
      :hide-add="true"
    >
      <a-tab-pane v-for="(tab, index) in pageList" :key="tab.path">
        <div
          slot="tab"
          class="tab"
          @contextmenu="(e) => onContextmenu(tab.path, e)"
        >
          <a-icon
            v-if="tab.path == $route.path"
            class="icon-sync"
            :type="refresh_loading ? 'loading' : 'sync'"
            @click="refresh"
          />
          <div class="title" @click="onTabClick(tab.path)">
            {{ tab.meta.title }}
          </div>
          <my-icon
            v-if="pageList.length > 1 && tab.path !== '/basicdata-home'"
            type="iconcha1"
            :style="{ color: tab.path == $route.path ? '#fff' : '#999' }"
            @click="delRoute(index)"
          ></my-icon>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import Contextmenu from "@/components/Contextmenu";
export default {
  data() {
    return {
      pageList: [],
      active: "",
      menuVisible: false,
      refresh_loading: false,
    };
  },
  props: {
    addroutes: Array,
  },
  components: {
    Contextmenu,
  },
  computed: {
    menuItemList() {
      return [
        {
          key: "1",
          icon: require("@/assets/img/close_left.png"),
          text: "关闭左侧",
        },
        {
          key: "2",
          icon: require("@/assets/img/close_right.png"),
          text: "关闭右侧",
        },
        {
          key: "3",
          icon: require("@/assets/img/close_other.png"),
          text: "关闭其他",
        },
      ];
    },
  },
  created() {
    /**判断是否有标签路由 有的话从缓存里取 */
    let pageList = window.sessionStorage.getItem("pageList");
    if (pageList) {
      this.pageList = JSON.parse(pageList);
      /**选中当前的路由 */
      this.active = this.$route.path;
    } else {
      this.createTabs(this.$route.path);
    }
  },
  methods: {
    onMenuSelect(key, target, pageKey) {
      console.log(key, target, pageKey);
      switch (key) {
        case "1":
          this.closeLeft(pageKey);
          break;
        case "2":
          this.closeRight(pageKey);
          break;
        case "3":
          this.closeOthers(pageKey);
          break;
        default:
          break;
      }
    },
    onContextmenu(pageKey, e) {
      // console.log(pageKey, e);
      // e.preventDefault();
      // this.menuVisible = true;
      if (pageKey) {
        e.preventDefault();
        e.meta = pageKey;
        this.menuVisible = true;
      }
    },
    refresh() {
      let _this = this;
      _this.refresh_loading = true;
      // console.log("刷新");
      setTimeout(() => {
        _this.refresh_loading = false;
        _this.$emit("reload"); //此处调用
      }, 500);
    },
    /**获取当前的标签页数据 */
    getNowTabData(route) {
      // console.log(route);
      let _route = {
        meta: {
          title: route.meta.title,
        },
        // path: "/" + route.filePath.split("/index")[0],
        path: route.path,
      };
      this.active = _route.path;
      if (this.pageList.length == 0) {
        this.pageList.push(_route);
      } else {
        let flag = false;
        for (let i = 0; i < this.pageList.length; i++) {
          if (this.pageList[i].path == _route.path) {
            flag = true;
          }
        }
        if (!flag) {
          this.pageList.push(_route);
        }
      }
      // console.log(this.pageList);
      // 把标签路由存在缓存中
      window.sessionStorage.setItem("pageList", JSON.stringify(this.pageList));
    },
    /**处理数据,转换成标签页需要的数据 */
    createTabs(val) {
      // console.log(val);
      let path = val.split("/")[1];
      let children_path = val.split("/")[2];
      // console.log(path, children_path);
      for (let i = 0; i < this.addroutes.length; i++) {
        // console.log(this.addroutes[i].path);
        if (typeof children_path == "undefined") {
          this.getNowTabData(this.addroutes[i].children[0]);
          return;
        }
        if ("/" + path == this.addroutes[i].path) {
          for (let j = 0; j < this.addroutes[i].children.length; j++) {
            if (val == this.addroutes[i].children[j].path) {
              this.getNowTabData(this.addroutes[i].children[j]);
              return;
            }
          }
        }
      }
    },
    /**点击标签页跳转 */
    onTabClick(path) {
      /**跳转时处理菜单路由的展示 格式必须一致 防止出错 */
      let openKeys = ["/" + path.split("/")[1]];
      window.sessionStorage.setItem("openKeys", JSON.stringify(openKeys));
      window.sessionStorage.setItem("selectedKeys", JSON.stringify([path]));
      this.$router.push({
        path: path,
      });
    },
    /**删除路由 */
    delRoute(index) {
      // console.log(index);
      if (this.pageList[index].path == this.$route.path) {
        let openKeys = "";
        let selectedKeys = "";
        if (index + 1 < this.pageList.length) {
          this.$router.push({
            path: this.pageList[index + 1].path,
          });
          this.active = this.pageList[index + 1].path;
          openKeys = ["/" + this.pageList[index + 1].path.split("/")[1]];
          selectedKeys = this.pageList[index + 1].path;
        } else if (index + 1 == this.pageList.length) {
          if (index == 1) {
            this.$router.push({
              path: this.pageList[0].path,
            });
            this.active = this.pageList[0].path;
            openKeys = ["/" + this.pageList[0].path.split("/")[1]];
            selectedKeys = this.pageList[0].path;
          } else {
            this.$router.push({
              path: this.pageList[index - 1].path,
            });
            this.active = this.pageList[index - 1].path;
            openKeys = ["/" + this.pageList[index - 1].path.split("/")[1]];
            selectedKeys = this.pageList[index - 1].path;
          }
        } else {
          this.$router.push({
            path: this.pageList[index - 1].path,
          });
          this.active = this.pageList[index - 1].path;
          openKeys = ["/" + this.pageList[index - 1].path.split("/")[1]];
          selectedKeys = this.pageList[index - 1].path;
        }
        /**跳转时处理菜单路由的展示 格式必须一致 防止出错 */
        window.sessionStorage.setItem("openKeys", JSON.stringify(openKeys));
        window.sessionStorage.setItem(
          "selectedKeys",
          JSON.stringify([selectedKeys])
        );
      }
      this.pageList.splice(index, 1);
      // 把标签路由存在缓存中
      window.sessionStorage.setItem("pageList", JSON.stringify(this.pageList));
    },
    /**关闭左侧 */
    closeLeft(pageKey) {
      // console.log(pageKey, this.pageList);
      const index = this.pageList.findIndex((item) => item.path === pageKey);
      const clearPages = this.pageList.filter((item, i) => i < index);
      this.pageList = this.pageList.filter(
        (item) => !clearPages.includes(item)
      );
      let flag = true;
      for (let i = 0; i < this.pageList.length; i++) {
        if (this.pageList[i].path == "/basicdata-home") {
          flag = false;
        }
      }
      if (flag) {
        this.pageList.unshift({
          meta: {
            title: "首页",
          },
          path: "/basicdata-home",
        });
      }
      // 把标签路由存在缓存中
      window.sessionStorage.setItem("pageList", JSON.stringify(this.pageList));
      // 判断跳转
      if (!this.pageList.find((item) => item.path === this.$route.path)) {
        this.onTabClick(pageKey);
      }
    },
    /**关闭右侧 */
    closeRight(pageKey) {
      // 清除缓存
      const index = this.pageList.findIndex((item) => item.path === pageKey);
      const clearPages = this.pageList.filter((item, i) => i > index);
      this.pageList = this.pageList.filter(
        (item) => !clearPages.includes(item)
      );
      // 把标签路由存在缓存中
      window.sessionStorage.setItem("pageList", JSON.stringify(this.pageList));
      // 判断跳转
      if (!this.pageList.find((item) => item.path === this.$route.path)) {
        this.onTabClick(pageKey);
      }
    },
    /**关闭其他 */
    closeOthers(pageKey) {
      // 清除缓存
      const clearPages = this.pageList.filter((item) => item.path !== pageKey);
      this.pageList = this.pageList.filter(
        (item) => !clearPages.includes(item)
      );
      let flag = true;
      for (let i = 0; i < this.pageList.length; i++) {
        if (this.pageList[i].path == "/basicdata-home") {
          flag = false;
        }
      }
      if (flag) {
        this.pageList.unshift({
          meta: {
            title: "首页",
          },
          path: "/basicdata-home",
        });
      }
      // 把标签路由存在缓存中
      window.sessionStorage.setItem("pageList", JSON.stringify(this.pageList));
      // 判断跳转
      if (this.$route.path != pageKey) {
        this.onTabClick(pageKey);
      }
    },
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        // console.log(newVal, oldVal);
        if (newVal) {
          this.createTabs(newVal.path);
        }
      },
    },
  },
};
</script>
<style lang="less" scoped>
@import "index";
</style>