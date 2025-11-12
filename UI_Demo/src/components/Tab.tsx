import React from 'react';

type TabProps = {
  className?: string;
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
};

const Tab: React.FC<TabProps> = ({ 
  className, 
  active = false,
  disabled = false,
  label,
  onClick 
}) => {
  if (disabled) {
    return (
      <div className={`${className} opacity-50 cursor-not-allowed`}>
        <div className="h-full flex items-center justify-center">
          <p className="font-['Noto_Sans:Display_Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] text-[48px] text-black text-center" style={{ fontVariationSettings: "'CTGR' 100, 'wdth' 100" }}>
            {label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <button 
      className={`${className} cursor-pointer h-[65px] overflow-hidden relative`}
      onClick={onClick}
    >
      <div className="h-full flex items-center justify-center">
        <p 
          className={`font-['Noto_Sans:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] text-[32px] ${
            active ? 'text-black' : 'text-[rgba(0,0,0,0.5)]'
          }`}
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          {label}
        </p>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-black transition-transform duration-150 ${active ? 'translate-y-0' : 'translate-y-[2px] scale-y-0'}`} />
    </button>
  );
};

export default Tab;
