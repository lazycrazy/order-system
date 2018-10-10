<template>
  <div class="container">
    <el-select v-model="curshop" style="width:300px" placeholder="店铺" @change="handleShopChange">
      <el-option
        v-for="item in shops"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="depts" multiple collapse-tags style="margin-left: 20px;width: 240px;" placeholder="请选择"> 
          <el-option v-for="item in userdepts" :key="item.deptid" :label="item.deptid + ' - '+ item.deptname" :value="item.deptid"> 
        </el-option>
      </el-select>
    <el-button type="primary" @click.native.prevent="handleShopChange">{{$t('table.search')}}</el-button> 
    {{auth}}审权限
    

    
        <el-table class='fstable' ref="head"  highlight-current-row @row-click="handleCurSheetChange" v-loading="table_loading" :data="sheets" >
          <el-table-column   type="index"   width="50"> </el-table-column>
          <el-table-column  prop="ShopName"   label="店铺" width='190'></el-table-column>     
          <el-table-column   prop="SheetID"  width='160' label="单号"  ></el-table-column>
          <el-table-column  label="课" > 
            <template slot-scope="scope">
                {{ scope.row.kid + ' - ' + scope.row.kname }}
              </template>
          </el-table-column>
          <el-table-column   prop="AskType" width='80'  label="类型"  > 
            <template slot-scope="scope">
              {{scope.row.AskType | AskType_Desc}}
            </template>
          </el-table-column>
          <el-table-column  width='60' label="状态"  >
            <template slot-scope="scope">
                {{Flag_Desc[scope.row.Flag] || scope.row.Flag}}
            </template>
          </el-table-column>
          <el-table-column   prop="Editor"  width='80' label="制单人" >  </el-table-column>
          <el-table-column width='100' label="制单日期" >
            <template slot-scope="scope">
              <span>{{new Date(scope.row.EditDate) | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
            </template>
          </el-table-column>
          <el-table-column   prop="Operator"  label="操作人" ></el-table-column>
          <el-table-column width='190' label="审批">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" v-if="canReview(1, scope.row)" @click="review(1, scope.row)">{{reviewDesc[0]}}</el-button>
              <el-button size="mini" type="danger" v-if="canNextReview(1, scope.row)" @click="logNext(1, scope.row)">下一级审批</el-button>
              <el-button size="mini" type="danger" v-if="canReview(2, scope.row)" @click="review(2, scope.row)">{{reviewDesc[1]}}</el-button>
              <el-button size="mini" type="danger" v-if="canNextReview(2, scope.row)" @click="logNext(2, scope.row)">下一级审批</el-button>
              <el-button size="mini" type="danger" v-if="canReview(3, scope.row)" @click="review(3, scope.row)">{{reviewDesc[2]}}</el-button>

              <el-button size="mini" type="danger" v-if="canReject(scope.row)" @click="reject(scope.row)">驳回</el-button>

            </template>
          </el-table-column>
        </el-table>

          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curpage" :page-sizes="[10,20,30,50]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
       
          <el-tabs class='tab' value='first' type="border-card">
            <el-tab-pane label="明细" name="first">
              <el-table fit :row-style="rowClass" class='items' v-loading="table_loading" :data="items" max-height='1000'  width='100%' >
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column label="编辑">
                   <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="openEditForm(scope.row)">编辑</el-button>
                  </template>
                </el-table-column>
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
            <el-tab-pane label="日志" name="second">
              <el-table fit max-height="500" class='logs' v-loading="table_loading":data="logs" width='100%' >
                <el-table-column type="index" width="50"></el-table-column>      
                <el-table-column label="记录时间" >
                  <template slot-scope="scope">
                    <span>{{new Date(scope.row.LogTime) | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="LogUser" label="操作人"></el-table-column>   
                <el-table-column prop="LogDesc" label="描述"></el-table-column>
                <el-table-column prop="GoodsID" label="商品ID"></el-table-column>
                <el-table-column prop="Qty" label="数量"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
       

    
<el-dialog title="修改订货数量" :visible.sync="dialogFormVisible"  width="35%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px" >        
      <el-form-item label="订货数" prop="num">
        <el-input type="number" autofocus v-model.number="temp.num" placeholder='0.00' min="0.00" step="0.01" auto-complete="off"></el-input>
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
import { groupBy, chunkArray, parseTime } from '@/utils'
import splitPane from 'vue-splitpane'

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
  name: 'orderReview',
  components: { splitPane },
  data() {
    return {
      IsHQ : process.env.SYS === "HQ",
      itemcols,Flag_Desc,itemcols_desc,
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
      editRow: null,
      shopServerUrl: '',
      userdepts:[],
      depts: []
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
    rowClass({row, rowIndex}) {
      if (row.reason.trim().length > 0) {
         return { "background-color": "oldlace" }
      }
      return ''
    },
    openEditForm(row){
       this.dialogFormVisible = true
       this.editRow = row
       this.temp.num = row.Qty
       this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async review(auth, row){
      const resl = await this.$store.dispatch('SetSheetLog', { shopServerUrl: this.shopServerUrl, sheetid: row.SheetID, desc: this.reviewDesc[auth - 1], auth })
      // console.log(resl)
      const res = await this.$store.dispatch('ReviewSheet', { shopServerUrl: this.shopServerUrl, sheetid: row.SheetID })
      console.log(res)
      this.$notify({
        title: '成功',
        message: this.reviewDesc[auth - 1] + '成功',
        type: 'success',
        duration: 2000
      })
      this.curSheet = null
      this.items = []
      this.logs = []
      await this.SearchSheet()
    },
    async reject(row){
      const resl = await this.$store.dispatch('SetSheetLog', { shopServerUrl: this.shopServerUrl, sheetid: row.SheetID, desc: '驳回', auth: -(this.auth + 99) })
      // console.log(resl)
      const res = await this.$store.dispatch('RejectSheet', { shopServerUrl: this.shopServerUrl, sheetid: row.SheetID })
      // console.log(res)
      this.$notify({
        title: '成功',
        message: '驳回' + '成功',
        type: 'success',
        duration: 2000
      })
      this.curSheet = null
      this.items = []
      this.logs = []
      await this.SearchSheet()
    },
    async logNext(auth, row){
      const res = await this.$store.dispatch('SetSheetLog', { shopServerUrl: this.shopServerUrl, sheetid: row.SheetID, desc: this.reviewDesc[auth - 1]+" -> 下一级审批", auth: -(auth + 10) })
      await this.SearchSheet()
      await this.handleCurSheetChange()
    },
    canReview(auth, row){
      const can = this.auth === auth && !row.reason
      return can
    },
    canNextReview(auth, row){
      const can = this.auth === auth && row.reason
      return can
    },
    canReject(row){
      const can = this.auth && this.auth > 0 
      return can
    },
    async fetchData() {
      const auth = await this.$store.dispatch('GetUserReviewAuth')
      this.auth = auth
      const res1 = await this.$store.dispatch('GetUserDepts')
      this.userdepts = res1
      const res = await this.$store.dispatch('GetCurShop')
      this.shops = res.sort((a,b)=>(a.value>b.value?1:(b.value >a.value? -1 : 0)))
      if (this.shops.length > 0) {
        this.curshop = this.shops[0].value
        this.handleShopChange() 
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
    async SearchSheet() {
      if(!this.curshop) return       
      this.table_loading = true
    // console.log(this.depts)
    // console.log(this.userdepts)
      const depts = this.depts.length > 0 ? this.depts : this.userdepts.map(d=> d.deptid)
      const res = await this.$store.dispatch('GetSheets', { shopid: this.curshop, auth: this.auth, curpage: this.curpage || 1 , pagesize: this.page_size || 10, shopServerUrl: this.shopServerUrl, depts })
      const sheets = res.fs
      this.total = res.total
      if(sheets.length > 0){
        const sheetids = sheets.map(s=> s. SheetID)
        const reasons = await this.$store.dispatch('GetItemReason', { sheetids, auth: this.auth, shopServerUrl: this.shopServerUrl })
        const reasonObj = groupBy(reasons, 'SheetID')

        for(const s of sheets){
          const sr = reasonObj[s.SheetID]
          if(sr) {
             const r = sr.map(i=>i.reason).filter(i=>i.length>0).join()
             s.reason = r //this.$set(s,'reason', r)
            }
        }
      }      
      this.sheets = sheets
      this.table_loading = false
      this.$message.success('单据加载完成')           
    },    
    async handleCurSheetChange(curSheet) {
      this.curSheet = curSheet
      if(curSheet){
        const res = await this.$store.dispatch('GetSheetDetail', { shopServerUrl: this.shopServerUrl, auth: this.auth, sheetids: [curSheet.SheetID]})
        const items = res[0]
        this.items = items
        this.logs = res[1]
        const reason = this.items.map(i=>i.reason).filter(i=>i.length>0).toString()
        this.$set(this.curSheet, 'reason', reason)
      }
      else{
        this.items = []
        this.logs = []
      }
    },
    async handleShopChange() {
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
    },
    confirm() {
      const that = this
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const tempData = Object.assign({}, that.temp)
          const obj = {sheetid: that.editRow.SheetID, goodsid: that.editRow.GoodsID,  qty: tempData.num, desc:"编辑", shopServerUrl: that.shopServerUrl }           
          const res = await that.$store.dispatch('UpdateItem', obj)
          // console.log(res)
          await that.handleCurSheetChange(this.curSheet)
          that.dialogFormVisible = false
          that.editRow = null
          that.$notify({
            title: '成功',
            message: '修改成功',
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

.warning-row {
  background: red;
} 
.container {
  position: relative;
  height: 100vh;
}

</style>


