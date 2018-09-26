import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  base: 'manage',
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/change-password',
    name: 'change-password', 
    component: Layout,
    children: [{ 
      path: 'index', 
      component: () => import('@/views/change-password/index'), 
      name: 'changePassword', 
      meta: { 
        title: 'changePassword', 
        icon: 'form' 
      }}]
  },
  {
    path: '/order-property-setting',
    name: 'order-property-setting', 
    component: Layout,
    meta: {
      title: 'orderPropertySetting',
      roles: ['admin'],
      sys: ['HQ']
    },
    children: [{ 
      path: 'index', 
      component: () => import('@/views/order-property-setting/index'), 
      name: 'orderPropertySetting', 
      meta: { 
        title: 'orderPropertySetting', 
        icon: 'form' 
      }}]
  },
  {
    path: '/role-permission',
    name: 'role-permission', 
    component: Layout,
    meta: {
      title: 'rolePermission',
      roles: ['admin']
    },
    children: [{ 
      path: 'index', 
      component: () => import('@/views/role-permission/index'), 
      name: 'rolePermission', 
      meta: { 
        title: 'rolePermission', 
        icon: 'form' 
      }}]
  },
  {
    path: '/function-setting',
    name: 'function-setting', 
    component: Layout,
    meta: {
      title: 'functionSetting',
      roles: ['admin'],
      sys: ['HQ']
    },
    children: [{ 
      path: 'index', 
      component: () => import('@/views/function-setting/index'), 
      name: 'functionSetting', 
      meta: { 
        title: 'functionSetting', 
        icon: 'form' 
      }}]
  },
  {
    path: '/order-review',
    name: 'order-review', 
    component: Layout,
    meta: {
      title: 'orderReview',
      roles: ['admin']
    },
    children: [{ 
      path: 'index', 
      component: () => import('@/views/order-review/index'), 
      name: 'orderReview', 
      meta: { 
        title: 'orderReview', 
        icon: 'table' 
      }}]
  },
  {
    path: '/order-review-query',
    name: 'order-review-query', 
    component: Layout,
    meta: {
      title: 'orderReviewQuery',
      roles: ['admin']
    },
    children: [{ 
      path: 'index', 
      component: () => import('@/views/order-review-query/index'), 
      name: 'orderReviewQuery', 
      meta: { 
        title: 'orderReviewQuery', 
        icon: 'table' 
      }}]
  },
  {
    path: '/order-qty-query',
    name: 'order-qty-query', 
    component: Layout,
    meta: {
      title: 'orderQtyQuery',
      roles: ['admin']
    },
    children: [{ 
      path: 'index', 
      component: () => import('@/views/order-qty-query/index'), 
      name: 'orderQtyQuery', 
      meta: { 
        title: 'orderQtyQuery', 
        icon: 'table' 
      }}]
  },
  { path: '*', redirect: '/404', hidden: true }
]
