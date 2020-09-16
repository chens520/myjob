<template>
  <div class="change_password">
    <!-- <h1>修改密码</h1> -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 卡片头部 -->
      <div
        slot="header"
        class="clearfix"
      >
        <span>修改密码</span>
      </div>
      <!-- 表单 -->
      <!-- :rules="rules" ref="ruleForm" prop="oldpwd"指定验证规则 -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- 原密码 -->
        <el-form-item
          label="原密码"
          prop="oldpwd"
        >
          <el-input
            style="width:300px"
            v-model="ruleForm.oldpwd"
          ></el-input>
        </el-form-item>
        <!-- 新密码 -->
        <el-form-item
          label="新密码"
          prop="newpwd"
        >
          <el-input
            style="width:300px"
            type="password"
            v-model="ruleForm.newpwd"
          ></el-input>
        </el-form-item>
        <!-- 确认新密码 -->
        <el-form-item
          label="确认新密码"
          prop="checknewPass"
        >
          <el-input
            style="width:300px"
            type="password"
            v-model="ruleForm.checknewPass"
          ></el-input>
        </el-form-item>
        <!-- 确认与重置 -->
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >确认</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 原密码验证
    var checkpwd = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("密码不能为空"));
      } else if (value.length > 9 || value.length < 3) {
        return callback(new Error("请输入3到9个字符"));
      } else {
        callback();
      }
    };
    // 新密码验证
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (value.length > 9 || value.length < 3) {
          return callback(new Error("请输入3到9个字符"));
        } else if (this.ruleForm.checknewPass !== "") {
          // 和新密码去验证
          this.$refs.ruleForm.validateField("checknewPass");
          callback();
        } else {
          callback();
        }
      }
    };
    //确认新密码验证
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newpwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      ruleForm: {
        newpwd: "",
        checknewPass: "",
        oldpwd: ""
      },
      // 制定自定义验证规则
      rules: {
        newpwd: [{ validator: validatePass, trigger: "blur" }],
        checknewPass: [{ validator: validatePass2, trigger: "blur" }],
        oldpwd: [{ validator: checkpwd, trigger: "blur" }]
      }
    };
  },
  methods: {
    //表单处理函数
    //点击确认
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        console.log(valid);

        if (valid) {
          //获取存储的token和id
          let token = sessionStorage.getItem("token");
          let id = JSON.parse(sessionStorage.getItem("userdata")).id;
          //定义发送数据
          let obj = {
            token: token,
            id: id,
            oldPassword: this.ruleForm.oldpwd,
            newPassword: this.ruleForm.newpwd
          };
          //发送axios请求
          let v = await this.axios.post(
            "users.php?a=chgpwd",
            this.qs.stringify(obj)
          );
          console.log(v);
          if (v.data.code === 0) {
            this.$message({
              message: v.data.msg,
              type: "success"
            });
            //跳转到退出页面
            this.$router.push("/log");
          }else{
            this.$message.error(v.data.msg);
          }
        } else {
          this.$message.error("修改失败");
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
</style>