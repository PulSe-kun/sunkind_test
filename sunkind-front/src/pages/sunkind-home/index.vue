<template>
  <div class="sunkind-home">
    <a-layout style="height: 100vh" class="layout">
      <a-layout-header>
        <div class="logo">
          <img src="../../assets/img/sunkind.png" alt/>
          <img src="../../assets/img/text.png" alt/>
        </div>
        <div id="myheader">
          <!-- <div>
            <a-badge :count="1" style="color: #353535">
              <a-icon type="bell" style="padding: 4px; vertical-align: middle" />
              <img class="img_clock" src="../../assets/img/clock.png" alt="钟" />
            </a-badge>
          </div>-->
          <a-dropdown>
            <span>
              <img class="img_people" src="../../assets/img/people.png" alt="头像"/>
              <span style="vertical-align: middle; font-size: 20px; color: #1a1a1a">{{ $store.state.user.name }}</span>
            </span>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="changePassword">
                  <a-icon type="setting" style="margin-right: 8px"/>
                  修改密码
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="logout">
                  <a-icon type="poweroff" style="margin-right: 8px"/>
                  退出登录
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content style="height: calc(100vh - 88px)">
        <div class="sunkind-home-content">
          <a
              v-for="(item, index) in cardList"
              :key="index"
              class="model-card"
              :style="{
              background: item.background,
            }"
          >
            <div class="card-title">
              <h3 :title="item.menuTitle">{{ item.menuTitle }}</h3>
              <span :title="item.description">{{ item.description }}</span>
              <div>
                <a
                    :style="{
                    background: item.background,
                  }"
                    title="进入"
                    target="_blank"
                    @click="openUrl(item)"
                >
                  <img src="../../assets/img/in.png" alt/>
                </a>
              </div>
            </div>
            <div class="card">
              <div class="logo-img" :style="{
                  background: item.logo_background,
                }">
                <img
                    v-if="item.menuIcon"
                    :src="
                    require('@/assets/systemIcon/' + item.menuIcon + '.png')
                  "
                    alt
                />
              </div>
              <div class="logo-title">
                <h3>{{ item.menuTitle }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </a>
        </div>
      </a-layout-content>
    </a-layout>
    <template>
      <ChangePassword ref="changePassword"/>
      <ModifySuccess ref="modifySuccess"/>
    </template>
  </div>
</template>

<script>
import {getSysMenus} from '@/services/api_user'
import {getToken} from '@/utils/auth' // get token from cookie
import {ChangePassword, ModifySuccess} from './components/index'

const colorList = [
  {
    background: '#50A9FF',
    logo_background: '#5898FD'
  },
  {
    background: '#FE508C',
    logo_background: '#F63A6F'
  },
  {
    background: '#FF9437',
    logo_background: '#FB7F31'
  }
]
export default {
  data() {
    return {
      cardList: []
    }
  },
  components: {
    ChangePassword,
    ModifySuccess
  },
  created() {
    this.$nextTick(() => {
      this.getSysMenusData()
    })
  },
  methods: {
    /** 修改密码 */
    changePassword() {
      this.$refs.changePassword.visible = true
    },
    /** 修改密码成功 */
    modifySuccessPage() {
      this.$refs.modifySuccess.visible = true
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$message.success('退出成功', 1)
      this.$router.push('/login')
    },
    openUrl(item) {
      console.log(item)
      const url = window.location.hostname // 地址栏
      console.log(url)
      const index = item.menuPath.indexOf(':') // 找到 ：在字符串中的位置
      // console.log(index);
      const pathLength = item.menuPath.length // 路径的长度
      // console.log(pathLength);
      const path = url + item.menuPath.substring(index, pathLength) // 截取:后面的字符拼接
      console.log(path)
      const hasToken = getToken()
      if (hasToken) {
        // 注意 👉首页判定下token是否存在
        window.open(
            'http://' + path + '?id=' + item.id + '&token=' + getToken()
            // "_self"
        )
      } else {
        this.$router.push('/login')
      }
      // window.open('http://' + item.menuPath + '?id=' + item.id + '&token=' + getToken(), '_blank')
    },
    /** 获取系统数据 */
    getSysMenusData() {
      getSysMenus().then(res => {
        // console.log(res);
        if (res.status === 200) {
          for (let i = 0; i < res.data.length; i++) {
            if (i / colorList.length >= 1) {
              res.data[i].background = colorList[i % colorList.length].background
              res.data[i].logo_background = colorList[i % colorList.length].logo_background
            } else {
              res.data[i].background = colorList[i].background
              res.data[i].logo_background = colorList[i].logo_background
            }
          }
          this.cardList = res.data
        }
      })
    }

    // mouseover() {
    //   //   console.log(this.$refs.model_card[0].css);
    // },
    // mouseout() {},
  }
}
</script>
<style scoped lang="less">
.sunkind-home {
  height: 100%;

  .ant-layout-header {
    height: 88px;
    line-height: 58px;
    background: #ffffff;
    box-shadow: 0 1px 6px 0 rgba(115, 115, 115, 0.43);
    padding: 15px 28px;

    .logo {
      float: left;
      height: 43px;
      line-height: 43px;

      img:first-child {
        width: 170px;
        height: 43px;
        margin-right: 24px;
      }

      img:last-child {
        width: 106px;
        height: 24px;
        vertical-align: bottom;
      }
    }

    #myheader {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      > * {
        padding: 0 16px;
      }

      > *:not(i):hover {
        background: rgba(0, 0, 0, 0.025);
      }

      .img_clock {
        width: 26px;
        height: 26px;
      }

      .img_people {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
    }
  }

  .sunkind-home-content {
    height: 100%;
    text-align: left;
    overflow: auto;

    .model-card {
      margin: 30px 30px 32px 30px;
      cursor: default;
      display: inline-block;
      border-radius: 13px;
      position: relative;
      overflow: hidden;

      &:hover {
        .card-title {
          opacity: 1;
          -webkit-transform: rotateY(0deg);
          -moz-transform: rotateY(0deg);
          transform: rotateY(0deg);
          -webkit-transition: -webkit-transform 0.4s, opacity 0.1s;
          -moz-transition: -moz-transform 0.4s, opacity 0.1s;
          transition: transform 0.4s, opacity 0.1s;
        }

        .card {
          transform: translateX(50%);
          padding: 45px 60px;

          .logo-title {
            opacity: 0;
            -webkit-transition: -webkit-transform 0.4s, opacity 0.1s;
            -moz-transition: -moz-transform 0.4s, opacity 0.1s;
            transition: transform 0.4s, opacity 0.1s;
          }
        }
      }

      .card-title {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 999;
        width: 210px;
        height: 180px;
        padding: 0 33px;
        text-align: left;
        background: #ededed;
        opacity: 0;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transform-origin: 0 0;
        -moz-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: rotateY(-90deg);
        -moz-transform: rotateY(-90deg);
        transform: rotateY(-90deg);
        -webkit-transition: -webkit-transform 0.4s, opacity 0.1s 0.3s;
        -moz-transition: -moz-transform 0.4s, opacity 0.1s 0.3s;
        transition: transform 0.4s, opacity 0.1s 0.3s;

        h3 {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-top: 37px;
          margin-bottom: 20px;
          height: 24px;
          line-height: 24px;
          font-size: 24px;
          font-weight: 500;
          color: #000000;
        }

        span {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: inline-block;
          margin-bottom: 20px;
          height: 18px;
          line-height: 18px;
          font-size: 18px;
          font-weight: 400;
          color: #000000;
        }

        div {
          width: 100%;
          height: 24px;
          text-align: right;

          a {
            display: inline-block;
            width: 43px;
            height: 24px;
            border-radius: 12px;
            text-align: center;

            img {
              width: 14px;
              height: 14px;
              vertical-align: middle;
            }
          }
        }
      }

      .card {
        // transition: all 0.5s ease-out;
        -webkit-transition: -webkit-transform 0.4s, opacity 0.1s;
        -moz-transition: -moz-transform 0.4s, opacity 0.1s;
        transition: transform 0.4s, opacity 0.1s;
        padding: 45px 73px;
        width: 420px;
        height: 180px;

        > div {
          float: left;
        }

        .logo-img {
          width: 90px;
          height: 90px;
          border-radius: 45px;
          margin-right: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .logo-title {
          opacity: 1;
          width: 140px;
          height: 90px;
          padding: 10px 0;

          h3 {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            height: 22px;
            font-size: 22px;
            font-weight: 500;
            color: #ffffff;
            line-height: 22px;
            margin-bottom: 20px;
          }

          p {
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            margin: 0;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}
</style>
