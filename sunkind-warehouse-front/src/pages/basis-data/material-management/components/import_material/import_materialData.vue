<template>
  <a-drawer
    :closable="false"
    placement="top"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog"
    :maskClosable="false"
  >
    <div class="header" @mousedown="isActive = false">
      <span>导入物料</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer" @mousedown="isActive = false">
      <div class="model" style="text-align: center" v-if="success">
        <div>本次导入成功：{{ materialData.successNum }}条，失败：0条</div>
        <a-button size="large" class="primary-style" type="primary" @click="uploadAgain" style="margin-top: 20px">继续导入</a-button>
      </div>
      <div class="model" v-if="!success">
        <div>
          本次导入成功：
          <span style="color: #67c23a">
            {{
            materialData.successNum
            }}
          </span>
          条，失败：
          <span style="color: #f56c6c">
            {{
            materialData.failNum
            }}
          </span>
          条，以下为失败数据：
        </div>
        <div class="table">
          <a-spin :spinning="spinning">
            <a-config-provider :locale="locale" v-if="dataList.length">
              <a-table
                :columns="columns"
                :data-source="dataList"
                :pagination="pagination"
                @change="handleChange"
                :scroll="{ y: 582 }"
                :rowKey="
                  (record, index) => {
                    return record.id;
                  }
                "
              >
                <template slot="title_slot">
                  <span style="margin-right: 8px">操作</span>
                  <a-dropdown :trigger="['click']" placement="bottomCenter" :visible="isActive">
                    <a
                      class="ant-dropdown-link"
                      @click="
                        (e) => {
                          e.preventDefault();
                          isActive = true;
                        }
                      "
                    >
                      <img style="width: 16px; height: 16px; margin-top: -3px" src="@/assets/img/More.png" alt />
                    </a>
                    <div class="more" slot="overlay">
                      <!-- <a-checkbox-group @change="onChange"> -->
                      <a-row>
                        <a-col
                          :span="24"
                          v-for="(item, index) in columnsAll"
                          :style="{
                            display:
                              item.dataIndex == 'operate' ? 'none' : 'block',
                          }"
                          :key="index"
                        >
                          <a-checkbox :checked="item.check" @change="onChange(item)">{{ item.title }}</a-checkbox>
                        </a-col>
                      </a-row>
                      <!-- </a-checkbox-group> -->
                      <div style="padding: 14px 0; text-align: center">
                        <a-button type="link" size="small" class="primary-a" style="color: #999" @click="reset">重置</a-button>
                        <a-button type="link" size="small" class="link-style primary-a" @click="sure">确定</a-button>
                      </div>
                    </div>
                  </a-dropdown>
                </template>
              </a-table>
            </a-config-provider>
            <Empty text="暂无数据" v-else />
          </a-spin>
        </div>
        <div style="text-align: right">
          <a-button size="large" style="margin-right: 20px" @click="give_up">放弃失败的数据</a-button>
          <a-upload name="file" :multiple="false" @change="changeFile" :fileList="fileList" :beforeUpload="beforeUpload">
            <a-button size="large" style="margin-right: 20px" :loading="uploading">重新导入失败的数据</a-button>
          </a-upload>
          <a-button class="primary-style" size="large" type="primary" @click="downloadFailData">下载失败数据</a-button>
        </div>
      </div>
    </div>
    <template>
      <a-modal
        v-model="del_visible"
        :closable="false"
        centered
        :bodyStyle="{
          padding: '0px',
          width: '530px',
          height: '274px',
        }"
        wrapClassName="state_dialog"
      >
        <div class="state_content">确认放弃失败数据？放弃后不可恢复！</div>
        <template slot="footer">
          <div class="footer_btn">
            <span style="color: #ed0000" @click="delData">确认放弃</span>
          </div>
          <div class="footer_btn">
            <span @click="del_visible = false">取消</span>
          </div>
        </template>
      </a-modal>
    </template>
  </a-drawer>
</template>
<script>
import { getToken } from '@/utils/auth'
import Empty from '@/components/Empty/index'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { unit } from '@/utils/utils'
import { matterfail, exportmatter, upload_matter } from '@/services/api_basis'
const columnsAll = [
  {
    title: '类型',
    dataIndex: 'matterType',
    check: true,
    align: 'center'
  },
  {
    title: '编码',
    dataIndex: 'matterCode',
    check: true,
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'matterName',
    check: true,
    align: 'center'
  },
  {
    title: '型号',
    dataIndex: 'matterMarking',
    check: true,
    align: 'center'
  },
  {
    title: '单位',
    dataIndex: '_matterUnit',
    check: true,
    align: 'center'
  },
  {
    title: '失败原因',
    dataIndex: 'matterErro',
    width: 300,
    ellipsis: true,
    check: true,
    align: 'center'
  },
  {
    width: 150,
    dataIndex: 'operate',
    scopedSlots: { title: 'title_slot', customRender: 'action' },
    align: 'center'
  }
]
export default {
  data() {
    return {
      visible: false,
      del_visible: false,
      uploading: false,
      fileList: [],
      success: false, //判断成功还是失败
      materialData: {
        failNum: 0,
        importNo: '',
        successNum: 0
      },
      spinning: false,
      isActive: false,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        defaultPageSize: 10, // 每页显示几条数据
        showSizeChanger: true, // 显示下拉选项（每页几条）
        showTotal: total => `共 ${total} 条数据`,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
      },
      columns: [],
      columnsAll
    }
  },
  components: {
    Empty
  },
  methods: {
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    /**重新导入失败的数据 */
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
        if (res.code == 0) {
          this.getData(res.data)
        }
      })
    },
    /**放弃失败的数据 */
    give_up() {
      this.del_visible = true
    },
    delData() {
      this.del_visible = false
      this.visible = false
    },
    /**重置表格 */
    reset() {
      let list = []
      for (let i = 0; i < this.columnsAll.length; i++) {
        this.columnsAll[i].check = true
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i])
        }
      }
      this.columns = list
      this.isActive = false
    },
    /**确定更改的表格 */
    sure() {
      let list = []
      for (let i = 0; i < this.columnsAll.length; i++) {
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i])
        }
      }
      this.columns = list
      this.isActive = false
    },
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        let list = []
        for (let i = 0; i < this.columnsAll.length; i++) {
          this.columnsAll[i].check = true
          if (this.columnsAll[i].check) {
            list.push(this.columnsAll[i])
          }
        }
        this.columns = list
      }
    },
    /**获取 */
    getData(data) {
      // console.log(1, data);
      this.materialData = data
      if (this.materialData.failNum > 0) {
        this.success = false
        let params = {
          page: this.pagination.current,
          limit: this.pagination.pageSize,
          importNo: this.materialData.importNo
        }
        this.matterfailData(params)
      } else {
        this.success = true
      }
    },
    handleChange(pagination) {
      // console.log(pagination);
      this.pagination = pagination
      let params = {
        page: this.pagination.current,
        limit: this.pagination.pageSize,
        importNo: this.materialData.importNo
      }
      this.matterfailData(params)
    },
    matterfailData(params) {
      this.spinning = true
      matterfail(params).then(res => {
        this.spinning = false
        console.log(res)
        if (res.code == 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i]['index'] = (this.pagination.current - 1) * this.pagination.pageSize + parseInt(i) + 1
            res.data.list[i]['_matterUnit'] = unit(res.data.list[i].matterUnit)
          }
          this.dataList = res.data.list
          this.pagination.total = res.data.total
        }
      })
    },
    /**下载失败的数据 */
    downloadFailData() {
      console.log(getToken())
      window.open(`/renren-admin/basicConfig/matterfail/export?importNo=${this.materialData.importNo}&token=${getToken()}`, '_blank')

      // let params = {
      //   importNo: this.materialData.importNo,
      // };
      // exportmatter(params).then((res) => {
      //   console.log(new Blob([data]));

      //   // if (res.code == 0) {
      //   //   this.isActive = false;
      //   //   this.visible = false;
      //   // }
      // });
    },
    /**重新导入失败的数据 */
    uploadAgain() {
      this.isActive = false
      this.visible = false
      this.$emit('uploadAgain')
    },
    onClose() {
      this.isActive = false
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
    max-width: 1040px;
    height: auto !important;
    background: #f5f4f4;
    border-radius: 5px;
    overflow: hidden;
    .ant-drawer-body {
      height: 100%;
      padding: 0;
      .header {
        position: relative;
        max-width: 1040px;
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
          .table {
            margin: 15px 0;
            border-radius: 5px;
            border: 1px solid #e6e6e6;
          }
        }
      }
    }
  }
}
.more {
  max-width: 150px;
  background: #ffffff;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  .ant-col-24 {
    height: 32px;
    line-height: 32px;
    padding-left: 12px;
  }
}
</style>
<style lang="less" scoped>
/deep/.ant-upload-list {
  display: none;
}
</style>
<style lang="less" scoped>
/deep/.ant-modal {
  max-width: 530px !important;
  max-height: 350px;
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