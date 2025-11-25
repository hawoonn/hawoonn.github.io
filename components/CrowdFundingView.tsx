
import React, { useState } from 'react';
import { Search, Heart, ChevronDown } from 'lucide-react';

interface Project {
  id: string;
  image: string;
  company: string;
  title: string;
  achievementRate: number;
  amount: string;
  tags?: string[];
  isHot?: boolean;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    image: 'https://i.namu.wiki/i/m-CXpLSiaK5AcAVqFi3MCPylJMHvU19Oa8TqHWRDKZ8ShCSwMK_NilzShm7rq6c8jWEOck0Gn3Q5cLD1kB7Hgw.webp',
    company: '현대건설',
    title: '디에이치 방배 일반분양 시작',
    achievementRate: 51,
    amount: '59억',
    tags: ['인기단지'],
    isHot: true,
  },
  {
    id: '2',
    image: 'https://i.namu.wiki/i/OXEhz-PW1ee9a36nYOkmY0Rde5pn4TU4Ll9ymZQmqHYQtjXCOS07oCktPBA-tkrEzTFr0-CfP_mz_I90O5G_6A.webp',
    company: 'GS건설',
    title: '마포자이 힐스테이트 라첼스 청약',
    achievementRate: 76,
    amount: '21억',
    tags: ['마감임박'],
  },
  {
    id: '3',
    image: 'https://i.namu.wiki/i/_vDyGYbQBU_h2ftoeV4UOIjniuSJ4xb4tpKXjodSv7bpmG0j5snJbX4IX64PjuNiquRpxlK9pxfyLHWmaYi7aA.webp',
    company: '삼성물산',
    title: '래미안 원펜타스 입주자 모집 공고',
    achievementRate: 85,
    amount: '120억',
    tags: ['주목'],
    isHot: true,
  },
  {
    id: '4',
    image: 'https://i.namu.wiki/i/JoxBtyW870mkhFZRde3kJAAEv0BIsL05ediooexTM12qv0eIT0mN3bEZMFNMP8sZ7B71-P231fPiFAbvYsnrIA.webp',
    company: '대우건설',
    title: '푸르지오 써밋 반포 1순위 청약',
    achievementRate: 28,
    amount: '8.5억',
  },
  {
    id: '5',
    image: 'https://i.namu.wiki/i/7dcUnF9YvxsUZtXWsdaDQQgb_JWDFUP8zQhF-XTXl4EGzukrLdJWv0TRjYTE2pTISAFbBzGzsdZxm8yX19FKMg.webp',
    company: 'DL이앤씨',
    title: '아크로 리버파크 2차 조합원 모집',
    achievementRate: 72,
    amount: '90억',
    tags: ['성공임박'],
  },
  {
    id: '6',
    image: 'https://landthumb-phinf.pstatic.net/20200720_72/apt_realimage_1595216440249D7XxM_JPEG/d043fb6743a1768688469c89cd525e76.JPG?type=m562',
    company: 'HDC현대산업개발',
    title: '서울 숲 아이파크 리버포레',
    achievementRate: 98,
    amount: '5.2억',
  },
];

const CATEGORIES = ['전체', '서울', '경기', '인천', '재건축', '재개발', '오피스텔', '도시형'];

const CrowdFundingView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('전체');

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 py-3 bg-white">
        <h1 className="text-lg font-bold text-[#101169]">분양</h1>
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1">
          <Search size={24} className="text-[#101169]" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex px-4 py-2 space-x-4 overflow-x-auto no-scrollbar border-b border-gray-100">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'text-[#101169] border-b-2 border-[#101169]'
                : 'text-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex px-4 py-3 space-x-2 overflow-x-auto no-scrollbar">
        <button className="flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-xs font-medium text-gray-700 bg-white whitespace-nowrap">
          인기순 <ChevronDown size={14} className="ml-1" />
        </button>
        <button className="flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-xs font-medium text-gray-700 bg-white whitespace-nowrap">
          상태 <ChevronDown size={14} className="ml-1" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {/* Count */}
        <div className="px-4 py-2 text-xs text-red-500 font-medium">
          6개 프로젝트
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-4 mt-2">
          {MOCK_PROJECTS.map((project) => (
            <div key={project.id} className="flex flex-col cursor-pointer group">
              {/* Image */}
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-gray-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute bottom-2 right-2 text-white/90 hover:text-white transition-colors">
                  <Heart size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-col">
                <div className="flex items-center text-[11px] text-gray-500 mb-1">
                  {project.company} <span className="text-[10px] ml-0.5">{'>'}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 leading-snug mb-0.5 line-clamp-2">
                  {project.title}
                </h3>
                
                {/* Stats & Progress Bar */}
                <div className="flex items-baseline mb-1">
                    <span className="text-red-500 font-bold text-sm mr-1.5">{project.achievementRate}%</span>
                    <span className="text-gray-500 font-bold text-sm">{project.amount}</span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full mb-2">
                    <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${Math.min(project.achievementRate, 100)}%` }}
                    ></div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {project.tags?.map((tag) => (
                    <span key={tag} className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrowdFundingView;
