<template>
  <a-drawer
    :closable="false"
    placement="right"
    :zIndex="999"
    :visible="visible"
    width="620"
    :mask="false"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog-right"
    @close="onClose"
  >
    <div class="header">
      <div class="header-title">
        <span v-if="card">
          {{
          card.storagebinLine + "行" + card.storagebinRow + "列"
          }}
        </span>
        <a-icon type="close" @click="onClose" />
      </div>
    </div>
    <div class="footer">
      <div class="footer-title">
        <div class="footer-title-header">
          <span></span>
          <span>物料清单</span>
        </div>
        <div class="footer-title-model" v-if="locationTitle">
          <div v-if="locationTitle.matterbindingDTOList !== null">
            <div v-if="locationTitle.matterbindingDTOList.length > 0">
              <p v-for="(item, ind) in locationTitle.matterbindingDTOList" :key="ind">
                {{ item.matterCode }} &nbsp;&nbsp;
                {{ item.matterName }} &nbsp;&nbsp;
                {{ item.matterMarking }}&nbsp;&nbsp; * &nbsp;&nbsp;
                {{ item.matterNum }}{{ item._matterUnit }}
              </p>
            </div>
            <div v-else>
              <p>暂无数据</p>
            </div>
          </div>
          <div v-else>
            <p>暂无数据</p>
          </div>
        </div>
      </div>
      <div class="footer-title">
        <div class="footer-title-header">
          <span></span>
          <span>基础信息</span>
        </div>
        <div class="footer-title-model">
          <a-descriptions :column="1">
            <a-descriptions-item label="仓库">
              <span>{{ warehouseName }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="料架">
              <span>{{ feederName }}</span>
            </a-descriptions-item>
            <!-- <a-descriptions-item label="库位"
              ><span v-if="card">{{
                card.storagebinName
              }}</span></a-descriptions-item
            >-->
            <a-descriptions-item label="可存放物料">
              <span v-if="card">
                <span v-if="card.mattertypeDTOList != null">
                  <span v-for="(item, i) in card.mattertypeDTOList" :key="i">{{ item.mattertypeName }}</span>
                </span>
                <span v-if="card.mattertypeDTOList == null">所有类型</span>
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="托盘编码" v-if="locationTitle">
              <span v-if="locationTitle.palletDTO !== null">
                <span>{{ locationTitle.palletDTO.palletCode }}</span>
              </span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </div>
  </a-drawer>
</template>
<script>
import { findInfo } from '@/services/api_statistical'
import { unit } from '@/utils/utils'
export default {
  data() {
    return {
      visible: false,
      feederName: '',
      warehouseName: '',
      card: null,
      locationTitle: null
    }
  },
  components: {},
  methods: {
    afterVisibleChange(val) {},
    getCardTitle(feederName, card, warehouseName) {
      console.log(feederName, card, warehouseName)
      this.feederName = feederName
      this.warehouseName = warehouseName
      this.card = card
      findInfo(card.storagebinId).then(res => {
        console.log(res)
        if (res.code == 0) {
          if (res.data.matterbindingDTOList !== null) {
            if (res.data.matterbindingDTOList.length > 0) {
              for (let i = 0; i < res.data.matterbindingDTOList.length; i++) {
                res.data.matterbindingDTOList[i]._matterUnit = unit(res.data.matterbindingDTOList[i].matterUnit)
              }
            }
          }

          this.locationTitle = res.data
        }
      })
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
    .ant-drawer-body {
      height: 100%;
      padding: 0;
      .header {
        padding: 35px;
        height: 153px;
        background: #2964ff;
        box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
        border-radius: 3px;
        .header-title {
          position: relative;
          height: 20px;
          margin-bottom: 39px;
          span {
            font-size: 20px;
            font-weight: 500;
            color: #ffffff;
            line-height: 20px;
          }
          i {
            position: absolute;
            top: 5px;
            right: -5px;
            color: #ffffff;
            font-size: 15px;
          }
        }
        .header-btn {
          height: 20px;
          display: flex;
          justify-content: flex-start;
          align-content: center;
          a {
            margin-right: 56px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            img {
              width: 20px;
              height: 20px;
              vertical-align: text-top;
            }
          }
        }
      }
      .footer {
        height: calc(100% - 153px);
        background: #f5f4f4;
        padding: 20px;
        overflow: auto;
        .footer-title {
          .footer-title-header {
            height: 20px;
            margin-bottom: 10px;
            span:first-child {
              display: inline-block;
              width: 5px;
              height: 20px;
              background: #2964ff;
              margin-right: 15px;
            }
            span:last-child {
              height: 20px;
              line-height: 20px;
              font-size: 18px;
              font-weight: 500;
              color: #818181;
              vertical-align: top;
            }
          }
          .footer-title-model {
            background: #ffffff;
            box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
            border-radius: 3px;
            padding: 20px;
            margin-bottom: 20px;
            p {
              margin-bottom: 0;
              padding: 5px 3px;
            }
            .ant-descriptions-row > td {
              padding-bottom: 30px !important;
              .ant-descriptions-item-content {
                font-size: 16px;
                font-weight: 600;
                color: #000000;
              }
            }
          }
        }
      }
    }
  }
}
</style>
