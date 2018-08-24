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
      <el-tab-pane label="店铺" name="first">
        <el-select 
        v-model="selectedShopsfirst"
        multiple collapse-tags
        style="margin-left: 20px;width: 300px;" 
        placeholder="请选择">
          <el-option
            v-for="item in shopsfirst"
            :key="item.shopid"
            :label="item.shopid + ' - '+ item.shopname"
            :value="item.shopid">
          </el-option>
        </el-select>

        <el-switch
          v-model='allowOrderfirst'
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
      <el-tab-pane label="毛利属性" name="second">
        <el-select 
        v-model="selectedShopssecond"
        multiple collapse-tags
        style="margin-left: 20px;width: 300px;" 
        placeholder="请选择">
          <el-option
            v-for="item in shopssecond"
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
          v-model='allowOrdersecond'
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
      <el-tab-pane label="销售属性" name="third">
        <el-select 
        v-model="selectedShopsthird"
        multiple collapse-tags
        style="margin-left: 20px;width: 300px;" 
        placeholder="请选择">
          <el-option
            v-for="item in shopsthird"
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
          v-model='allowOrderthird'
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
      <el-tab-pane label="品类店型组" name="fourth">
        <el-select 
        v-model="selectedShopsfourth"
        multiple collapse-tags
        style="margin-left: 20px;width: 300px;" 
        placeholder="请选择">
          <el-option
            v-for="item in shopsfourth"
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
          v-model='allowOrderfourth'
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
      allowOrderfirst: false,
      allowOrdersecond: false,
      allowOrderthird: false,
      allowOrderfourth: false,
      type_shops: [],
      selectedTypes: [],
      selectedShops: [],
      selectedShopsfirst: [],
      selectedShopssecond: [],
      selectedShopsthird: [],
      selectedShopsfourth: [],
      selectedMLSXs: [],
      selectedXSSXs: [],
      selectedDepts: [],
      selectedSkuTypes: [],
      activeName: 'first',
      propertys: {
        mlsxs: [],
        pldxzs: [],
        shops: [],
        xssxs: []
      }
    }
  },
  computed: {
    shopTypes () {
      return this.type_shops.filter(function (s, i, arr) {
        return  arr.findIndex(f=> f.shoptypeid == s.shoptypeid && f.shoptypename.trim() == s.shoptypename.trim() ) === i
      })
    },
    shops () {
      return this.type_shops.filter(f=> this.selectedTypes.includes(f.shoptypeid))
    },
    shopsfirst() {
      return this.propertys.shops.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.shopid == s.shopid ) === i
      })
    },
    shopssecond () {
      return this.propertys.mlsxs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.shopid == s.shopid ) === i
      })
    },
    mlsxs () {
      return this.propertys.mlsxs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.sxid == s.sxid ) === i
      })
    },
    shopsthird () {
      return this.propertys.xssxs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.shopid == s.shopid ) === i
      })
    },
    xssxs () {
      return this.propertys.xssxs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.sxid == s.sxid ) === i
      })
    },
    shopsfourth () {
      return this.propertys.pldxzs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.shopid == s.shopid ) === i
      })
    },
    depts () {
      return this.propertys.pldxzs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.deptid == s.deptid ) === i
      })
    },
    skuTypes () {
      return this.propertys.pldxzs.filter((s, i, arr) => {
        return  arr.findIndex(f=> f.skutype == s.skutype ) === i
      })
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
      console.log(type_shops)
      this.type_shops = type_shops
      
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
    async handleSwitchTab(index) {
      try {
        console.log(arguments)
        // await this.$store.dispatch('SetOrderProperty', Object.assign({}, row))
        // row.isnew = false
        this.$message.success('设置成功')
      } catch (err) {
        
        this.$message.error('设置失败')
      }finally {

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


