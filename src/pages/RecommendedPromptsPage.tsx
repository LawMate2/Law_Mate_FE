import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadButton from '../components/UploadButton';
import Tab from '../components/Tab';
import StickyNote from '../components/StickyNote';
import InputBox from '../components/InputBox';
import FileUploadModal from '../components/FileUploadModal';

const RecommendedPromptsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'recommended' | 'recent'>('recommended');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const getScale = () => {
    const widthScale = Math.min(1, window.innerWidth / 1920);
    const heightScale = Math.min(1, window.innerHeight / 1280);
    return Math.min(widthScale, heightScale);
  };

  const [scale, setScale] = useState(() => getScale());

  React.useEffect(() => {
    const handleResize = () => {
      const newScale = getScale();
      setScale((prev) => (prev === newScale ? prev : newScale));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePromptSubmit = (value: string) => {
    console.log('Submitted:', value);
    // TODO: 채팅 페이지로 이동하거나 오버레이 표시
  };

  const handleStickyNoteClick = (text: string) => {
    console.log('Clicked sticky note:', text);
    // TODO: 해당 프롬프트로 대화 시작
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    // TODO: 파일 처리 로직
  };

  const recommendedPrompts = [
    { text: "너는 무엇을 할 수 있니?", color: "#B19CD9", left: "326px", top: "654px", width: "480px" },
    { text: '"파기환송"은 어떤 과정으로 이루어져?', color: "#FFB3BA", left: "240px", top: "781px", width: "720px" },
    { text: '저작권법의 "사적이용"에 대해 알려줘', color: "#BAFFC9", left: "989px", top: "781px", width: "700px" },
    { text: "부당한 근로계약을 맺었습니다.", color: "#FFD9B3", left: "289px", top: "908px", width: "600px" },
    { text: "절세와 탈세의 차이에 대해 설명해주세요", color: "#87CEEB", left: "844px", top: "657px", width: "720px" },
    { text: "내 상속세를 계산해줄래?", color: "#D3D3D3", left: "917px", top: "908px", width: "480px" },
  ];

  const handleTabChange = React.useCallback((tab: 'recommended' | 'recent') => {
    if (tab === 'recent') {
      navigate('/recent');
      return;
    }
    setActiveTab(tab);
  }, [navigate]);

  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      <div 
        className="relative w-[1920px] h-[1280px] origin-center"
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 160ms ease',
          willChange: 'transform'
        }}
      >
      <div className="absolute h-[1120px] left-1/2 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.25)] top-[80px] w-[1800px] -translate-x-1/2">
        <div className="absolute inset-0 bg-gray-200 opacity-50" />
      </div>

      <p className="absolute font-['Noto_Sans:Display_SemiBold',_'Noto_Sans_KR:Bold',_sans-serif] font-semibold leading-[normal] left-1/2 text-[64px] text-black text-center top-[187px] translate-x-[-50%]" style={{ fontVariationSettings: "'CTGR' 100, 'wdth' 100" }}>
        어떤 법률 문제로 고민하고 있나요?
      </p>

      <InputBox 
        placeholder="여기에 입력해보세요"
        onSubmit={handlePromptSubmit}
      />

      <UploadButton 
        className="absolute h-[100px] left-[130px] top-[489px] w-[320px]"
        onClick={handleUploadClick}
      />

      <div className="absolute left-1/2 top-[506px] -translate-x-1/2 flex items-center gap-[192px]">
        <Tab
          className="h-[65px] w-[277px]"
          label="추천 프롬프트"
          active={activeTab === 'recommended'}
          onClick={() => handleTabChange('recommended')}
        />
        <Tab
          className="h-[65px] w-[289px]"
          label="최근 대화 기록"
          active={activeTab === 'recent'}
          disabled={false}
          onClick={() => handleTabChange('recent')}
        />
      </div>

      {activeTab === 'recommended' && recommendedPrompts.map((prompt, index) => (
        <StickyNote
          key={index}
          text={prompt.text}
          color={prompt.color}
          left={prompt.left}
          top={prompt.top}
          width={prompt.width}
          onClick={() => handleStickyNoteClick(prompt.text)}
        />
      ))}

      <p className="absolute font-['Gulim:Regular',_sans-serif] leading-[normal] left-[1436px] not-italic text-[32px] text-black text-right top-[18px] translate-x-[-100%]">
        다크모드
      </p>
      <p className="absolute font-['Noto_Sans:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] left-[1556px] text-[32px] text-black text-right top-[18px] translate-x-[-100%]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        메뉴0
      </p>
      <p className="absolute font-['Noto_Sans:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] left-[1659px] text-[32px] text-black text-right top-[18px] translate-x-[-100%]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        메뉴1
      </p>
      <p className="absolute font-['Noto_Sans:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] left-[1762px] text-[32px] text-black text-right top-[18px] translate-x-[-100%]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        메뉴2
      </p>
      <p className="absolute font-['Noto_Sans:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[normal] left-[1859px] text-[32px] text-black text-right top-[18px] translate-x-[-100%]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        설정
      </p>

      <div className="absolute font-inkfree leading-[normal] left-[1808px] not-italic text-[32px] text-black text-right top-[149px] translate-x-[-100%] whitespace-nowrap">
        <p className="mb-0">date. 2025.10.21</p>
        <p>ver. 0.0.0</p>
      </div>

      <div className="absolute h-[640px] left-[-154px] top-[646px] w-[960px] pointer-events-none hidden">
        <img src="/assets/images/안경.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute h-[700px] left-[1438px] top-[526px] w-[573px] pointer-events-none">
        <img src="/assets/images/볼펜.png" alt="" className="w-full h-full object-contain" />
      </div>

      <FileUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileUpload={handleFileUpload}
      />
      </div>
    </div>
  );
};

export default RecommendedPromptsPage;
