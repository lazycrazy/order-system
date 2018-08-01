import { getOrderProperty, setOrderProperty, getRolePermission, setRolePermission } from '@/api/query'

const query = {
  state: {
  },

  mutations: {
  },

  actions: {
    GetRolePermission({ commit }) {
      return new Promise((resolve, reject) => {
        getRolePermission().then(response => {
          const data = response.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    async SetRolePermission({ commit }, permission) {
      const res = await setRolePermission(permission)
      return res.data
    },

    // 用户名登录
    GetOrderProperty({ commit }) {
      return new Promise((resolve, reject) => {
        getOrderProperty().then(response => {
          const data = response.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    async SetOrderProperty({ commit }, orderProperty) {
      const res = await setOrderProperty(orderProperty)
      return res.data
    }
  }
}

export default query
