<template>
  <div class="login-container">
    <img class="login-logo" src="../../assets/img/logo_bg.png" alt="" />
    <a-form-model
      ref="loginForm"
      :model="form"
      :rules="rules"
      class="login-form"
    >
      <h1 class="title">尚景平台</h1>
      <a-form-model-item layout="inline" ref="username" prop="username">
        <a-input
          size="large"
          v-model="form.username"
          type="text"
          autocomplete="off"
          @keyup.enter="login"
          placeholder="请输入账号"
        >
          <img
            slot="prefix"
            class="login-img"
            src="../../assets/img/username.png"
            alt=""
          />
        </a-input>
      </a-form-model-item>
      <a-form-model-item ref="password" prop="password">
        <a-input
          size="large"
          v-model="form.password"
          type="password"
          autocomplete="off"
          @keyup.enter="login"
          placeholder="请输入密码"
        >
          <img
            slot="prefix"
            class="login-img"
            src="../../assets/img/password.png"
            alt=""
          />
        </a-input>
        <span class="input_title">忘记密码？</span>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          size="large"
          class="primary-style"
          type="primary"
          style="width: 100%; height: 60px"
          @click="login"
          :loading="loading"
        >
          登录
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // 封装登陆数据
          const loginData = { ...this.form };
          this.$store
            .dispatch("user/login", loginData)
            .then(() => {
              this.loading = false;
              this.$message.success("登录成功");
              // 路由跳转重定向页面或者首页
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          // 表单校验失败
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
/* 背景 */
.login-container {
  width: 100%;
  height: 100%;
  background: #fff;
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
    width: 750px;
    height: 690px;
    background: red;
    padding: 68px 161px 95px 183px;
    .title {
      text-align: center;
      margin-bottom: 121px;
      color: #000;
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
      margin-top: 102px;
    }
  }
}
/deep/.ant-input-affix-wrapper .ant-input:not(:first-child) {
  padding-left: 40px;
}
.input_title {
  position: absolute;
  right: -8px;
  top: 35px;
  display: inline-block;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  cursor: pointer;
}
</style>