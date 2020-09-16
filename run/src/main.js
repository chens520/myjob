import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

// 引入公共样式
import "./assets/communal.css"
//引入elemental-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// 引入阿里巴巴矢量图图标
import './assets/icon/iconfont.css'
//将axios挂载到vue原型上
import axios from 'axios'
Vue.prototype.axios = axios
//引入qs模块
import qs from 'qs'
Vue.prototype.qs = qs
//设置公共地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
