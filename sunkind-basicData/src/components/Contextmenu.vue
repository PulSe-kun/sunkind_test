<template>
  <a-menu
    v-show="visible"
    class="contextmenu"
    :style="style"
    :selectedKeys="selectedKeys"
    @click="handleClick"
  >
    <a-menu-item :key="item.key" v-for="item in itemList">
      <img v-if="item.icon" :src="item.icon" :alt="item.text" />
      <span>{{ item.text }}</span>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  name: "Contextmenu",
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    itemList: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      left: 0,
      top: 0,
      target: null,
      meta: null,
      selectedKeys: [],
    };
  },
  computed: {
    style() {
      return {
        left: this.left + "px",
        top: this.top + "px",
      };
    },
  },
  created() {
    window.addEventListener("click", this.closeMenu);
    window.addEventListener("contextmenu", this.setPosition);
  },
  beforeDestroy() {
    window.removeEventListener("click", this.closeMenu);
    window.removeEventListener("contextmenu", this.setPosition);
  },
  methods: {
    closeMenu() {
      this.$emit("update:visible", false);
    },
    setPosition(e) {
      this.left = e.clientX;
      this.top = e.clientY;
      this.target = e.target;
      this.meta = e.meta;
    },
    handleClick({ key }) {
      this.$emit("select", key, this.target, this.meta);
      this.closeMenu();
    },
  },
};
</script>

<style lang="less" scoped>
.contextmenu {
  position: fixed;
  z-index: 1000;
  border-radius: 4px;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
}
.ant-menu-item {
  margin: 0 !important; // 菜单项之间的缝隙会影响点击
  padding: 0 12px;
  color: #666666;
  img {
    width: 15px;
    height: 15px;
    margin-right: 8px;
  }
  span {
    vertical-align: middle;
  }
}
.ant-menu-item:hover,
.ant-menu-item-active,
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-submenu-active,
.ant-menu-submenu-title:hover {
  background: #e6f7ff;
  color: #000000;
}
</style>
