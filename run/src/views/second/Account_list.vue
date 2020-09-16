<template>
  <div class="account_list">
    <!-- <h1>账号列表</h1> -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 卡片头部 -->
      <div
        slot="header"
        class="clearfix"
      >
        <h3>账号列表</h3>
      </div>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
      >
        <!-- 多选框 -->
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <!-- 账号 -->
        <el-table-column
          label="账号"
          width="180"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <!-- 用户组 -->
        <el-table-column
          label="用户组"
          width="180"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.userGroup }}</span>
          </template>
        </el-table-column>

        <!-- 创建时间 -->
        <el-table-column
          label="创建时间"
          width="180"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.ctime }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>

        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
        >
        </el-pagination>
      </div>
      <!-- 删除与取消 -->
      <div>
        <el-button
          type="danger"
          @click="alldelete"
        >批量删除</el-button>
        <el-button
          type="primary"
          @click="toggleSelection()"
        >取消选择</el-button>
      </div>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog
      title="修改账号"
      :visible.sync="dialogFormVisible"
    >
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
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="changedata"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入axios
import axios from "axios";
export default {
  // 在组件对象创建后发出axios请求
  created() {
    // 发送请求
    this.appaxios();
  },
  // 数据
  data() {
    return {
      // 表格数据
      tableData: [],
      //   分页数据
      // 默认跳转到哪页
      currentPage1: 1,
      //当前页为第一页
      page: 1,
      //默认每页10
      pages: 10,
      //总条数
      totals: 0,
      // 弹出框
      dialogFormVisible: false,
      form: {
        name: "",
        region: "普通管理员"
      },
      formLabelWidth: "120px",
      // 弹出框表单验证
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ]
      },
      //点击编辑获取到的当前行的数据
      row: []
    };
  },
  methods: {
    // 取消选择
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    //表格处理函数
    // 编辑
    handleEdit(row) {
      this.row = row;
      this.form.name = row.account;
      this.dialogFormVisible = true;
    },
    //确认修改
    changedata() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          //获取数据
          let obj = {
            id: this.row.id,
            account: this.form.name,
            userGroup: this.form.region
          };
          //发送axios请求
          let v = await axios.post("users.php?a=edit", this.qs.stringify(obj));
          console.log(v);
          if (v.data.code === 0) {
            this.$message({
              message: v.data.msg,
              type: "success"
            });
            // 关闭弹出框
            this.dialogFormVisible = false;
            // 重新刷新页面
            this.appaxios();
          } else if (v.data.code !== 0) {
            this.$message.error(v.data.msg);
          }
        } else {
          return false;
        }
      });
    },
    //删除
    handleDelete(row) {
      // 提示是否删除
      this.$confirm("此操作将永久删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 发送axios
          axios
            .get(`http://127.0.0.1:8888/users.php?a=delete&id=${row.id}`)
            .then(v => {
              if (v.data.code === 0) {
                this.$message({
                  showClose: true,
                  message: v.data.msg,
                  type: "success"
                });
                //重新刷新页面
                if (
                  this.$refs.multipleTable.selection.length ===
                    this.$refs.multipleTable.data.length &&
                  this.page === Math.ceil(this.totals / this.pages) &&
                  this.page !== 1
                ) {
                  axios
                    .get(
                      `http://127.0.0.1:8888/users.php?a=list&currentPage=${this
                        .page - 1}&pageSize=${this.pages}`
                    )
                    .then(v => {
                      if (v.data.code === 0) {
                        // 将数据渲染到界面上
                        this.tableData = v.data.data;
                        //渲染总条数
                        this.totals = parseInt(v.data.total);
                      }
                    });
                } else if (
                  this.page === Math.ceil(this.totals / this.pages) &&
                  this.page === 1 &&
                  this.tableData.length === 1
                ) {
                  this.tableData = [];
                } else {
                  this.appaxios();
                }
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //批量删除
    alldelete() {
      //定义一个空数组
      let arr = [];
      // 遍历选中的账号数据
      this.$refs.multipleTable.selection.forEach(v => {
        arr.push(v.id);
      });
      // 发送axios
      if (arr.length === 0) {
        return false;
      } else {
        // 提示是否删除
        this.$confirm("此操作将永久删除这些账号, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 发送axios
            axios
              .get(
                `http://127.0.0.1:8888/users.php?a=delete&id=${arr.join(",")}`
              )
              .then(v => {
                if (v.data.code === 0) {
                  this.$message({
                    showClose: true,
                    message: v.data.msg,
                    type: "success"
                  });

                  //重新刷新页面
                  if (
                    this.$refs.multipleTable.selection.length ===
                      this.$refs.multipleTable.data.length &&
                    this.page === Math.ceil(this.totals / this.pages) &&
                    this.page != 1
                  ) {
                    axios
                      .get(
                        `http://127.0.0.1:8888/users.php?a=list&currentPage=${this
                          .page - 1}&pageSize=${this.pages}`
                      )
                      .then(v => {
                        if (v.data.code === 0) {
                          // 将数据渲染到界面上
                          this.tableData = v.data.data;
                          //渲染总条数
                          this.totals = parseInt(v.data.total);
                        }
                      });
                  } else if (
                    this.$refs.multipleTable.selection.length ===
                      this.$refs.multipleTable.data.length &&
                    this.page === Math.ceil(this.totals / this.pages) &&
                    this.page === 1
                  ) {
                    this.tableData = [];
                  } else {
                    this.appaxios();
                  }
                }
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    //分页功能
    handleSizeChange(val) {
      this.pages = val;
      // 发送请求
      this.appaxios();
    },
    handleCurrentChange(val) {
      this.page = val;
      // 发送请求
      this.appaxios();
    },
    //分页封装axios发送请求
    appaxios() {
      axios
        .get(
          `http://127.0.0.1:8888/users.php?a=list&currentPage=${this.page}&pageSize=${this.pages}`
        )
        .then(v => {
          if (v.data.code === 0) {
            // 将数据渲染到界面上
            this.tableData = v.data.data;
            //渲染总条数
            this.totals = parseInt(v.data.total);
          }
        });
    }
  }
};
</script>
<style>
.account_list .el-table th > .cell {
  padding-left: 20px;
}
.account_list .el-pagination {
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>
