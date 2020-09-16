<template>
  <div class="home">
    <!-- <h1>这是首页</h1> -->
    <el-container>
      <!-- 左边栏二级导航 -->
      <el-aside width="200px">
        <div class="home_aside_img">
          <!-- logo图 -->
          <img
            v-bind:src="img"
            alt=""
          >
        </div>
        <!-- 二级导航 -->
        <el-col :span="12">
          <el-menu
            v-bind:default-active="this.$route.path"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            router
          >
            <!-- 后台首页 -->
            <el-menu-item index="/home/back_order">
              <i class="el-icon-menu"></i>
              <span slot="title">后台首页</span>
            </el-menu-item>
            <!-- 订单管理 -->
            <el-menu-item index="/home/order_management">
              <i class="el-icon-menu"></i>
              <span slot="title">订单管理</span>
            </el-menu-item>
            <!-- 商品管理 -->
            <el-submenu index="/home/commodity_management">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/home/product_list">商品列表</el-menu-item>
                <el-menu-item index="/home/add_item">添加商品</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <!-- 店铺管理 -->
            <el-menu-item index="/home/store_management">
              <i class="el-icon-menu"></i>
              <span slot="title">店铺管理</span>
            </el-menu-item>
            <!-- 账号管理 -->
            <el-submenu index="/home/account_management">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>账号管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/home/account_list">账号列表</el-menu-item>
                <el-menu-item index="/home/add_account">添加账号</el-menu-item>
                <el-menu-item index="/home/change_password">修改账号</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 销售统计 -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>销售统计</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <!-- 面包屑导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(v,i) in this.$route.meta"
              :key='i'
            >{{v}}</el-breadcrumb-item>
          </el-breadcrumb>

          <!-- 下拉菜单 -->
          <el-dropdown>
            <span class="el-dropdown-link">
              欢迎你，{{username}}<el-avatar
                :size="50"
                :src="userimgUrl"
              ></el-avatar>
            </span>
            <el-dropdown-menu
              slot="dropdown"
              style="width:80px;text-align:center;font-size:16px"
            >
              <a
                href="#/home/personal_information"
                style="line-height:30px"
              >个人信息</a><br>
              <a
                href="#/log"
                style="line-height:30px"
              >退出登录</a>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <!-- 主体内容 -->
        <el-main>
          <!-- 二级路由容器 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
// 引入logo图
import logo from "../assets/imgs/logo.jpg";
// 注册
export default {
  data() {
    // 图片数据
    return {
      img: logo,
      //图片和用户名
      userimgUrl:'',
      username:"",
    };
  },
  //页面加载之后
  mounted(){
    //得到图片和用户名
    let userdata = JSON.parse(sessionStorage.getItem("userdata"));    
    this.userimgUrl = userdata.imgUrl;
    this.username = userdata.account;
  },
  //定义函数
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style>
html,
body,
#app,
.home,
.home .el-container {
  height: 100%;
  width: 100%;
}
.home .home_aside_img img {
  width: 100%;
}
.home .el-col {
  width: 100%;
}
.home .el-menu-item-group__title {
  padding: 0;
}
.home .el-aside {
  background: #304156;
}
.home .el-menu-vertical-demo li .el-submenu__title {
  background: #304156 !important;
}
.home .el-menu-vertical-demo li {
  background: #304156 !important;
}
.home .el-menu {
  border: 0;
}
.home .el-breadcrumb {
  line-height: 60px;
}
.home .el-header {
  display: flex;
  justify-content: space-between;
}
.home .el-avatar--circle {
  margin-right: 20px;
  margin-left: 10px;
  vertical-align: middle;
}
.home .el-avatar--circle img {
  width: 100%;
}
.home .el-dropdown {
  line-height: 60px;
}
</style>