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
      <el-input v-model="barcodeid" placeholder="商品码" style="width:200px"></el-input>

      <el-button type="primary" @click.native.prevent="SearchSheet">{{$t('table.search')}}</el-button>
      <el-button type="primary" @click.native.prevent="exportDoc">{{$t('table.export')}}</el-button>
    </div>
    
 
    <div class='top'>      

      <el-table fit  class='fstable' ref="head" height="600" highlight-current-row  v-loading="table_loading" :data="sheets" >
        <el-table-column   type="index"   width="50"> </el-table-column>
        <el-table-column   label="店铺"  > 
           <template slot-scope="scope">
            <span>{{ scope.row.shopid + ' - ' + scope.row.shopname}}</span>
          </template>
        </el-table-column> 
        <el-table-column   label="审核日期"  > 
           <template slot-scope="scope">
            <span>{{ scope.row.editdate }}</span>
          </template>
        </el-table-column> 
        <el-table-column  prop="SheetID"   label="课" width='100' > 
           <template slot-scope="scope">
            <span>{{ scope.row.kid + ' - ' + scope.row.kname }}</span>
          </template>
        </el-table-column> 
        <el-table-column  prop="SheetID"  label="小类"  > 
           <template slot-scope="scope">
            <span>{{ scope.row.deptid + ' - ' + scope.row.deptname }}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="barcodeid"   label="商品码"  /> 
        <el-table-column   label="商品"  > 
           <template slot-scope="scope">
            <span>{{ scope.row.customno + ' - ' + scope.row.goodsname }}</span>
          </template>
        </el-table-column>             
        <el-table-column   prop="minorderqty"    label="最小订货量"  /> 
        <el-table-column   prop="oqty"    label="申请订货数"  /> 
        <el-table-column   prop="qty"    label="批准订货数"  />  
            
        
      </el-table>   
      
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curpage" :page-sizes="[10,20,30,50]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    
  </div>
</template>

<script>
import { groupBy, chunkArray, parseTime } from '@/utils'

const Flag_Desc = {0:'未审核', 1:'待开始', 2:'待结束', 99:'已取消', 100:'结束'} 
export default {
  name: 'orderQtyQuery',
  data() {
    return {
      IsHQ : process.env.SYS === "HQ", 
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
        num: 0.00
      },
      dialogFormVisible: false,
      rules: {
        num: [{ type: 'number', message: '必须为数字值'}, { required: true, message: '不能为空', trigger: 'blur' }],
      },
      curpage: 1,
      page_size: 10,
      total: 0,
      auth: 0,
      reviewDesc: ['一审','二审','三审'],
      curSheet: null,
      sheetid: '',
      barcodeid: '',
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
    console.log(process.env.SYS)
    await this.fetchData()
  },
  methods: {
    editDateParamChange(){
      console.log(this.editDateParam)
      console.log(this.sheetid)
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
      console.log(auth)
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
    arrayToCsv(data, args = {}) {
      let columnDelimiter = args.columnDelimiter || ',';
      let lineDelimiter = args.lineDelimiter || '\n';
      const cols =["店铺ID",'店铺名',"审核日期","课ID","课名","小类ID","小类名","商品ID","商品码","商品名","商品条码","最小订货数","申请订货数","批准订货数"]
       return cols.join(columnDelimiter) + lineDelimiter + data.reduce((csv, row) => {
         const rowContent = cols.reduce((rowTemp, col) => {
          let ret = rowTemp ? rowTemp + columnDelimiter : rowTemp;
          let formatedCol = row[col].toString().trim().replace(new RegExp(lineDelimiter, 'g'), ' ');
          ret += /,/.test(formatedCol) ? `"${formatedCol}"` : formatedCol;
          return ret;
        }, '')
        return (csv ? csv + lineDelimiter : '') + rowContent;
      }, '');
    },
    async exportDoc() {
      this.$confirm('确认导出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const rs = await this.$store.dispatch('GetQTYExport',{ shopid: this.curshop, sheetid: this.sheetid.trim(), dates: this.editDateParam[0], datee: this.editDateParam[1], barcodeid: this.barcodeid.trim(), auth: this.auth, shopServerUrl: this.shopServerUrl })
          const csv = this.arrayToCsv(rs);
          const BOM = '\uFEFF'; 
          let url = window.URL.createObjectURL(new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', this.curshop + '-实际补货量导出.csv')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link);

          this.$message({
            type: 'success',
            message: '导出成功!'
          });
        }).catch((e) => {
          this.$message({
            type: 'info',
            message: 'cancel'==e? '已取消导出' :'导出失败,'+ e
          });          
        });
    },
    async SearchSheet() {
      if(!this.curshop) return       
      this.table_loading = true
      const res = await this.$store.dispatch('GetOriginQty', { shopid: this.curshop, sheetid: this.sheetid.trim(), dates: this.editDateParam[0], datee: this.editDateParam[1], barcodeid: this.barcodeid.trim(), auth: this.auth, curpage: this.curpage || 1 , pagesize: this.page_size || 10, shopServerUrl: this.shopServerUrl })
      const sheets = res.fs 
      this.total = res.total
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
      this.sheets = sheets
      this.table_loading = false
      this.$message.success('加载完成')           
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
      this.SearchSheet()
    },
    handleCurrentChange(val) {
      this.curpage = val
      this.SearchSheet()
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


