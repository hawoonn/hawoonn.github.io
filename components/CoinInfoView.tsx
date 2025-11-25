import React, { useState } from 'react';
import { AreaChart, Area, YAxis, ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, Cell } from 'recharts';
import { MessageSquare, ChevronDown, HelpCircle } from 'lucide-react';
import { INDICES_DATA } from '../constants';
import { Coin } from '../types';

interface CoinInfoViewProps {
  coins: Coin[];
}

const CoinInfoView: React.FC<CoinInfoViewProps> = ({ coins }) => {
  const topRising = [...coins]
    .filter(c => !['FLUID', 'MMT', 'TRUST', 'OG', 'SSV2'].includes(c.id))
    .sort((a, b) => b.changeRate - a.changeRate)
    .slice(0, 5);

  const TREND_DATA = [
    { name: '10월 3주', value: 0.35 },
    { name: '10월 4주', value: 0.32 },
    { name: '11월 1주', value: 0.1 },
    { name: '11월 2주', value: 0.39 },
    { name: '11월 3주', value: 0.27 },
  ];

  const [selectedTrendIndex, setSelectedTrendIndex] = useState(3); 
  const selectedData = TREND_DATA[selectedTrendIndex];

  // CONFIG: Defined Y-Axis width to calculate exact alignment
  const Y_AXIS_WIDTH = 30;

  // DYNAMIC CALCULATION:
  // 1. Start at Y_AXIS_WIDTH (30px)
  // 2. Add the center of the specific bar within the remaining space
  //    Formula: 30px + (Remaining_Width * Bar_Center_Percentage)
  const getTooltipLeft = (index: number) => {
    const barCount = TREND_DATA.length;
    const centerPercentage = (index + 0.5) / barCount;
    return `calc(${Y_AXIS_WIDTH}px + (100% - ${Y_AXIS_WIDTH}px) * ${centerPercentage})`;
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto pb-20">
      {/* Header */}
      <div className="px-4 py-3 flex justify-center items-center relative border-b border-gray-100">
        <h1 className="text-lg font-bold text-blue-900">부동산정보</h1>
        <div className="absolute right-4 top-3.5 text-blue-900">
            <MessageSquare size={22} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-gray-100">
          <button className="flex-1 py-3 text-blue-900 font-bold border-b-2 border-blue-900 -mb-0.5">주택매매 동향</button>
          <button className="flex-1 py-3 text-gray-500 font-medium">뉴스</button>
      </div>

      {/* Chart Section */}
      <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">아파트 시세 동향</h2>
          
          <button className="flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-sm text-blue-800 font-bold mb-8 shadow-sm hover:bg-gray-50">
            전국 <ChevronDown size={16} className="ml-1" strokeWidth={2.5} />
          </button>

          {/* Chart Area */}
          <div className="relative w-full h-40">
             {/* Tooltip Overlay */}
             {selectedTrendIndex !== null && (
               <div 
                  className="absolute top-[-50px] transform -translate-x-1/2 z-20 transition-all duration-300 ease-out pointer-events-none"
                  // Apply the dynamic calculated position
                  style={{ left: getTooltipLeft(selectedTrendIndex) }}
               >
                   <div className="bg-white border border-gray-800 rounded-lg px-3 py-2 shadow-md text-center whitespace-nowrap relative z-20">
                      <div className="text-[11px] text-gray-500 mb-0.5">2025년 {selectedData.name}</div>
                      <div className="text-sm font-bold text-gray-900">
                        시세 <span className="text-red-500">{selectedData.value}% 상승</span>
                      </div>
                   </div>
                   <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[1px] h-[140px] bg-gray-800 -z-10"></div>
               </div>
             )}

             <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={TREND_DATA} 
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                        dy={10}
                        interval={0}
                        padding={{ left: 0, right: 0 }} // Ensure bars go edge-to-edge
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                        domain={[-1, 1]}
                        ticks={[-1, 0, 1]}
                        tickFormatter={(value) => value === 0 ? '0' : `${value}%`}
                        width={Y_AXIS_WIDTH} // Match the constant
                    />
                    <Bar 
                        dataKey="value" 
                        barSize={45} 
                        radius={[2, 2, 0, 0]}
                        isAnimationActive={false}
                    >
                        {TREND_DATA.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={index === selectedTrendIndex ? '#FF5A5A' : '#FFD1D1'} 
                                cursor="pointer"
                                onClick={() => setSelectedTrendIndex(index)}
                            />
                        ))}
                    </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
          
          <div className="text-right mt-4 text-xs text-gray-500 flex justify-end items-center">
             부동산뱅크 제공 <HelpCircle size={14} className="ml-1 text-gray-400"/>
          </div>
      </div>

      {/* Indices Section */}
      <div className="p-4 grid grid-cols-2 gap-4 border-b border-gray-100">
        <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-1">전국 매매가격 지수</p>
            <p className="text-2xl font-medium text-blue-600">13,204.88</p>
            <p className="text-xs text-blue-500 mb-2">▼ 144.09 -1.08%</p>
            <div className="w-full h-16 bg-gray-50 rounded">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={INDICES_DATA[0].data.map((v,i) => ({i, v}))}>
                        <YAxis domain={['auto', 'auto']} hide />
                        <Area type="monotone" dataKey="v" stroke="#3B82F6" fill="#EFF6FF" strokeWidth={1.5} isAnimationActive={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-1">서울 매매가격 지수</p>
            <p className="text-2xl font-medium text-blue-600">3,985.97</p>
            <p className="text-xs text-blue-500 mb-2">▼ 47.71 -1.18%</p>
             <div className="w-full h-16 bg-gray-50 rounded">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={INDICES_DATA[1].data.map((v,i) => ({i, v}))}>
                        <YAxis domain={['auto', 'auto']} hide />
                        <Area type="monotone" dataKey="v" stroke="#3B82F6" fill="#EFF6FF" strokeWidth={1.5} isAnimationActive={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center space-x-1.5 py-3 border-b-4 border-gray-100">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
      </div>

      {/* Promo Banner */}
      <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
          <div>
              <p className="font-bold text-lg">부동산 자산 시장, 한 눈에 보고 싶다면?</p>
              <p className="text-xs opacity-80 flex items-center mt-1">데이터랩 바로 가기 <span className="ml-1">{'>'}</span></p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-blue-400 rounded-lg transform rotate-12 border-2 border-white/20 shadow-lg"></div>
      </div>

      {/* Rising Coins List */}
      <div className="mt-4">
          <div className="px-4 flex justify-between items-center mb-2">
              <div className="flex items-center space-x-1">
                  <h2 className="font-bold text-gray-800">상승률 상위 아파트</h2>
                  <span className="text-xs text-gray-400">실거래가 기준</span>
              </div>
              <span className="text-gray-400">{'>'}</span>
          </div>

          <div className="px-4 mb-2">
             <div className="flex border border-gray-300 rounded">
                 {['1주일', '1개월', '3개월', '6개월', '1년'].map((t, i) => (
                     <button key={t} className={`flex-1 py-1.5 text-xs ${i === 0 ? 'bg-white font-bold border-r border-blue-900 text-blue-900 ring-1 ring-blue-900 z-10' : 'bg-white text-gray-500 border-r border-gray-200 last:border-r-0'}`}>
                         {t}
                     </button>
                 ))}
             </div>
          </div>

          <div className="divide-y divide-gray-100">
              {topRising.map(coin => (
                  <div key={coin.id} className="flex justify-between items-center px-4 py-3">
                      <span className="text-sm text-gray-800">{coin.nameKr}</span>
                      <span className="text-sm font-medium text-red-500">{coin.changeRate > 0 ? '+' : ''}{coin.changeRate.toFixed(2)}%</span>
                  </div>
              ))}
          </div>
      </div>

    </div>
  );
};

export default CoinInfoView;