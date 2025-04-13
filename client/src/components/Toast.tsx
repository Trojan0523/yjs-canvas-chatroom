/*
 * @Author: BuXiongYu
 * @Date: 2025-04-13 11:15:47
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-13 23:38:45
 * @Description: Toast component using shadcn/ui
 */
import React, { useEffect } from 'react';
import { toast } from '../hooks/use-toast';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  show,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (show) {
      const variant = type === 'success' ? 'success' :
                      type === 'error' ? 'destructive' : 'default';

      const toastInstance = toast({
        title: type.charAt(0).toUpperCase() + type.slice(1),
        description: message,
        variant,
        duration,
      });

      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        toastInstance.dismiss();
      };
    }
  }, [show, message, type, duration, onClose]);

  return null; // UI is managed by Toaster component
};

export default Toast;
