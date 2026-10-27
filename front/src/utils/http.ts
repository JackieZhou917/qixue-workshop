import axios, { AxiosError } from 'axios'
import { Toast } from 'antd-mobile'

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.timeout = 50000    // 超出5秒没有响应，就认为请求失败
axios.defaults.headers.common['Content-Type'] = 'application/json'  // 设置请求头，指定请求体为json格式

// 请求拦截器
axios.interceptors.request.use((request) => {
  const access_token = localStorage.getItem('access_token')
  if(access_token){
    request.headers['Authorization'] = access_token
  }
  return request
})

// 响应拦截器  ---  统一做错误处理
axios.interceptors.response.use(
  (response) => {  // 响应成功 http状态码是200
    if(response.data.code !== 1){  // 逻辑错误
      Toast.show({
        icon: 'fail',
        content: response.data.message
      })
      return Promise.reject(response)
    }
    return response
  },
  (error: AxiosError) => {  // 响应失败
    if(error.status !== 200) {
      Toast.show({
        icon: 'fail',
        // @ts-ignore
        content: error.response?.data?.message || '服务器异常'
      })
      return Promise.reject(error)
    }
  }
)

export default axios