import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTokens } from '../../contexts/TokenContext';
import { toast } from '../../hooks/use-toast';

// Token package options
const tokenPackages = [
  { id: 'basic', name: '基础包', tokens: 5, price: '¥10', popular: false },
  { id: 'standard', name: '标准包', tokens: 20, price: '¥30', popular: true },
  { id: 'premium', name: '高级包', tokens: 50, price: '¥60', popular: false },
];

/**
 * 购买入场次数页面
 */
function BuyTokens() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { tokens, refreshTokens } = useTokens();
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [isProcessing, setIsProcessing] = useState(false);

  // 如果未登录，重定向到登录页面
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: '请先登录后再购买入场次数', from: '/buy-tokens' } });
    }
  }, [isAuthenticated, navigate]);

  // 处理包选择
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  // 处理支付
  const handlePurchase = async () => {
    setIsProcessing(true);

    // 模拟支付过程
    try {
      // 这里只是模拟，实际实现中应该调用后端API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const purchasedPackage = tokenPackages.find(pkg => pkg.id === selectedPackage);

      if (purchasedPackage) {
        // 支付成功后刷新令牌
        await refreshTokens();

        toast({
          title: "购买成功",
          description: `您已成功购买 ${purchasedPackage.tokens} 个入场次数`,
        });

        // 跳转到首页
        navigate('/');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "购买失败",
        description: "处理您的购买请求时发生错误，请稍后再试",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">购买入场次数</h1>

      {/* 当前余额 */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 text-center">
        <p className="text-gray-400 mb-2">当前入场次数余额</p>
        <p className="text-4xl font-bold text-yellow-400">{tokens}</p>
      </div>

      {/* 套餐选择 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {tokenPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-gray-800 rounded-lg p-6 border-2 transition-all relative ${
              selectedPackage === pkg.id
                ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => handlePackageSelect(pkg.id)}
          >
            {pkg.popular && (
              <div className="absolute -top-3 -right-3 bg-yellow-500 text-gray-900 text-sm font-medium px-3 py-1 rounded-full">
                热门选择
              </div>
            )}

            <h3 className="text-xl font-semibold mb-2 text-white">{pkg.name}</h3>
            <p className="text-3xl font-bold mb-4 text-white">{pkg.price}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{pkg.tokens} 次入场</span>
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>无限使用时长</span>
              </li>
            </ul>

            <div className="w-full h-10 flex items-center justify-center">
              {selectedPackage === pkg.id && (
                <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 支付按钮 */}
      <div className="text-center">
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className={`px-8 py-3 rounded-lg text-white font-medium text-lg ${
            isProcessing
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 transition-colors'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              处理中...
            </span>
          ) : (
            '立即购买'
          )}
        </button>

        <p className="mt-4 text-sm text-gray-400">
          点击"立即购买"，即表示您同意我们的服务条款和隐私政策
        </p>
      </div>

    </div>
  );
}

export default BuyTokens;
