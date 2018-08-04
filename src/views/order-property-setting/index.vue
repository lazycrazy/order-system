<template>
  <div class="container">
<el-tabs v-model="activeName" class="tab">
    <el-tab-pane label="店铺" name="first"><el-table
    :data="propertys.shops"
    style="width: 100%">
     <el-table-column
      label="店铺"
      width="280">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="是否可订货">
      <template slot-scope="scope">
        <el-switch
  v-model='scope.row.allowOrder'
  active-text="可订"
  inactive-text="不可订" @change="handleSwitch(scope.row)">
</el-switch>        
      </template>
    </el-table-column>
  </el-table>
</el-tab-pane>
    <el-tab-pane label="毛利属性" name="second"><el-table
    :data="propertys.mlsxs"
    style="width: 100%">
     <el-table-column
      label="毛利属性"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="是否可订货">
      <template slot-scope="scope">
        <el-switch
  v-model='scope.row.allowOrder'
  active-text="可订"
  inactive-text="不可订" @change="handleSwitch(scope.row)">
</el-switch>        
      </template>
    </el-table-column>
  </el-table>
</el-tab-pane>
    <el-tab-pane label="销售属性" name="third"><el-table
    :data="propertys.xssxs"
    style="width: 100%">
     <el-table-column
      label="销售属性"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="是否可订货">
      <template slot-scope="scope">
        <el-switch
  v-model='scope.row.allowOrder'
  active-text="可订"
  inactive-text="不可订" @change="handleSwitch(scope.row)">
</el-switch>        
      </template>
    </el-table-column>
  </el-table></el-tab-pane>
    <el-tab-pane label="品类店型组" name="fourth"><el-table
    :data="propertys.pldxzs"
    style="width: 100%">
     <el-table-column
      label="店铺"
      width="280">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.storename }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="小类"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.deptname }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="SkuType"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.skutype }}</span>
      </template>
    </el-table-column>
    <el-table-column label="是否可订货">
      <template slot-scope="scope">
        <el-switch
  v-model='scope.row.allowOrder'
  active-text="可订"
  inactive-text="不可订" @change="handleSwitch(scope.row)">
</el-switch>        
      </template>
    </el-table-column>
  </el-table></el-tab-pane>
  </el-tabs>
      
       
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      propertys: {
        mlsxs: [],
        pldxzs: [],
        shops: [],
        xssxs: []
      }
    }
  },
  async created() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await this.$store.dispatch('GetOrderProperty')
      res.mlsxs.forEach(i => { i.allowOrder = !i.forbidden })
      res.pldxzs.forEach(i => { i.allowOrder = !i.forbidden })
      res.shops.forEach(i => { i.allowOrder = !i.forbidden })
      res.xssxs.forEach(i => { i.allowOrder = !i.forbidden })
      this.propertys = res
    },
    async handleSwitch(row) {
      try {
        await this.$store.dispatch('SetOrderProperty', Object.assign({}, row))
        row.isnew = false
        this.$message.success('设置成功')
      } catch (err) {
        row.allowOrder = !row.allowOrder
        this.$message.error('设置失败')
      }
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>




<style rel="stylesheet/scss" lang="scss" scoped>

$dark_gray:#889aa4;
$light_gray:#fff;
.container {
  display: flex;
  .tab {
    width: 100%;
    border:2px solid beige;
    border-radius: 1px;
    padding: 20px;
    margin: 20px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 80%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  
  .login-form {
    width: 420px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>


