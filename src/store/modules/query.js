import { 
  getOrderProperty, 
  setOrderProperty, 
  getRolePermission, 
  setRolePermission, 
  getShop, 
  getShopGoods,
  getFunctionSetting,
  setFunctionSetting,
  deleteFunctionSetting,
  setFunctionSettingByShop,
  getSheets,
  getSheetDetail
} from '@/api/query'

const query = {
  state: {
  },

  mutations: {
  },

  actions: {
    async GetSheetDetail({ commit }, data) {
      const res = await getSheetDetail(data)
      return res.data
    },
    async GetSheets({ commit }, data) {
      const res = await getSheets(data)
      return res.data
    },
    async SetFunctionSettingByShop({ commit }, data) {
      const res = await setFunctionSettingByShop(data)
      return res.data
    },
    async SetFunctionSetting({ commit }, data) {
      const res = await setFunctionSetting(data)
      return res.data
    },
    async DeleteFunctionSetting({ commit }, data) {
      const res = await deleteFunctionSetting(data)
      return res.data
    },
    GetFunctionSetting({ commit }, data) {
      return new Promise((resolve, reject) => {
        getFunctionSetting(data).then(response => {
          const data = response.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetShopGoods({ commit }, shopid) {
      return new Promise((resolve, reject) => {
        getShopGoods(shopid).then(response => {
          const data = response.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetShop({ commit }) {
      return new Promise((resolve, reject) => {
        getShop().then(response => {
          const data = response.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

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
