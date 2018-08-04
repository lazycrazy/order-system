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
  <el-radio-group v-model="curfunc" @change="handleFunctionChange()">
      <el-radio-button :label="1">一级审批</el-radio-button>
      <el-radio-button :label="2">二级审批</el-radio-button>
      <el-radio-button :label="3">三级审批</el-radio-button>
    </el-radio-group>

    <el-tree
      :props="defaultProps"
      :data="goods"
      show-checkbox
      @check-change="handleCheckChange">
    </el-tree>
    
    <el-table
    :data="functionSettings" >
     <el-table-column
      label="商品"
      width="280">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.goodsname }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="deptname"
      label="小类"
      >
    </el-table-column>
     <el-table-column
      prop="ordermultiple"
      label="最大订货倍数"
      >
    </el-table-column>
<el-table-column
      prop="ordernum"
      label="最大订货数"
      ></el-table-column>
      <el-table-column
      prop="ordernum"
      label="最大订货额"
      ></el-table-column>
      <el-table-column
      prop="dayupperlimit"
      label="每日最大订货数"
      ></el-table-column>
      <el-table-column
      prop="dayupperlimitamt"
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
</template>

<script>
export default {
  data() {
    return {
      functionSettings: [],
      shops: [], 
      curshop: null,
      curfunc: 1,
      goods: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
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
      }
    },
    async handleShopChange(curshop) {
      try {
        console.log('this.curshop' + this.curshop)
        console.log('curshop' + curshop)
        // await this.$store.dispatch('SetRolePermission', Object.assign({}, row))
        this.$message.success('设置成功')
      } catch (err) {
        this.$message.error('设置失败')
      } finally {
        await this.fetchData()
      }
    },
    async handleFunctionChange(row) {
      try {
        await this.$store.dispatch('SetRolePermission', Object.assign({}, row))
        this.$message.success('设置成功')
      } catch (err) {
        this.$message.error('设置失败')
      } finally {
        await this.fetchData()
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
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


