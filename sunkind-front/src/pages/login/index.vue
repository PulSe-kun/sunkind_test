<template>
  <div class="login-container">
    <img class="login-logo" src="../../assets/img/logo_bg.png" alt />
    <a-form-model ref="loginForm" :model="form" :rules="rules" class="login-form">
      <h1 class="title">尚景平台</h1>
      <a-form-model-item layout="inline" ref="username" prop="username">
        <a-input size="large" v-model="form.username" type="text" autocomplete="off" @keyup.enter="login" placeholder="请输入账号">
          <img slot="prefix" class="login-img" src="../../assets/img/username.png" alt />
        </a-input>
      </a-form-model-item>
      <a-form-model-item ref="password" prop="password">
        <a-input size="large" v-model="form.password" type="password" autocomplete="off" @keyup.enter="login" placeholder="请输入密码">
          <img slot="prefix" class="login-img" src="../../assets/img/password.png" alt />
        </a-input>
        <span class="input_title">忘记密码？</span>
      </a-form-model-item>
      <a-form-model-item>
        <a-button size="large" type="primary" style="width: 100%; height: 50px" @click="login" :loading="loading">登录</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
  <div></div>
</template>

<script>
const Base64 = require('js-base64').Base64
export default {
  data() {
    return {
      loading: false,
      form: {
        username: 'zhanggong',
        password: '888888'
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login() {
      this.loading = true
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 封装登陆数据
          const loginData = { ...this.form }
          // 密码Base64编码
          loginData.password = Base64.encode(this.form.password)
          // console.log(loginData);
          this.$store
            .dispatch('user/login', loginData)
            .then(res => {
              console.log(res)
              this.loading = false
              if (res.access_token) {
                // 路由跳转重定向页面或者首页
                this.$router.push({ path: '/sunkind-home' })
                this.$message.success('登录成功', 1)
              } else {
                this.$message.error('账号或者密码输入错误')
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          // console.log("error submit!!");
          this.loading = false
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/* 背景 */
.login-container {
  width: 100%;
  height: 100%;
  background: url('../../assets/img/bg_small.png') no-repeat;
  background-size: 100% 100%;
  position: relative;

  .login-logo {
    position: fixed;
    left: 55px;
    top: 43px;
    width: 269px;
    height: 37px;
  }

  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 500px;
    background: rgba(155, 151, 151, 0.5);
    padding: 28px 120px 95px 120px;
    .title {
      text-align: center;
      margin-bottom: 80px;
      color: #e5e5e5;
      font-weight: 500;
      font-size: 42px;
    }
    .login-img {
      width: 20px;
      height: 20px;
    }
    .ant-form-item {
      margin-bottom: 30px;
      .ant-input-lg {
        height: 52px;
      }
    }
    .ant-form-item:last-child {
      margin-bottom: 0 !important;
      margin-top: 80px;
    }
  }
}
/deep/.ant-input-affix-wrapper .ant-input:not(:first-child) {
  padding-left: 40px;
}
.input_title {
  position: absolute;
  right: -8px;
  top: 40px;
  display: inline-block;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #000;
  cursor: pointer;
}
/deep/.ant-input-lg {
  height: 50px;
}
</style>
