import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/users',
    method: 'get',
    params: query
  })
}

export function updateUserStatus(id, data) {
  return request({
    url: `/user/${id}`,
    method: 'post',
    data
  })
}
