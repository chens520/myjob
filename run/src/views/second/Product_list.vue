<template>
  <div class="product_list">
    <!-- <h1>商品列表</h1> -->
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <!-- 展示商品信息 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <!-- 1 -->
            <el-form-item label="商品名称">
              <span>{{ props.row.goodsname }}</span>
            </el-form-item>
            <!-- 2 -->
            <el-form-item label="添加时间">
              <span>{{ props.row.ctime }}</span>
            </el-form-item>
            <!-- 3 -->
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <!-- 5 -->
            <el-form-item label="商品特性">
              <span>{{ props.row.goodsfeature }}</span>
            </el-form-item>
            <!-- 4 -->
            <el-form-item label="商品分类">
              <span>{{ props.row.goodscategory }}</span>
            </el-form-item>
            <!-- 6 -->
            <el-form-item label="是否促销">
              <span>{{ props.row.isPromotion }}</span>
            </el-form-item>
            <!-- 7 -->
            <el-form-item label="规格">
              <span>{{ props.row.standard }}</span>
            </el-form-item>
            <!-- 8 -->
            <el-form-item label="包装费">
              <span>{{ props.row.packprice }}</span>
            </el-form-item>

            <!-- 9 -->
            <el-form-item label="价格">
              <span>{{ props.row.price }}</span>
            </el-form-item>
            <!-- 10 -->
            <el-form-item label="商品描述">
              <span>{{ props.row.goodsdesc }}</span>
            </el-form-item>
            <!-- 11 -->
            <el-form-item label="商品图片">
              <!-- 图片展示 -->
              <div class="demo-image">
                <div
                  class="block"
                  v-for="(v,i) in props.row.imgUrl"
                  :key="i"
                >
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="v"
                    :fit="fits"
                  ></el-image>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <!-- 商品 ID -->
      <el-table-column
        label="商品 ID"
        prop="id"
      >
      </el-table-column>
      <!-- 商品名称 -->
      <el-table-column
        label="商品名称"
        prop="goodsname"
      >
      </el-table-column>
      <!-- 描述 -->
      <el-table-column
        label="描述"
        prop="goodsdesc"
      >
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage1"
        :page-sizes="[5,10,20,30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  //数据
  data() {
    return {
      //图片展示
      fits: "fill",
      // 表格数据
      tableData: [
        {
          id: "",
          ctime: "",
          goodscategory: "",
          goodsname: "",
          goodsfeature: "",
          isPromotion: "",
          standard: "",
          packprice: "",
          price: "",
          goodsdesc: "",
          imgUrl: []
        }
      ],
      //   分页数据
      currentPage1: 1,
      //总条数
      total: 0,
      //当前页
      page: 1,
      //每页几条
      pages: 5
    };
  },
  //页面加载完成后
  async mounted() {
    //发送axios请求
    let v = await this.axios.get(
      `goods.php?a=list&currentPage=${this.page}&pageSize=${this.pages}`
    );
    if (v.data.code === 0) {
      //将图片地址转换为数组
      v.data.data.forEach(value => {
        let arr = value.imgUrl.split(",");
        value.imgUrl = arr;
      });
      //商品名称
      this.tableData = v.data.data;
      // 获取总页数
      this.total = Number(v.data.total);
    }
  },
  methods: {
    // 表单按钮操作函数
    handleEdit(index, row) {
      this.$router.push("/home/modify_product" + row.id);
    },
    // 删除数据按钮
    async handleDelete(row) {
      //发送axios请求
      let v = await this.axios.get(`goods.php?a=delete&id=${row.id}`);
      //消息提示
      if (v.data.code === 0) {
        this.$message({
          message: v.data.msg,
          type: "success"
        });
        //从新刷新页面
        if (
          this.tableData.length === 1 &&
          this.page !== 1 &&
          this.page === Math.ceil(this.total / this.pages)
        ) {
          //发送axios请求
          let v = await this.axios.get(
            `goods.php?a=list&currentPage=${this.page - 1}&pageSize=${
              this.pages
            }`
          );
          if (v.data.code === 0) {
            //将图片地址转换为数组
            v.data.data.forEach(value => {
              let arr = value.imgUrl.split(",");
              value.imgUrl = arr;
            });
            //商品名称
            this.tableData = v.data.data;
            // 获取总页数
            this.total = Number(v.data.total);
          }
        } else if (
          this.tableData.length === 1 &&
          this.page === 1 &&
          this.page === Math.ceil(this.total / this.pages)
        ) {
          //重新刷新页面
          this.tableData = [];
        } else {
          //重新刷新页面
          this.addfenye();
        }
      }
    },

    // 分页功能函数
    handleSizeChange(val) {
      // 每页条数
      this.pages = val;
      //调用函数
      this.addfenye();
    },
    handleCurrentChange(val) {
      // 当前页数
      this.page = val;
      //调用函数
      this.addfenye();
    },
    // 分页axios请求函数
    async addfenye() {
      let v = await this.axios.get(
        `goods.php?a=list&currentPage=${this.page}&pageSize=${this.pages}`
      );
      if (v.data.code === 0) {
        //将图片地址转换为数组
        v.data.data.forEach(value => {
          let arr = value.imgUrl.split(",");
          value.imgUrl = arr;
        });
        //商品名称
        this.tableData = v.data.data;
        // 获取总页数
        this.total = Number(v.data.total);
      }
    }
  }
};
</script>

<style>
.product_list .demo-table-expand {
  font-size: 0;
}
.product_list .demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.product_list .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.product_list .el-pagination {
  margin-top: 20px;
  margin-left: 10px;
}
.product_list .el-form > div:last-child {
  width: 100%;
}
.product_list .demo-image {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.product_list .el-form-item__content {
  width: 100%;
}
</style>