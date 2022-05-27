<template>
  <div class="material-unbundling">
    <a-steps :current="current" labelPlacement="vertical">
      <a-step title="扫描托盘" />
      <a-step title="解绑物料" />
    </a-steps>
    <div class="material-unbundling-content" v-if="current == 0">
      <a-input
        placeholder="请扫码或输入托盘条码"
        v-model="palletName"
        ref="input"
        @pressEnter="pressEnter"
        @focus="focusInput"
        style="width: 350px"
      />
    </div>
    <div class="material-unbundling-contents" v-if="current == 1">
      <div class="header">
        <div class="header-title" v-if="palletTitle">
          <span>{{ palletTitle.palletCode }}</span>
          <span style="margin-left: 15px; color: #999">{{
            palletTitle.palletName
          }}</span>
        </div>
      </div>
      <div class="table">
        <a-spin :spinning="spinning">
          <a-config-provider :locale="locale" v-if="dataList.length">
            <a-table
              :rowKey="
                (record, index) => {
                  return record.matterbindingId;
                }
              "
              :scroll="{ y: 162 }"
              :pagination="false"
              :columns="columns"
              :data-source="dataList"
              :row-selection="rowSelection"
            >
              <template slot="matterNum" slot-scope="text, item">
                <a-input-number
                  id="inputNumber"
                  v-model="item.untieNum"
                  :min="0"
                  :max="item._matterNum"
                  :disabled="item.check"
                  @change="changeCheck"
                />
              </template>
            </a-table>
          </a-config-provider>
          <a-empty description="暂无数据" v-else />
        </a-spin>
      </div>
    </div>
    <div class="material-unbundling-btn">
      <a-button class="btn-prev cancel-style" v-if="current == 1" @click="prev"
        >上一步</a-button
      >
      <div class="btn" v-if="current == 1">
        <span style="margin-right: 10px"
          >已选：{{ changeObj.count }}种，合计{{ changeObj.sum }} 件</span
        >
        <a-button class="primary-style" type="primary" @click="unbundling"
          >解绑</a-button
        >
      </div>
      <a-button class="btn primary-style" v-else type="primary" @click="next"
        >下一步</a-button
      >
    </div>
  </div>
</template>

<script>
import {
  getMatterbindings,
  findPalletCode,
  unbundling,
} from "@/services/api_in_out";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
const columnsAll = [
  {
    title: "物料名称",
    dataIndex: "matterName",
    check: true,
    align: "center",
  },
  {
    title: "物料型号",
    dataIndex: "matterMarking",
    check: true,
    align: "center",
  },
  {
    title: "物料编码",
    dataIndex: "matterCode",
    check: true,
    align: "center",
  },
  {
    title: "现有数量",
    dataIndex: "_matterNum",
    check: true,
    align: "center",
  },
  {
    title: "解绑数量",
    dataIndex: "matterNum",
    check: true,
    scopedSlots: { customRender: "matterNum" },
    align: "center",
  },
];

export default {
  data() {
    return {
      palletName: "",
      current: 0,
      palletTitle: null,
      spinning: false,
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      dataList: [],
      columns: [],
      columnsAll,
      changeObj: {
        count: 0,
        sum: 0,
      },
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          let _this = this;
          // console.log(selectedRowKeys, selectedRows);
          if (selectedRows.length == _this.dataList.length) {
            for (let i = 0; i < selectedRows.length; i++) {
              selectedRows[i].check = false;
              // selectedRows[i].untieNum = selectedRows[i].matterNum;
            }
            this.$nextTick(function () {
              _this.changeData();
            });
          } else {
            if (selectedRows.length > 0) {
              for (let i = 0; i < _this.dataList.length; i++) {
                _this.dataList[i].check = true;
                // _this.dataList[i].untieNum = 0;
                _this.$forceUpdate();
              }
              for (let i = 0; i < selectedRows.length; i++) {
                selectedRows[i].check = false;
                // selectedRows[i].untieNum = selectedRows[i].matterNum;
              }
              this.$nextTick(function () {
                _this.changeData();
              });
            } else if (selectedRows.length == 0) {
              for (let i = 0; i < _this.dataList.length; i++) {
                _this.dataList[i].check = true;
                // _this.dataList[i].untieNum = 0;
                _this.$forceUpdate();
              }
              this.$nextTick(function () {
                _this.changeData();
              });
            }
          }
        },
      };
    },
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
    /**改变数据 */
    changeData() {
      // console.log(this.dataList);
      let count = 0,
        sum = 0;
      for (let i = 0; i < this.dataList.length; i++) {
        if (!this.dataList[i].check) {
          count++;
          sum += this.dataList[i].untieNum;
        }
      }
      // console.log(count, sum);
      this.changeObj = {
        count: count,
        sum: sum,
      };
    },
    changeCheck() {
      this.$nextTick(function () {
        this.changeData();
      });
    },
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
      this.changeObj = {
        count: 0,
        sum: 0,
      };
      if (this.palletName == "") {
        this.$message.warning("托盘条码不能为空！");
        return;
      }
      findPalletCode(this.palletName,3).then((res) => {
        // console.log(res);
        if (res.code == 0) {
          this.palletTitle = res.data;
          this.getMatterbindingsData(this.palletTitle.palletCode);
          this.current = 1;
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
        for (let i = 0; i < res.data.length; i++) {
          res.data[i]["_matterNum"] = res.data[i].matterNum;
          res.data[i].untieNum = res.data[i].matterNum;
          res.data[i]["check"] = true;
        }
        this.dataList = res.data;
      });
    },
    /**解绑 */
    unbundling() {
      let list = [];
      let flag = false;
      for (let i = 0; i < this.dataList.length; i++) {
        if (!this.dataList[i].check) {
          list.push(this.dataList[i]);
          flag = true;
        }
      }
      if (flag) {
        // console.log(params);
        unbundling(list).then((res) => {
          // console.log(res);
          if (res.code === 0) {
            this.$message.success("物料以解绑");
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
      } else {
        this.$message.warning("请先勾选需要解绑的物料！");
      }
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
.material-unbundling {
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
  .material-unbundling-content,
  .material-unbundling-contents {
    margin: 0 14.28% 179px 14.28%;
    height: 289px;
    background: #ffffff;
    border: 1px solid #cecece;
    border-radius: 3px;
  }
  .material-unbundling-content {
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
  .material-unbundling-contents {
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
    }
    .table {
      margin-top: 7px;
    }
  }
  .material-unbundling-btn {
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
