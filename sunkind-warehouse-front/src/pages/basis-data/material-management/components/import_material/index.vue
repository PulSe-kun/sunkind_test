<template>
  <a-drawer
    :closable="false"
    placement="top"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog"
    :maskClosable="false"
  >
    <div class="header">
      <span>导入物料</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <div class="models">
          <div class="models-header">
            <img src="../../../../../assets/img/download_icon.png" alt />
            <h3>第一步，下载EXCEL模板，整理数据</h3>
          </div>
          <div class="models-footer">
            <a-button @click="downloadExcel">
              <img src="../../../../../assets/img/download_btn.png" alt />
              下载模板
            </a-button>
            <div>（如已下载过模板请忽略）</div>
          </div>
        </div>
        <div class="models">
          <div class="models-header">
            <img src="../../../../../assets/img/download_icon.png" alt />
            <h3>第二步，选择已整理好的EXCEL，导入数据</h3>
          </div>
          <div class="models-footers">
            <a-upload
              name="file"
              :multiple="false"
              @change="changeFile"
              :fileList="fileList"
              :remove="handleRemove"
              :beforeUpload="beforeUpload"
            >
              <a-button class="primary-style" type="primary" :loading="uploading">开始导入</a-button>
            </a-upload>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>
<script>
import { upload_matter } from '@/services/api_basis'
export default {
  data() {
    return {
      visible: false,
      uploading: false,
      fileList: []
    }
  },
  methods: {
    afterVisibleChange(val) {},
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    changeFile(info) {
      // console.log(info, this.fileList);
      // 上传文件
      if (info.fileList.length > 0) {
        const formData = new FormData()
        formData.append('file', info.file)
        this.saveFile(formData)
      }
    },
    saveFile(formData) {
      this.uploading = true
      upload_matter(formData).then(res => {
        this.uploading = false
        // console.log(res);
        this.fileList = []
        this.visible = false
        if (res.code == 0) {
          this.$emit('import_materialData', res.data)
        }
      })
    },
    /**下载excel模板 */
    downloadExcel() {
      window.open('./static/matterImport.xlsx', '_blank')
    },
    onClose() {
      this.fileList = []
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.dialog {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /deep/.ant-drawer-content-wrapper {
    max-width: 620px;
    height: auto !important;
    background: #f5f4f4;
    border-radius: 5px;
    overflow: hidden;
    .ant-drawer-body {
      height: 100%;
      padding: 0;
      .header {
        position: relative;
        max-width: 620px;
        height: 67px;
        line-height: 67px;
        background: #2964ff;
        box-shadow: 0px 0px 5px 0px rgba(110, 110, 110, 0.36);
        padding-left: 20px;
        text-align: left;
        span {
          font-size: 22px;
          font-weight: 500;
          color: #ffffff;
        }
        i {
          position: absolute;
          top: 29px;
          right: 20px;
          font-size: 15px;
          color: #fff;
          cursor: pointer;
        }
      }
      .footer {
        background: #f5f4f4;
        padding: 20px;
        max-height: 863px;
        overflow: auto;
        .model {
          background: #ffffff;
          box-shadow: -2px 2px 7px 0px rgba(179, 179, 179, 0.4);
          border-radius: 5px;
          padding: 30px 20px;
          .models {
            margin-bottom: 50px;
            .models-header {
              height: 18px;
              margin-bottom: 30px;
              img {
                float: left;
                width: 18px;
                height: 18px;
                margin-right: 10px;
              }
              h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 500;
                color: #000000;
                line-height: 18px;
              }
            }
            .models-footer {
              padding-left: 28px;
              > .ant-btn {
                float: left;
                width: 110px;
                height: 34px;
                border-radius: 2px;
                border: 1px solid #cb9657;
                color: #cb9657;
                img {
                  width: 16px;
                  height: 16px;
                  margin-right: 5px;
                }
                span {
                  vertical-align: middle;
                }
              }
              > .ant-btn:hover {
                color: #cb9657;
              }
              > div {
                margin-left: 120px;
                font-size: 14px;
                font-weight: 400;
                color: #999999;
                line-height: 34px;
              }
            }
            .models-footers {
              padding-left: 28px;
              > .ant-btn {
                width: 110px;
                height: 40px;
              }
              .ant-upload-list-item-card-actions {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
