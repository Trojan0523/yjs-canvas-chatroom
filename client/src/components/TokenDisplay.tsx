import React from 'react';
import { useTokens } from '../contexts/TokenContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Component to display user's entry tokens
 */
const TokenDisplay: React.FC = () => {
  const { tokens, isLoading, error, refreshTokens } = useTokens();
  const isLow = tokens !== undefined && tokens <= 3;

  return (
    <div className="relative group">
      <Badge
        variant="token"
        className="py-1.5 px-3 text-sm font-medium"
      >
        <Coins className="h-4 w-4" />

        {isLoading ? (
          <span className="text-gray-300">加载中...</span>
        ) : error ? (
          <div className="flex items-center gap-1">
            <span className="text-red-400">错误</span>
            <Button
              onClick={() => refreshTokens()}
              variant="link"
              className="h-auto p-0 text-xs underline text-indigo-400 hover:text-indigo-300"
            >
              重试
            </Button>
          </div>
        ) : (
          <span>{tokens} 次入场</span>
        )}
      </Badge>

      {/* Tooltip */}
      {isLow && !isLoading && !error && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-36 py-1.5 px-2 bg-yellow-500/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          入场次数不足，请考虑购买更多
          <div className="absolute left-1/2 -translate-x-1/2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-yellow-500/90"></div>
        </div>
      )}

      {/* Click target for low tokens */}
      {isLow && !isLoading && !error && (
        <Link
          to="/buy-tokens"
          className="absolute inset-0 z-10"
          aria-label="购买更多入场次数"
        />
      )}
    </div>
  );
};

export default TokenDisplay;
