import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { Toast } from 'antd-mobile'

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.timeout = 50000    // 超出5秒没有响应，就认为请求失败
axios.defaults.headers.common['Content-Type'] = 'application/json'  // 设置请求头，指定请求体为json格式

/// 请求拦截器
axios.interceptors.request.use((request) => {
  const access_token = localStorage.getItem('access_token')
  if (access_token) {
    request.headers.Authorization = access_token
  }
  return request
})


// token 无感刷新：加锁 + 等待队列，保证并发 401 时只刷新一次，其余请求排队等待重发
let isRefreshing = false
// 队列中每一项：拿到新 token 后重发请求 resolve 原Promise；刷新失败则以 null 回调
type PendingCallback = (token: string | null) => void
const pendingQueue: PendingCallback[] = []

const redirectToLogin = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  setTimeout(() => {
    window.location.href = '/login'
  }, 2000)
}

// 用新 token 重发原请求
const resendRequest = (config: AxiosRequestConfig & { _retry?: boolean }, token: string) => {
  config._retry = true  // 打上标记，重发的请求若再 401 不再进入刷新流程，避免死循环
  config.headers = { ...config.headers, Authorization: token }
  return axios(config)
}

// 响应拦截器  --- 统一做错误处理
axios.interceptors.response.use(
  (response) => {  // 响应成功 http状态码是200
    // 刷新token接口的结果由刷新流程自行处理，不走全局错误提示
    if (response.config.url === '/auth/refresh') {
      return response
    }
    if (response.data.code !== 1) {  // 逻辑错误
      Toast.show({
        icon: 'fail',
        content: response.data.message
      })
      return Promise.reject(response)
    }
    return response
  },
  (error: AxiosError) => {  // 响应失败
    const originalConfig = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined

    // 401：token 失效，走无感刷新流程，全程静默，不弹错误 Toast
    if (error.status === 401 && originalConfig) {
      // 已重发过仍 401，或刷新接口本身失败：会话彻底结束，跳登录
      if (originalConfig._retry || originalConfig.url === '/auth/refresh') {
        Toast.show({ icon: 'fail', content: '登录已过期，请重新登录' })
        redirectToLogin()
        return Promise.reject(error)
      }

      const userId = localStorage.getItem('userId')
      const account = localStorage.getItem('account')

      // 已在刷新中：当前请求进入等待队列，刷新完成后统一重发
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (token) {
              resolve(resendRequest(originalConfig, token))
            } else {
              reject(error)
            }
          })
        })
      }

      const refresh_token = localStorage.getItem('refresh_token')
      if (!refresh_token) {  // 没有 refresh_token，无法续期，跳登录
        Toast.show({ icon: 'fail', content: '登录已过期，请重新登录' })
        redirectToLogin()
        return Promise.reject(error)
      }

      isRefreshing = true
      return axios.post('/auth/refresh', { refresh_token, userId, account }).then(res => {
        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('refresh_token', res.data.refresh_token)
        isRefreshing = false

        // 唤醒排队中的请求，让它们用新 token 重发
        pendingQueue.forEach(cb => cb(res.data.access_token))
        pendingQueue.length = 0

        // 无感重发刚才失败的请求，结果直接返回给业务代码
        return resendRequest(originalConfig, res.data.access_token)
      }).catch(() => {
        // 刷新失败（refresh_token 也过期了），通知队列中所有请求失败，并跳登录
        isRefreshing = false
        pendingQueue.forEach(cb => cb(null))
        pendingQueue.length = 0
        Toast.show({ icon: 'fail', content: '登录已过期，请重新登录' })
        redirectToLogin()
        return Promise.reject(error)
      })
    }

    if (error.status !== 200) {
      Toast.show({
        icon: 'fail',
        // @ts-ignore
        content: error.response?.data?.message   || '服务器异常'
      })

      // 需要登录
      if (error.status === 402) {
        redirectToLogin()
      }

      return Promise.reject(error)
    }
  }
)



export default axios