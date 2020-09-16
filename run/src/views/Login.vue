<template>
  <div class="login">
    <!-- <h1>这是登录页</h1> -->
    <div class="box">
      <h1 class="box_xitong">系统登录</h1>
      <!-- 输入框 -->
      <!-- :rules="rules" prop="username" 表单验证功能 -->
      <el-form
        :rules="rules"
        ref="ruleForm"
        :model="form"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="fontfamily el-icon-nowfontbussiness-man"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input
            show-password
            prefix-icon="fontfamily el-icon-nowfontpassword"
            placeholder="请输入密码"
            v-model="form.pwd"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >登录</el-button>
        </el-form-item>
      </el-form>

    </div>

  </div>
</template>
<script>
export default {
  // 路由守卫
  async beforeRouteLeave(to, from, next) {
    //获取用户数据
    let userdata = sessionStorage.getItem("userdata");
    //判断id有没有
    let id = userdata ? JSON.parse(userdata).id : "";
    //获取用户token
    let token = sessionStorage.getItem("token");
    //发送axios请求
    let v = await this.axios.get(
      `/users.php?a=chklogin&id=${id}&token=${token}`
    );
    if (v.data.code > 0) {
      alert("请登录以后再操作");
      next("/");
    } else if (v.data.code == 0) {
      if(to.path === '/home'){
        next('/home/back_order');
      }else{
        next();
      }
    }
  },
  //数据
  data() {
    return {
      // 数据
      form: {
        username: "",
        pwd: ""
      },
      //表单验证
      rules: {
        //用户名
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        // 用户密码
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 点击事件(登陆)
    onSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 获取数据
          let obj = {
            account: this.form.username,
            password: this.form.pwd
          };
          // 发送axios请求
          let v = await this.axios.post(
            "users.php?a=login",
            this.qs.stringify(obj)
          );
          // 判断
          if (v.data.code === 0) {
            this.$message(v.data.msg);
            //在sessionStorage保存数据
            sessionStorage.setItem("token", v.data.token);
            sessionStorage.setItem("userdata", JSON.stringify(v.data.data)); //转成字符串
            //跳转到首页
            this.$router.push("/home/back_order");
          } else {
            this.$message.error(v.data.msg);
            return false;
          }
        } else {
          this.$message.error("登陆失败");
          return false;
        }
      });
    }
  }
};
</script>

<style>
html,
body,
#app,
.login {
  height: 100%;
  width: 100%;
}
.login {
  background: #2d3a4b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login .box {
  width: 300px;
  height: 210px;
  text-align: center;
}
.login .el-button {
  width: 100%;
}
.login .box_xitong {
  margin-bottom: 20px;
  color: #eee;
}
.login .el-icon-nowfontbussiness-man,
.login .el-icon-nowfontpassword {
  font-size: 25px;
}
.login .el-input__inner {
  background: #283443;
}
</style>