import React, { useState } from 'react';

type InputBoxProps = {
  placeholder?: string;
  onSubmit?: (value: string) => void;
};

const InputBox: React.FC<InputBoxProps> = ({ 
  placeholder = "여기에 입력해보세요",
  onSubmit 
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value);
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="absolute contents left-[130px] top-[350px]">
      <div className="absolute bg-[rgba(255,255,255,0.25)] blur-[2px] filter h-[100px] left-[130px] rounded-[16px] shadow-[0px_-4px_16px_0px_rgba(255,255,255,0.25),0px_4px_16px_16px_rgba(217,217,217,0.15)] top-[350px] w-[1660px] transition-opacity duration-150">
        <div className="absolute inset-0 rounded-[16px] pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="absolute bg-transparent border-none outline-none flex flex-col font-['Noto_Sans:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] left-[155px] text-[32px] text-black placeholder:text-[rgba(0,0,0,0.25)] top-[400px] translate-y-[-50%] w-[1500px]"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        //AI: Sonnet 4.5 - Prevent browser's default focus scrolling behavior which can cause layout shifts
        onFocus={(e) => e.preventDefault()}
      />
      <button
        onClick={handleSubmit}
        className="absolute left-[1690px] top-[350px] w-[96px] h-[96px] cursor-pointer group"
      >
        <div className="absolute bg-white rounded-[16px] shadow-[0px_-4px_16px_0px_rgba(255,255,255,0.25),0px_4px_16px_8px_rgba(0,0,0,0.15)] inset-0 blur-[2px] filter group-active:shadow-[0px_-4px_16px_0px_rgba(255,255,255,0.25),0px_4px_16px_16px_rgba(217,217,217,0.15)] hover:border-2 hover:border-[#D9D9D9]">
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(217,217,217,0.25)] group-active:shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)] rounded-[16px]" />
        </div>
        <div className="absolute left-[16px] overflow-clip size-[64px] top-[16px] pointer-events-none">
          <img src="/assets/icons/send.svg" alt="send" className="w-full h-full" />
        </div>
      </button>
    </div>
  );
};

export default InputBox;
