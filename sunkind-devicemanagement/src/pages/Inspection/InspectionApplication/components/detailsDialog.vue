<template>
  <a-drawer
    :closable="false"
    placement="right"
    :zIndex="999"
    width="620"
    :visible="visible"
    wrapClassName="dialog-right"
    :mask="false"
  >
    <div class="header">
      <div class="header-title">
        <span v-if="item">{{
          item.cmName + " " + item.cmNum + " " + item.deptName
        }}</span>
        <a-icon type="close" @click="onClose" />
      </div>
      <div class="header-state" v-if="item">
        <span>{{ item.status }}</span>
      </div>
      <div class="header-btn" v-if="item">
        <a @click="editor(item)" v-if="item.status == '待处理'">
          <img src="../../../../assets/img/editor.png" alt="" />
          <span>作废</span>
        </a>
      </div>
    </div>
    <div class="footer" v-if="item">
      <maintain-items
        :detail-data="drawerDetailData"
        @showDeviceDetail="showDeviceDetail"
        tableName="点检"
      ></maintain-items>
      <div class="footer-title">
        <span></span>
        <h3>处理信息</h3>
      </div>
      <div class="dialog-content" v-if="activities.length > 0">
        <div v-for="deal in activities" :key="deal.id">
          <div class="deal-div">
            <div class="deal-avator">
              {{
                deal.createUserName.substring(
                  deal.createUserName.length - 2,
                  deal.createUserName.length
                )
              }}
            </div>

            <div class="deal-detail">
              <p class="deal-name">{{ deal.createUserName }}</p>
              <p class="deal-time">{{ deal.updateTime }}</p>
              <p>处理结果：{{ deal.extension.result }}</p>
              <div v-if="deal.extension.result == '已点检'">
                <p v-if="deal.extension.finishDate">
                  完工日期：{{ deal.extension.finishDate }}
                </p>
                <p v-if="deal.extension.workingHours">
                  点检工时：{{ deal.extension.workingHours }}小时
                </p>
                <p v-if="deal.extension.note">
                  备注：{{ deal.extension.note }}
                </p>
                <div
                  v-if="
                    deal.extension.maintainItems &&
                    deal.extension.maintainItems.length > 0
                  "
                >
                  <div
                    v-for="maintainItem in deal.extension.maintainItems"
                    :key="maintainItem.id"
                  >
                    <p>
                      <span
                        style="margin-left: 50px"
                        v-if="maintainItem.note_value"
                        >{{ maintainItem.note_value }}</span
                      >
                    </p>
                  </div>
                </div>
                <a-row class="basic-info">
                  <a-col :span="3">图片：</a-col>
                  <a-col :span="21" v-if="deal.attachment">
                    <div>
                      <img
                        style="
                          width: 102px;
                          height: 102px;
                          margin: 0 10px 5px 0;
                          cursor: pointer;
                        "
                        v-for="(image, i) in deal.pictures"
                        :key="i"
                        :src="'data:image/png;base64,' + image.previewImage"
                        @click="watchViewImg(i, deal.pictures)"
                      />
                    </div>
                  </a-col>

                  <a-col :span="16" v-else>-</a-col>
                </a-row>
              </div>

              <div v-if="deal.extension.result == '转办'">
                <p v-if="deal.extension.userName">
                  转办给：{{ deal.extension.userName }}
                </p>

                <p v-if="deal.extension.note">
                  备注：{{ deal.extension.note }}
                </p>
              </div>

              <div
                v-if="
                  deal.extension.result == '无需点检' ||
                  deal.extension.result == '作废'
                "
              >
                <p v-if="deal.extension.note">
                  {{ deal.extension.result }}原因：{{ deal.extension.note }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-content" v-else>
        <Empty text="暂无数据" />
      </div>

      <div class="footer-title">
        <span></span>
        <h3>基本信息</h3>
      </div>
      <div class="dialog-content">
        <div>
          <a-descriptions :column="1">
            <a-descriptions-item label="点检单号">
              <span>{{ item.checkoutNo | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="来源">
              <span>{{ item.taskType == 0 ? "计划生成" : item.source }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="计划单号" v-if="item.sourceId">
              <span>{{ item.sourceId }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="点检人">
              <span>{{ item.userName | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              <span>{{ item.createTime | emptyValue }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
      <maintain-modal
        ref="maintainModel"
        :maintainItem="maintainItem"
        tableName="点检"
      ></maintain-modal>
    </div>
  </a-drawer>
</template>
<script>
import MaintainItems from "@/components/MaintainItems.vue";
import MaintainModal from "@/components/MaintainModal.vue";
import { getActivities } from "@/services/api";
import Empty from "@/components/Empty/index";
export default {
  data() {
    return {
      visible: false,
      item: null,
      maintainItem: {},
      drawerDetailData: [],
      activities: [],
    };
  },
  components: { MaintainItems, MaintainModal, Empty },
  methods: {
    //查看图片
    watchViewImg(i, pictures) {
      // console.log(i, pictures);
      this.$parent.watchViewImg(i, JSON.stringify(pictures));
    },
    afterVisibleChange(item) {
      console.log(item);
      this.visible = true;
      this.item = item;
      this.drawerDetailData = item.cmCheckouts;
      //获取处理节点信息
      getActivities(item.id).then((res) => {
        if (res.status == 200) {
          let { data } = res;
          if (data.rows && data.rows.length > 0) {
            let count = 0;
            data.rows.map((v, i) => {
              v.extension = JSON.parse(v.extension);
              count = count + 1;
              if (count == data.rows.length) {
                this.activities = data.rows;
              }
            });
            return;
          }
          this.activities = [];
        }
      });
    },
    /**编辑 */
    editor(item) {
      this.visible = false;
      this.$parent.compile(item);
    },
    del(item) {
      this.visible = false;
      this.$parent.del_device(item.id);
    },
    showDeviceDetail(index) {
      let obj = {};
      obj = JSON.parse(JSON.stringify(this.drawerDetailData[index]));
      obj.status = this.$utils.getStateName("status", obj.status);
      this.maintainItem = obj;
      this.$refs.maintainModel.showMaterialModal = true;
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
    // width: 100% !important;
    // max-width: 620px;
    .ant-drawer-body {
      height: 100%;
      padding: 0;
      .header {
        padding: 20px;
        height: 146px;
        background: #2964ff;
        box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
        border-radius: 3px 3px 0px 0px;
        .header-title {
          position: relative;
          height: 20px;
          margin-bottom: 10px;
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
          margin-bottom: 30px;
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
        height: calc(100% - 146px);
        background: #f5f4f4;
        padding: 20px;
        padding-top: 0;
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
              float: left;
              display: inline-block;
              font-size: 16px;
              height: 16px;
              line-height: 16px;
              width: 130px;
              text-align: right;
            }
            .ant-descriptions-item-content {
              margin-left: 130px;
              display: block;
              // height: 16px;
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
.deal-div {
  display: flex;
  flex-direction: row;
  padding: 20px 0;
  margin-bottom: 1px;
  background: #fff;
  .deal-avator {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background: #79a3ff;
    color: #fff;
    font-size: 16px;
    line-height: 55px;
    text-align: center;
    margin: 0 6.5%;
  }

  .deal-detail {
    font-size: 16px;
    line-height: 24px;
    color: #000;
    margin: 0 0 10px 0;
    flex: 1;
    .deal-name {
      font-size: 18px;
      line-height: 27px;
      margin: 0 0 10px 0;
    }

    .deal-time {
      color: #bfbfbf;
      margin: 0 0 15px 0;
    }

    p:last-child {
      margin: 0;
    }
  }
}
</style>
<style lang="less" scoped>
.preview {
  width: 102px;
  height: 102px;
  margin: 0 10px 5px 0;
}
</style>