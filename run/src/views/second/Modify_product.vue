<template>
  <div class="add_item">
    <!-- <h1>修改商品</h1> -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- 商品名称 -->
      <el-form-item
        label="商品名称"
        prop="appname"
      >
        <el-input
          style="width:300px"
          v-model="ruleForm.appname"
        ></el-input>
      </el-form-item>
      <!-- 商品分类 -->
      <el-form-item
        label="商品分类"
        prop="region"
      >
        <el-select
          v-model="ruleForm.region"
          placeholder="请选择商品分类"
        >
          <el-option
            label="肉类"
            value="肉类"
          ></el-option>
          <el-option
            label="蔬菜类"
            value="蔬菜类"
          ></el-option>
          <el-option
            label="水果类"
            value="水果类"
          ></el-option>
          <el-option
            label="海鲜类"
            value="海鲜类"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 商品特色 -->
      <el-form-item
        label="商品特色"
        prop="type"
      >
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox
            label="新品上市"
            name="type"
          ></el-checkbox>
          <el-checkbox
            label="第二单半价"
            name="type"
          ></el-checkbox>
          <el-checkbox
            label="主打产品"
            name="type"
          ></el-checkbox>
          <el-checkbox
            label="火爆产品"
            name="type"
          ></el-checkbox>
          <el-checkbox
            label="祖传手艺"
            name="type"
          ></el-checkbox>
          <el-checkbox
            label="源自四川"
            name="type"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 商品图片 -->
      <el-form-item label="商品图片">
        <el-upload
          action="http://127.0.0.1:8888/goods.php?a=uploadImg"
          list-type="picture-card"
          :on-success="handleAvatarSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img
            width="100%"
            :src="dialogImageUrl"
            alt=""
          >
        </el-dialog>
      </el-form-item>
      <!-- 是否促销 -->
      <el-form-item
        label="是否促销"
        prop="resource"
      >
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="促销"></el-radio>
          <el-radio label="不促销"></el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 食品规格 -->
      <el-form-item
        label="食品规格"
        prop="resources"
      >
        <el-radio-group v-model="ruleForm.resources">
          <el-radio label="单规格"></el-radio>
          <el-radio label="多规格"></el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 包装费 -->
      <el-form-item
        label="包装费"
        prop="num"
      >
        <el-input-number
          v-model="num"
          @change="handleChange"
          :min="1"
          :max="10"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
      <!-- 价格 -->
      <el-form-item
        label="价格"
        prop="nums"
      >
        <el-input-number
          v-model="nums"
          @change="handleChanges"
          :min="1"
          :max="10"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
      <!-- 商品描述 -->
      <el-form-item
        label="商品描述"
        prop="desc"
      >
        <el-input
          type="textarea"
          v-model="ruleForm.desc"
        ></el-input>
      </el-form-item>
      <!-- 添加 -->
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  //对象创建时
  async created() {
    //   接收商品列表传过来的id
    console.log(this.$route.params.id);
    //获取一条商品信息
    let v = await this.axios.get(
      `goods.php?a=readOne&id=${this.$route.params.id}`
    );
    console.log(v);

    if (v.data.code === 0) {
      //商品名称
      this.ruleForm.appname = v.data.data.goodsname;
      // 商品分类
      this.ruleForm.region = v.data.data.goodscategory;
      //商品特色
      this.ruleForm.type = v.data.data.goodsfeature.split(",");
      //商品图片
      v.data.data.imgUrl.split(",").forEach(value => {
        //定义图片数据
        let obj = {
          url: ""
        };
        obj.url = value;
        this.fileList.push(obj);
      });
      //将默认的图片保存在myurls中
      this.fileList.forEach(val => {
        this.myurls.push(val.url);
      });
      //是否促销
      this.ruleForm.resource = v.data.data.isPromotion;
      //食品规格
      this.ruleForm.resources = v.data.data.standard;
      //包装费
      this.num = v.data.data.packprice;
      //价格
      this.nums = v.data.data.price;
      //描述
      this.ruleForm.desc = v.data.data.goodsdesc;
    }
  },
  // 数据
  data() {
    return {
      ruleForm: {
        // 表单数据
        appname: "",
        region: "",
        type: [],
        resource: "促销",
        resources: "单规格",
        desc: ""
      },
      //包装费
      num: "",
      //价格
      nums: "",
      // 上传图片样式
      dialogImageUrl: "",
      dialogVisible: false,
      //默认显示图片路径数组
      fileList: [],
      //保存在数据库时，定义一个数组保存图片路径
      myurls: [],
      //   表单验证
      rules: {
        //   商品名称
        appname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        // 商品分类
        region: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ],
        // 商品特点
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个商品特点",
            trigger: "change"
          }
        ],
        // 是否促销
        resource: [
          { required: true, message: "请选择是否促销", trigger: "change" }
        ],
        // 食品规格
        resources: [
          { required: true, message: "请选择食品规格", trigger: "change" }
        ],
        // 商品描述
        desc: [{ required: true, message: "请填写商品描述", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 包装费
    handleChange(value) {
      console.log(value);
    },
    // 价格
    handleChanges(value) {
      console.log(value);
    },
    //上传图片处理函数
    //1 删除
    handleRemove(file) {
      let img = file.url;
      //删除myurls中对应图片
      if (this.myurls.indexOf(img) !== -1) {
        this.myurls.splice(this.myurls.indexOf(img), 1);
      }
    },
    //2 放大
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //3 上传时候
    handleAvatarSuccess(res) {
      // 上传图片的路径保存在数组中
      let iurl = "http://127.0.0.1:8888/" + res.data;
      this.myurls.push(iurl);
    },
    // 表单按钮函数
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //获取数据
          let obj = {
            id: this.$route.params.id,
            goodsname: this.ruleForm.appname,
            goodscategory: this.ruleForm.region,
            goodsfeature: this.ruleForm.type.join(","),
            imgUrl: this.myurls.join(","),
            isPromotion: this.ruleForm.resource,
            standard: this.ruleForm.resources,
            packprice: this.num,
            price: this.nums,
            goodsdesc: this.ruleForm.desc
          };
          //修改商品
          let v = await this.axios.post(
            "goods.php?a=edit",
            this.qs.stringify(obj)
          );
          console.log(v);
          if (v.data.code === 0) {
            this.$message({
              message: "v.data.msg",
              type: "success"
            });
            //跳转到商品列表页面
            this.$router.push("/home/product_list");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style>
.add_item .appimg {
  font-family: "微软雅黑";
  font-size: 14px;
  padding-left: 33px;
  display: flex;
}
.add_item .appimg span {
  margin-right: 10px;
  color: #606266;
}
</style>