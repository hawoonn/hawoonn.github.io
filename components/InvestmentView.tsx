
import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { MessageSquare, Share } from 'lucide-react';

const InvestmentView: React.FC = () => {
  const chartData = [
      { name: '현금', value: 12.2, color: '#8DC63F' },
      { name: '헬리오시티', value: 51.8, color: '#0071B8' },
      { name: '청담르엘', value: 10.2, color: '#7D7D7D' },
      { name: '반포자이', value: 25.8, color: '#C76FBC' },
  ];

  const TOTAL_ASSET = 11410944;

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-y-auto pb-20">
      {/* Top Bar */}
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-lg font-bold text-blue-900">투자내역</h1>
        <div className="flex space-x-4 text-blue-900">
            <Share size={20} />
            <MessageSquare size={20} />
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex bg-white text-sm font-medium text-gray-500">
        <button className="flex-1 py-3 text-blue-900 border-b-2 border-blue-900 font-bold">보유자산</button>
        <button className="flex-1 py-3">투자손익</button>
        <button className="flex-1 py-3">거래내역</button>
        <button className="flex-1 py-3">미체결</button>
      </div>

      {/* Total Summary */}
      <div className="bg-white p-4 mb-2">
        <div className="flex items-center mb-4">
            <h2 className="font-bold text-gray-800 mr-2">내 보유자산</h2>
            <span className="text-gray-400 text-xs">?</span>
        </div>
        
        <div className="flex justify-between mb-6">
            <div>
                <p className="text-xs text-gray-500 mb-1">보유 KRW</p>
                <p className="text-2xl font-medium text-gray-900">1,392,135</p>
            </div>
            <div className="text-right">
                 <p className="text-xs text-gray-500 mb-1">총 보유자산</p>
                 <p className="text-2xl font-medium text-gray-900">{TOTAL_ASSET.toLocaleString()}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="flex justify-between pr-4 border-r border-gray-100">
                <span className="text-gray-500">총 매수</span>
                <span className="text-gray-900">9,899,999</span>
            </div>
            <div className="flex justify-between pl-4">
                 <span className="text-gray-500">평가손익</span>
                 <span className="text-blue-600">+118,810</span>
            </div>
            <div className="flex justify-between pr-4 border-r border-gray-100">
                 <span className="text-gray-500">총 평가</span>
                 <span className="text-gray-900">10,018,809</span>
            </div>
            <div className="flex justify-between pl-4">
                 <span className="text-gray-500">수익률</span>
                 <span className="text-blue-600">+1.20%</span>
            </div>
             <div className="flex justify-between pr-4 border-r border-gray-100">
                 <span className="text-gray-500">주문가능</span>
                 <span className="text-gray-900">1,392,135</span>
            </div>
        </div>
      </div>

      {/* Portfolio Chart Section */}
      <div className="bg-white p-4 mb-2">
         <div className="flex justify-between items-center mb-2">
             <h3 className="text-sm font-bold text-gray-700">보유자산 포트폴리오</h3>
             <span className="text-gray-400">^</span>
         </div>
         
         <div className="flex items-center">
            {/* Chart Container */}
            <div className="relative w-[160px] h-[160px] shrink-0">
                <PieChart width={160} height={160}>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={75}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                        isAnimationActive={false}
                    >
                        {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[11px] text-gray-500 text-center leading-tight">보유비중<br/>(%)</span>
                </div>
            </div>
            
            <div className="flex-1 pl-6 space-y-2">
                {chartData.map(item => (
                    <div key={item.name} className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                            <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-gray-800">{item.value.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* Hide Small Assets Checkbox */}
      <div className="px-4 py-2 bg-white flex items-center text-xs text-gray-600 border-b border-gray-100">
          <div className="w-4 h-4 rounded bg-blue-900 flex items-center justify-center text-white mr-2">✓</div>
          <span>거래미지원/소액 자산 숨기기</span>
          <span className="ml-1 text-gray-400 text-[10px] border border-gray-300 rounded-full px-1">?</span>
      </div>

      {/* Asset List */}
      {chartData.filter(d => d.name !== '현금').map((asset) => {
        // Calculate dynamic value based on percentage of total asset
        const assetValue = Math.floor(TOTAL_ASSET * (asset.value / 100));
        const profit = Math.floor(assetValue * 0.012); // Mock 1.2% profit
        
        return (
        <div key={asset.name} className="bg-white p-4 border-b border-gray-100">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center text-blue-900 font-bold text-sm">
                    {asset.name} <span className="ml-1 text-gray-400"><Share size={12}/></span>
                </div>
                <div className="text-right text-xs">
                    <div className="flex justify-end items-center space-x-8 mb-1">
                        <span className="text-gray-500">평가손익</span>
                        <span className="text-blue-600">+{profit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-end items-center space-x-8">
                        <span className="text-gray-500">수익률</span>
                        <span className="text-blue-600">+1.20%</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-1 text-sm">
                <div>
                    <p className="font-bold text-gray-800">1.00000000</p>
                    <p className="text-[10px] text-gray-400">보유수량</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-800">{assetValue.toLocaleString()} <span className="text-xs font-normal text-gray-500">KRW</span></p>
                    <p className="text-[10px] text-gray-400">매수평균가</p>
                </div>
            </div>
        </div>
      )})}
    </div>
  );
};

export default InvestmentView;
