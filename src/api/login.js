import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    mobile: username,
    password
  }
  return request({
    url: '/user/access/login',
    method: 'post',
    data
  })
}

export function changePassword(oldPassword, password) {
  const data = {
    oldPassword,
    password
  }
  return request({
    url: '/user/access/resetPsw',
    method: 'put',
    data
  })
}

export function logout() {
  return request({
    url: '/user/access/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/access/current',
    method: 'get'
  })
}

