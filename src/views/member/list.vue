<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.phone')" v-model="listQuery.phone">
      </el-input>
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.role" :placeholder="$t('table.role')">
        <el-option v-for="v,k in roles" :key="k" :label="v" :value="k">
        </el-option>
      </el-select>      
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <!-- <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button> -->
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="稍候" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" type="index" :label="$t('table.id')" width="50">      
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.meta.createdAt) | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" :label="$t('table.name')">
        <template slot-scope="scope">
          <span>{{scope.row.nickname || scope.row.name || scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="30px" :label="$t('table.phone')">
        <template slot-scope="scope">
          <span >{{scope.row.phone}}</span>
          <el-tag v-for='r in scope.row.roles' key='r' >{{ r | rolesFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="30px" :label="$t('table.point')">
        <template slot-scope="scope">
          <span >{{scope.row.point}}</span>
        </template>
      </el-table-column>
      
      <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{statusDesc[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status != 0" type="danger" size="mini" @click="handleModifyStatus(scope.row,'0')">{{$t('table.lock')}}
          </el-button>
          <el-button v-if="scope.row.status != 1" type="success" size="mini" @click="handleModifyStatus(scope.row,'1')">{{$t('table.unlock')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchList, updateUserStatus } from '@/api/user'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const roles = {
  user: '会员',
  admin: '管理员'
}

export default {
  name: 'memberList',
  directives: {
    waves
  },
  data() {
    return {
      statusDesc: ['锁定', '正常'],
      tableKey: 1,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        role: 'user',
        phone: undefined
      },
      roles,
      pvData: [],
      downloadLoading: false
    }
  },
  filters: {
    rolesFilter(role) {
      return roles[role]
    },
    statusFilter(statu) {
      const statusMap = ['danger', 'info']
      return statusMap[statu]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const { limit, page } = this.listQuery
      const query = { limit, page }
      if (this.listQuery.phone) {
        query.phone = this.listQuery.phone
      }
      if (this.listQuery.role) {
        query.roles = this.listQuery.role
      }
      fetchList(query).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    async handleModifyStatus(row, status) {
      const rs = await updateUserStatus(row._id, { status })
      if (rs.success) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      } else {
        this.$message({
          message: '操作失败',
          type: 'error'
        })
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['时间', '手机号', 'type', 'importance', 'status']
        const filterVal = ['meta.createAt', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel(tHeader, data, 'table-list')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
