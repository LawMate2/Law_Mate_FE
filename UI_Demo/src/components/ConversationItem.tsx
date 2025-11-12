import React from 'react';

type ConversationItemProps = {
  title: string;
  preview: string;
  timeAgo: string;
  date: string;
  left: string;
  top: string;
  onDelete?: () => void;
  onClick?: () => void;
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

//HACK
const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const createGradient = (baseColor: string): string => {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const l0 = Math.max(0, hsl.l - 10);
  const l15 = Math.max(0, hsl.l - 20);
  const l20 = hsl.l;
  const l100 = Math.max(0, hsl.l - 5);
  
  return `linear-gradient(90deg, hsl(${hsl.h}, ${hsl.s}%, ${l0}%) 0%, hsl(${hsl.h}, ${hsl.s}%, ${l15}%) 15%, hsl(${hsl.h}, ${hsl.s}%, ${l20}%) 20%, hsl(${hsl.h}, ${hsl.s}%, ${l100}%) 100%)`;
};

const ConversationItem: React.FC<ConversationItemProps> = ({ 
  title,
  preview,
  timeAgo,
  date,
  left,
  top,
  onDelete,
  onClick
}) => {
  const gradient = createGradient('#FFFFDD');
  
  return (
    <div className="absolute" style={{ left, top }}>
      <div 
        className="absolute h-[127px] left-0 shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] w-[1440px] cursor-pointer active:shadow-[2px_4px_8px_0px_rgba(0,0,0,0.3)] hover:border-2 hover:border-[#D9D9D9]"
        style={{ top: 0, background: gradient }}
        onClick={onClick}
      />
      
      <div 
        className="absolute font-['Noto_Sans:Display_Regular',_'Noto_Sans_KR:Bold',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] text-[32px] text-black whitespace-nowrap pointer-events-none"
        style={{ 
          left: '269px',
          top: '24px',
          fontVariationSettings: "'CTGR' 100, 'wdth' 100" 
        }}
      >
        <p className="font-['Noto_Sans:Bold',_'Noto_Sans_KR:Bold',_'Noto_Sans_KR:Regular',_sans-serif] font-bold mb-0" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          {title}
        </p>
        <p className="text-ellipsis overflow-hidden max-w-[900px]">{preview}</p>
      </div>
      
      <div 
        className="absolute font-['Noto_Sans:Display_Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] text-[32px] text-black text-center whitespace-nowrap pointer-events-none"
        style={{ 
          left: '29px',
          top: '24px',
          fontVariationSettings: "'CTGR' 100, 'wdth' 100" 
        }}
      >
        <p className="mb-0">{timeAgo}</p>
        <p>{date}</p>
      </div>
      
      <button
        className="absolute left-[1323px] size-[96px] cursor-pointer group"
        style={{ top: '16px' }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
      >
        <div className="absolute bg-white blur-[2px] filter inset-0 rounded-[16px] shadow-[0px_-4px_16px_0px_rgba(255,255,255,0.25),0px_4px_16px_8px_rgba(0,0,0,0.15)] group-active:shadow-[0px_-4px_16px_0px_rgba(255,255,255,0.25),0px_4px_16px_16px_rgba(217,217,217,0.15)] hover:border-2 hover:border-[#D9D9D9]">
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(217,217,217,0.25)] group-active:shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
        </div>
        <div className="absolute inset-[16.667%] overflow-clip pointer-events-none">
          <img src="/assets/icons/delete.svg" alt="delete" className="w-full h-full" />
        </div>
      </button>
    </div>
  );
};

export default ConversationItem;
