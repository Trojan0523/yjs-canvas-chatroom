/*
 * @Author: BuXiongYu
 * @Date: 2025-04-15 20:11:16
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-15 22:59:26
 * @Description: 请填写简介
 */
import React from 'react';
import { useTokens } from '../contexts/TokenContext';
import { Button } from './ui/button';
import { Coins, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Component to display user's entry tokens
 */
const TokenDisplay: React.FC = () => {
  const { tokens, isLoading, error, refreshTokens } = useTokens();
  const isLow = tokens !== undefined && tokens <= 3;

  return (
    <div className="relative group">
      <div className="flex items-center rounded-md border border-indigo-600/30 overflow-hidden">
        {/* Token display button */}
        <Button
          variant="secondary"
          size="sm"
          className={`h-9 px-3 rounded-r-none border-r ${isLow ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-500' : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400'}`}
          disabled={isLoading}
        >
          <Coins className="h-4 w-4 mr-2" />

          {isLoading ? (
            <span className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              加载中...
            </span>
          ) : error ? (
            <span className="flex items-center text-red-400">
              <AlertCircle className="h-3 w-3 mr-1" />
              错误
            </span>
          ) : (
            <span className="font-medium">{tokens} 次入场</span>
          )}
        </Button>

        {/* Buy tokens button */}
        <Link to="/buy-tokens">
          <Button
            variant="secondary"
            size="sm"
            className="h-9 px-3 rounded-l-none bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            购买入场
          </Button>
        </Link>
      </div>

      {/* Tooltip for low tokens */}
      {isLow && !isLoading && !error && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-36 py-1.5 px-2 bg-amber-500/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          入场次数不足，请考虑购买更多
          <div className="absolute left-1/2 -translate-x-1/2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-amber-500/90"></div>
        </div>
      )}

      {/* Retry button for error state */}
      {error && (
        <Button
          onClick={() => refreshTokens()}
          variant="ghost"
          size="sm"
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-xs text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          重试
        </Button>
      )}
    </div>
  );
};

export default TokenDisplay;
