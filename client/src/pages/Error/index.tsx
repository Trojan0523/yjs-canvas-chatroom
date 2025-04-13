/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:44:43
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-11 20:30:00
 * @Description: 错误页面组件
 */
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';

/**
 * 错误页面组件
 */
function ErrorPage() {
  const error = useRouteError();
  
  let errorMessage = '发生了未知错误。';
  let errorTitle = '出错了';
  
  if (isRouteErrorResponse(error)) {
    errorTitle = error.statusText || (error.status === 404 ? '页面未找到' : '出错了');
    errorMessage = error.data?.message || '请求的页面不存在或无法访问。';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl text-center">
        <div className="w-24 h-24 mx-auto mb-6 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">{errorTitle}</h2>
        
        <p className="text-gray-300 mb-8">
          {errorMessage}
        </p>
        
        <Link
          to="/"
          className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage; 