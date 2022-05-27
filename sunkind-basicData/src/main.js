import Vue from 'vue'
import './assets/font/font.css'
import '../src/styles/index.less'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
import 'echarts-gl'
import animated from 'animate.css'
// import "./styles/font/index.less"
import './styles/font/index'
// 路由守卫
import './permission' // npm install animate.css --save安装，再引入
Vue.use(animated)
Vue.config.productionTip = false
Vue.use(Antd)
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
