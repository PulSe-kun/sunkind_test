<template>
  <!-- 审批流程 -->
  <div v-if="approvalSteps.length > 0">
    <div
      v-for="(item, index) in approvalSteps"
      :key="index"
      class="approval-div"
    >
      <div class="approver">
        <div class="approval-process">
          <span>{{
            item.userName.substring(
              item.userName.length - 2,
              item.userName.length
            )
          }}</span>
          <img
            v-if="item.type == 1 || item.type == 4 || item.type == 3"
            src="../assets/img/pass.png"
          />
          <img v-if="item.type == 2" src="@/assets/img/reject.png" />
          <img v-if="item.type == 0" src="@/assets/img/inprocess.png" />
        </div>
      </div>

      <div class="approval-content">
        <div>
          <!-- <p>
            {{
              item.type == 0
                ? "通过"
                : item.type == 2
                ? "发起申请"
                : item.type == 3
                ? "驳回"
                : "审批中"
            }}
          </p> -->
          <p v-if="item.type == 0">审批中</p>
          <p v-if="item.type == 1">通过</p>
          <p v-if="item.type == 2">驳回</p>
          <p v-if="item.type == 3">撤回</p>
          <p v-if="item.type == 4">发起审批</p>
          <p>{{ item.userName }}</p>
          <p v-if="item.content">{{ item.content }}</p>
        </div>
        <div>
          <span>{{ item.endTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    approvalSteps: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang='less' scoped>
.approval-process {
  width: 55px;
  height: 55px;
  background: @theme-color;
  border-radius: 50%;
  text-align: center;
  position: relative;
  margin-left: 20px;
  span {
    font-size: 16px;
    color: #fff;
    line-height: 55px;
  }
  img {
    width: 17px;
    height: 17px;
    right: 0;
    bottom: 0;
    position: absolute;
  }
}

/deep/.approval-div:not(:last-child) .approver {
  &::after {
    content: "";
    width: 1px;
    height: 38px;
    background: #e8e8e8;
    position: absolute;
    left: 47px;
    top: 65px;
  }
}

.approver {
  // width:20%;
  position: relative;
}
.approval-content {
  display: flex;
  flex-direction: row;
  color: #000;
  width: 80%;
  margin-left: 30px;
  div:first-child {
    width: 60%;
  }
  div:last-child {
    width: 40%;
    text-align: right;
    font-size: 16px;
    color: #808080;
    padding-right: 5px;
  }
  div:first-child p {
    margin: 0;
    font-size: 16px;
  }
  div:first-child p:first-child {
    font-size: 18px;
    margin: 4px 0;
  }
  div:first-child :nth-child(3) {
    margin-top: 15px;
    font-size: 13px;
  }
}

.approval-div {
  height: 120px;
  padding: 20px 0;
  display: flex;
  flex-direction: row;
}
</style>