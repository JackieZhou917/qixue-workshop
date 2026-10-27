import ImageCaptureAndProcess from '@/components/imageCaptureAndProcess'
import { Toast } from 'antd-mobile'
import axios from '@/utils/http.ts'


export default function index() {
  const onRecognition = async (image) => {
    // 跟后端通信
    try {
      // 将图片处理成 base64
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(image)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (err) => reject(err)
      })
      // 显示AI识别中
      const toast = Toast.show({
        icon: 'loading',
        content: 'AI识别中...',
        duration: 0,
        maskClickable: false
      })
      // 向后端发请求
      const res = await axios.post('/coze/recognition', {
        img: dataUrl
      })
 
    } catch (error) {
      
    }
  }

  return (
    <div>
      <ImageCaptureAndProcess theme='default' onRecognition={onRecognition}>
        <h1>hello</h1>
      </ImageCaptureAndProcess>
    </div>
  )
}
