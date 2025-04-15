import React from 'react';

// A small cloud decoration component
export const SmallCloud: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className = '', style }) => {
  return (
    <div
      className={`ghibli-cloud ${className}`}
      style={{
        width: '80px',
        height: '60px',
        ...style
      }}
    >
      <div style={{
        position: 'absolute',
        width: '60%',
        height: '80%',
        left: '20%',
        top: '10%',
        borderRadius: '50%',
      }}></div>
      <div style={{
        position: 'absolute',
        width: '40%',
        height: '60%',
        left: '5%',
        top: '20%',
        borderRadius: '50%',
      }}></div>
      <div style={{
        position: 'absolute',
        width: '40%',
        height: '60%',
        right: '5%',
        top: '20%',
        borderRadius: '50%',
      }}></div>
    </div>
  );
};

// A larger cloud decoration component
export const LargeCloud: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className = '', style }) => {
  return (
    <div
      className={`ghibli-cloud ${className}`}
      style={{
        width: '140px',
        height: '80px',
        ...style
      }}
    >
      <div style={{
        position: 'absolute',
        width: '50%',
        height: '80%',
        left: '25%',
        top: '10%',
        borderRadius: '50%',
      }}></div>
      <div style={{
        position: 'absolute',
        width: '40%',
        height: '60%',
        left: '5%',
        top: '20%',
        borderRadius: '50%',
      }}></div>
      <div style={{
        position: 'absolute',
        width: '30%',
        height: '50%',
        left: '45%',
        top: '5%',
        borderRadius: '50%',
      }}></div>
      <div style={{
        position: 'absolute',
        width: '35%',
        height: '60%',
        right: '5%',
        top: '25%',
        borderRadius: '50%',
      }}></div>
    </div>
  );
};

// Leaf decoration
export const Leaf: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className = '', style }) => {
  return (
    <div
      className={`ghibli-leaf ${className}`}
      style={style}
    ></div>
  );
};

// Cloud background container with multiple clouds
export const CloudBackground: React.FC = () => {
  return (
    <div className="ghibli-cloud-container">
      <SmallCloud style={{ top: '10%', left: '5%', animationDelay: '0.3s' }} />
      <LargeCloud style={{ top: '25%', right: '8%', animationDelay: '0.1s' }} />
      <SmallCloud style={{ bottom: '20%', left: '15%', animationDelay: '0.5s' }} />
      <LargeCloud style={{ bottom: '12%', right: '15%', animationDelay: '0.8s' }} />
      <SmallCloud style={{ top: '40%', left: '30%', animationDelay: '0.2s', opacity: 0.7 }} />
      <Leaf style={{ top: '15%', right: '25%', transform: 'rotate(30deg)' }} />
      <Leaf style={{ bottom: '25%', left: '20%', transform: 'rotate(120deg)' }} />
      <Leaf style={{ top: '60%', right: '10%', transform: 'rotate(210deg)', width: '40px', height: '40px' }} />
    </div>
  );
};

// Decorative paper texture overlay for containers
export const PaperTexture: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      opacity: 0.05,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    }} />
  );
};
