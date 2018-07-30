import { getOrderProperty, setOrderProperty } from '@/api/query'

const query = {
  state: {
  },

  mutations: {
  },

  actions: {
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
