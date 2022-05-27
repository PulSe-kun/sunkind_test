<template>
  <div class="empty-wrap">
    <img
      :src="imgSrc || require('@/assets/img/empty_table.png')"
      alt=""
      :style="{ width: width + 'px', height: height + 'px' }"
    />
    <div :style="{ 'font-size': fontSize + 'px' }">{{ text }}</div>
  </div>
</template>
<script>
export default {
  props: {
    /**空数据文案 */
    text: {
      type: String,
      default: "",
    },
    /**图片路径 */
    imgSrc: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 431,
    },
    height: {
      type: Number,
      default: 364,
    },
    fontSize: {
      type: Number,
      default: 28,
    },
  },
};
</script>
<style lang="less" scoped>
.empty-wrap {
  height: 100%;
  // padding-top: 112px;
  padding-top: 20px;
  text-align: center;
  div {
    font-weight: 500;
    color: #cccccc;
    letter-spacing: 2px;
    margin-top: 48px;
  }
}
</style>