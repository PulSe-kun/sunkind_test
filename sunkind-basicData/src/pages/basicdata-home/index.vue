<template>
  <div class="basicdata-home">
    <div class="basicdata-home-img">
      <img src="../../assets/img/home_top.png" alt="" />
      <img src="../../assets/img/home_bottom.png" alt="" />
    </div>
  </div>
</template>

<script>
import { getauth } from "../../services/api_log";
export default {
  data() {
    return {};
  },
  components: {},
  created() {},
  mounted() {
    // getauth().then((res) => {
    //   console.log(res);
    // });
  },
  methods: {},
};
</script>

<style scoped lang="less">
.basicdata-home {
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  overflow: auto;
  .basicdata-home-img {
    margin: 0 auto;
    width: 471px;
    height: 535px;
    padding-top: 177px;
    text-align: center;
    img:first-child {
      width: 368px;
      height: 37px;
      margin-bottom: 84px;
    }
    img:last-child {
      width: 471px;
      height: 409px;
    }
  }
}
</style>
