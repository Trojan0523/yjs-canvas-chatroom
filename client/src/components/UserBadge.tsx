import React from 'react';
import { User } from '../types/auth.types';
import { Badge } from './ui/badge';
import { Github, User as UserIcon } from 'lucide-react';

interface UserBadgeProps {
  user: User | null;
  showEmail?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Component to display user information with provider badge
 */
const UserBadge: React.FC<UserBadgeProps> = ({
  user,
  showEmail = false,
  size = 'md'
}) => {
  if (!user) return null;

  // 获取显示名称 - 优先使用OAuth提供的displayName
  const displayName = user.displayName || user.username || '用户';

  // 检查是否是OAuth用户以及具体提供商
  const isGithubUser = user.provider === 'github';
  const isGoogleUser = user.provider === 'google';

  // 用户头像 - 如果有OAuth提供的头像则使用它
  const userAvatar = user.photo;

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'gap-2',
      avatar: 'w-6 h-6',
      icon: 14,
      badgeText: 'text-[10px]',
    },
    md: {
      container: 'gap-2.5',
      avatar: 'w-8 h-8',
      icon: 16,
      badgeText: 'text-xs',
    },
    lg: {
      container: 'gap-3',
      avatar: 'w-10 h-10',
      icon: 18,
      badgeText: 'text-xs',
    }
  }[size];

  return (
    <div className={`flex items-center ${sizeClasses.container}`}>
      {userAvatar ? (
        <img
          src={userAvatar}
          alt={displayName}
          className={`${sizeClasses.avatar} rounded-full object-cover border border-gray-600`}
        />
      ) : (
        <div className={`${sizeClasses.avatar} rounded-full bg-indigo-600/70 flex items-center justify-center`}>
          <UserIcon size={sizeClasses.icon} />
        </div>
      )}

      <div>
        <div className="flex items-center gap-1.5">
          {isGithubUser && (
            <Badge variant="secondary" className="gap-1 py-0">
              <Github size={sizeClasses.icon - 2} />
              <span className={sizeClasses.badgeText}>GitHub</span>
            </Badge>
          )}
          {isGoogleUser && (
            <Badge variant="secondary" className="py-0">
              <span className={sizeClasses.badgeText}>Google</span>
            </Badge>
          )}
        </div>

        <div className="font-medium">{displayName}</div>

        {showEmail && user.email && (
          <div className="text-xs text-gray-400">{user.email}</div>
        )}
      </div>
    </div>
  );
};

export default UserBadge;
