
import React, { useState, useEffect, useRef, memo } from 'react';
import { Settings, MessageSquare, Search } from 'lucide-react';
import { Coin } from '../types';

interface ExchangeViewProps {
  coins: Coin[];
  onCoinClick: (coin: Coin) => void;
}

// Helper component for individual coin row to handle flash animations efficiently
const CoinRow = memo(({ coin, onCoinClick }: { coin: Coin; onCoinClick: (coin: Coin) => void }) => {
  const [flashState, setFlashState] = useState<'up' | 'down' | null>(null);
  
  // Initialize lastTickDirection based on 24h change to have a sensible default, 
  // but subsequent updates will track the immediate tick direction.
  const [lastTickDirection, setLastTickDirection] = useState<'up' | 'down' | 'neutral'>(
    coin.changeRate > 0 ? 'up' : coin.changeRate < 0 ? 'down' : 'neutral'
  );
  
  const prevPriceRef = useRef(coin.price);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect price changes for flash effect and track direction
  useEffect(() => {
    if (coin.price !== prevPriceRef.current) {
      const direction = coin.price > prevPriceRef.current ? 'up' : 'down';
      setFlashState(direction);
      setLastTickDirection(direction); // Persist the direction of this tick
      prevPriceRef.current = coin.price;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Flash duration 500ms
      timeoutRef.current = setTimeout(() => {
        setFlashState(null);
      }, 500); 
    }
    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [coin.price]);

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  // Tick Color: Based on the LAST TICK direction (for idle state digits)
  const tickColor = lastTickDirection === 'up' ? 'text-red-500' : lastTickDirection === 'down' ? 'text-blue-600' : 'text-gray-800';
  
  // Change Color: Based on 24h Change Rate (for the % column)
  const isUp24h = coin.changeRate > 0;
  const isZero24h = coin.changeRate === 0;
  const changeColor = isUp24h ? 'text-red-500' : isZero24h ? 'text-gray-800' : 'text-blue-600';

  // Flash Color: Immediate visual feedback
  const flashColor = flashState === 'up' ? 'text-red-500' : 'text-blue-600';

  // Render Logic for Price
  const renderPrice = () => {
    const priceStr = formatPrice(coin.price);

    // Case 1: Flashing (Price changed recently) - color entire string
    if (flashState) {
        return <span className={`${flashColor} transition-colors duration-75 font-medium`}>{priceStr}</span>;
    }

    // Case 2: Idle (Color only the last two digits/characters based on LAST TICK direction)
    if (priceStr.length <= 2) {
         return <span className={`font-medium ${tickColor}`}>{priceStr}</span>;
    }

    const base = priceStr.slice(0, -2);
    const highlight = priceStr.slice(-2);

    return (
        <span className="font-medium">
            <span className="text-gray-900">{base}</span>
            <span className={tickColor}>{highlight}</span>
        </span>
    );
  };

  return (
    <div 
      onClick={() => onCoinClick(coin)}
      className="flex py-2.5 border-b border-gray-50 items-center hover:bg-gray-50 active:bg-gray-100 cursor-pointer h-[56px] transition-colors"
    >
      {/* Name */}
      <div className="w-[45%] pl-4 flex flex-col justify-center">
        <div className="flex items-center">
          <span className="font-bold text-gray-800 text-sm mr-1">{coin.nameKr}</span>
          {[ 'MMT', 'OG', 'ENSO'].includes(coin.id) && (
              <span className="bg-orange-100 text-orange-600 text-[9px] px-1 rounded font-medium leading-tight flex items-center h-4">재건축</span>
          )}
          {coin.id === 'DOGE' && (
               <div className="flex space-x-0.5">
                   <span className="bg-orange-100 text-orange-600 text-[9px] px-1 rounded font-medium leading-tight flex items-center h-4">재건축</span>
                   <span className="bg-purple-100 text-purple-600 text-[9px] px-1 rounded font-medium leading-tight flex items-center h-4">분양</span>
               </div>
          )}
        </div>
        <span className="text-[11px] text-gray-400 font-normal mt-0.5">{coin.location}</span>
      </div>

      {/* Price */}
      <div className="w-[30%] text-right flex flex-col items-end justify-center">
        <span className="text-sm tracking-tight">{renderPrice()}</span>
        {/* Invisible spacer to align price with the percentage change line (which has a subtitle below it) */}
        <span className="text-[10px] leading-none mt-0.5 opacity-0 select-none">0</span>
      </div>

      {/* Change - Uses 24h change color */}
      <div className={`w-[25%] text-right pr-4 flex flex-col items-end justify-center ${changeColor}`}>
        <span className="text-sm">{coin.changeRate > 0 ? '+' : ''}{coin.changeRate.toFixed(2)}%</span>
        <span className="text-[10px] leading-none mt-0.5">{Math.round(coin.price - coin.prevPrice)}</span>
      </div>
    </div>
  );
});

const ExchangeView: React.FC<ExchangeViewProps> = ({ coins, onCoinClick }) => {
  const [activeFilter, setActiveFilter] = useState('전국');

  const filteredCoins = coins.filter((coin) => {
    if (activeFilter === '전국') return true;
    if (activeFilter === '관심') return false; 
    return coin.location.includes(activeFilter);
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header */}
      <div className="relative px-4 py-3 flex justify-center items-center bg-white">
        <h1 className="text-lg font-bold text-[#101169]">거래소</h1>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-3 text-[#101169]">
          <Settings size={22} strokeWidth={1.5} />
          <MessageSquare size={22} strokeWidth={1.5} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-2 bg-white">
        <div className="flex items-center text-[#101169] cursor-pointer">
            <Search size={18} className="mr-2" />
            <span className="text-sm font-medium">아파트명 검색</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex px-4 pt-2 space-x-4 overflow-x-auto no-scrollbar border-b border-gray-100 bg-white">
        {['전국', '서울', '경기', '부산', '인천', '대전', '대구', '울산', '관심'].map((tab) => {
             const isActive = activeFilter === tab;
             return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`whitespace-nowrap pb-2 text-sm transition-colors flex-shrink-0 border-b-2 ${
                    isActive 
                      ? 'text-[#101169] border-[#101169] font-bold' 
                      : 'text-gray-400 border-transparent font-medium hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
             );
        })}
      </div>

      {/* List Header */}
      <div className="flex text-xs text-gray-500 py-2 border-b border-gray-100 bg-white">
        <div className="w-[45%] pl-4 flex items-center cursor-pointer">한글명 <span className="text-[9px] ml-1 text-gray-300">⇅</span></div>
        <div className="w-[30%] text-right flex justify-end items-center cursor-pointer">현재가 <span className="text-[9px] ml-1 text-gray-300">⇅</span></div>
        <div className="w-[25%] text-right pr-4 flex justify-end items-center cursor-pointer">전일대비 <span className="text-[9px] ml-1 text-gray-300">⇅</span></div>
      </div>

      {/* Coin List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20 bg-white">
        {filteredCoins.map((coin) => (
            <CoinRow key={coin.id} coin={coin} onCoinClick={onCoinClick} />
        ))}
      </div>
    </div>
  );
};

export default ExchangeView;
