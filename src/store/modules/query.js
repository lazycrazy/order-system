import { 
  getOrderProperty, 
  setOrderProperty, 
  getRolePermission, 
  setRolePermission, 
  getShop, 
  getCurShop, 
  getShopGoods,
  getFunctionSetting,
  setFunctionSetting,
  deleteFunctionSetting,
  setFunctionSettingByShop,
  getSheetsQuery,
  getSheets,
  getSheetDetail,
  getSheetDetailQuery,
  getUserReviewAuth,
  getItemReason,
  setSheetLog,
  reviewSheet,
  rejectSheet,
  updateItem,
  getGoodsIdBySF,
  getShopServerInfos,
  getShopServerUrl,
  functionSettingImport,
  getShopTypes,
  getOriginQty,
  getUserInfo,
  getUserDepts,
  syncMaster
} from '@/api/query'

const query = {
  state: {
  },

  mutations: {
  },

  actions: {  
    async SyncMaster({ commit }) {
      const res = await syncMaster()
      return res.data
    },  
    async GetUserDepts({ commit }) {
      const res = await getUserDepts()
      return res.data
    },  
    async SearchUserInfo({ commit }) {
      const res = await getUserInfo()
      return res.data
    },
    async GetShopTypes({ commit }) {
      const res = await getShopTypes()
      return res.data
    },
    async GetShopServerUrl({ commit }, data) {
      const res = await getShopServerUrl(data)
      return res.data
    },
    async GetShopServerInfos({ commit }, ) {
      const res = await getShopServerInfos()
      return res.data
    },
    async GetGoodsIdBySF({ commit }, data) {
      const res = await getGoodsIdBySF(data)
      return res.data
    },
    async FunctionSettingImport({ commit }, data){
      const res = await functionSettingImport(data)
      return res.data
    },
    async UpdateItem({ commit }, data) {
      const res = await updateItem(data)
      return res.data
    },
    async SetSheetLog({ commit }, data) {
      const res = await setSheetLog(data)
      return res.data
    },
    async ReviewSheet({ commit }, data) {
      const res = await reviewSheet(data)
      return res.data
    },
    async RejectSheet({ commit }, data) {
      const res = await rejectSheet(data)
      return res.data
    },
    async GetItemReason({ commit }, data) {
      const res = await getItemReason(data)
      return res.data
    },
    async GetUserReviewAuth({ commit }) {
      const res = await getUserReviewAuth()
      return res.data
    },
    async GetSheetDetail({ commit }, data) {
      const res = await getSheetDetail(data)
      return res.data
    },
    async GetSheets({ commit }, data) {
      const res = await getSheets(data)
      return res.data
    },
    async GetOriginQty({ commit }, data) {
      const res = await getOriginQty(data)
      return res.data
    },
    async GetSheetDetailQuery({ commit }, data) {
      const res = await getSheetDetailQuery(data)
      return res.data
    },
    async GetSheetsQuery({ commit }, data) {
      const res = await getSheetsQuery(data)
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
  GetCurShop({ commit }) {
      return new Promise((resolve, reject) => {
        getCurShop().then(response => {
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
    async GetOrderProperty({ commit }, data) {
      const res = await getOrderProperty(data)
      return res.data
    },
    async SetOrderProperty({ commit }, orderProperty) {
      const res = await setOrderProperty(orderProperty)
      return res.data
    }
  }
}

export default query
