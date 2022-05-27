<template>
  <div class="warehouse-management" @mousedown="isActive = false">
    <div class="header">
      <div>
        <ul>
          <li>
            <span>仓库信息：</span>
            <a-input placeholder="搜索仓库名称、备注" v-model="conditions" style="width: 280px" />
          </li>
        </ul>
      </div>
      <div>
        <a-button class="default-style" @click="queryData">查询</a-button>
      </div>
    </div>
    <div class="warehouse-management-table">
      <a-spin :spinning="spinning">
        <div class="table-btn">
          <a-button class="primary-style" type="primary" style="margin-right: 20px" @click="addwarehouse">新建仓库</a-button>
        </div>
        <a-config-provider :locale="locale" v-if="dataList.length">
          <a-table
            :columns="columns"
            :data-source="dataList"
            :pagination="pagination"
            @change="handleChange"
            :rowKey="
              (record, index) => {
                return record.warehouseId;
              }
            "
          >
            <template slot="warehouseType" slot-scope="text">
              <span v-if="text == 1">自动仓库</span>
              <span v-if="text == 2">半自动仓库</span>
              <span v-if="text == 3">普通仓库</span>
              <span v-if="text == 4">虚拟仓库</span>
            </template>
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
                  <img style="width: 16px; height: 16px; margin-top: -3px" src="../../../assets/img/More.png" alt />
                </a>
                <div class="more" slot="overlay">
                  <a-row>
                    <a-col
                      :span="24"
                      v-for="(item, index) in columnsAll"
                      :style="{
                        display: item.dataIndex == 'operate' ? 'none' : 'block',
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
            <template slot="action" slot-scope="text, item">
              <a class="primary-a link-style" @click="compile(item)">编辑</a>
            </template>
          </a-table>
        </a-config-provider>
        <Empty text="暂无数据" v-else />
      </a-spin>
    </div>
    <template>
      <NewAdd_dialog ref="newAdd_dialog" @refresh="refresh" />
      <Compile_dialog ref="compile_dialog" @refresh="refresh" :item="item" />
    </template>
  </div>
</template>

<script>
import { warehousePage } from '@/services/api_basis'
import Empty from '@/components/Empty/index'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { NewAdd_dialog, Compile_dialog } from './components/index'
const columnsAll = [
  {
    title: '行号',
    dataIndex: 'index',
    check: true,
    align: 'center'
  },
  {
    title: '仓库名称',
    dataIndex: 'warehouseName',
    check: true,
    align: 'center'
  },
  {
    title: '仓库类型',
    dataIndex: 'warehouseType',
    check: true,
    scopedSlots: { customRender: 'warehouseType' },
    align: 'center'
  },

  {
    title: '备注',
    dataIndex: 'warehouseRemark',
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
      item: null,
      conditions: '',
      isActive: false,
      treeData: [],
      locale: zhCN, // 国际化 设置成中文 www.itxst.com
      spinning: false,
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
    Empty,
    NewAdd_dialog,
    Compile_dialog
  },
  created() {
    const list = []
    for (let i = 0; i < this.columnsAll.length; i++) {
      this.columnsAll[i].check = true
      if (this.columnsAll[i].check) {
        list.push(this.columnsAll[i])
      }
    }
    this.columns = list
    this.$nextTick(function () {
      this.warehousePageData({
        conditions: this.conditions,
        order: 'desc',
        page: this.pagination.current,
        limit: this.pagination.pageSize
      })
    })
  },
  mounted() {},
  methods: {
    /** 查询数据 */
    queryData() {
      const params = {
        conditions: this.conditions,
        order: 'desc',
        page: this.pagination.current,
        limit: this.pagination.pageSize
      }
      // console.log(params);
      this.warehousePageData(params)
    },
    /** 重置表格 */
    reset() {
      const list = []
      for (let i = 0; i < this.columnsAll.length; i++) {
        this.columnsAll[i].check = true
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i])
        }
      }
      this.columns = list
      this.isActive = false
    },
    /** 确定更改的表格 */
    sure() {
      const list = []
      for (let i = 0; i < this.columnsAll.length; i++) {
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i])
        }
      }
      this.columns = list
      this.isActive = false
    },
    /** 新建仓库 */
    addwarehouse() {
      this.$refs.newAdd_dialog.visible = true
    },
    /** 编辑 */
    compile(item) {
      this.item = item
      this.$refs.compile_dialog.visible = true
    },
    /** 获取仓库数据 */
    warehousePageData(params) {
      this.spinning = true
      warehousePage(params).then(res => {
        this.spinning = false
        console.log(res)
        if (res.code == 0) {
          // console.log(this.pagination);
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i].index = (this.pagination.current - 1) * this.pagination.pageSize + parseInt(i) + 1
          }
          this.dataList = res.data.list
          this.pagination.total = res.data.total
        }
      })
    },
    onChange(item) {
      // console.log(check);
      item.check = !item.check
      this.$forceUpdate()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleChange(pagination) {
      // console.log(pagination);
      this.pagination = pagination
      const params = {
        conditions: this.conditions,
        order: 'desc',
        page: this.pagination.current,
        limit: this.pagination.pageSize
      }
      // console.log(params);
      this.warehousePageData(params)
    },
    refresh() {
      const params = {
        conditions: this.conditions,
        order: 'desc',
        page: this.pagination.current,
        limit: this.pagination.pageSize
      }
      // console.log(params);
      this.warehousePageData(params)
    }
  }
}
</script>

<style scoped lang="less">
.warehouse-management {
  height: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  .header {
    padding: 46px 22px 36px 21px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div:first-child {
      ul {
        margin: 0;
        padding: 0;
        li {
          list-style: none;
          float: left;
          margin-right: 60px;
          span:first-child {
            margin-right: 20px;
          }
        }
      }
    }
  }
  .warehouse-management-table {
    margin: 0 20px 20px 20px;
    border-radius: 5px;
    border: 1px solid #e6e6e6;
    .table-btn {
      padding: 21px 0 33px 30px;
      button {
        margin-right: 20px;
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
