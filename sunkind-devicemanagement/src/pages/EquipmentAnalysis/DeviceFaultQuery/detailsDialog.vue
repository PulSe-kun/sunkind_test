<template>
  <a-drawer
    :closable="false"
    placement="right"
    :zIndex="999"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog-right"
  >
    <div class="header">
      <div class="header-title">
        <span v-if="item">{{ item.cmName }}</span>
        <a-icon type="close" @click="onClose" />
      </div>
      <div class="header-state" v-if="item">{{ item.faultName }}</div>
      <div class="header-btn"></div>
    </div>
    <div class="footer">
      <div class="dialog-content">
        <div>
          <a-descriptions :column="1" v-if="item">
            <a-descriptions-item>
              <span title="设备编号" slot="label">设备编号</span>
              <span class="span-title" :title="item.cmNum">{{
                item.cmNum | emptyValue
              }}</span>
            </a-descriptions-item>
            <a-descriptions-item>
              <span title="设备名称" slot="label">设备名称</span>
              <span class="span-title">{{ item.cmName | emptyValue }}</span>
            </a-descriptions-item>

            <a-descriptions-item>
              <span title="使用部门" slot="label">使用部门</span>
              <span class="span-title">{{ item.deptName | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item>
              <span title="故障名称" slot="label">故障名称</span>
              <span class="span-title">{{ item.faultName | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item>
              <span title="故障等级" slot="label">故障等级</span>
              <span
                class="span-title"
                v-text="item.level == 1 ? '高' : '低'"
              ></span>
            </a-descriptions-item>
            <a-descriptions-item>
              <span title="故障代码" slot="label">故障代码</span>
              <span class="span-title">
                {{ item.faultType | emptyValue }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item>
              <span title="上报时间" slot="label">上报时间</span>
              <span class="span-title">{{ item.startTime | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item>
              <span title="恢复时间" slot="label">恢复时间</span>
              <span class="span-title">{{ item.endTime | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item>
              <span title="故障时长" slot="label">故障时长</span>
              <span class="span-title"
                >{{ item.consuming | emptyValue }}分钟</span
              >
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </div>
  </a-drawer>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  components: {},
  methods: {
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        // console.log(this.item);
        // this.findQualityInfoData();
      }
    },
    onClose() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.dialog-right {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /deep/.ant-drawer-content-wrapper {
    width: 100% !important;
    max-width: 620px;
    .ant-drawer-body {
      height: 100%;
      padding: 0;
      .header {
        display: block;
        padding: 20px;
        height: 100px;
        background: #2964ff;
        box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
        border-radius: 3px 3px 0px 0px;
        .header-title {
          position: relative;
          height: 20px;
          margin-bottom: 20px;
          span {
            font-size: 18px;
            color: #ffffff;
            line-height: 20px;
          }
          i {
            position: absolute;
            top: 3px;
            right: 0;
            color: #ffffff;
            font-size: 15px;
          }
        }
        .header-state {
          height: 20px;
          line-height: 20px;
          color: #fff;
          font-size: 16px;
        }
        .header-btn {
          height: 16px;
          display: flex;
          justify-content: flex-start;
          align-content: center;
          a {
            margin-right: 20px;
            display: flex;
            justify-items: flex-start;
            align-items: center;
            img {
              width: 16px;
              height: 16px;
              margin-right: 5px;
            }
            span {
              font-size: 16px;
              line-height: 16px;
              color: #ffffff;
            }
          }
        }
      }
      .footer {
        height: calc(100% - 100px);
        background: #f5f4f4;
        padding: 20px;
        // padding-top: 0;
        overflow: auto;
        .footer-title {
          padding-top: 21px;
          padding-bottom: 11px;
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
        .dialog-content,
        .dialog-contents {
          padding: 20px;
          background: #fff;
          box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
          border-radius: 3px;
          .ant-descriptions-row > td {
            line-height: 16px;
            padding: 0;
            padding-bottom: 18px !important;
            .ant-descriptions-item-label {
              span {
                display: inline-block;
                font-size: 16px;
                height: 16px;
                line-height: 16px;
                width: 100px;
                text-align: right;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }

            .ant-descriptions-item-content {
              display: inline-block;
              line-height: 16px;
              font-size: 16px;
              font-family: "SourceHanSansSC-Medium";
              color: #000000;
            }
          }
        }
        .dialog-contents {
          margin-bottom: 1px;
          padding: 20px 30px;
          .footer-icon {
            padding-bottom: 20px;
            img {
              width: 32px;
              height: 32px;
              vertical-align: bottom;
            }
            span {
              font-size: 20px;
              line-height: 32px;
              color: @theme-color;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
.span-title {
  width: 300px;
  height: 100%;
  vertical-align: top;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>