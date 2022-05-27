<template>
  <div>
    <div class="footer-title">
      <span></span>
      <h3>{{ tableName }}项</h3>
    </div>
    <div class="dialog-content">
      <div class="add-btn">
        <a-button class="default-style" @click="addOneColumn">添加一行</a-button>
      </div>

      <a-table :columns="maintainColumns" :data-source="detailData" :pagination="false" bordered :row-key="(record, index) => index">
        <span slot="name" slot-scope="text, record">
          <!-- <a-select
            label-in-value
            show-search
            allow-clear
            :filter-option="filterOption"
            option-filter-prop="children"
            style="width: 100%"
            option-label-prop="label"
            :default-value="{ key: record.id, label: record.name }"
          >-->
          <a-select
            label-in-value
            show-search
            :filter-option="filterOption"
            option-filter-prop="children"
            style="width: 100%"
            option-label-prop="label"
            :value="text"
          >
            <a-select-option
              v-for="(option, index) in maintainSelectData"
              :key="option.id"
              :label="option.name"
              :value="option.id"
              @click="handleSelectChange(index, record, option)"
            >{{ option.name }} &nbsp;&nbsp;&nbsp;&nbsp; {{ option.content }}</a-select-option>
          </a-select>
        </span>

        <span slot="action" class="action-btn" slot-scope="text, record, index">
          <a v-if="record.id !== '' && record.name !== ''" style="margin-right: 10px" @click="showMaintainDetail(index)">{{ tableName }}细节</a>
          <a @click="deleteMaintainDetail(index)">移除</a>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import { getMaintainSelect, getInspectionSelect } from '@/services/api'
export default {
  components: {},
  extends: {},
  props: ['tableName'],
  data() {
    return {
      detailData: [],
      maintainSelectData: [],
      maintainColumns: [
        {
          title: '行号',
          align: 'center',
          customRender: (text, record, index) => `${index + 1}`
        },
        {
          title: this.tableName + '项名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.tableName + '内容',
          dataIndex: 'content',
          key: 'content',
          align: 'center'
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted() {},
  computed: {},

  methods: {
    getData(list) {
      // console.log(list);
      if (this.tableName == '保养') {
        getMaintainSelect().then(res => {
          const { data } = res
          const result = data.rows
          this.maintainSelectData = []
          if (result && result.length > 0) {
            this.maintainSelectData = result
            console.log(JSON.parse(list))
            // this.detailData = JSON.parse(list);
            const _list = JSON.parse(list)
            for (let i = 0; i < _list.length; i++) {
              if (_list[i].id !== '' && _list[i].name !== '') {
                _list[i].name = {
                  key: _list[i].id,
                  label: _list[i].name
                }
              }
            }
            this.detailData = _list
          }
        })
      }
      if (this.tableName == '点检') {
        getInspectionSelect().then(res => {
          console.log(res)
          const { data } = res
          const result = data
          this.maintainSelectData = []
          if (result && result.length > 0) {
            this.maintainSelectData = result
            // this.detailData = JSON.parse(list);
            const _list = JSON.parse(list)
            for (let i = 0; i < _list.length; i++) {
              if (_list[i].id !== '' && _list[i].name !== '') {
                _list[i].name = {
                  key: _list[i].id,
                  label: _list[i].name
                }
              }
            }
            this.detailData = _list
          }
        })
      }
    },
    addOneColumn() {
      this.detailData.push({
        content: '',
        name: '',
        id: ''
      })
    },
    deleteMaintainDetail(index) {
      this.detailData.splice(index, 1)
      // this.$emit("update:detailData", this.detailData);
      this.$emit('getData', JSON.stringify(this.detailData))
    },
    handleSelectChange(index, record, option) {
      console.log(index, record, option)

      // index是select选中第几个，i是table第几列
      // 判断数据是否已经被选中
      const selectedId = this.maintainSelectData[index].id
      let flag = true
      this.detailData.map(item => {
        if (item.id == selectedId) {
          this.$message.error('已选择过该' + this.tableName + '项')
          flag = false
        }
      })
      if (flag) {
        record.id = option.id
        record.name = {
          key: option.id,
          label: option.name
        }
        record.content = option.content
        this.$emit('getData', JSON.stringify(this.detailData))
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    showMaintainDetail(index) {
      const id = this.detailData[index].id
      this.maintainSelectData.map((item, i) => {
        if (item.id == id) {
          this.$emit('showMaintainDetail', this.maintainSelectData[i])
        }
      })
    }
  }
}
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
  margin-top: 11px;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
  border-radius: 3px;
  .add-btn {
    padding-bottom: 20px;
  }
}
</style>
