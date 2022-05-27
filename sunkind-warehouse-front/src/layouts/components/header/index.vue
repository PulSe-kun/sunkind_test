<template>
  <div id="myheader">
    <a-dropdown>
      <span>
        <!-- <a-icon type="smile" theme="twoTone" style="font-size: 18px" /> -->
        <img class="img_people" src="../../../assets/img/people.png" alt="头像" />
        <span style="vertical-align: middle; font-size: 16px; color: #1a1a1a">{{ $store.state.user.name }}</span>
      </span>
      <a-menu slot="overlay">
        <a-menu-item>
          <a @click="changePassword">
            <a-icon type="setting" style="margin-right: 8px" />修改密码
          </a>
        </a-menu-item>
        <a-menu-item>
          <a @click="logout">
            <a-icon type="poweroff" style="margin-right: 8px" />退出登录
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <template>
      <ChangePassword ref="changePassword" />
      <ModifySuccess ref="modifySuccess" />
    </template>
  </div>
</template>
<script>
import { ChangePassword, ModifySuccess } from './components/index'
export default {
  name: 'myheader',
  mounted() {},
  components: {
    ChangePassword,
    ModifySuccess
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$message.success('退出成功')
      this.$router.push('/login')
    },
    /** 修改密码 */
    changePassword() {
      this.$refs.changePassword.visible = true
    },
    /** 修改密码成功 */
    modifySuccessPage() {
      this.$refs.modifySuccess.visible = true
    }
  }
}
</script>
<style scoped>
#myheader {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
#myheader > * {
  padding: 0 16px;
}
#myheader > *:not(i):hover {
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
</style>
