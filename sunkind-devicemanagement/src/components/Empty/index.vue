<template>
  <div class="empty-wrap" :style="'transform:scale(' + scale + ')'">
    <img
      :src="imgSrc || require('@/assets/img/empty.png')"
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
      default: 506,
    },
    height: {
      type: Number,
      default: 179,
    },
    fontSize: {
      type: Number,
      default: 16,
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
};
</script>
<style lang="less" scoped>
.empty-wrap {
  height: 100%;
  text-align: center;
  position: relative;
  img {
    margin: 20px;
  }
  div {
    position: absolute;
    left: 50%;
    bottom: 24px;
    transform: translate(-50%, 0px);
    color: #a3b1bf;
  }
}
</style>