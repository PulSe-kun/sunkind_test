<template>
  <a-config-provider :locale="locale">
    <a-table :columns="columns" :data-source="dataList" :pagination="pagination" @change="handleChange">
      <div
        slot="filterDropdown"
        slot-scope="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
        style="padding: 8px"
      >
        <a-input
          :placeholder="`按${column.title}筛选`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="
            (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
          "
          @pressEnter="
            () => handleSearch(selectedKeys, confirm, column.dataIndex)
          "
        />
        <a-button
          class="primary-style"
          type="primary"
          size="small"
          style="width: 80px; margin-right: 20px"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >筛选</a-button>
        <a-button class="primary-style" size="small" style="width: 80px" @click="() => handleReset(clearFilters)">重置</a-button>
      </div>
      <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#108ee9' : undefined }" />
    </a-table>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
const dataList = [
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  },
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  },
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  },
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  },
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  },
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  },
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  },
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  },
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  },
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  },
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  },
  {
    goods: '名称',
    type: 'xxx',
    quantity: 'yyy',
    price: '1111',
    rest: '123',
    creater: '11111',
    createTime: '123321'
  }
]
// const columns = [
//   {
//     title: "货品名称",
//     dataIndex: "goods",
//     scopedSlots: {
//       filterDropdown: "filterDropdown",
//       filterIcon: "filterIcon",
//       customRender: "goods",
//     },
//     onFilter: (value, record) =>
//       record.goods.toString().toLowerCase().includes(value.toLowerCase()),
//   },
//   {
//     title: "所属品种",
//     dataIndex: "type",
//     filters: {},
//     onFilter: (value, record) => {
//       return record.type && record.type.indexOf(value) === 0;
//     },
//   },
//   {
//     title: "进货数量",
//     dataIndex: "quantity",
//     sorter: (a, b) => a.quantity - b.quantity,
//   },
//   { title: "单价", dataIndex: "price" },
//   { title: "剩余数量", dataIndex: "rest" },
//   { title: "创建者", dataIndex: "creater" },
//   { title: "创建日期", dataIndex: "createTime" },
// ];
export default {
  data() {
    return {
      locale: zhCN, // 国际化 设置成中文 www.itxst.com
      dataList,
      loading: true,
      pagination: {
        total: 0,
        defaultPageSize: 1, // 每页显示几条数据
        showSizeChanger: true, // 显示下拉选项（每页几条）
        showTotal: total => `共 ${total} 条数据`,
        pageSizeOptions: ['1', '20', '30', '50', '100'],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
      }
    }
  },
  computed: {
    columns() {
      const columns = [
        {
          title: '货品名称',
          dataIndex: 'goods',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'goods'
          },
          onFilter: (value, record) => record.goods.toString().toLowerCase().includes(value.toLowerCase())
        },
        {
          title: '所属品种',
          dataIndex: 'type',
          onFilter: (value, record) => {
            return record.type && record.type.indexOf(value) === 0
          }
        },
        {
          title: '进货数量',
          dataIndex: 'quantity',
          sorter: (a, b) => a.quantity - b.quantity
        },
        { title: '单价', dataIndex: 'price' },
        { title: '剩余数量', dataIndex: 'rest' },
        { title: '创建者', dataIndex: 'creater' },
        { title: '创建日期', dataIndex: 'createTime' }
      ]
      return columns
    }
  },
  methods: {
    handleChange(pagination) {
      console.log(pagination)
      // const pager = { ...this.pagination };
      // pager.current = pagination.current;
      // pager.pageSize = pagination.pageSize;
      // this.pagination = pager;
    }
  }
}
</script>
