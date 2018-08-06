import request from '@/utils/request'

export function getFunctionSetting(data) {
  return request({
    url: `/query/functionSetting/${data.shopid}/${data.funcid}`,
    method: 'get'
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
