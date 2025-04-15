/*
 * @Author: BuXiongYu
 * @Date: 2025-04-16 10:24:15
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-16 10:24:15
 * @Description: 吉卜力风格的装饰元素
 */

import React from 'react';

/**
 * 纸质纹理背景装饰
 */
export const PaperTexture: React.FC = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        opacity: 0.4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23513f31' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px'
      }}
    />
  );
};

/**
 * 小草装饰
 */
export const GrassDecoration: React.FC<{
  position?: 'left' | 'right';
  bottom?: string;
  opacity?: number;
}> = ({ position = 'left', bottom = '10px', opacity = 0.7 }) => {
  return (
    <div
      className={`absolute pointer-events-none ${position === 'left' ? 'left-0' : 'right-0'}`}
      style={{ bottom, opacity }}
    >
      <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path d="M20,80 C15,60 25,40 15,20" stroke="#8ea676" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M30,80 C40,50 30,30 35,15" stroke="#8ea676" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M40,80 C50,65 45,40 60,30" stroke="#8ea676" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M50,80 C45,60 60,50 55,35" stroke="#8ea676" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M60,80 C70,60 60,40 75,30" stroke="#8ea676" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M80,80 C75,60 85,50 80,30" stroke="#8ea676" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M90,80 C100,60 90,40 95,25" stroke="#8ea676" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

/**
 * 小鸟装饰
 */
export const BirdDecoration: React.FC<{
  position?: 'topleft' | 'topright';
  size?: 'small' | 'medium';
  animate?: boolean;
}> = ({ position = 'topleft', size = 'small', animate = true }) => {
  const styles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 5,
    ...(position === 'topleft' ? { top: '10%', left: '5%' } : { top: '15%', right: '7%' }),
    ...(animate ? {
      animation: 'float 15s infinite ease-in-out alternate',
      transform: 'translateY(0px)',
    } : {})
  };

  const width = size === 'small' ? 40 : 60;
  const height = size === 'small' ? 30 : 45;

  return (
    <div style={styles}>
      <svg width={width} height={height} viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="18" cy="15" rx="9" ry="8" fill="#7a9eb8" />
        <circle cx="15" cy="12" r="1.5" fill="#263238" />
        <path d="M25,13 L32,10" stroke="#5c734f" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M25,17 L30,20" stroke="#5c734f" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10,17 C5,22 8,25 12,23" fill="#7a9eb8" />
      </svg>
    </div>
  );
};

/**
 * 小猫咪装饰
 */
export const CatDecoration: React.FC<{
  position?: 'bottomleft' | 'bottomright';
}> = ({ position = 'bottomright' }) => {
  const styles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 5,
    ...(position === 'bottomleft' ? { bottom: '5%', left: '5%' } : { bottom: '5%', right: '5%' }),
  };

  return (
    <div style={styles}>
      <svg width="70" height="50" viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="35" cy="35" rx="25" ry="15" fill="#e0c9a6" />
        <circle cx="25" cy="30" r="2" fill="#513f31" />
        <circle cx="45" cy="30" r="2" fill="#513f31" />
        <path d="M35,35 L35,40" stroke="#513f31" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M30,42 C32,45 38,45 40,42" stroke="#513f31" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M15,20 L25,28" stroke="#e0c9a6" strokeWidth="3" strokeLinecap="round" />
        <path d="M55,20 L45,28" stroke="#e0c9a6" strokeWidth="3" strokeLinecap="round" />
        <path d="M20,12 L22,27" stroke="#e0c9a6" strokeWidth="4" strokeLinecap="round" />
        <path d="M50,12 L48,27" stroke="#e0c9a6" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};

/**
 * 小羊装饰
 */
export const SheepDecoration: React.FC<{
  position?: 'bottomleft' | 'bottomright';
}> = ({ position = 'bottomleft' }) => {
  const styles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 5,
    ...(position === 'bottomleft' ? { bottom: '7%', left: '7%' } : { bottom: '7%', right: '7%' }),
  };

  return (
    <div style={styles}>
      <svg width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="40" cy="40" rx="25" ry="15" fill="#f5f5f5" />
        <circle cx="30" cy="35" r="2" fill="#513f31" />
        <circle cx="50" cy="35" r="2" fill="#513f31" />
        <path d="M40,40 L40,45" stroke="#513f31" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M35,48 C37,51 43,51 45,48" stroke="#513f31" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="25" r="6" fill="#f5f5f5" />
        <circle cx="40" cy="20" r="8" fill="#f5f5f5" />
        <circle cx="50" cy="25" r="6" fill="#f5f5f5" />
        <circle cx="55" cy="32" r="7" fill="#f5f5f5" />
        <circle cx="25" cy="32" r="7" fill="#f5f5f5" />
      </svg>
    </div>
  );
};

/**
 * 树木装饰
 */
export const TreeDecoration: React.FC<{
  position?: 'left' | 'right';
  height?: string;
}> = ({ position = 'right', height = '200px' }) => {
  return (
    <div
      className={`absolute pointer-events-none ${position === 'left' ? 'left-0 bottom-0' : 'right-0 bottom-0'}`}
      style={{ height, opacity: 0.9 }}
    >
      <svg width="120" height="200" viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M60,200 L60,120" stroke="#7d6852" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="60" cy="90" rx="40" ry="50" fill="#8ea676" />
        <ellipse cx="40" cy="70" rx="25" ry="30" fill="#8ea676" />
        <ellipse cx="80" cy="60" rx="30" ry="40" fill="#8ea676" />
        <ellipse cx="60" cy="40" rx="35" ry="35" fill="#8ea676" />
      </svg>
    </div>
  );
};

/**
 * 小云朵装饰
 */
export const CloudDecoration: React.FC<{
  position?: 'topleft' | 'topright' | 'topcenter';
  size?: 'small' | 'medium' | 'large';
}> = ({ position = 'topright', size = 'medium' }) => {
  const getPosition = () => {
    switch(position) {
      case 'topleft': return { top: '5%', left: '5%' };
      case 'topright': return { top: '8%', right: '5%' };
      case 'topcenter': return { top: '3%', left: '40%' };
      default: return { top: '5%', right: '5%' };
    }
  };

  const getSize = () => {
    switch(size) {
      case 'small': return { width: '80px', height: '50px' };
      case 'medium': return { width: '120px', height: '70px' };
      case 'large': return { width: '160px', height: '90px' };
      default: return { width: '120px', height: '70px' };
    }
  };

  const styles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 5,
    opacity: 0.8,
    filter: 'blur(1px)',
    ...getPosition(),
    ...getSize(),
    animation: 'float 20s infinite ease-in-out alternate'
  };

  return (
    <div style={styles}>
      <svg width="100%" height="100%" viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg">
        <path d="M30,50 Q10,50 10,40 Q10,20 30,20 Q30,10 45,10 Q70,5 75,20 Q100,15 105,30 Q115,35 110,50 Q100,60 75,55 Q60,65 45,55 Q35,60 30,50" fill="#f5f5f5" />
      </svg>
    </div>
  );
};

/**
 * 蒲公英种子装饰
 */
export const DandelionSeedDecoration: React.FC<{
  count?: number;
}> = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const top = `${Math.random() * 80 + 10}%`;
        const left = `${Math.random() * 90 + 5}%`;
        const animationDuration = `${Math.random() * 20 + 30}s`;
        const animationDelay = `${Math.random() * 15}s`;
        const rotation = Math.random() * 360;
        const size = Math.random() * 15 + 10;

        return (
          <div
            key={`seed-${i}`}
            className="absolute pointer-events-none"
            style={{
              top,
              left,
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0.7,
              transform: `rotate(${rotation}deg)`,
              animation: `float ${animationDuration} infinite ease-in-out alternate`,
              animationDelay,
              zIndex: 3
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="2" fill="#f5f5f5" />
              <g stroke="#f5f5f5" strokeWidth="0.5" strokeLinecap="round">
                <path d="M10,2 L10,18" />
                <path d="M2,10 L18,10" />
                <path d="M4,4 L16,16" />
                <path d="M4,16 L16,4" />
                <path d="M2,6 L18,14" />
                <path d="M2,14 L18,6" />
              </g>
            </svg>
          </div>
        );
      })}
    </>
  );
};

/**
 * 脚印装饰
 */
export const FootprintDecoration: React.FC<{
  direction?: 'left' | 'right';
  count?: number;
}> = ({ direction = 'right', count = 3 }) => {
  const prints = [];
  const startX = direction === 'left' ? 80 : 20;
  const xIncrement = direction === 'left' ? -20 : 20;

  for (let i = 0; i < count; i++) {
    const x = startX + (i * xIncrement);
    const y = 90 - (i * 5); // Move up slightly with each step

    prints.push(
      <g key={`print-${i}`} transform={`translate(${x}, ${y}) scale(0.15) ${direction === 'left' ? 'scale(-1, 1)' : ''}`}>
        <path d="M0,0 C10,-10 30,-10 40,0 C50,10 50,30 40,50 C30,70 10,70 0,50 C-10,30 -10,10 0,0 Z" fill="#513f31" fillOpacity="0.3" />
        <circle cx="10" cy="20" r="5" fill="#513f31" fillOpacity="0.3" />
        <circle cx="25" cy="20" r="5" fill="#513f31" fillOpacity="0.3" />
        <circle cx="10" cy="35" r="5" fill="#513f31" fillOpacity="0.3" />
        <circle cx="25" cy="35" r="5" fill="#513f31" fillOpacity="0.3" />
      </g>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '100px' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {prints}
      </svg>
    </div>
  );
};

/**
 * 漂浮光点装饰
 */
export const FloatingLightsDecoration: React.FC<{
  count?: number;
}> = ({ count = 15 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 10 + 2;
        const top = `${Math.random() * 80 + 10}%`;
        const left = `${Math.random() * 80 + 10}%`;
        const animationDuration = `${Math.random() * 10 + 5}s`;
        const animationDelay = `${Math.random() * 5}s`;

        return (
          <div
            key={`light-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top,
              left,
              opacity: Math.random() * 0.3 + 0.1,
              filter: 'blur(1px)',
              animation: `float ${animationDuration} infinite ease-in-out alternate`,
              animationDelay
            }}
          />
        );
      })}
    </div>
  );
};
