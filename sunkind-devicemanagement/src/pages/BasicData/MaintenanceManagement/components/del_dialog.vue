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
    :zIndex="999"
    wrapClassName="invalid_dialog"
  >
    <div class="invalid_content">
      <img src="../../../../assets/img/delete2.png" alt="" />
      <div>是否删除该保养项？</div>
    </div>
    <template slot="footer">
      <div class="footer_btn">
        <a class="cancel-style" @click="visible = false">取消</a>
      </div>
      <div class="footer_btn">
        <a class="link-style" @click="empty">确定删除</a>
      </div>
    </template>
  </a-modal>
</template>
<script>
import { deleteMaintainItem } from "@/services/api";
export default {
  data() {
    return {
      id: "",
      visible: false,
    };
  },
  methods: {
    openDialog(id) {
      this.visible = true;
      this.id = id;
    },
    /**清空 */
    empty() {
      deleteMaintainItem(this.id).then((res) => {
        // console.log(res);
        if (res.status === 200) {
          this.visible = false;
          this.$message.success("删除成功");
          this.$parent.refreshTree();
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-modal {
  width: 530px !important;
  height: 350px;
  .invalid_content {
    width: 530px;
    height: 100%;
    padding: 44px 40px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 44px;
      height: 44px;
      margin-bottom: 25px;
    }
  }
}
/deep/.ant-modal-footer {
  width: 530px;
  overflow: hidden;
  padding: 0;
  .footer_btn {
    width: 260px;
    height: 75px;
    text-align: center;
    line-height: 75px;
    float: left;
  }
  .footer_btn:first-child {
    border-right: 1px solid #f2f2f2;
  }
}
</style>