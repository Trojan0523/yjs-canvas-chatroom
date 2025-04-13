/*
 * @Author: BuXiongYu
 * @Date: 2025-04-13 11:18:27
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-13 11:19:48
 * @Description: 请填写简介
 */
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string()
    .min(1, { message: '用户名不能为空' })
    .min(3, { message: '用户名长度不能少于3个字符' }),
  password: z.string()
    .min(1, { message: '密码不能为空' })
    .min(6, { message: '密码长度不能少于6个字符' }),
});

export const registerSchema = z.object({
  username: z.string()
    .min(1, { message: '用户名不能为空' })
    .min(3, { message: '用户名长度不能少于3个字符' }),
  email: z.string()
    .min(1, { message: '邮箱不能为空' })
    .email({ message: '请输入有效的邮箱地址' }),
  password: z.string()
    .min(1, { message: '密码不能为空' })
    .min(6, { message: '密码长度不能少于6个字符' }),
  confirmPassword: z.string()
    .min(1, { message: '确认密码不能为空' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
