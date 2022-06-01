<template>
  <div class="login-container">
    <img class="login-logo" src="../../assets/img/logo_bg.png" alt/>
    <a-form ref="form" :model="form" class="login-form">
      <h2 class="title">尚景平台</h2>
      <a-form-item>
        <a-input class="inputBox" v-model="form.username">
          <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)"/>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input-password class="inputBox" v-model="form.password">
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"/>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button class="submit primary-style" type="primary" @click="onSubmit" :loading="loading">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
const Base64 = require('js-base64').Base64
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      loading: false
    }
  },
  methods: {
    async onSubmit() {
      // console.log("登陆成功！");
      if (this.form.username == '') {
        this.$message.error('用户名不能为空')
        return
      }
      if (this.form.password == '') {
        this.$message.error('密码不能为空')
        return
      }
      this.loading = true
      // 封装登陆数据
      const loginData = {...this.form}
      // 密码Base64编码
      loginData.password = Base64.encode(this.form.password)
      // console.log(loginData);
      this.$store
          .dispatch('user/login', loginData)
          .then(() => {
            this.loading = false
            this.$message.success('登录成功')
            // 路由跳转重定向页面或者首页
            this.$router.push({path: '/'})
          })
          .catch(() => {
            this.loading = false
          })
    }
  }
}
</script>
<style scoped>
.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 750px;
  height: 690px;
  background: #ffffff;
  padding: 68px 161px 95px 183px;
}

/* 背景 */
.login-container {
  width: 100%;
  height: 100%;
  background: #000;
  position: fixed;
}
.login-logo {
  position: fixed;
  left: 55px;
  top: 43px;
  width: 269px;
  height: 37px;
}

/* 登陆按钮 */
.submit {
  width: 414px;
  height: 60px;
  background: @theme-color;
  border-radius: 3px;
}
/* 用户登陆标题 */
.title {
  text-align: center;
  margin-bottom: 121px;
  color: #000;
  font-weight: 500;
  font-size: 42px;
}
/* 输入框 */
.inputBox {
  height: 32px;
}
/* 输入框内左边距50px */
.ant-input-affix-wrapper .ant-input:not(:first-child) {
  padding-left: 50px;
}
</style>
