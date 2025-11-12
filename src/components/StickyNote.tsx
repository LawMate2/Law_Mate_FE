import React from 'react';

type StickyNoteProps = {
  text: string;
  color?: string;
  left: string;
  translateX?: string;
  top: string;
  width?: string;
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

//HACKs
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

const StickyNote: React.FC<StickyNoteProps> = ({ 
  text, 
  color = '#ffffff',
  left,
  translateX,
  top,
  width = '600px',
  onClick 
}) => {
  const gradient = createGradient(color);
  
  const transformString = `${translateX ? `translateX(${translateX}) ` : ''}`;

  return (
    <div className="absolute" style={{ 
      left, 
      top, 
      width,
      transform: transformString,
      willChange: 'transform'
    }}>
      <div 
        className="absolute h-[95px] shadow-[4px_8px_16px_0px_rgba(0,0,0,0.25)] cursor-pointer active:shadow-[2px_4px_8px_0px_rgba(0,0,0,0.3)] hover:border-2 hover:border-[#D9D9D9]"
        style={{ 
          left: 0,
          top: 0,
          width: '100%',
          background: gradient
        }}
        onClick={onClick}
      />
      <div 
        className="absolute h-[95px] flex items-center justify-center font-['Noto_Sans:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal text-[32px] text-black pointer-events-none px-6"
        style={{ 
          left: 0,
          top: 0,
          width: '100%',
          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
          lineHeight: '1.4'
        }}
      >
        <p className="text-center w-full break-words">{text}</p>
      </div>
    </div>
  );
};

export default StickyNote;
