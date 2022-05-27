<template>
  <div class="tray-management" @mousedown="isActive = false">
    <div class="header">
      <div>
        <ul>
          <li>
            <span>托盘信息：</span>
            <a-input
              placeholder="搜索托盘编码、名称"
              v-model="palletInfo"
              style="width: 280px"
            />
          </li>
          <li>
            <span>托盘类型:</span>
            <a-select
              show-search
              placeholder="请选择托盘类型"
              option-filter-prop="children"
              style="width: 280px"
              :filter-option="filterOption"
              v-model="palletTypeId"
            >
              <a-select-option
                v-for="item in palletTypeList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </li>
        </ul>
      </div>
      <div>
        <a-button
          class="primary-style"
          type="primary"
          style="margin-right: 20px"
          @click="resetData"
          >重置</a-button
        >
        <a-button class="default-style" @click="queryData">查询</a-button>
      </div>
    </div>
    <div class="tray-management-table">
      <div class="table-btn">
        <a-button
          class="primary-style"
          type="primary"
          style="margin-right: 20px"
          @click="add"
          >新建托盘</a-button
        >
        <a-button
          class="primary-style"
          type="primary"
          style="margin-right: 20px"
          @click="print_more"
          >批量打印标签</a-button
        >
      </div>
      <a-spin :spinning="spinning">
        <a-config-provider :locale="locale" v-if="dataList.length">
          <a-table
            :columns="columns"
            :data-source="dataList"
            :pagination="pagination"
            :row-selection="rowSelection"
            @change="handleChange"
            :rowKey="
              (record, index) => {
                return record.palletId;
              }
            "
          >
            <template slot="palletType" slot-scope="text">
              <span v-if="text == 1">平托盘</span>
              <span v-if="text == 2">柱式托盘</span>
              <span v-if="text == 3">箱式托盘</span>
              <span v-if="text == 4">轮式托盘</span>
              <span v-if="text == 5">专用托盘</span>
            </template>
            <template slot="title_slot">
              <span style="margin-right: 8px">操作</span>
              <a-dropdown
                :trigger="['click']"
                placement="bottomCenter"
                :visible="isActive"
              >
                <a
                  class="ant-dropdown-link"
                  @click="
                    (e) => {
                      e.preventDefault();
                      isActive = true;
                    }
                  "
                >
                  <img
                    style="width: 16px; height: 16px; margin-top: -3px"
                    src="../../../assets/img/More.png"
                    alt=""
                  />
                </a>
                <div class="more" slot="overlay">
                  <!-- <a-checkbox-group @change="onChange"> -->
                  <a-row>
                    <a-col
                      :span="24"
                      v-for="(item, index) in columnsAll"
                      :style="{
                        display: item.dataIndex == 'operate' ? 'none' : 'block',
                      }"
                      :key="index"
                    >
                      <a-checkbox
                        :checked="item.check"
                        @change="onChange(item)"
                        >{{ item.title }}</a-checkbox
                      >
                    </a-col>
                  </a-row>
                  <!-- </a-checkbox-group> -->
                  <div style="padding: 14px 0; text-align: center">
                    <a-button
                      type="link"
                      size="small"
                      class="primary-a"
                      style="color: #999"
                      @click="reset"
                      >重置</a-button
                    >
                    <a-button
                      type="link"
                      size="small"
                      class="link-style primary-a"
                      @click="sure"
                      >确定</a-button
                    >
                  </div>
                </div>
              </a-dropdown>
            </template>
            <template slot="action" slot-scope="text, item">
              <a
                class="primary-a link-style"
                style="margin-right: 20px"
                @click="compile(item)"
                >编辑</a
              >
              <a class="primary-a link-style" @click="print_one(item)">打印</a>
            </template>
          </a-table>
        </a-config-provider>
        <Empty text="暂无托盘" v-else />
      </a-spin>
    </div>
    <template>
      <NewAdd_dialog ref="newAdd_dialog" @refresh="refresh" />
      <Compile_dialog ref="compile_dialog" @refresh="refresh" :item="item" />
      <!-- 托盘单个打印 -->
      <iframe
        ref="printIframe"
        frameborder="0"
        scrolling="no"
        style="margin: 0px; padding: 0px; width: 0px; height: 0px"
      >
        <div style="display: none" ref="odiv">
          <p style="text-align: center; font-size: 14px; margin: 0; padding: 0">
            {{ palletName }}
          </p>
          <svg id="prt1" />
        </div>
      </iframe>
      <!-- 多个打印 -->
      <iframe
        ref="printIframeMulti"
        frameborder="0"
        scrolling="no"
        style="margin: 0px; padding: 0px; width: 0px; height: 0px"
      >
        <div id="printArea" style="display: none" ref="odivMulti"></div>
      </iframe>
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
        <div class="state_content" v-if="item">
          {{ item.palletName }}{{ content }}，无法编辑
        </div>
        <template slot="footer">
          <div class="footer_btn">
            <a-button
              class="primary-style"
              type="primary"
              @click="del_visible = false"
              >确认</a-button
            >
          </div>
        </template>
      </a-modal>
    </template>
  </div>
</template>

<script>
import jsbarcode from "jsbarcode";
import { palletPage } from "@/services/api_basis";
import Empty from "@/components/Empty/index";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { NewAdd_dialog, Compile_dialog } from "./components/index";
const columnsAll = [
  {
    title: "行号",
    dataIndex: "index",
    check: true,
    align: "center",
  },
  {
    title: "托盘编码",
    dataIndex: "palletCode",
    check: true,
    align: "center",
  },
  {
    title: "托盘名称",
    dataIndex: "palletName",
    check: true,
    align: "center",
  },
  {
    title: "托盘类型",
    dataIndex: "palletType",
    check: true,
    scopedSlots: { customRender: "palletType" },
    align: "center",
  },
  {
    title: "托盘规格",
    dataIndex: "palletSpecs",
    check: true,
    align: "center",
  },
  {
    width: 150,dataIndex: "operate",
    scopedSlots: { title: "title_slot", customRender: "action" },
    align: "center",
  },
];
export default {
  data() {
    return {
      item: null,
      content: "",
      del_visible: false,
      selectedRows: [],
      palletName: "",
      palletInfo: "",
      palletTypeId: undefined,
      palletTypeList: [
        {
          id: 1,
          name: "平托盘",
        },
        {
          id: 2,
          name: "柱式托盘",
        },
        {
          id: 3,
          name: "箱式托盘",
        },
        {
          id: 4,
          name: "轮式托盘",
        },
        {
          id: 5,
          name: "专用托盘",
        },
      ],
      isActive: false,
      treeData: [],
      locale: zhCN, //国际化 设置成中文 www.itxst.com
      spinning: false,
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        defaultPageSize: 10, // 每页显示几条数据
        showSizeChanger: true, // 显示下拉选项（每页几条）
        showTotal: (total) => `共 ${total} 条数据`,
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },
      columns: [],
      columnsAll,
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(selectedRowKeys, selectedRows);
          this.selectedRows = selectedRows;
        },
      };
    },
  },
  components: {
    Empty,
    NewAdd_dialog,
    Compile_dialog,
  },
  created() {
    let list = [];
    for (let i = 0; i < this.columnsAll.length; i++) {
      this.columnsAll[i].check = true;
      if (this.columnsAll[i].check) {
        list.push(this.columnsAll[i]);
      }
    }
    this.columns = list;
    this.$nextTick(() => {
      this.palletPageData({
        conditions: this.palletInfo,
        palletType: this.palletTypeId == undefined ? "" : this.palletTypeId,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      });
    });
  },
  mounted() {},
  methods: {
    /**打印多个 */
    print_more() {
      if (this.selectedRows.length > 0) {
        //获取指定打印区域
        let printContent = "";
        for (let i = 0; i < this.selectedRows.length; i++) {
          printContent +=
            "<div><p style='text-align: center;font-size:14px;margin:0;padding:0'>" +
            this.selectedRows[i].palletName +
            "</p><svg id='prts" +
            i +
            "'/></div>";
        }
        // console.log("打印内容：" + printContent);
        //构建新网页
        this.$refs.odivMulti.innerHTML = printContent;
        for (let i = 0; i < this.selectedRows.length; i++) {
          jsbarcode(
            document.getElementById("prts" + i),
            this.selectedRows[i].palletCode,
            { height: 45, textAlign: "center", fontSize: 14, textMargin: 8 }
          );
        }
        var printIframe = this.$refs.printIframeMulti;
        var newstr = this.$refs.odivMulti.innerHTML;
        printIframe.setAttribute("srcdoc", newstr);
        printIframe.onload = function () {
          // 去掉iframe里面的dom的body的padding margin的默认数值
          printIframe.contentWindow.document.body.style.padding = "0px";
          printIframe.contentWindow.document.body.style.margin = "0px";
          // 开始打印
          printIframe.contentWindow.focus();
          printIframe.contentWindow.print();
        };
      } else {
        this.$message.warning("请选择托盘！");
      }
    },
    /**打印当前 */
    print_one(item) {
      console.log(item);
      this.palletName = item.palletName;
      setTimeout(() => {
        jsbarcode("#prt1", item.palletCode, {
          height: 45,
          textAlign: "center",
          fontSize: 14,
          textMargin: 8,
        });

        // 拿到要打印区域的dom结构并设置到Iframe的srcdoc属性上面
        var printIframe = this.$refs.printIframe;
        var newstr = this.$refs.odiv.innerHTML;
        printIframe.setAttribute("srcdoc", newstr);
        printIframe.onload = function () {
          console.log(printIframe.contentWindow);
          // 去掉iframe里面的dom的body的padding margin的默认数值
          printIframe.contentWindow.document.body.style.padding = "0px";
          printIframe.contentWindow.document.body.style.margin = "0px";
          // 开始打印
          printIframe.contentWindow.focus();
          printIframe.contentWindow.print();
        };
      }, 300);
    },
    /**重置表格 */
    reset() {
      let list = [];
      for (let i = 0; i < this.columnsAll.length; i++) {
        this.columnsAll[i].check = true;
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i]);
        }
      }
      this.columns = list;
      this.isActive = false;
    },
    /**确定更改的表格 */
    sure() {
      let list = [];
      for (let i = 0; i < this.columnsAll.length; i++) {
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i]);
        }
      }
      this.columns = list;
      this.isActive = false;
    },
    /**新建托盘 */
    add() {
      this.$refs.newAdd_dialog.visible = true;
    },
    /**编辑 */
    compile(item) {
      // console.log(item);
      this.item = item;
      if (this.item.palletIsbinding == 0) {
        if (this.item.storagebinStatus == 0) {
          this.$refs.compile_dialog.visible = true;
          return;
        } else if (this.item.storagebinStatus == 1) {
          this.content = "已在库";
        } else if (
          this.item.storagebinStatus == 2 ||
          this.item.storagebinStatus == 3
        ) {
          this.content = "正在出入库";
        }
      } else {
        this.content = "已绑定物料";
      }
      this.del_visible = true;
    },
    /**重置数据 */
    resetData() {
      this.palletInfo = "";
      this.palletTypeId = undefined;
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.palletPageData({
        conditions: this.palletInfo,
        palletType: this.palletTypeId == undefined ? "" : this.palletTypeId,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      });
    },
    /**查询数据 */
    queryData() {
      this.palletPageData({
        conditions: this.palletInfo,
        palletType: this.palletTypeId == undefined ? "" : this.palletTypeId,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      });
    },
    /**获取物料数据 */
    palletPageData(params) {
      this.spinning = true;
      palletPage(params).then((res) => {
        this.spinning = false;
        console.log(res);
        if (res.code == 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i]["index"] =
              (this.pagination.current - 1) * this.pagination.pageSize +
              parseInt(i) +
              1;
          }
          this.dataList = res.data.list;
          this.pagination.total = res.data.total;
        }
      });
    },
    onChange(item) {
      // console.log(check);
      item.check = !item.check;
      this.$forceUpdate();
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    handleChange(pagination) {
      // console.log(pagination);
      this.pagination = pagination;
      this.palletPageData({
        conditions: this.palletInfo,
        palletType: this.palletTypeId == undefined ? "" : this.palletTypeId,
        page: this.pagination.current,
        limit: this.pagination.pageSize,
      });
    },
    refresh() {
      this.resetData();
    },
  },
};
</script>

<style scoped lang="less">
.tray-management {
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
  .tray-management-table {
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
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  .ant-col-24 {
    height: 32px;
    line-height: 32px;
    padding-left: 12px;
  }
}
</style>
<style lang="less" scoped>
.select_style {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .icon_style {
    background: #000;
  }
  .icon_select_style {
    background: #fff;
  }
  .icon_style,
  .icon_select_style {
    width: 25px;
    height: 25px;
    text-align: center;
    vertical-align: middle;
    img {
      width: 20px;
      height: 20px;
    }
  }

  span {
    display: inline-block;
    text-align: right;
    width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #ccc;
  }
}
/deep/.avatar-uploader {
  .ant-upload {
    width: 102px;
    height: 102px;
  }
}
/deep/.ant-modal {
  width: 530px !important;
  height: 350px;
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
    width: 100%;
    height: 75px;
    text-align: right;
    padding-right: 20px;
    line-height: 75px;
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