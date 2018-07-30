import request from '@/utils/request'

export function getOrderProperty() {
  return request({
    url: '/query/orderProperty',
    method: 'get'
  })
}

export function setOrderProperty(data) {
  return request({
    url: '/query/orderProperty',
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
