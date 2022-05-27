<template>
  <a-modal
    v-model="visible"
    :closable="false"
    centered
    :bodyStyle="{
      padding: '0px',
      width: '530px',
      height: '274px',
    }"
    wrapClassName="state_dialog"
  >
    <!-- <img :src="imgSrc" alt="" /> -->
    <div class="state_content">
      {{ state_content.content }}
      <span>{{ state_content.title }}</span>？
    </div>
    <template slot="footer">
      <div class="footer_btn">
        <span :style="{ color: isRed ? '#ED0000' : '#999999' }" @click="btn_cancel">{{ cancelText }}</span>
      </div>
      <div class="footer_btn">
        <span :style="{ color: !isRed ? '#ED0000' : '#999999' }" @click="btn_ok">{{ okText }}</span>
      </div>
    </template>
  </a-modal>
</template>
<script>
import { updateStatus } from '../services/api_in_out'
export default {
  props: {
    state_name: Number,
    warehousingStatus: Number,
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      state_content: {
        content: '',
        title: ''
      },
      isRed: false, // 判断是哪个按钮功能有效
      // imgSrc: require("../assets/img/state3.png"),
      visible: false,
      cancelText: '',
      okText: ''
    }
  },
  methods: {
    btn_cancel() {
      // console.log(this.state_name);
      this.visible = false
      if (this.state_name == 2 || this.state_name == 3 || this.state_name == 52 || this.state_name == 53) {
        // console.log(this.item);
        this.changeStatus({
          warehousingId: this.item.warehousingId,
          warehousingStatus: this.warehousingStatus
        })
      }
    },
    btn_ok() {
      // console.log(this.item);
      this.visible = false
      if (this.state_name == 1 || this.state_name == 51) {
        this.changeStatus({
          warehousingId: this.item.warehousingId,
          warehousingStatus: this.warehousingStatus
        })
      }
    },
    changeStatus(params) {
      updateStatus(params).then(res => {
        // console.log(res);
        switch (this.state_name) {
          case 2:
            this.$message.success('删除成功')
            break
          case 3:
            this.$message.success('入库成功')
            break
          case 1:
            this.$message.success('取消成功')
            break
          case 52:
            this.$message.success('删除成功')
            break
          case 53:
            this.$message.success('出库成功')
            break
          case 51:
            this.$message.success('取消成功')
            break
          default:
            break
        }
        this.$emit('reload')
      })
    }
  },
  watch: {
    state_name: {
      handler(newVal, oldVal) {
        // console.log(newVal);
        switch (newVal) {
          case 1:
            this.cancelText = '继续等待'
            this.okText = '确认取消'
            this.isRed = false
            this.state_content = {
              content: '确认取消该入库队列'
              // title: "",
            }
            break
          case 2:
            this.cancelText = '确认删除'
            this.okText = '取消'
            this.isRed = true
            this.state_content = {
              content: '此操作视为取消入库，不会更新库位信息'
              // title: "XXXX",
            }
            break
          case 3:
            this.cancelText = '确认变更'
            this.okText = '取消'
            this.isRed = true
            this.state_content = {
              content: '此操作视为入库成功，会更新库存信息'
              // title: "入库完成",
            }
            break
          case 51:
            this.cancelText = '继续等待'
            this.okText = '确认取消'
            this.isRed = false
            this.state_content = {
              content: '确定取消该出库队列'
              // title: "",
            }
            break
          case 52:
            this.cancelText = '确认删除'
            this.okText = '取消'
            this.isRed = true
            this.state_content = {
              content: '此操作视为取消出库，不会更新库位信息'
              // title: "XXXX",
            }
            break
          case 53:
            this.cancelText = '确认变更'
            this.okText = '取消'
            this.isRed = true
            this.state_content = {
              content: '此操作视为出库成功，会更新库存信息'
              // title: "入库完成",
            }
            break
          default:
            break
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-modal {
  width: 530px !important;
  height: 350px;
  .state_content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    font-weight: 400;
    color: #000000;
    span {
      font-weight: bold;
    }
  }
}
/deep/.ant-modal-footer {
  overflow: hidden;
  padding: 0;
  .footer_btn {
    width: 260px;
    height: 75px;
    text-align: center;
    line-height: 75px;
    float: left;
    span {
      cursor: pointer;
      font-size: 18px;
      font-weight: 400;
    }
  }
  .footer_btn:first-child {
    border-right: 1px solid #f2f2f2;
  }
}
</style>
