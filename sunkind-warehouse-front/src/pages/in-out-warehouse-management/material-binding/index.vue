<template>
  <div class="material-binding">
    <a-steps :current="current" labelPlacement="vertical">
      <a-step title="扫描托盘" />
      <a-step title="绑定物料" />
    </a-steps>
    <div class="material-binding-content" v-if="current == 0">
      <a-input
        placeholder="请扫码或输入托盘条码"
        v-model="palletName"
        ref="input"
        @pressEnter="pressEnter"
        @focus="focusInput"
        style="width: 350px"
      />
    </div>
    <div class="material-binding-contents" v-if="current == 1">
      <div class="header">
        <div class="header-title" v-if="palletTitle">
          <span>{{ palletTitle.palletCode }}</span>
          <span style="margin-left: 15px; color: #999">{{
            palletTitle.palletName
          }}</span>
        </div>
        <div class="header-input">
          <a-select
            :allowClear="true"
            show-search
            :value="value"
            placeholder="请扫描或输入物料编码、名称、型号"
            style="width: 400px"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :autoFocus="true"
            @search="handleSearch"
            @change="handleChange_code"
          >
            <a-icon slot="suffixIcon" type="search" />
            <a-select-option v-for="d in data" :key="d.matterId">
              {{ d.extendA }}
            </a-select-option>
          </a-select>
          <!-- <a-select
            show-search
            :value="value"
            placeholder="请扫描或输入物料编码、名称、型号"
            style="width: 240px"
            :autoFocus="true"
            @search="handleSearch"
            @change="handleChange_code"
          >
            <a-select-option v-for="d in data" :key="d.matterCode">
              {{ d.extendA }}
            </a-select-option>
          </a-select> -->
        </div>
      </div>
      <div class="table">
        <a-spin :spinning="spinning">
          <a-config-provider :locale="locale" v-if="dataList.length">
            <a-table
              :rowKey="
                (record, index) => {
                  return record.matterId;
                }
              "
              :scroll="{ y: 162 }"
              :pagination="false"
              :columns="columns"
              :data-source="dataList"
            >
              <template slot="matterNum" slot-scope="text, item">
                <a-input-number
                  id="inputNumber"
                  v-model="item.matterNum"
                  :min="1"
                  :max="100000"
                />
              </template>
              <template slot="title_slot">
                <span style="margin-right: 8px">移除</span>
              </template>
              <template slot="action" slot-scope="text, item">
                <a @click="delmatter(item.matterId)" title="移除">
                  <img
                    style="width: 25px; height: 28px"
                    src="@/assets/img/remove.png"
                    alt=""
                  />
                </a>
              </template>
            </a-table>
          </a-config-provider>
          <a-empty description="暂无数据" v-else />
        </a-spin>
      </div>
    </div>
    <div class="material-binding-btn">
      <a-button class="btn-prev cancel-style" v-if="current == 1" @click="prev"
        >上一步</a-button
      >
      <a-button
        class="btn primary-style"
        v-if="current == 1"
        type="primary"
        @click="binding"
        >绑定</a-button
      >
      <a-button class="btn primary-style" v-else type="primary" @click="next"
        >下一步</a-button
      >
    </div>
  </div>
</template>

<script>
import {
  findPalletCode,
  getMatterbindings,
  getMatters,
  matterBindingNew,
} from "@/services/api_in_out";
import { unit } from "@/utils/utils";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
const columnsAll = [
  {
    title: "行号",
    dataIndex: "index",
    check: true,
    align: "center",
  },
  {
    title: "名称",
    dataIndex: "matterName",
    check: true,
    align: "center",
  },
  {
    title: "编码",
    dataIndex: "matterCode",
    check: true,
    align: "center",
  },
  {
    title: "型号",
    dataIndex: "matterMarking",
    check: true,
    align: "center",
  },
  {
    title: "数量",
    dataIndex: "matterNum",
    check: true,
    align: "center",
    scopedSlots: { customRender: "matterNum" },
  },
  {
    title: "单位",
    dataIndex: "_matterUnit",
    check: true,
    align: "center",
  },
  {
    width: 150,
    dataIndex: "operate",
    align: "center",
    scopedSlots: { title: "title_slot", customRender: "action" },
  },
];

export default {
  data() {
    return {
      timer: null,
      value: undefined,
      data: [],
      palletName: "",
      palletTitle: null,
      current: 0,
      spinning: false,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      dataList: [],
      columns: [],
      columnsAll,
    };
  },
  components: {},
  created() {},
  mounted() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.focusInput();
    }, 100);
  },
  methods: {
    focusInput() {
      // console.log("获取焦点");
      this.$refs.input.focus();
    },
    /**回车 */
    pressEnter() {
      // console.log("回车");
      this.next();
    },
    next() {
      if (this.palletName == "") {
        this.$message.warning("托盘条码不能为空！");
        return;
      }
      findPalletCode(this.palletName,2).then((res) => {
        // console.log(res);
        if (res.code == 0) {
          this.palletTitle = res.data;
          this.getMatterbindingsData(this.palletTitle.palletCode);
          this.current = 1;
          // this.$nextTick(function () {
          //   // this.$refs.selectInput.focus();
          //   console.log(document.getElementsByClassName('ant-select-search__field'))
          //   console.log(this.$refs.selectInput);
          // });
        }
      });
    },
    /**绑定物料 */
    binding() {
      for (let i = 0; i < this.dataList.length; i++) {
        this.dataList[i]["palletCode"] = this.palletTitle.palletCode;
        this.dataList[i]["palletId"] = this.palletTitle.palletId;
      }
      /** 绑定物料并返回自动匹配的料架和库位*/
      let params = {
        matterbindingDTOS: this.dataList,
        warehouseId: this.palletTitle.warehouseId,
      };
      matterBindingNew(params).then((res) => {
        // console.log(res);
        if (res.code === 0) {
          this.$message.success("物料绑定成功!");
          this.palletName = "";
          this.current = 0;
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.focusInput();
          }, 100);
        }
      });
    },
    /**获取绑定物料得数据 */
    getMatterbindingsData(palletCode) {
      let list = [];
      for (let i = 0; i < this.columnsAll.length; i++) {
        this.columnsAll[i].check = true;
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i]);
        }
      }
      this.columns = list;
      this.spinning = true;
      getMatterbindings(palletCode).then((res) => {
        console.log(res);
        this.spinning = false;
        let index = 1;
        for (let i = 0; i < res.data.length; i++) {
          res.data[i]["index"] = index++;
          res.data[i]["matterNum"] = res.data[i].matterNum;
          res.data[i]["_matterUnit"] = unit(res.data[i].matterUnit);
        }
        this.dataList = res.data;
      });
    },
    /**移除物料 */
    delmatter(matterId) {
      const dataList = [...this.dataList];
      this.dataList = dataList.filter((item) => item.matterId !== matterId);
    },
    /**查询物料 */
    handleSearch(value) {
      // console.log(1, value);
      getMatters(value).then((res) => {
        // console.log(res);
        this.data = res.data;
      });
    },
    /**选择物料 */
    handleChange_code(value) {
      // console.log(2, value);
      getMatters(value, "matterId").then((res) => {
        // console.log(res);
        let flag = true;
        // for (let i = 0; i < res.data.length; i++) {
        res.data[0]["_matterUnit"] = unit(res.data[0].matterUnit);
        for (let j = 0; j < this.dataList.length; j++) {
          if (res.data[0].matterId == this.dataList[j].matterId) {
            this.dataList[j].matterNum = this.dataList[j].matterNum + 1;
            flag = false;
          }
        }
        // }
        if (flag) {
          res.data[0]["index"] = this.dataList.length + 1;
          this.dataList.push(res.data[0]);
        }
        this.value = undefined;
        this.data = [];
      });
    },
    prev() {
      this.current = 0;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.focusInput();
      }, 100);
    },
  },
};
</script>

<style scoped lang="less">
.material-binding {
  height: 100%;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  overflow: auto;
  .ant-steps {
    // width: 917px;
    // height: ;
    padding: 75px 22.55% 114px 22.85%;
    // /deep/.ant-steps-item-icon {
    //   width: 65px;
    //   height: 65px;
    //   line-height: 65px;
    // }
    // /deep/.ant-steps-item-title {
    //   line-height: 65px;
    // }
  }
  .material-binding-content,
  .material-binding-contents {
    margin: 0 14.28% 179px 14.28%;
    height: 289px;
    background: #ffffff;
    border: 1px solid #cecece;
    border-radius: 3px;
  }
  .material-binding-content {
    display: flex;
    justify-content: center;
    align-items: center;
    .ant-input {
      font-size: 30px;
      font-weight: 400;
      border: none;
      box-shadow: none;
    }
  }
  .material-binding-contents {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-title {
        padding-top: 31px;
        padding-left: 34px;
        & > span {
          font-size: 22px;
          font-weight: 400;
          color: #000000;
        }
      }
      .header-input {
        padding-top: 23px;
        padding-right: 24px;
      }
    }
    .table {
      margin-top: 7px;
      /deep/.ant-table-tbody {
        color: #000;
        font-weight: 500;
      }
    }
  }
  .material-binding-btn {
    margin: 0 9.22% 0 11.9%;
    position: relative;
    .btn-prev {
      position: absolute;
      left: 0;
      top: 0;
    }
    .btn {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  // /deep/.ant-steps-item-title::after {
  //   top: 32px;
  // }
}
/deep/.ant-steps-item-process .ant-steps-item-icon {
  background: #385cef;
  border-color: #385cef;
}
/deep/.ant-steps-item-finish .ant-steps-item-icon {
  border-color: #385cef;
}
/deep/.ant-steps-item-icon {
  width: 65px;
  height: 65px;
  line-height: 65px;
  font-size: 25px;
}
/deep/.ant-steps-item-content {
  margin-left: 17px;
}
/deep/.ant-steps-label-vertical .ant-steps-item-tail {
  top: 28px;
  margin-left: 83px;
}
</style>
