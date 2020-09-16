<template>
  <div class="personal_information">
    <!-- <h1>个人信息</h1> -->
    <el-card class="box-card">
      <!-- 卡片头部 -->
      <div
        slot="header"
        class="clearfix"
      >
        <h3>管理员信息</h3>
      </div>
      <!-- 管理员信息 -->
      <div class="usernamenews">
        <p><span>管理员ID：</span>{{usernamenews.id}}</p>
        <p><span>账号：</span>{{usernamenews.account}}</p>
        <p><span>用户组：</span>{{usernamenews.userGroup}}</p>
        <p><span>创建时间：</span>{{usernamenews.ctime}}</p>
        <p><span>管理员头像：</span>
          <!-- 上传头像 -->
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:8888/goods.php?a=uploadImg"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
        </p>

      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usernamenews: {
        id: "",
        account: "",
        userGroup: "",
        ctime: ""
      },
      imageUrl: ""
    };
  },
  // 获取一个账号的个人信息
  async created() {
    let userdata = JSON.parse(sessionStorage.getItem("userdata"));
    let v = await this.axios.get(`users.php?a=readOne&id=${userdata.id}`);
    if (v.data.code === 0) {
      this.usernamenews.id = v.data.data.id;
      this.usernamenews.account = v.data.data.account;
      this.usernamenews.userGroup = v.data.data.userGroup;
      this.usernamenews.ctime = v.data.data.ctime;
      this.imageUrl = v.data.data.imgUrl;
    }
  },
  methods: {
    // 上传头像
    async handleAvatarSuccess(res) {
      this.imageUrl = "http://127.0.0.1:8888/" + res.data
      // 修改头像,将上传到服务 器的图片传入数据库
      //获取到id
      let id = JSON.parse(sessionStorage.getItem("userdata")).id;
      let obj = {
        id: id,
        imgUrl: this.imageUrl
      };
      // 发送axios
      let v = await this.axios.post(
        "users.php?a=chgImg",
        this.qs.stringify(obj)
      );
      if (v.data.code === 0) {
        this.$message({
          message: v.data.msg,
          type: "success"
        });
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style>
.personal_information .usernamenews {
  font-size: 18px;
}
.personal_information .usernamenews p {
  line-height: 60px;
  border-bottom: 1px solid #eaecf0;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>