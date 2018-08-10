import request from '@/utils/request'

export function getItemReason(data) {
  return request({
    url: `/purchase/itemReason`,
    method: 'post',
    data
  })
}

export function getUserReviewAuth() {
  return request({
    url: `/purchase/reviewAuth`,
    method: 'get'
  })
}

export function getSheetDetail(data) {
  return request({
    url: `/purchase/itemBySheetIds`,
    method: 'post',
    data
  })
}

export function getSheets(data) {
  return request({
    url: `/purchase/listByShop`,
    method: 'post',
    data
  })
}

export function setFunctionSettingByShop(data) {
  return request({
    url: `/set/functionSettingByShop`,
    method: 'post',
    data
  })
}

export function deleteFunctionSetting(data) {
  return request({
    url: `/set/functionSetting`,
    method: 'delete',
    data
  })
}
export function setFunctionSetting(data) {
  return request({
    url: `/set/functionSetting`,
    method: 'post',
    data
  })
}

export function getFunctionSetting(data) {
  return request({
    url: `/query/functionSetting`,
    method: 'post',
    data
  })
}

export function getShopGoods(shopid) {
  return request({
    url: `/query/shopGoods/${shopid}`,
    method: 'get'
  })
}

export function getShop() {
  return request({
    url: '/query/shop',
    method: 'get'
  })
}

export function getRolePermission() {
  return request({
    url: '/query/rolePermission',
    method: 'get'
  })
}

export function setRolePermission(data) {
  return request({
    url: '/set/rolePermission',
    method: 'put',
    data
  })
}

export function getOrderProperty() {
  return request({
    url: '/query/orderProperty',
    method: 'get'
  })
}

export function setOrderProperty(data) {
  return request({
    url: '/set/orderProperty',
    method: 'put',
    data
  })
}

export function updateUserStatus(id, data) {
  return request({
    url: `/user/${id}`,
    method: 'post',
    data
  })
}
