import React, { useState, useRef, DragEvent } from 'react';

type FileUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload?: (file: File) => void;
};

const FileUploadModal: React.FC<FileUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onFileUpload 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    //TODO
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/tiff',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/x-hwp',
      'application/haansofthwp'
    ];

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.pdf', '.doc', '.docx', '.hwp', '.hwpx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      alert('지원하지 않는 파일 형식입니다.');
      return;
    }

    //HACK
    if (file.size > 100 * 1024 * 1024) {
      alert('파일 크기가 100MB를 초과합니다.');
      return;
    }

    console.log('File uploaded:', file);
    onFileUpload?.(file);
    onClose();
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="bg-[rgba(255,255,255,0.75)] fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative w-[1280px] h-[720px] shadow-[0px_0px_32px_8px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: 'rgba(200, 200, 200, 0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} />
        
        <p 
          className="absolute font-['Noto_Sans:Display_SemiBold',_'Noto_Sans_KR:Bold',_sans-serif] font-semibold leading-[normal] left-1/2 text-[64px] text-black text-center top-[45px] translate-x-[-50%]" 
          style={{ fontVariationSettings: "'CTGR' 100, 'wdth' 100" }}
        >
          계약서 파일을 업로드해보세요
        </p>

        <button
          className="absolute right-[28px] top-[26px] w-[35px] h-[87px] cursor-pointer"
          onClick={onClose}
        >
          <p className="font-['Noto_Sans:Display_SemiBold',_sans-serif] font-semibold leading-[normal] text-[64px] text-black text-center hover:text-[#ff0000] active:text-[rgb(127,0,0)]" style={{ fontVariationSettings: "'CTGR' 100, 'wdth' 100" }}>
            ×
          </p>
        </button>

        <div
          className="absolute left-[100px] top-[310px] w-[1080px] h-[310.345px] cursor-pointer"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleAreaClick}
        >
          <div 
            className={`absolute inset-0 rounded-[16px] shadow-[0px_-4px_16px_0px_rgba(255,255,255,0.25),0px_4px_16px_8px_rgba(217,217,217,0.15)] blur-[2px] filter transition-all ${
              isDragging ? 'scale-105 bg-[rgba(255,255,255,0.4)]' : 'bg-[rgba(255,255,255,0.25)]'
            }`}
          >
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_4px_16px_0px_rgba(0,0,0,0.25)] rounded-[16px]" />
          </div>
          
          <div className="absolute left-1/2 top-[80px] transform -translate-x-1/2 opacity-50 z-10">
            <img src="/assets/icons/document.svg" alt="document" width="64" height="64" />
          </div>

          <div 
            className="absolute flex flex-col font-['Noto_Sans:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[normal] left-1/2 text-[rgba(0,0,0,0.5)] text-center top-1/2 translate-x-[-50%] translate-y-[-50%] w-full whitespace-pre-wrap pointer-events-none z-10"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            <p className="mb-2 text-[32px]">&nbsp;</p>
            <p className="mb-2 text-[32px]">&nbsp;</p>
            <p className="mb-4 text-[32px]">여기에 파일을 끌어다 놓으세요</p>
            <p className="mb-1 text-[24px]">지원 파일: jpg, png, webp, tiff, pdf, doc, docx, hwp, hwpx</p>
            <p className="text-[24px]">최대 용량: 100MB</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp,.tiff,.pdf,.doc,.docx,.hwp,.hwpx"
          onChange={handleFileInput}
        />
      </div>
    </div>
  );
};

export default FileUploadModal;
