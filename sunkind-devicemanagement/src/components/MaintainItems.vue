<template>
  <div>
    <div class="footer-title">
      <span></span>
      <h3>{{ tableName }}项</h3>
    </div>
    <div class="dialog-content">
      <a-table
        :columns="detailColumns"
        :data-source="detailData"
        :pagination="false"
        bordered
        :row-key="(record, index) => index"
      >
        <span slot="maintainName" slot-scope="text, record, index">
          <a @click="showDeviceDetail(index)" class="device-name">{{ text }}</a>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  extends: {},
  props: {
    detailData: {
      type: Array,
    },
    tableName: {
      type: String,
    },
  },
  data() {
    return {
      detailColumns: [
        {
          title: "行号",
          align:'center',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: this.tableName + "项名称",
          dataIndex: "name",
          key: "name",
          align:'center',
          scopedSlots: { customRender: "maintainName" },
        },
        {
          title: this.tableName + "内容",
          dataIndex: "content",
          align:'center',
          key: "content",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    showDeviceDetail(index) {
      this.$emit("showDeviceDetail", index);
    },
  },
};
</script>
<style lang='less' scoped>
.footer-title {
  padding-top: 21px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span {
    display: inline-block;
    width: 5px;
    height: 20px;
    margin-right: 10px;
    background: #585858;
  }
  h3 {
    margin: 0;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    font-weight: 500;
    color: #818181;
  }
}
.dialog-content {
  // margin-top: 11px;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
  border-radius: 3px;
  .add-btn {
    padding-bottom: 20px;
  }
}
</style>