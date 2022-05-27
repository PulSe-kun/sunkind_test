<template>
  <a-modal
    v-model="visible"
    :closable="false"
    centered
    :bodyStyle="{
      padding: '0px',
      width: '530px',
      height: '200px',
    }"
    :zIndex="1000"
    wrapClassName="invalid_dialog"
  >
    <div class="invalid_content">
      <div v-if="obj.equipmentManagement">
        该设备已存在维修、保养、点检等记录，无法删除！
      </div>
      <div v-if="obj.hasCm">该类型存在设备，请转移设备后再删除！</div>
      <div v-if="obj.hasChildren">该类型存在子类型，无法删除！</div>
    </div>
    <template slot="footer">
      <div class="footer_btn">
        <a-button class="primary-style" type="primary" @click="visible = false"
          >确定</a-button
        >
      </div>
      <!-- <div class="footer_btn">
        <a class="cancel-style" @click="visible = false">取消</a>
      </div>
      <div class="footer_btn">
        <a class="link-style" @click="empty">确定删除</a>
      </div> -->
    </template>
  </a-modal>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      obj: {
        equipmentManagement: false,
        hasCm: false,
        hasChildren: false,
      },
    };
  },
  methods: {
    openDialog(obj) {
      this.obj = obj;
      this.visible = true;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-modal {
  width: 530px !important;
  height: 300px;
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
    // width: 260px;
    padding-right: 20px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    text-align: right;
  }
  //   .footer_btn:first-child {
  //     border-right: 1px solid #f2f2f2;
  //   }
}
</style>