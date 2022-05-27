<template>
  <div class="title">
    <span></span>
    <span>{{ title }}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>

<style scoped lang="less">
.title {
  height: 20px;
  position: absolute;
  left: 30px;
  top: 20px;
  z-index: 999;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span:first-child {
    display: inline-block;
    width: 3px;
    height: 20px;
    background: #385cef;
  }
  span:last-child {
    display: inline-block;
    margin-left: 10px;
    font-size: 20px;
    font-weight: 600;
    color: #000000;
  }
}
</style>
