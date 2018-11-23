<template>
  <div class="container">
    <div class='search'>
      <el-select v-model="curshop" style="width:300px" placeholder="店铺" @change="handleShopChange">
        <el-option
          v-for="item in shops"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker style="width:360px"
        v-model="editDateParam"
        type="daterange" value-format="yyyy-MM-dd" @change="editDateParamChange" 
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-input v-model="sheetid" placeholder="单号" style="width:200px"></el-input>

      <el-button type="primary" @click.native.prevent="SearchSheet">{{$t('table.search')}}</el-button>
    </div>
    
 
    <div class='top'>     
      <div class='left'> 
        <el-table ref="headleft" height="300" highlight-current-row @row-click="handleCurSheetChange" v-loading="table_loading" :data="sheets" >
          <el-table-column   type="index"   width="40" fixed> </el-table-column>
          <el-table-column   prop="SheetID"  width='150' label="申请单号"  ></el-table-column>
          <el-table-column  label="课" width='100'> 
            <template slot-scope="scope">
                {{ scope.row.kid + ' - ' + scope.row.kname }}
              </template>
          </el-table-column>
          <el-table-column   prop="AskType" width='60'  label="类型"  > 
              <template slot-scope="scope">
                {{scope.row.AskType | AskType_Desc}}
              </template>
          </el-table-column>
          <el-table-column  width='60' label="状态"  >
            <template slot-scope="scope">
                {{Flag_Desc[scope.row.Flag] || scope.row.Flag}}
            </template>
          </el-table-column>
          <el-table-column   prop="Editor"  width='70' label="制单人" >  </el-table-column>
          <el-table-column  width='150' label="制单日期" >
            <template slot-scope="scope">
              <span>{{new Date(scope.row.EditDate) | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
            </template>
          </el-table-column>
          <el-table-column   prop="Operator"  label="操作人" ></el-table-column>
        </el-table>
         <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curpage" :page-sizes="[10,20,30,50]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div> 
      <div  class='right'>
        <el-table class='fstable' ref="headright" height="300"  highlight-current-row @current-change="handleCurSheetChange" v-loading="table_loading" :data="sheets1" >
          <el-table-column   type="index"   width="40" fixed> </el-table-column>
          <el-table-column   prop="SheetID"  width='150' label="单号"  ></el-table-column>
          <el-table-column  label="课"  width='100'> 
            <template slot-scope="scope">
                {{ scope.row.kid + ' - ' + scope.row.kname }}
              </template>
          </el-table-column>
          <el-table-column   prop="AskType" width='60'  label="类型"  > 
              <template slot-scope="scope">
                {{scope.row.AskType | AskType_Desc}}
              </template>
          </el-table-column>
          <el-table-column  width='60' label="状态"  >
            <template slot-scope="scope">
                {{Flag_Desc[scope.row.Flag] || scope.row.Flag}}
            </template>
          </el-table-column>
          <el-table-column   prop="Editor"  width='70' label="制单人" >  </el-table-column>
          <el-table-column  width='150'  label="审核日期" >
            <template slot-scope="scope">
              <span>{{new Date(scope.row.EditDate) | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
            </template>
          </el-table-column>
          <el-table-column   prop="Operator"  label="操作人" ></el-table-column>
        </el-table>
         <el-pagination background @size-change="handleSizeChange_x" @current-change="handleCurrentChange_x" :current-page="curpage_x" :page-sizes="[10,20,30,50]" :page-size="page_size_x" layout="total, sizes, prev, pager, next, jumper" :total="total_x">
        </el-pagination>
       </div>    
    </div>

    <div class='bottom'>
      <el-tabs class='tab' value='second' type="border-card" @tab-click='doLayout'>
        <el-tab-pane label="明细" name="first">
          <el-table fit ref='bottomleft' height="250" class='items' v-loading="table_loading" :data="items" max-height='500'  width='100%' >
            <el-table-column type="index" width="50"></el-table-column>
             <el-table-column label="商品" width='250'>
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.goodsname }}</span>
              </template>
            </el-table-column>
            <el-table-column :key='col' v-for='col in itemcols' :label="itemcols_desc[col]">
                <template slot-scope="scope">
                  {{scope.row[col]}}
                </template>
              </el-table-column>
            
          </el-table>
        </el-tab-pane>
        <el-tab-pane  label="日志" name="second">
          <el-table height="250" ref='bottomright' class='logs' v-loading="table_loading" :data="logs" width='100%' >
            <el-table-column type="index" width="50"></el-table-column>      
            <el-table-column label="记录时间" width='160'>
              <template slot-scope="scope">
                <span>{{new Date(scope.row.LogTime) | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="LogUser" label="操作人"></el-table-column>   
            <el-table-column prop="LogDesc" width='250' label="描述"></el-table-column>
            <el-table-column prop="GoodsID" label="商品ID"></el-table-column>
            <el-table-column prop="Qty" label="数量"></el-table-column>
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
,'PromotionType'
,'Notes'
,'KSDays'
,'AdviceQty']
const itemcols_desc = 
{'reason': '原因'
,'SheetID': '单号'
,'serialid': '序号'
,'GoodsID': '商品ID'
,'PKNum': '件装数'
,'Qty': '数量'
,'PKName': '件数描述'
,'PKSpec': '件装规格'
,'BarcodeID': '条码'
,'Cost': '进价'
,'Price': '售价'
,'StockQty': '库存'
,'PromotionType': '促销类型'
,'Notes': '备注'
,'KSDays': '可销天数'
,'AdviceQty': '建议数'}
const Flag_Desc = {0:'未审核', 1:'待开始', 2:'待结束', 99:'已取消', 100:'结束'} 
export default {
  name: 'orderReviewQuery',
  data() {
    return {
      IsHQ : process.env.SYS === "HQ",
      itemcols,Flag_Desc,itemcols_desc,
      sheets: [],
      sheets1: [],
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
        num: 0.00
      },
      dialogFormVisible: false,
      rules: {
        num: [{ type: 'number', message: '必须为数字值'}, { required: true, message: '不能为空', trigger: 'blur' }],
      },
      curpage: 1,
      curpage_x: 1,
      page_size: 10,
      page_size_x: 10,
      total: 0,
      total_x: 0,
      auth: 0,
      reviewDesc: ['一审','二审','三审'],
      curSheet: null,
      sheetid: '',
      editDateParam: [parseTime(new Date(),'{y}-{m}-{d}'),parseTime((new Date()).setDate((new Date()).getDate()+1),'{y}-{m}-{d}')],
      editRow: null,
      shopServerUrl: ''
    }    
  },
  filters: {
    AskType_Desc(value) {
      return value === '0'? '手工': value === '1'? '电脑' : value
    },
  },
  async created() {
    // console.log(process.env.SYS)
    await this.fetchData()
  },
  methods: {
    editDateParamChange(){
      // console.log(this.editDateParam)
      // console.log(this.sheetid)
    },
    doLayout(tab) {
       if(tab.name === 'first') {
         this.$refs.bottomleft.doLayout();
       } else {
         this.$refs.bottomright.doLayout();
       }
    },
    openEditForm(row){
       this.dialogFormVisible = true
       this.editRow = row
       this.temp.num = row.Qty
       this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
     
    async fetchData() {
      const auth = await this.$store.dispatch('GetUserReviewAuth')
      // console.log(auth)
      this.auth = auth
      const res = await this.$store.dispatch('GetCurShop')
      this.shops = res.sort((a,b)=>(a.value>b.value?1:(b.value >a.value? -1 : 0)))
      if (this.shops.length > 0) {
        this.curshop = this.shops[0].value
        this.handleShopChange(this.curshop) 
      }
    },
    async getShopServerUrl() {
      let shopServerUrl = ''
      if(this.IsHQ){
        const res = await this.$store.dispatch('GetShopServerUrl', {shopid: this.curshop})
        if(res.length > 0)
          shopServerUrl = res[0].ServerUrl
      }
      return shopServerUrl
    },
    async SearchSheet(ev, lrt) {
       const lr = lrt || 2
      this.items = []
      this.logs = []
      if(!this.curshop) return       
      this.table_loading = true
      console.log(this.editDateParam)
      const res = await this.$store.dispatch('GetSheetsQuery', { shopid: this.curshop, sheetid: this.sheetid, editDateS: this.editDateParam[0], editDateE: this.editDateParam[1], auth: this.auth, curpage: this.curpage || 1 , pagesize: this.page_size || 10, curpage_x: this.curpage_x || 1 , pagesize_x: this.page_size_x || 10, shopServerUrl: this.shopServerUrl,lr })
      const sheets = res.fs
      const sheets1 = res.fs1
      // if(sheets.length > 0){
      //   const sheetids = sheets.map(s=> s. SheetID)
      //   const reasons = await this.$store.dispatch('GetItemReason', { sheetids, auth: this.auth, shopServerUrl: this.shopServerUrl })
      //   const reasonObj = groupBy(reasons, 'SheetID')

      //   for(const s of sheets){
      //     const sr = reasonObj[s.SheetID]
      //     if(sr) {
      //        const r = sr.map(i=>i.reason).filter(i=>i.length>0).join()
      //        s.reason = r //this.$set(s,'reason', r)
      //       }
      //   }
      // }   
      console.log(lr)     
      if(lr===2 || lr===0 ){
        this.sheets = sheets
        this.total = res.total
      }
      if(lr===2 || lr===1 ){
        this.sheets1 = sheets1
        this.total_x = res.total1
      }     
      this.table_loading = false
      this.$message.success('单据加载完成')     
    },    
    async handleCurSheetChange(curSheet) {
      this.curSheet = curSheet
      if(curSheet){
        const res = await this.$store.dispatch('GetSheetDetailQuery', { shopServerUrl: this.shopServerUrl, auth: this.auth, sheetids: [curSheet.SheetID]})
        const items = res[0].length > 0 ? res[0] : res[1]
        this.items = items
        this.logs = res[2]
        const reason = this.items.map(i=>i.reason).filter(i=>i.length>0).toString()
        this.$set(this.curSheet, 'reason', reason)
      }
      else{
        this.items = []
        this.logs = []
      }
    },
    async handleShopChange(curshop) {
      this.shopServerUrl = ''
      this.sheets = []
      this.items = []
      this.logs = []
      const shopServerUrl = await this.getShopServerUrl()
      if(this.IsHQ && !shopServerUrl){
        this.$message.error('所选店铺没有配置店铺服务URL地址')
        return
      }
      if(this.IsHQ && shopServerUrl)
        this.shopServerUrl = shopServerUrl + '/api'
      await this.SearchSheet()     
    },
    handleSizeChange(val) {
      this.page_size = val
      this.SearchSheet(null, 0)
    },
    handleCurrentChange(val) {
      this.curpage = val
      this.SearchSheet(null, 0)
    },
    handleSizeChange_x(val) {
      this.page_size_x = val
      this.SearchSheet(null, 1)
    },
    handleCurrentChange_x(val) {
      this.curpage_x = val
      this.SearchSheet(null, 1)
    }
  }
}
</script>




<style rel="stylesheet/scss" lang="scss" scoped>

$dark_gray:#889aa4;
$light_gray:#fff;
.container {
  .search{
    display: flex;
    justify-content: flex-start;
  }
  border:2px solid beige;
  border-radius: 1px;
  padding: 10px;
  .top{
    border:2px solid beige;
    border-radius: 1px;
    padding: 1px;
    display: flex; 
    .left{     
      overflow-x: scroll;
      flex:1;
    }
    .right{
      overflow-x: scroll;
      border-left: 2px solid beige;
      flex:1;
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


