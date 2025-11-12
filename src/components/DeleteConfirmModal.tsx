import React from 'react';

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
};

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "이 대화 기록을 삭제할까요?"
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="bg-[rgba(255,255,255,0.75)] fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative w-[1080px] h-[720px] shadow-[0px_0px_32px_8px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: 'rgba(200, 200, 200, 0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} />
        
        <div className="absolute left-1/2 top-[250px] transform -translate-x-1/2">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
            <path d="M48 16L88 80H8L48 16Z" stroke="red" strokeWidth="4" strokeLinejoin="round" fill="none"/>
            <path d="M48 36V56M48 64V68" stroke="red" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>

        <p 
          className="absolute font-['Noto_Sans:Display_SemiBold',_'Noto_Sans_KR:Bold',_sans-serif] font-semibold leading-[normal] left-1/2 text-[48px] text-black text-center top-[364px] translate-x-[-50%]" 
          style={{ fontVariationSettings: "'CTGR' 100, 'wdth' 100" }}
        >
          {title}
        </p>

        <button
          className="absolute right-[28px] top-[28px] w-[35px] h-[87px] cursor-pointer"
          onClick={onClose}
        >
          <p className="font-['Noto_Sans:Display_SemiBold',_sans-serif] font-semibold leading-[normal] text-[64px] text-black text-center hover:text-[#ff0000] active:text-[rgb(127,0,0)]" style={{ fontVariationSettings: "'CTGR' 100, 'wdth' 100" }}>
            ×
          </p>
        </button>

        <div className="absolute left-1/2 top-[562px] transform -translate-x-1/2 flex gap-8">
          <button
            className="w-[240px] h-[100px] cursor-pointer relative group"
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-[rgba(255,255,255,0.25)] rounded-[16px] shadow-[0px_-4px_16px_0px_rgba(255,255,255,0.25),0px_4px_16px_8px_rgba(0,0,0,0.15)] blur-[2px] filter group-active:shadow-[0px_-4px_16px_0px_rgba(255,255,255,0.25),0px_4px_16px_16px_rgba(217,217,217,0.15)] hover:border-2 hover:border-[#D9D9D9]">
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(217,217,217,0.25)] group-active:shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)] rounded-[16px]" />
            </div>
            <div className="flex items-center justify-center gap-2 h-full relative z-10 pointer-events-none">
              <img src="/assets/icons/cancel.svg" alt="cancel" width="32" height="32" />
              <span className="font-['Noto_Sans:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal text-[32px] text-black" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                취소
              </span>
            </div>
          </button>

          <button
            className="w-[240px] h-[96px] cursor-pointer relative group"
            onClick={handleConfirm}
          >
            <div className="absolute inset-0 bg-[rgba(255,255,255,0.25)] rounded-[16px] shadow-[0px_-4px_16px_0px_rgba(255,255,255,0.25),0px_4px_16px_8px_rgba(0,0,0,0.15)] blur-[2px] filter group-active:shadow-[0px_-4px_16px_0px_rgba(255,255,255,0.25),0px_4px_16px_16px_rgba(217,217,217,0.15)] hover:border-2 hover:border-[#D9D9D9]">
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(217,217,217,0.25)] group-active:shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)] rounded-[16px]" />
            </div>
            <div className="flex items-center justify-center gap-2 h-full relative z-10 pointer-events-none">
              <img src="/assets/icons/delete.svg" alt="delete" width="32" height="32" />
              <span className="font-['Noto_Sans:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal text-[32px] text-[red]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                삭제
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
