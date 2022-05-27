<template>
  <div class="put-out">
    <div class="put-out-title" v-if="typeValue == 'put'">
      入库中：<span>{{ putQueue.ongoingNum }}</span> 入库等待：<span>{{
        putQueue.waitingNum
      }}</span>
    </div>
    <div class="put-out-title" v-if="typeValue == 'out'">
      出库中：<span>{{ outQueue.ongoingNum }}</span> 出库等待：<span>{{
        outQueue.waitingNum
      }}</span>
    </div>
    <div class="put-out-content" v-if="typeValue == 'put'">
      <a-spin :spinning="put_spinning">
        <div
          class="queueStyle"
          v-for="(item, index) in putQueue.recordDTOList"
          :key="index"
        >
          <span
            class="put-out-content-label"
            v-if="item.warehousingStatus == 0"
            style="background: #15e45a"
          ></span>
          <span
            class="put-out-content-label"
            v-if="item.warehousingStatus == 1"
            style="background: #c2c2c2"
          ></span>
          <span
            class="put-out-content-label"
            v-if="item.warehousingStatus == 2"
            style="background: #385cef"
          ></span>
          <div>
            <span v-if="item.warehousingStatus == 2">入库中</span>
            <span v-if="item.warehousingStatus == 1">入库等待</span>
            <span v-if="item.warehousingStatus == 0">入库完成</span>
            <span>{{ item.palletCode + "(" + item.palletName + ")" }}</span>
            <span>{{
              item.conveyerName +
              "--" +
              item.feederName +
              "--" +
              item.storagebinLine +
              "行" +
              item.storagebinRow +
              "列"
            }}</span>
          </div>
        </div>
        <div
          style="text-align: center"
          v-if="putQueue.recordDTOList.length == 0"
        >
          <img
            style="width: 345px; height: 215px"
            src="@/assets/img/empty2.png"
            alt=""
          />
          <p style="font-size: 28px; color: #ccc">暂无入库队列</p>
        </div>
      </a-spin>
    </div>
    <div class="put-out-content" v-else>
      <a-spin :spinning="out_spinning">
        <div
          class="queueStyle"
          v-for="(item, index) in outQueue.recordDTOList"
          :key="index"
        >
          <span
            class="put-out-content-label"
            v-if="item.warehousingStatus == 50"
            style="background: #15e45a"
            ></span
          >
          <span
            class="put-out-content-label"
            v-if="item.warehousingStatus == 51"
            style="background: #c2c2c2"
            >1</span
          >
          <span
            class="put-out-content-label"
            v-if="item.warehousingStatus == 52"
            style="background: #385cef"
            >2</span
          >
          <div>
            <span v-if="item.warehousingStatus == 52">出库中</span>
            <span v-if="item.warehousingStatus == 51">出库等待</span>
            <span v-if="item.warehousingStatus == 50">出库完成</span>
            <span>{{ item.palletCode + "(" + item.palletName + ")" }}</span>
            <span>{{
              item.conveyerName +
              "--" +
              item.feederName +
              "--" +
              item.storagebinLine +
              "行" +
              item.storagebinRow +
              "列"
            }}</span>
          </div>
        </div>
        <div
          style="text-align: center"
          v-if="outQueue.recordDTOList.length == 0"
        >
          <img
            style="width: 345px; height: 215px"
            src="@/assets/img/empty2.png"
            alt=""
          />
          <p style="font-size: 28px; color: #ccc">暂无出库队列</p>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    typeValue: String,
  },
  data() {
    return {
      put_spinning: false,
      out_spinning: false,
      putQueue: {
        // 入库队列
        ongoingNum: 0,
        recordDTOList: [],
        waitingNum: 0,
        warehouseId: "",
      },
      outQueue: {
        // 出库队列
        ongoingNum: 0,
        recordDTOList: [],
        waitingNum: 0,
        warehouseId: "",
      },
    };
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    getPut(putQueue) {
      console.log(putQueue);
      this.put_spinning = true;
      setTimeout(() => {
        this.put_spinning = false;
        this.putQueue = putQueue;
      }, 300);
    },
    getOut(outQueue) {
      console.log(outQueue);
      this.out_spinning = true;
      setTimeout(() => {
        this.out_spinning = false;
        this.outQueue = outQueue;
      }, 300);
    },
  },
};
</script>

<style scoped lang="less">
.put-out {
  margin-top: 30px;
  padding-bottom: 20px;
  padding-right: 38px;
  height: calc(100% - 30px);
  .put-out-title {
    height: 15px;
    font-size: 15px;
    font-weight: 500;
    color: #000000;
  }
  .put-out-content {
    margin-top: 21px;
    height: calc(100% - 36px);
    overflow: auto;
    .queueStyle {
      position: relative;
      height: 26px;
      line-height: 26px;
      background: #f7f6fa;
      border-radius: 3px;
      margin-bottom: 3px;
      .put-out-content-label {
        position: absolute;
        width: 10px;
        height: 26px;
        border-radius: 3px;
      }
      & > div {
        padding-left: 21px;
        padding-right: 67px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:nth-child(1) {
          font-size: 15px;
          font-weight: 500;
          color: #6d6d6d;
          opacity: 0.95;
          display: inline-block;
          min-width: 60px;
        }
        span:nth-child(2) {
          font-size: 15px;
          font-weight: 400;
          color: #000000;
          opacity: 0.5;
          display: inline-block;
          // margin-left: 20px;
          min-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        span:nth-child(3) {
          font-size: 15px;
          font-weight: 500;
          color: #000000;
          display: inline-block;
          // margin-left: 20px;
          min-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
