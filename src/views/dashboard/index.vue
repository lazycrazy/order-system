<template>
  <div class="dashboard-container">
    <span>仪表盘</span>
    <!-- <div class="dashboard-text">name:{{name}}</div>
    <div class="dashboard-text">roles:<span v-for='role in roles' :key='role'>{{role}}</span></div> -->
     
    <el-button size="mini" v-if="!IsHQ" type="danger"  @click="syncMaster">下载同步本店订货设置</el-button>

    <el-table v-if='IsHQ'
    :data="shopInfos"
    style="width: 100%">
     <el-table-column
      label="店铺"
      width="230">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.shopname }}</span>
      </template>
    </el-table-column>
    <el-table-column label="店铺服务地址" prop='ServerUrl'></el-table-column> 
    <el-table-column label="需三审单据数" >
      <template slot-scope="scope">
        <router-link :to="path" > {{ scope.row.Need3ReviewCount }} </router-link>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  data(){
    return {
      IsHQ: process.env.SYS === "HQ",
      shopInfos: [],
      path:'order-review/index'
    }
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      if(!this.IsHQ) return
      this.shopInfos = await this.$store.dispatch('GetShopServerInfos')      
    },
    async syncMaster() {
      if(this.IsHQ) return
      const res = await this.$store.dispatch('SyncMaster')      
      console.log('syncMaster'+res)
      this.$message.success('同步完成') 
    } 
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
