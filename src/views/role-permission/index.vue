<template>
  <div class="container">

    <el-table
    :data="permissions" >
     <el-table-column
      label="角色"
      width="280">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.rolename }}</span>
      </template>
    </el-table-column>
    <el-table-column label="审批权限">
      <template slot-scope="scope">
        <el-radio-group v-model="scope.row.auth" @change="handleChange(scope.row)">
      <el-radio-button :label="0">无</el-radio-button>
      <el-radio-button :label="1">一审</el-radio-button>
      <el-radio-button :label="2">二审</el-radio-button>
      <el-radio-button :label="3" v-if='isHQ'>三审</el-radio-button>
    </el-radio-group>     
      </template>
    </el-table-column>
  </el-table>
 
       
  </div>
</template>

<script>
export default {
  name: 'rolePermission',
  data() {
    return {
      activeName: 'first',
      permissions: [],
      isHQ: false
    }
  },
  async created() {
    this.isHQ = process.env.SYS === "HQ"
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await this.$store.dispatch('GetRolePermission')
      res.forEach(i => { i.auth_bak = i.auth })
      this.permissions = res
    },
    async handleChange(row) {
      try {
        await this.$store.dispatch('SetRolePermission', Object.assign({}, row))
        this.$message.success('设置成功')
      } catch (err) {
        this.$message.error('设置失败')
      } finally {
        await this.fetchData()
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
  border:2px solid beige;
  border-radius: 1px;
  padding: 20px;
  margin: 20px;
}
</style>


