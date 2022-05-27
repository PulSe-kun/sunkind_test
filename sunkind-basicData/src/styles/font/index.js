import Vue from 'vue'
import iconFront from './font/iconfont'
import { Icon } from 'ant-design-vue';
const myicon = Icon.createFromIconfontCN({
    scriptUrl: iconFront
})
Vue.component('my-icon', myicon)