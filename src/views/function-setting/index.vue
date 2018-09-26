<template>
  <div class="container">
 
    <el-select v-model="curshop"  style="width:300px"  placeholder="请选择店铺" @change="handleShopChange">
    <el-option
      v-for="item in allShops"
      :key="item.shopid"
      :label="item.shopid+' - '+item.shopname"
      :value="item.shopid">
    </el-option>
  </el-select>
  <el-button type="primary" @click.native.prevent="dialogSelectShopVisible=true">复制应用到它店</el-button>
  <label  v-if='IsHQ' class='import'>
    <input ref='import' type="file" @change="fsImport1" accept=".csv" v-show='false'/>
    导入
  </label>

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
    <el-table class='fstable' 
    v-loading="table_loading"
    :data="functionSettings" >
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
     <el-table-column 
      label="商品" width='400px'>
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.customno + ' - ' + scope.row.goodsname }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="barcodeid"
      label="条码" width="180"/>
    </el-table-column>
    <el-table-column 
        label="课" width='230'>
         <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.kid +' - ' + scope.row.kname }}</span>
       </template>
      </el-table-column>
      <el-table-column 
        label="小类" width='230'>
         <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.DeptId +' - ' + scope.row.deptname }}</span>
       </template>
      </el-table-column>
      <el-table-column
      prop="cost"
      label="进价" />
      <el-table-column
      prop="minorderqty"
      label="最小订货数" />
      <el-table-column
      prop="ordermultiple"
      label="最大订货倍数">
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
          @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

   <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curpage" :page-sizes="[100,200,300, 500]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
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
       

  <el-dialog title="选择应用同样设置的店" :visible.sync="dialogSelectShopVisible"  width="30%">
       
          店型组：
          <el-select v-model="selectedTypes" style="width: 210px;" collapse-tags multiple placeholder="请选择">
              <el-option
                v-for="item in shopTypes"
                :key="item.shoptypeid"
                :label="item.shoptypeid + ' - ' + item.shoptypename"
                :value="item.shoptypeid">
              </el-option>
          </el-select>
          <el-checkbox-group v-model="checkShops" class='checkgroup'>
           <el-checkbox v-for="s in shops" :label="s.shopname" :key="s.shopid" :disabled="curshop === s.shopid" border>{{s.shopid+' - '+s.shopname}}</el-checkbox>
          </el-checkbox-group>
        
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectShopVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="confirmShops">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { groupBy, chunkArray } from '@/utils'


export default {
  name: 'functionSetting',
  data() {
    return {
      IsHQ : process.env.SYS === "HQ",
      selectedTypes: [],
      allShops: [],
      type_shops: [],
      functionSettings: [],
      checkShops: [],
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
      dialogSelectShopVisible: false,
      rules: {
        multiple: [{ type: 'number', message: '必须为数字值'}],
        num: [{ type: 'number', message: '必须为数字值'}],
        amt: [{ type: 'number', message: '必须为数字值'}],
        day_limit_num: [{ type: 'number', message: '必须为数字值'}, { required: true, message: '不能为空', trigger: 'blur' }],
        day_limit_amt: [{ type: 'number', message: '必须为数字值'}, { required: true, message: '不能为空', trigger: 'blur' }]
      },
      curpage: 1,
      page_size: 100,
      total: 0
    }    
  },
  computed: {
    shopTypes () {
      return this.type_shops.filter(function (s, i, arr) {
        return  arr.findIndex(f=> f.shoptypeid == s.shoptypeid && f.shoptypename.trim() == s.shoptypename.trim() ) === i
      })
    },
    shops () {
      return this.type_shops.filter(f=> this.selectedTypes.includes(f.shoptypeid) && f.shopid !== this.curshop)
    },
  },
  async created() {
    await this.fetchData()
  },
  methods: {
    fsImport1(e) {
      const self = this 
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload =  async (e) => {
          const data = e.target.result
          const rows = data.split(/\r?\n/).filter(r=>r.trim().length > 0)
          rows.shift()
          const srows = rows.map(r => {
            const strs = r.split(',')
            const o = strs.reduce((acc, cur, i) => { 
              acc['Col'+(i+1)] = cur
              return acc
              },{})
            return o
          })
          console.log(srows)
          //发送到服务端
         const res = await self.$store.dispatch('FunctionSettingImport', { data: srows}) 
          console.log(res)
          self.$message.success(`更新：${res[0]}条，新增：${res[1]}条`)
      }
      reader.readAsText(file)    

      this.$refs['import'].value = null
    },
    async fetchData() { 
      const type_shops = await this.$store.dispatch('GetShopTypes')
      this.type_shops = type_shops
      this.allShops = this.type_shops.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.shopid == s.shopid ) === i
       }).sort((a,b)=>(a.shopid > b.shopid) ? 1 : ((b.shopid > a.shopid) ? -1 : 0)) 

      if (this.allShops.length > 0) {
        this.curshop = this.allShops[0].shopid
        this.handleShopChange(this.curshop) 
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
      const res = await that.$store.dispatch('GetFunctionSetting', { shopid: that.curshop, funcid: that.curfunc, curpage: that.curpage || 1 , pagesize: that.page_size || 100 })
      console.log('fs')
      console.log(res)
      that.functionSettings = res.fs
      that.total = res.total
      console.log('fs loaded')
      that.table_loading = false
      that.$message.success('功能数据加载完成')           
    },
    async handleShopChange(curshop) {
      await Promise.all([this.refreshShopGoods(),this.refreshFunctionSettings()])       
    },
    async handleFunctionChange(row) {
        await this.refreshFunctionSettings()
    },
    handleSizeChange(val) {
      this.page_size = val
      this.refreshFunctionSettings()
    },
    handleCurrentChange(val) {
      this.curpage = val
      this.refreshFunctionSettings()
    },
    handleOpenSelectShops(){
      this.dialogSelectShopVisible = true
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
    async handleDelete(row){
      const rs = await this.$store.dispatch('DeleteFunctionSetting', {shopid: row.ShopId
, functionid: row.FunctionId, goodsid: row.GoodsId})
      await this.refreshFunctionSettings()
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    },
    async confirmShops() { 
      if(this.checkShops.length ===0) return
      const res = await this.$store.dispatch('SetFunctionSettingByShop', {curshop: this.curshop, shops: this.checkShops})
      // console.log(res)
      this.dialogSelectShopVisible = false
      this.checkShops= []
      this.$notify({
        title: '成功',
        message: '应用到它店成功',
        type: 'success',
        duration: 2000
      })
    },
    confirm() {
      const that = this
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const tempData = Object.assign({}, that.temp)
          const obj = {shopid: that.curshop, functionid: that.curfunc, multiple: tempData.multiple, num: tempData.num, amt: tempData.amt, limitnum: tempData.day_limit_num, limitamt: tempData.day_limit_amt, iids: null, uids: null}
          //处理选择的商品
          const ids = that.$refs.tree.getCheckedNodes().filter(n=>n.type===6).map(n=> n.id)
          //获取已存在的商品ID 
          const exIds = await that.$store.dispatch('GetGoodsIdBySF', { shopid: that.curshop, functionid: that.curfunc})
          console.log(ids)
          console.log(exIds)
          obj.iids = chunkArray(ids.filter(i=> exIds.findIndex(fs=> fs.goodsid === i) === -1), 1000)
          obj.uids = chunkArray(ids.filter(i=> exIds.findIndex(fs=> fs.goodsid === i) > -1), 1000)
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
  .import {
    padding: 10px 20px;
    font-weight: 500;
    border:2px solid grey;
    border-radius: 4px;
    font-size: 14px;
    color: grey;
  }
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
      .fstable{
        border:2px solid beige;
        border-radius: 1px;
      }
    }
  }
  .checkgroup{
    display: flex;
    flex-wrap: wrap;
    flex-flow: column;
    overflow-y: scroll;
    height: 300px;
    :first-child{
      margin-left: 10px;
    }
  }
}
</style>


