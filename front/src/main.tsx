
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import './utils/rem.js'
import { unstableSetRender } from 'antd-mobile'; // Support since version ^5.40.0

// 让ts不校验antd-mobile的render方法
// @ts-ignore
unstableSetRender((node, container) => {
  // @ts-ignore
  container._reactRoot ||= createRoot(container);
  // @ts-ignore
  const root = container._reactRoot;
  root.render(node);
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});


createRoot(document.getElementById('root')!).render(
    <App />
)
