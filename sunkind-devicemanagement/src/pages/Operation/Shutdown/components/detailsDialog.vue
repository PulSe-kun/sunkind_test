<template>
  <a-drawer :closable="false" placement="right" :zIndex="999" width="620" :visible="visible" wrapClassName="dialog-right" :mask="false">
    <div class="header">
      <div class="header-title">
        <span v-if="item">
          {{
          item.cmName + " " + item.cmNum + " " + item.deptName
          }}
        </span>
        <a-icon type="close" @click="onClose" />
      </div>
      <div class="header-state"></div>
      <div class="header-btn" v-if="item && activeKey == '0'">
        <a @click="editor(item)">
          <img src="../../../../assets/img/power-on.png" alt />
          <span>开机</span>
        </a>
      </div>
    </div>
    <div class="footer" v-if="item">
      <div class="footer-title">
        <span></span>
        <h3>停机信息</h3>
      </div>
      <div class="dialog-content">
        <div>
          <a-descriptions :column="1" v-if="item">
            <a-descriptions-item label="停机原因">
              <span>{{ item.downtimeReasons | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="计划结束时间">
              <span>{{ item.planEndTime | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="计划停机时长">
              <span>{{ item.plannedDowntime | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="备注">
              <span>{{ item.note | emptyValue }}</span>
            </a-descriptions-item>

            <a-descriptions-item label="图片">
              <span class="span-title" v-if="fileList.length == 0">暂无图片</span>
              <div>
                <img
                  style="
                    width: 102px;
                    height: 102px;
                    margin: 0 10px 5px 0;
                    cursor: pointer;
                  "
                  v-for="(image, i) in fileList"
                  :key="i"
                  :src="image.thumbUrl"
                  :alt="image.name"
                  @click="watchViewImg(i, fileList)"
                />
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="停机单号">
              <span>{{ item.runNo | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="操作人">
              <span>{{ item.createUserName | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="操作时间">
              <span>{{ item.createTime | emptyValue }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>

      <div class="footer-title">
        <span></span>
        <h3>开机信息</h3>
      </div>
      <div class="dialog-content">
        <div>
          <a-descriptions :column="1">
            <a-descriptions-item label="实际开机时间">
              <span>{{ item.bootTime | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="实际停机时长">
              <span>{{ item.outageTime | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="操作人">
              <span>{{ item.updateUserName | emptyValue }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="操作时间">
              <span>{{ item.createTime | emptyValue }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </div>
  </a-drawer>
</template>
<script>
import { getBatchImages } from '@/services/api'
export default {
  data() {
    return {
      visible: false,
      item: {},
      fileList: [],
      activeKey: ''
    }
  },
  methods: {
    //查看图片
    watchViewImg(i, pictures) {
      console.log(i, pictures)
      this.$parent.watchViewImg(i, JSON.stringify(pictures))
    },
    afterVisibleChange(activeKey, item) {
      this.activeKey = activeKey
      this.visible = true
      // console.log(item);
      this.item = item
      this.fileList = []
      if (this.item.attachmentSearchId) {
        getBatchImages(this.item.attachmentSearchId).then(res => {
          console.log(res)
          let { data } = res
          if (data.pictures && data.pictures.length > 0) {
            let list = []
            let images = data.pictures
            images.map(item => {
              let image = {
                name: item.name,
                uid: item.id,
                id: item.id,
                type_value: true,
                thumbUrl: 'data:image/png;base64,' + item.previewImage
              }
              list.push(image)
            })
            this.fileList = list
          }
        })
      }
    },
    /**编辑 */
    editor(item) {
      this.visible = false
      this.$parent.editor(item)
    },
    onClose() {
      this.visible = false
    }
  }
}
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
        height: 100px;
        background: #2964ff;
        box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
        border-radius: 3px 3px 0px 0px;
        .header-title {
          position: relative;
          height: 20px;
          // margin-bottom: 10px;
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
          // margin-bottom: 30px;
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
              font-weight: bold;
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