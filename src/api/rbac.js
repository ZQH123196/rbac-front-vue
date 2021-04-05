import request from '@/utils/request'
import { praseStrEmpty } from '../utils/myutils'

const rbacAPI = {
  getAdmdiv(data) {
    return request({
      url: '/rabc/admdiv',
      method: 'get',
      data
    })
  },
  getUsers(id) { // id 为空查询全部
    return request({
      url: '/rabc/user/' + praseStrEmpty(id),
      method: 'get'
    })
  },
  getRoles(data) {
    return request({
      url: '/rabc/role',
      method: 'get',
      data
    })
  }

}

export default rbacAPI
