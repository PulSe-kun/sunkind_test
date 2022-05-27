<template>
  <a-modal
    v-model="showMaterialModal"
    :closable="false"
    centered
    :bodyStyle="{
      padding: '0px',
      width: '620px',
      height: '274px',
    }"
    :zIndex="1000"
    wrapClassName="invalid_dialog"
  >
    <div class="header" v-if="maintainItem">
      <span>{{ maintainItem.name }}</span>
      <a-icon type="close" @click="closeModal" />
    </div>
    <div class="footer" v-if="maintainItem">
      <a-descriptions :column="1">
        <a-descriptions-item label="适用设备类型" v-if="deviceTypeName">
          <span>{{ deviceTypeName | emptyValue }}</span>
        </a-descriptions-item>
        <a-descriptions-item :label="tableName + '内容'">
          <span>{{ maintainItem.content | emptyValue }}</span>
        </a-descriptions-item>

        <a-descriptions-item v-if="tableName == '保养'" label="保养方法">
          <span>{{ maintainItem.method | emptyValue }}</span>
        </a-descriptions-item>
        <a-descriptions-item v-if="tableName == '点检'" label="判定标准">
          <span>{{ maintainItem.criteria | emptyValue }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="图片说明">
          <span class="span-title" v-if="fileList.length == 0">暂无图片</span>
          <div>
            <img
              style="width: 102px; height: 102px; margin: 0 10px 5px 0"
              v-for="(image, i) in fileList"
              :key="i"
              :src="image.thumbUrl"
              :alt="image.name"
            />
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <span>{{ maintainItem.status | emptyValue }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="创建人">
          <span>{{ maintainItem.createUserName | emptyValue }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          <span>{{ maintainItem.createTime | emptyValue }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>
<script>
import { getDeviceData, getBatchImages } from '@/services/api'
export default {
  props: {
    maintainItem: {
      type: Object,
      default: {}
    },
    tableName: {
      type: String
    }
  },
  data() {
    return {
      fileList: [],
      devices: [],
      showMaterialModal: false,
      deviceTypeName: ''
    }
  },
  methods: {
    closeModal() {
      this.fileList = []
      this.devices = []
      this.deviceTypeName = ''
      // this.$parent.maintainItem = {};
      this.showMaterialModal = false
    }
  },
  watch: {
    showMaterialModal: {
      handler(newVal, oldVal) {
        if (newVal) {
          getDeviceData().then(res => {
            const { data } = res
            const result = data.rows
            if (result && result.length > 0) {
              this.devices = result
              this.devices.map(device => {
                if (device.id == this.maintainItem.typeId) {
                  this.deviceTypeName = device.name
                }
              })
            }
          })
          console.log(this.maintainItem)

          this.fileList = []
          if (this.maintainItem.attachmentSearchId) {
            getBatchImages(this.maintainItem.attachmentSearchId).then(res => {
              console.log(res)
              const { data } = res
              if (data.pictures && data.pictures.length > 0) {
                const list = []
                const images = data.pictures
                images.map(item => {
                  const image = {
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
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-modal {
  width: 620px !important;
  .header {
    position: relative;
    max-width: 620px;
    height: 67px;
    line-height: 67px;
    background: @theme-color;
    box-shadow: 0px 0px 5px 0px rgba(110, 110, 110, 0.36);
    padding-left: 20px;
    text-align: left;
    span {
      font-size: 18px;
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
    overflow: auto;
  }
}
/deep/.ant-modal-footer {
  display: none;
}
/deep/.ant-descriptions-row > td {
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
    font-family: 'SourceHanSansSC-Medium';
    color: #000000;
  }
}
</style>
