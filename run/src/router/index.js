import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    //登陆列表
    { path: '/', name: 'login', component: Login },
    //退出登录
    { path: '/log', component: () => import('../views/Log_out.vue')},
    {
      path: '/home', name: 'home', component: () => import('../views/Home.vue'), children: [
        //登陆设置默认激活的二级路由
        { path: '', component: () => import('../views/second/Back_order.vue') },
        //后台首页
        { path: '/home/back_order', component: () => import('../views/second/Back_order.vue'), meta: ["后台订单"] },
        // 账号列表
        { path: '/home/account_list', component: () => import('../views/second/Account_list.vue'), meta: ["账号管理", "账号列表"] },
        // 添加账号
        { path: '/home/add_account', component: () => import('../views/second/Add_account.vue'), meta: ["账号管理", "添加账号"] },
        // 修改账号
        { path: '/home/change_password', component: () => import('../views/second/Change_password.vue'), meta: ["账号管理", "修改账号"] },
        // 个人信息
        { path: '/home/personal_information', component: () => import('../views/second/Personal_information.vue') },
        // 商品列表
        { path: '/home/product_list', component: () => import('../views/second/Product_list.vue'), meta: ["商品管理", "商品列表"] },
        // 添加商品
        { path: '/home/add_item', component: () => import('../views/second/Add_item.vue'), meta: ["商品管理", "添加商品"] },
        //修改商品(声明要传入的id)
        { path: '/home/modify_product:id', component: () => import('../views/second/Modify_product.vue'), meta: ["商品管理", "修改商品"] }
      ]
    }
  ]
})

export default router
