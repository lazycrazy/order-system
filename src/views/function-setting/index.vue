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
        label="小类">
      </el-table-column>
      <el-table-column
      prop="ordermultiple"
      label="最大订货倍数"
      >
      </el-table-column>
      <el-table-column
      prop="OrderNum"
      label="最大订货数"
      ></el-table-column>
      <el-table-column
      prop="OrderAmt"
      label="最大订货额"
      ></el-table-column>
      <el-table-column
      prop="DayUpperlimit"
      label="每日最大订货数"
      ></el-table-column>
      <el-table-column
      prop="DayUpperlimitAmt"
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
    
    
 <el-dialog title="设置属性值" :visible.sync="dialogFormVisible"  width="35%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px" >
        <el-form-item label="最大订货倍数" prop="multiple">
      <el-input type="number" v-model.number="temp.multiple" placeholder='0.00' min="0.00" step="0.01" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="最大订货数" prop="num">
      <el-input type="number" v-model.number="temp.num" placeholder='0.00' min="0.00" step="0.01" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="最大订货金额" prop="amt">
      <el-input type="number" v-model.number="temp.amt" placeholder='0.00' min="0.00" step="0.01" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="每日最大订货数" prop="day_limit_num">
      <el-input type="number" v-model.number="temp.day_limit_num" placeholder='0.00' min="0.00" step="0.01" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="每日最大订货金额" prop="day_limit_amt">
      <el-input type="number" v-model.number="temp.day_limit_amt" placeholder='0.00' min="0.00" step="0.01" auto-complete="off"></el-input>
        </el-form-item>         
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
       
  </div>
</template>

<script>
import { groupBy, chunkArray } from '@/utils'


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
      table_loading: false,
      temp: {
        multiple: 0.00,
        num: 0.00,
        amt: 0.00,
        day_limit_num: 0.00,
        day_limit_amt: 0.00
      },
      dialogFormVisible: false,
      rules: {
        multiple: [{ type: 'number', message: '必须为数字值'}],
        num: [{ type: 'number', message: '必须为数字值'}],
        amt: [{ type: 'number', message: '必须为数字值'}],
        day_limit_num: [{ type: 'number', message: '必须为数字值'}, { required: true, message: '不能为空', trigger: 'blur' }],
        day_limit_amt: [{ type: 'number', message: '必须为数字值'}, { required: true, message: '不能为空', trigger: 'blur' }]
      }
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

    async refreshShopGoods() {
      this.tree_loading = true
      console.time('getdata')
      const shopGoods = await this.$store.dispatch('GetShopGoods',this.curshop)
      console.timeEnd('getdata')
      console.time('split')
      let bl = shopGoods.splice(0, shopGoods.findIndex(d => d.type===2)),
          kl = groupBy(shopGoods.splice(0, shopGoods.findIndex(d => d.type===3)),'pid'),
          dl = groupBy(shopGoods.splice(0, shopGoods.findIndex(d => d.type===4)),'pid'),
          zl = groupBy(shopGoods.splice(0, shopGoods.findIndex(d => d.type===5)),'pid'),
          xl = groupBy(shopGoods.splice(0, shopGoods.findIndex(d => d.type===6)),'pid'),
          sl = groupBy(shopGoods,'pid')
      console.timeEnd('split')
      console.time('setchildren')
      bl.forEach(b=>b.children = kl[b.id])
      Object.values(kl).forEach(b=> b.forEach(c=> c.children = dl[c.id]))
      Object.values(dl).forEach(b=> b.forEach(c=> c.children = zl[c.id]))
      Object.values(zl).forEach(b=> b.forEach(c=> c.children = xl[c.id]))
      Object.values(xl).forEach(b=> b.forEach(c=> c.children = sl[c.id]))
      console.timeEnd('setchildren')
      this.shopGoods = bl
      this.tree_loading = false
      this.$message.success('店铺商品加载完成')
    },
    async refreshFunctionSettings() {
      if(!this.curfunc || !this.curshop) return 
      this.table_loading = true
      let that = this      
      const fs = await that.$store.dispatch('GetFunctionSetting', { shopid: that.curshop, funcid: that.curfunc })
      console.log('fs')
      console.log(fs)
      that.functionSettings = fs
      console.log('fs loaded')
      that.table_loading = false
      that.$message.success('功能数据加载完成')           
    },
    handleShopChange(curshop) {
      Promise.all([this.refreshShopGoods(),this.refreshFunctionSettings()])       
    },
    async handleFunctionChange(row) {
        await this.refreshFunctionSettings()
    },
    handleAdd() {
      const ns = this.$refs.tree.getCheckedNodes().filter(n=>n.type===6)
      if (ns.length ===0 )
      {
        this.$message.warning('请勾选商品')
        return
      }

      this.temp = {
        multiple: 0.00,
        num: 0.00,
        amt: 0.00,
        day_limit_num: 0.00,
        day_limit_amt: 0.00
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // this.$refs.tree.setCheckedKeys([3]);
      // this.$refs.tree.setCheckedKeys([]);
    },
    handleCheckChange() {
      //console.log(arguments);      
    },
    confirm() {
      const that = this
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const tempData = Object.assign({}, that.temp)
          const obj = {shopid: that.curshop, functionid: that.curfunc, multiple: tempData.multiple, num: tempData.num, amt: tempData.amt, limitnum: tempData.day_limit_num, limitamt: tempData.day_limit_amt, iids: null, uids: null}
          //处理选择的商品
          const ids = that.$refs.tree.getCheckedNodes().filter(n=>n.type===6).map(n=> n.id)
          obj.iids = chunkArray(ids.filter(i=> that.functionSettings.findIndex(fs=> fs.goodsid === i.id) === -1), 1000)
          obj.uids = chunkArray(ids.filter(i=> that.functionSettings.findIndex(fs=> fs.goodsid === i.id) > -1), 1000)
          console.log(ids.length)
          console.log(obj.iids.length)
          console.log(obj.uids.length)
           
          console.log(obj)
          const res = await that.$store.dispatch('SetFunctionSetting', obj)
          console.log(res)
          await this.refreshFunctionSettings()
          that.dialogFormVisible = false
          that.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            duration: 2000
          })
          // })
        }
      })
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


