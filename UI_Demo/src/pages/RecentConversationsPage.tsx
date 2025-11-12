import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tab from '../components/Tab';
import ConversationItem from '../components/ConversationItem';
import InputBox from '../components/InputBox';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

type Conversation = {
  id: string;
  title: string;
  preview: string;
  timeAgo: string;
  date: string;
};

const RecentConversationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'recommended' | 'recent'>('recent');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
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

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: '편의점 아르바이트의 주휴수당에 대하여',
      preview: '흥미로운 질문이네요. 말씀하신 내용에 대해서는, 먼저 점주와 대화한 후에 진…',
      timeAgo: '13일 전',
      date: '2025.10.08'
    },
    {
      id: '2',
      title: 'League of Legends에서의 채팅으로 명예훼손 성립 여부',
      preview: '결론부터 말씀드리자면, **사실직시명예훼손**은 공연성과 특정성, 고의성, …',
      timeAgo: '15일 전',
      date: '2025.10.06'
    }
  ]);

  const handlePromptSubmit = (value: string) => {
    console.log('Submitted:', value);
    // TODO: 채팅 페이지로 이동
  };

  const handleConversationClick = (id: string) => {
    console.log('Open conversation:', id);
    // TODO: 해당 대화로 이동
  };

  const handleDeleteConversation = (id: string) => {
    setConversationToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (conversationToDelete) {
      setConversations(prev => prev.filter(conv => conv.id !== conversationToDelete));
      setConversationToDelete(null);
    }
  };

  const handleTabChange = React.useCallback((tab: 'recommended' | 'recent') => {
    if (tab === 'recommended') {
      navigate('/');
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

      <div className="absolute left-1/2 top-[506px] -translate-x-1/2 flex items-center gap-[192px]">
        <Tab
          className="h-[65px] w-[277px]"
          label="추천 프롬프트"
          active={activeTab === 'recommended'}
          disabled={false}
          onClick={() => handleTabChange('recommended')}
        />
        <Tab
          className="h-[65px] w-[289px]"
          label="최근 대화 기록"
          active={activeTab === 'recent'}
          onClick={() => handleTabChange('recent')}
        />
      </div>

      {conversations.map((conversation, index) => (
        <ConversationItem
          key={conversation.id}
          title={conversation.title}
          preview={conversation.preview}
          timeAgo={conversation.timeAgo}
          date={conversation.date}
          left="240px"
          top={`${684 + index * 186}px`}
          onClick={() => handleConversationClick(conversation.id)}
          onDelete={() => handleDeleteConversation(conversation.id)}
        />
      ))}

//HACK: ㅈ중복
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

      <div className="absolute h-[640px] left-[-154px] top-[646px] w-[960px] pointer-events-none">
      </div>
      <div className="absolute h-[700px] left-[1438px] top-[526px] w-[573px] pointer-events-none">
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setConversationToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
      </div>
    </div>
  );
};

export default RecentConversationsPage;
