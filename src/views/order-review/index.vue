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
  <el-button type="primary" @click.native.prevent="SearchSheet">{{$t('table.search')}}</el-button>
 
    <div class='top'>       
      <el-table class='fstable' height="300" highlight-current-row @current-change="handleCurSheetChange" v-loading="table_loading" :data="sheets" >
        <el-table-column   type="index"   width="50"> </el-table-column>
        <el-table-column  prop="ShopName"   label="店铺" width='190'></el-table-column>     
        <el-table-column   prop="SheetID"  width='160' label="单号"  ></el-table-column>
        <el-table-column   prop="ManageDeptID" label="ManageDeptID" > </el-table-column>
        <el-table-column   prop="AskType" width='80'  label="AskType"  > </el-table-column>
        <el-table-column   prop="Flag" width='60' label="Flag"  > </el-table-column>
        <el-table-column   prop="Editor"  width='80' label="编辑人" >  </el-table-column>
        <el-table-column   label="编辑时间" >
          <template slot-scope="scope">
            <span>{{scope.row.EditDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column   prop="Operator"  label="操作人" ></el-table-column>
        <el-table-column label="审批">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" v-if="canReview(1, scope.row)" @click="first(scope.row)">一审</el-button>
            <el-button size="mini" type="danger" v-if="canReview(2, scope.row)" @click="second(scope.row)">二审</el-button>
            <el-button size="mini" type="danger" v-if="canReview(3, scope.row)" @click="third(scope.row)">三审</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curpage" :page-sizes="[10,20,30,50]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <div class='bottom'>
      <el-tabs class='tab' value='first' type="border-card">
        <el-tab-pane label="明细" name="first">
          <el-table class='items' v-loading="table_loading" :data="items"  width='100%' >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="修改">
               <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleUpdate(scope.row)">修改</el-button>
              </template>
            </el-table-column>
             <el-table-column label="商品" width='250'>
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.goodsname }}</span>
              </template>
            </el-table-column>
            <el-table-column :key='col' v-for='col in itemcols' :label="col">
                <template slot-scope="scope">
                  {{scope.row[col]}}
                </template>
              </el-table-column>
            
          </el-table>
        </el-tab-pane>
    <el-tab-pane label="日志" name="second">
      <el-table class='logs' v-loading="table_loading":data="logs" width='100%' >
        <el-table-column type="index" width="50"></el-table-column>      
        <el-table-column prop="LogTime" label="时间" width='130'></el-table-column>
        <el-table-column prop="LogUser" label="操作人"></el-table-column>   
        <el-table-column prop="LogDesc" label="描述"></el-table-column>
      </el-table>
    </el-tab-pane>
     
  </el-tabs>
      

      
    </div>

  </div>
</template>

<script>
import { groupBy, chunkArray, parseTime } from '@/utils'

const itemcols = ['reason','SheetID'
,'serialid'
,'GoodsID'
,'PKNum'
,'Qty'
,'PKName'
,'PKSpec'
,'BarcodeID'
,'Cost'
,'Price'
,'StockQty'
,'SaleDate'
,'ReceiptDate'
,'PromotionType'
,'NewFlag'
,'Notes'
,'MonthSaleQty'
,'LastWeekSaleQty'
,'KSDays'
,'InputGoodsId'
,'OrdDay'
,'MakeUpInterval'
,'DeliverDay'
,'AdviceQty'
,'SSQ'
,'retdcflag'
,'DeliveryAddr'
,'SafeInventoryDay'
,'COV'
,'CanSaleQty'
,'OpenTransQty'
,'LastyearSaleQty'
,'MakeupDays'
,'LastTotalSaleQty'
]
export default {
  data() {
    return {
      itemcols,
      sheets: [],
      items: [],
      logs: [],
      shops: [],
      checkShops: [],
      curshop: null,
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
      page_size: 10,
      total: 0,
      auth: 0
    }    
  },
  async created() {
    await this.fetchData()
  },
  methods: {
    canReview(auth, row){
       const can = this.auth === auth && !row.reason
       return can
    },
    async fetchData() {
      const auth = await this.$store.dispatch('GetUserReviewAuth')
      console.log(auth)
      this.auth = auth
      const res = await this.$store.dispatch('GetShop')
      this.shops = res
      if (this.shops.length > 0) {
        this.curshop = this.shops[0].value
        this.handleShopChange(this.curshop) 
      }
    },
    async SearchSheet() {
      if(!this.curshop) return 
      this.table_loading = true
      const res = await this.$store.dispatch('GetSheets', { shopid: this.curshop, curpage: this.curpage || 1 , pagesize: this.page_size || 10 })
      const sheets = res.fs
      this.total = res.total
      if(sheets.length > 0){
        const sheetids = sheets.map(s=> s. SheetID)
        const reasons = await this.$store.dispatch('GetItemReason', { sheetids })
        const reasonObj = groupBy(reasons, 'SheetID')

        for(const s of sheets){
          const sr = reasonObj[s.SheetID]
          if(sr) {
             const r = sr.map(i=>i.reason).join()
             s.reason = r //this.$set(s,'reason', r)
            }
        }
      }      
      this.sheets = sheets
      this.table_loading = false
      this.$message.success('单据加载完成')           
    },    
    async handleCurSheetChange(curSheet) {
      const res = await this.$store.dispatch('GetSheetDetail', { sheetids: [curSheet.SheetID]})
      console.log(res)
      this.items = res[0]
      this.logs = res[1]
    },
    async handleShopChange(curshop) {
      await this.SearchSheet()     
    },
    handleSizeChange(val) {
      this.page_size = val
      this.SearchSheet()
    },
    handleCurrentChange(val) {
      this.curpage = val
      this.SearchSheet()
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
    async handleUpdate(row){
      const rs = await this.$store.dispatch('DeleteFunctionSetting', {shopid: row.ShopId
, functionid: row.FunctionId, goodsid: row.GoodsId})
      await this.SearchSheet()
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
  .top{
    border:2px solid beige;
    border-radius: 1px;
    padding: 10px;
    display: flex; 
    flex-flow: column;
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
  .bottom{
    display: flex;
    .tab{
      width: 100%
    }
  }
}
</style>


