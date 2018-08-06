<template>
  <div class="container">
 
    <el-select v-model="curshop" placeholder="请选择店铺" @change="handleShopChange">
    <el-option
      v-for="item in shops"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-button type="primary">复制应用到它店</el-button>

 
<div class='content'>
  <div class='left'>
    <div class='header'>
      <span>店铺商品列表：</span>
      <el-button type="primary" @click.native.prevent="handleAdd">添加设置</el-button>
    </div>   

    <el-tree
      ref="tree"
      v-loading="tree_loading"
      :props="defaultProps"
      :data="shopGoods"
      show-checkbox
      @check-change="handleCheckChange" >
    </el-tree>
</div>
  <div class='right'>
     <el-radio-group v-model="curfunc" @change="handleFunctionChange()">
      <el-radio-button :label="1">一级审批</el-radio-button>
      <el-radio-button :label="2">二级审批</el-radio-button>
      <el-radio-button :label="3">三级审批</el-radio-button>
    </el-radio-group>
    <el-table
    v-loading="table_loading"
    :data="functionSettings" >
     <el-table-column
      label="商品">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.goodsname }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="deptname"
      label="小类"
      >
    </el-table-column>
     <el-table-column
      prop="ordermultiple"
      label="最大订货倍数"
      >
    </el-table-column>
<el-table-column
      prop="ordernum"
      label="最大订货数"
      ></el-table-column>
      <el-table-column
      prop="ordernum"
      label="最大订货额"
      ></el-table-column>
      <el-table-column
      prop="dayupperlimit"
      label="每日最大订货数"
      ></el-table-column>
      <el-table-column
      prop="dayupperlimitamt"
      label="每日最大订货额"
      >
    </el-table-column>
    <el-table-column label="删除">
       <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  </div>

</div>
    
    
 
       
  </div>
</template>

<script>
export default {
  data() {
    return {
      functionSettings: [],
      shops: [], 
      curshop: null,
      curfunc: 1,
      shopGoods: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tree_loading: false,
      table_loading: false  
    }    
  },
  async created() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await this.$store.dispatch('GetShop')
      this.shops = res
      if (this.shops.length > 0) {
        this.curshop = this.shops[0].value
        await this.handleShopChange(this.curshop) 
      }
    },

    async refreshShopGoods(){
      this.tree_loading = true
      const shopGoods = await this.$store.dispatch('GetShopGoods',this.curshop)
      console.log(shopGoods.length)
      let bl = shopGoods.splice(0, shopGoods.findIndex(d => d.type===2)),
          kl = shopGoods.splice(0, shopGoods.findIndex(d => d.type===3)),
          dl = shopGoods.splice(0, shopGoods.findIndex(d => d.type===4)),
          zl = shopGoods.splice(0, shopGoods.findIndex(d => d.type===5)),
          xl = shopGoods.splice(0, shopGoods.findIndex(d => d.type===6)),
          sl = shopGoods
      console.log(bl.length,kl.length,dl.length,zl.length,xl.length,sl.length)
      bl.forEach(b=>b.children = kl.filter(k=> k.pid === b.id))
      kl.forEach(b=>b.children = dl.filter(k=> k.pid === b.id))
      dl.forEach(b=>b.children = zl.filter(k=> k.pid === b.id))
      zl.forEach(b=>b.children = xl.filter(k=> k.pid === b.id))
      xl.forEach(b=>b.children = sl.filter(k=> k.pid === b.id))
      this.shopGoods =  bl
      this.tree_loading = false
      this.$message.success('店铺商品加载完成')
    },
    async refreshFunctionSettings(){
      if(!this.curfunc || !this.curshop) return 
      this.table_loading = true
      var millisecondsToWait = 100;
      let that = this
      setTimeout(async function() {
            const fs = await that.$store.dispatch('GetFunctionSetting', { shopid: that.curshop, funcid: that.curfunc })
            that.functionSettings = fs
            that.table_loading = false
            that.$message.success('功能数据加载完成')
      }, millisecondsToWait);      
    },
    handleShopChange(curshop) {
      Promise.all([this.refreshShopGoods(),this.refreshFunctionSettings()])       
    },
    async handleFunctionChange(row) {
        await this.refreshFunctionSettings()
    },
    handleAdd() {
      console.log(this.$refs.tree.getCheckedNodes());
      console.log(this.$refs.tree.getCheckedKeys());
      // this.$refs.tree.setCheckedKeys([3]);
      // this.$refs.tree.setCheckedKeys([]);
    },
    handleCheckChange() {
      //console.log(arguments);      
    }
  }
}
</script>




<style rel="stylesheet/scss" lang="scss" scoped>

$dark_gray:#889aa4;
$light_gray:#fff;
.container {
  border:2px solid beige;
  border-radius: 1px;
  padding: 10px;
  .content{
    border:2px solid beige;
    border-radius: 1px;
    padding: 10px;
    min-height: 1000px;
    display: flex;
    .left{
      border:2px solid beige;
      border-radius: 1px;
      padding: 10px;
      flex-grow: 1;
      min-width: 300px;
      overflow-x: scroll;
      .header{
        display: flex;
        justify-content: space-between;
      }
    }
    .right{
      border:2px solid beige;
      border-radius: 1px;
      padding: 10px;
      flex-grow: 2;
      overflow-x: scroll;
    }
  }
}
</style>


