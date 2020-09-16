<template>
  <div class="add_account">
    <!-- <h1>添加账号</h1> -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 卡片头部 -->
      <div
        slot="header"
        class="clearfix"
      >
        <span>添加账号</span>
      </div>
      <!-- 表单 -->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <!-- 账号 -->
        <el-form-item
          label="账号"
          prop="name"
        >
          <el-input
            style="width:300px"
            v-model="form.name"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item
          label="密码"
          prop="pwd"
        >
          <el-input
            style="width:300px"
            placeholder="请输入密码"
            v-model="form.pwd"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 用户组 -->
        <el-form-item label="用户组">
          <el-select
            v-model="form.region"
            placeholder="选择用户组"
          >
            <el-option
              label="超级管理员"
              value="超级管理员"
            ></el-option>
            <el-option
              label="部门管理员"
              value="部门管理员"
            ></el-option>
            <el-option
              label="普通管理员"
              value="普通管理员"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 添加与重置 -->
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >添加</el-button>
          <el-button @click="empty">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      form: {
        name: "",
        pwd: "",
        region: "普通管理员"
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 表单处理函数
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 添加用户ajax请求数据
          //获取数据
          let account = this.form.name;
          let password = this.form.pwd;
          let userGroup = this.form.region;
          // 1创建ajax对象
          var xhr = new XMLHttpRequest();
          // 2配置请求方式和请求地址
          xhr.open("post", "http://127.0.0.1:8888/users.php?a=add");
          //3.设置请求头
          xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
          //4.发送
          xhr.send(
            `account=${account}&password=${password}&userGroup=${userGroup}`
          );
          //5.监听状态变化&接收数据
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
              var data =JSON.parse(xhr.responseText);
              if(data.code === 0){
                this.$message(data.msg);
                this.$router.push('/home/account_list');
              }else{
                 this.$message.error(data.msg);
              }
            }
          };
        } else {
          return false;
        }
      });
    },
    //重置
    empty() {
      this.form = {
        name: "",
        pwd: "",
        region: "普通管理员"
      };
    }
  }
};
</script>

<style>
</style>