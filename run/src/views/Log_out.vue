<template>
  <div class="log_out">
    <!-- <h1>退出登录</h1> -->
    <h1>正在退出..............</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: null
    };
  },
  // 组件对象创建时
  created() {
    this.timer = setInterval(function() {
      //清空本地存储
      sessionStorage.clear();
      // 跳转到登陆页
      window.location.href = "#/"
    }, 5000);
  },
  //组件销毁时候
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>

<style>
.log_out {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.log_out h1 {
  width: 400px;
}
</style>