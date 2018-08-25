<template>
  <div class="container">
    <div class='select'>
    店型组：
    <el-select v-model="selectedTypes" style="width: 210px;" @change="selectedShops=[]" collapse-tags multiple placeholder="请选择">
        <el-option
          v-for="item in shopTypes"
          :key="item.shoptypeid"
          :label="item.shoptypeid + ' - ' + item.shoptypename"
          :value="item.shoptypeid">
        </el-option>
    </el-select>
    店铺：
    <el-select 
      v-model="selectedShops"
      multiple collapse-tags
      style="margin-left: 20px;width: 300px;" 
      placeholder="请选择">
      <el-option
        v-for="item in shops"
        :key="item.shopid"
        :label="item.shopid + ' - '+ item.shopname"
        :value="item.shopid">
      </el-option>
    </el-select>
    <el-button slot="append" @click="select" icon="el-icon-search"></el-button>
  </div>

    <el-tabs v-model="activeName" class="tab">
      <el-tab-pane label="店铺" name="1">
        <el-select 
        v-model="selectedShops1"
        multiple collapse-tags
        style="margin-left: 20px;width: 300px;" 
        placeholder="请选择">
          <el-option
            v-for="item in shops1"
            :key="item.shopid"
            :label="item.shopid + ' - '+ item.shopname"
            :value="item.shopid">
          </el-option>
        </el-select>

        <el-switch
          v-model='allowOrder1'
          active-text="可订"
          inactive-text="不可订" @change="handleSwitchTab">
        </el-switch>        

        <el-table stripe
        :data="propertys.shops"
        style="width: 100%">
           <el-table-column
            label="店铺"
            width="280">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.shopid + ' - ' + scope.row.shopname }}</span>
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
      <el-tab-pane label="毛利属性" name="2">
        <el-select 
        v-model="selectedShops2"
        multiple collapse-tags
        style="margin-left: 20px;width: 300px;" 
        placeholder="请选择">
          <el-option
            v-for="item in shops2"
            :key="item.shopid"
            :label="item.shopid + ' - '+ item.shopname"
            :value="item.shopid">
          </el-option>
        </el-select>
        <el-select 
        v-model="selectedMLSXs"
        multiple collapse-tags
        style="margin-left: 20px;width: 150px;" 
        placeholder="请选择">
          <el-option
            v-for="item in mlsxs"
            :key="item.sxid"
            :label="item.sxid"
            :value="item.sxname">
          </el-option>
        </el-select>
        <el-switch
          v-model='allowOrder2'
          active-text="可订"
          inactive-text="不可订" @change="handleSwitchTab">
        </el-switch>

          <el-table stripe
          :data="propertys.mlsxs"
          style="width: 100%">
            <el-table-column
              label="店铺"
              width="280">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.shopid + ' - ' + scope.row.shopname }}</span>
              </template>
            </el-table-column>
             <el-table-column
              label="毛利属性"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.sxname }}</span>
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
      <el-tab-pane label="销售属性" name="3">
        <el-select 
        v-model="selectedShops3"
        multiple collapse-tags
        style="margin-left: 20px;width: 300px;" 
        placeholder="请选择">
          <el-option
            v-for="item in shops3"
            :key="item.shopid"
            :label="item.shopid + ' - '+ item.shopname"
            :value="item.shopid">
          </el-option>
        </el-select>
        <el-select 
        v-model="selectedXSSXs"
        multiple collapse-tags
        style="margin-left: 20px;width: 150px;" 
        placeholder="请选择">
          <el-option
            v-for="item in xssxs"
            :key="item.sxid"
            :label="item.sxid"
            :value="item.sxid">
          </el-option>
        </el-select>
        <el-switch
          v-model='allowOrder3'
          active-text="可订"
          inactive-text="不可订" @change="handleSwitchTab">
        </el-switch>
          <el-table  stripe 
          :data="propertys.xssxs"
          style="width: 100%">
            <el-table-column
            label="店铺"
            width="280">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.shopid + ' - ' + scope.row.shopname }}</span>
              </template>
            </el-table-column>
            <el-table-column
            label="销售属性"
            width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.sxname }}</span>
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
      <el-tab-pane label="品类店型组" name="4">
        <el-select 
        v-model="selectedShops4"
        multiple collapse-tags
        style="margin-left: 20px;width: 300px;" 
        placeholder="请选择">
          <el-option
            v-for="item in shops4"
            :key="item.shopid"
            :label="item.shopid + ' - '+ item.shopname"
            :value="item.shopid">
          </el-option>
        </el-select>
        <el-select 
        v-model="selectedDepts"
        multiple collapse-tags
        style="margin-left: 20px;width: 240px;" 
        placeholder="请选择">
          <el-option
            v-for="item in depts"
            :key="item.deptid"
            :label="item.deptid + ' - '+ item.deptname"
            :value="item.deptid">
          </el-option>
        </el-select>
        <el-select 
          v-model="selectedSkuTypes"
          multiple collapse-tags
          style="margin-left: 20px;width: 150px;" 
          placeholder="请选择">
          <el-option
            v-for="item in skuTypes"
            :key="item.skutype"
            :label="item.skutype"
            :value="item.skutype">
          </el-option>
        </el-select>
        <el-switch
          v-model='allowOrder4'
          active-text="可订"
          inactive-text="不可订" @change="handleSwitchTab">
        </el-switch>

        <el-table stripe
        :data="propertys.pldxzs"
            style="width: 100%">
          <el-table-column
                label="店铺"
                width="280">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.shopid + ' - ' + scope.row.shopname }}</span>
                </template>
              </el-table-column>
          <el-table-column
            label="小类"
            width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.deptid + ' - ' + scope.row.deptname }}</span>
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
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'orderPropertySetting',
  data() {
    return {
      allowOrder1: false,
      allowOrder2: false,
      allowOrder3: false,
      allowOrder4: false,
      type_shops: [],
      selectedTypes: [],
      selectedShops: [],
      selectedShops1: [],
      selectedShops2: [],
      selectedShops3: [],
      selectedShops4: [],
      selectedMLSXs: [],
      selectedXSSXs: [],
      selectedDepts: [],
      selectedSkuTypes: [],
      activeName: '1',
      propertys: {
        shops: [],
        mlsxs: [],
        xssxs: [],
        pldxzs: []
      }
    }
  },
  computed: {
    shopTypes () {
      return this.type_shops.filter(function (s, i, arr) {
        return  arr.findIndex(f=> f.shoptypeid == s.shoptypeid && f.shoptypename.trim() == s.shoptypename.trim() ) === i
      }).sort((a,b)=> (a.shopid > b.shopid) ? 1 : ((b.shopid > a.shopid) ? -1 : 0))
    },
    shops () {
      return this.type_shops.filter(f=> this.selectedTypes.includes(f.shoptypeid)).sort((a,b)=> (a.shopid > b.shopid) ? 1 : ((b.shopid > a.shopid) ? -1 : 0))
    },
    shops1() {
      return this.propertys.shops.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.shopid == s.shopid ) === i
      }).sort((a,b)=> (a.shopid > b.shopid) ? 1 : ((b.shopid > a.shopid) ? -1 : 0))
    },
    shops2 () {
      return this.propertys.mlsxs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.shopid == s.shopid ) === i
      }).sort((a,b)=> (a.shopid > b.shopid) ? 1 : ((b.shopid > a.shopid) ? -1 : 0))
    },
    mlsxs () {
      return this.propertys.mlsxs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.sxid == s.sxid ) === i
      }).sort((a,b)=> (a.sxid > b.sxid) ? 1 : ((b.sxid > a.sxid) ? -1 : 0))
    },
    shops3 () {
      return this.propertys.xssxs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.shopid == s.shopid ) === i
      }).sort((a,b)=> (a.shopid > b.shopid) ? 1 : ((b.shopid > a.shopid) ? -1 : 0))
    },
    xssxs () {
      return this.propertys.xssxs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.sxid == s.sxid ) === i
      }).sort((a,b)=> (a.sxid > b.sxid) ? 1 : ((b.sxid > a.sxid) ? -1 : 0))
    },
    shops4 () {
      return this.propertys.pldxzs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.shopid == s.shopid ) === i
      }).sort((a,b)=> (a.shopid > b.shopid) ? 1 : ((b.shopid > a.shopid) ? -1 : 0))
    },
    depts () {
      return this.propertys.pldxzs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.deptid == s.deptid ) === i
      }).sort((a,b)=> (a.deptid > b.deptid) ? 1 : ((b.deptid > a.deptid) ? -1 : 0))
    },
    skuTypes () {
      return this.propertys.pldxzs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.skutype == s.skutype ) === i
      }).sort((a,b)=> (a.skutype > b.skutype) ? 1 : ((b.skutype > a.skutype) ? -1 : 0))
    }
  },
  async created() { 
    await this.loadTypeAndShops()
  },
  methods: {
    async select(){
      let shops = this.selectedShops
      if(!shops || shops.length === 0)
        shops = this.type_shops.filter(f=> this.selectedTypes.includes(f.shoptypeid)).map(m=> m.shopid)
      if(shops.length === 0) {
        this.$message.warning('请选择店型组或店铺')
        return
      }
      const res = await this.$store.dispatch('GetOrderProperty', { shops })
      res.mlsxs.forEach(i => { i.allowOrder = !i.forbidden })
      res.pldxzs.forEach(i => { i.allowOrder = !i.forbidden })
      res.shops.forEach(i => { i.allowOrder = !i.forbidden })
      res.xssxs.forEach(i => { i.allowOrder = !i.forbidden })
      this.propertys = res
    },
    async loadTypeAndShops() {
      //获取店型组
      const type_shops = await this.$store.dispatch('GetShopTypes')
      this.type_shops = type_shops
      
    },
    async handleSwitch(row) {
      try {
        const data = { type: parseInt(this.activeName), rows: [row] }
        console.log(data)
        await this.$store.dispatch('SetOrderProperty', data)
        row.isnew = false
        this.$message.success('设置成功')
      } catch (err) {
        row.allowOrder = !row.allowOrder
        this.$message.error('设置失败'+err.message)
      }
    },
    async handleSwitchTab() {
      
        let saveRows = Object.values(this.propertys)[parseInt(this.activeName)-1]
        const sshop = this['selectedShops'+this.activeName]
        if(sshop.length > 0)
          saveRows = saveRows.filter(f=> sshop.includes(f.shopid))
        switch(this.activeName)
        {
          case '1':
            break
          case '2':
            if(this.selectedMLSXs.length > 0)
              saveRows = saveRows.filter(f=> this.selectedMLSXs.includes(f.sxid))
            break
           case '3':
            if(this.selectedXSSXs.length > 0)
              saveRows = saveRows.filter(f=> this.selectedXSSXs.includes(f.sxid))
            break
           case '4':
            if(this.selectedDepts.length > 0)
              saveRows = saveRows.filter(f=> this.selectedDepts.includes(f.deptid))
            if(this.selectedSkuTypes.length > 0)
              saveRows = saveRows.filter(f=> this.selectedSkuTypes.includes(f.skutype))
            break
          default:
            break
        }
        if(saveRows.length === 0){
          this.$message.error('没有需要保存的数据')
          return
        } 
      try {
        for (const r of saveRows)
          r.allowOrder = this['allowOrder' + this.activeName]

        const data = { type: parseInt(this.activeName), rows: saveRows }
        await this.$store.dispatch('SetOrderProperty', data)
        
        this.$message.success('设置成功')
      } catch (err) {
        
        this.$message.error('设置失败'+err.message)
      } finally {
        await this.select()
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
  // display: flex;
  // flex-direction:  column; 
  .tab {
    width: 100%;
    border:2px solid beige;
    border-radius: 1px;
    padding: 20px;
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


