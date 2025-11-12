import React from 'react';

type UploadButtonProps = {
  className?: string;
  onClick?: () => void;
};

const UploadButton: React.FC<UploadButtonProps> = ({ 
  className, 
  
  onClick 
}) => {
  return (
    <button 
      className={`${className} relative cursor-pointer group`}
      data-name="마우스=계약서 업로드 버튼_Normal" 
      onClick={onClick}
    >
      <div 
        className="absolute h-[100px] left-0 rounded-[16px] shadow-[4px_8px_16px_0px_rgba(0,0,0,0.15)] top-0 w-[320px] blur-[2px] filter group-active:shadow-[0px_-4px_16px_0px_rgba(255,255,255,0.25),0px_4px_16px_16px_rgba(217,217,217,0.15)] hover:border-2 hover:border-[#D9D9D9]"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
      >
        <div className="absolute inset-0 pointer-events-none rounded-[16px] shadow-[inset_0px_4px_16px_0px_rgba(217,217,217,0.25)] group-active:shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      </div>
      <p className="absolute bottom-1/4 font-['Noto_Sans:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] left-[23.44%] right-[8.13%] text-[32px] text-black text-center top-[31%] pointer-events-none" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        계약서 업로드
      </p>
      <div className="absolute inset-[18%_72.19%_18%_7.81%] overflow-clip pointer-events-none">
        <img src="/assets/icons/document.svg" alt="upload" className="absolute inset-0 w-full h-full" />
      </div>
    </button>
  );
};

export default UploadButton;
