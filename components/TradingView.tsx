
import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Star, Bell, Share, ChevronDown, ChevronUp, Plus, Minus, Check, Search, MapPin, SlidersHorizontal, Building2, School, Coffee, Clock, Store, Cone, Maximize, RotateCw } from 'lucide-react';
import { Coin } from '../types';

interface TradingViewProps {
  coin: Coin;
  onBack: () => void;
}

const TradingView: React.FC<TradingViewProps> = ({ coin, onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('지도');
  const [orderTab, setOrderTab] = useState<'buy' | 'sell' | 'history'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'reserve'>('limit');
  
  // New State for toggling Map UI
  const [showMapUi, setShowMapUi] = useState<boolean>(true);

  // Size Selector State
  const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('18B평(11B)');

  // Unit Toggle State (Defaulted to pyeong to match screenshot)
  const [unitMode, setUnitMode] = useState<'m2' | 'pyeong'>('pyeong');

  // --- REAL-TIME SIMULATION STATE ---
  const [tickerPrice, setTickerPrice] = useState<number>(coin.price);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
        const volatility = 2000000; 
        const randomMove = (Math.random() - 0.5) * volatility;
        setTickerPrice(prev => Math.floor(prev + randomMove));
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  // Derived values for Real-time display
  const currentChangeRate = ((tickerPrice - coin.prevPrice) / coin.prevPrice) * 100;
  const isUp = currentChangeRate > 0;
  const isZero = currentChangeRate === 0;
  const mainColor = isUp ? 'text-red-500' : isZero ? 'text-gray-800' : 'text-blue-600';
  
  const pyeongPrice = Math.floor((tickerPrice / 17.6739) / 10000); 

  const [orderPrice, setOrderPrice] = useState<number>(coin.price);
  const [amount, setAmount] = useState<string>('');

  // CSS class for smooth toggling
  const uiTransitionClass = `transition-opacity duration-300 ease-in-out ${showMapUi ? 'opacity-100' : 'opacity-0 pointer-events-none'}`;

  const sizeOptions = [
      '18B평(11B)',
      '25A평(59A)',
      '25B평(59B)',
      '33A평(84A)',
      '33B평(84B)',
      '38평(99)',
      '42평(110)',
      '50평(134)'
  ];

  const getSizeText = (size: string) => {
    if (unitMode === 'pyeong') return size;
    if (size === '18B평(11B)') return '61.37A㎡ (39.1A)';
    const match = size.match(/(\d+)[A-Z]?평\((\d+)[A-Z]?\)/);
    if (match) {
        return `${match[2]}.${match[1]}㎡ (${match[2]})`; 
    }
    return size;
  };

  const handleSizeSelect = (size: string) => {
      setSelectedSize(size);
      setIsSizeSelectorOpen(false);
  };

  // --- Order Logic ---
  const calculateTotal = () => {
    const amt = parseFloat(amount);
    if (!amt) return 0;
    return Math.floor(orderPrice * amt);
  };

  const orderBookData = useMemo(() => {
    const currentPrice = tickerPrice; 
    const asks = [];
    const bids = [];
    const shape = 2.5; 
    const scale = 4.0; 
    const imbalanceRaw = Math.max(-5, Math.min(5, currentChangeRate)); 
    const imbalance = 1 + (imbalanceRaw * 0.1);
    const baseVolume = Math.max(coin.volume24h / 50, 500);

    const getGammaVolume = (index: number) => {
        const x = index + 1; 
        return Math.pow(x, shape - 1) * Math.exp(-x / scale);
    };

    let tickSize = currentPrice >= 1000 ? 1 : 0.01; 
    if (currentPrice >= 1000000) tickSize = 1000;
    else if (currentPrice >= 100000) tickSize = 100;

    const depth = 15;

    for(let i = depth - 1; i >= 0; i--) {
        const priceOffset = (i + 1) * tickSize;
        const p = currentPrice + priceOffset;
        const change = ((p - coin.prevPrice) / coin.prevPrice) * 100;
        let vol = baseVolume * getGammaVolume(i) * (2 - imbalance);
        const isWall = (i % 7 === 3) && Math.random() > 0.5;
        vol = vol * (0.8 + Math.random() * 0.4) * (isWall ? 2.5 : 1);
        asks.push({ price: p, amount: Math.floor(vol), changeRate: change });
    }

    for(let i = 0; i < depth; i++) {
        const priceOffset = i * tickSize;
        const p = currentPrice - priceOffset;
        const change = ((p - coin.prevPrice) / coin.prevPrice) * 100;
        let vol = baseVolume * getGammaVolume(i) * imbalance;
        const isWall = (i % 8 === 2) && Math.random() > 0.5;
        vol = vol * (0.8 + Math.random() * 0.4) * (isWall ? 2.5 : 1);
        bids.push({ price: p, amount: Math.floor(vol), changeRate: change });
    }
    return { asks: asks.slice(asks.length - 7), bids: bids.slice(0, 7) };
  }, [tickerPrice, coin.prevPrice, coin.volume24h, currentChangeRate]); 

  const maxQuantity = useMemo(() => {
    const maxAsk = Math.max(...orderBookData.asks.map(o => o.amount), 0);
    const maxBid = Math.max(...orderBookData.bids.map(o => o.amount), 0);
    return Math.max(maxAsk, maxBid);
  }, [orderBookData]);

  const OrderRow: React.FC<{ item: any; type: 'buy' | 'sell' }> = ({ item, type }) => {
      const quantityRatio = maxQuantity > 0 ? (item.amount / maxQuantity) : 0;
      const barWidth = quantityRatio * 50;
      const barColor = type === 'buy' ? 'bg-red-500/10' : 'bg-blue-500/10';
      const textColor = type === 'buy' ? 'text-red-500' : 'text-blue-500';
      const displayPrice = item.price >= 100 ? Math.floor(item.price).toLocaleString() : item.price.toLocaleString();

      return (
          <div className="relative flex justify-end items-center h-[45px] px-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden w-full">
              <div className={`absolute top-0 bottom-0 left-1/2 h-full ${barColor} z-0`} style={{ width: `${barWidth}%` }} />
              <div className="relative z-10 flex flex-col items-end justify-center mr-3 w-24">
                  <span className={`font-bold text-sm ${textColor}`}>{displayPrice}</span>
                  <span className="text-[10px] text-gray-400">{item.changeRate > 0 ? '+' : ''}{item.changeRate.toFixed(2)}%</span>
              </div>
              <div className="relative z-10 text-right w-16">
                  <span className="text-gray-600 font-medium">{item.amount.toLocaleString()}</span>
              </div>
          </div>
      );
  };

  const renderMarketPriceView = () => {
    return (
      <div className="flex flex-col w-full h-full bg-white relative">
        
        {/* Map Area */}
        <div className="absolute inset-0 w-full h-full bg-[#F3F0E7] overflow-hidden">
            {/* Map Background Layer */}
            <div 
                className="absolute inset-0 z-0 cursor-pointer" 
                onClick={() => setShowMapUi(!showMapUi)}
            >
                {/* Map Texture */}
                <div className="absolute inset-0 opacity-10 w-full h-full pointer-events-none" 
                     style={{ 
                         backgroundImage: 'radial-gradient(#A0A0A0 1px, transparent 1px)', 
                         backgroundSize: '20px 20px' 
                     }}>
                </div>
                
                {/* Roads */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-white/60 transform -rotate-12 border-y border-gray-300 w-[120%] -ml-[10%] pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-white/60 transform border-x border-gray-300 pointer-events-none"></div>

                {/* Labels */}
                <div className="absolute top-[20%] left-[20%] text-orange-800 text-[10px] font-medium bg-white/80 px-1 rounded border border-orange-200 pointer-events-none">투썸플레이스</div>
                <div className="absolute top-[25%] left-[50%] text-gray-600 text-[10px] font-medium pointer-events-none">석촌시장</div>
                <div className="absolute bottom-[20%] right-[30%] text-gray-500 text-sm font-medium pointer-events-none">가락1동</div>
            </div>

            {/* Top Controls (Left) */}
            <div className={`absolute top-24 left-4 flex flex-col space-y-2 z-10 ${uiTransitionClass}`}>
                <button className="bg-white p-2 rounded shadow-sm border border-gray-200 mb-2 flex flex-col items-center justify-center w-10 h-10">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-gray-600"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-gray-600"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-gray-600"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-gray-600"></div>
                    </div>
                </button>
                <div className="bg-white rounded shadow-sm border border-gray-200 flex flex-col w-10 overflow-hidden">
                    <button className="p-2 flex items-center justify-center active:bg-gray-100 border-b border-gray-100">
                        <Plus size={20} className="text-gray-700"/>
                    </button>
                    <button className="p-2 flex items-center justify-center active:bg-gray-100">
                        <Minus size={20} className="text-gray-700"/>
                    </button>
                </div>
                 <button className="bg-white p-1 rounded shadow-sm border border-gray-200 flex flex-col items-center justify-center w-10 h-10 mt-2">
                     <div className="w-5 h-5 border border-gray-400 relative bg-yellow-100/50 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-200"></div>
                     </div>
                     <span className="text-[9px] text-gray-600 leading-none mt-0.5">도구</span>
                 </button>
            </div>

            {/* Top Center/Right - Controls */}
            <div className={`absolute top-24 left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-2 w-full justify-center pl-8 ${uiTransitionClass}`}>
                 {/* Center Pill */}
                <button className="bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200 flex items-center space-x-1">
                    <MapPin size={12} className="text-green-600 fill-green-600" />
                    <span className="text-xs font-bold text-gray-800">가락동만 보기</span>
                </button>
                
                {/* Fullscreen Button */}
                <button className="bg-white w-8 h-8 rounded shadow-md border border-gray-200 flex items-center justify-center text-gray-700">
                     <Maximize size={16} strokeWidth={2.5} />
                </button>
            </div>

            {/* Right Sidebar */}
            <div className={`absolute top-24 right-4 flex flex-col space-y-2 z-10 ${uiTransitionClass}`}>
                <button className="bg-white w-10 h-10 rounded-full shadow-md flex flex-col items-center justify-center border border-gray-200 mb-2">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-600 flex items-center justify-center">
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    <span className="text-[9px] mt-0.5 font-medium">매물</span>
                </button>
                
                <div className="bg-white rounded-md shadow-md flex flex-col overflow-hidden border border-gray-200 w-10">
                    <button className="h-12 flex flex-col items-center justify-center bg-[#8b5cf6] text-white">
                        <Building2 size={18} strokeWidth={1.5} />
                        <span className="text-[9px] mt-0.5 font-medium">단지</span>
                    </button>
                    <button className="h-12 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-50 border-t border-gray-100">
                        <Cone size={18} strokeWidth={1.5} />
                        <span className="text-[9px] mt-0.5">개발</span>
                    </button>
                    <button className="h-12 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-50 border-t border-gray-100">
                        <School size={18} strokeWidth={1.5} />
                        <span className="text-[9px] mt-0.5">학교</span>
                    </button>
                    <button className="h-12 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-50 border-t border-gray-100">
                        <Star size={18} strokeWidth={1.5} />
                        <span className="text-[9px] mt-0.5">편의</span>
                    </button>
                    <button className="h-12 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-50 border-t border-gray-100">
                        <Store size={18} strokeWidth={1.5} />
                        <span className="text-[9px] mt-0.5">중개</span>
                    </button>
                    <button className="h-12 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-50 border-t border-gray-100">
                        <Clock size={18} strokeWidth={1.5} />
                        <span className="text-[9px] mt-0.5">도착</span>
                    </button>
                </div>
            </div>

            {/* Markers */}
            <div className="absolute top-[45%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                <div className="flex flex-col items-center relative">
                    <div className="bg-white border border-gray-400 p-0.5 rounded-sm shadow-sm z-0">
                        <div className="w-5 h-6 bg-[#E0E7FF] flex flex-col items-center justify-end pb-0.5 border border-blue-200">
                             <div className="flex space-x-[1px] mb-0.5">
                                 <div className="w-[2px] h-[2px] bg-blue-300"></div>
                                 <div className="w-[2px] h-[2px] bg-blue-300"></div>
                             </div>
                             <div className="flex space-x-[1px] mb-0.5">
                                 <div className="w-[2px] h-[2px] bg-blue-300"></div>
                                 <div className="w-[2px] h-[2px] bg-blue-300"></div>
                             </div>
                             <div className="w-full h-1.5 bg-[#8b5cf6]"></div>
                        </div>
                    </div>
                    <div className="text-gray-600 text-[10px] font-bold mt-0.5 drop-shadow-md shadow-white">
                        헬리오시티
                    </div>
                </div>
            </div>
            
            <div className="absolute top-[35%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="flex flex-col items-center">
                    <div className="bg-white border border-gray-400 p-0.5 rounded-sm shadow-sm">
                        <div className="w-4 h-5 bg-[#E0E7FF] border border-blue-200"></div>
                    </div>
                    <div className="mt-[-2px] bg-gray-600 text-white text-[9px] px-1 py-0.5 rounded-md shadow-md whitespace-nowrap">
                        3,673만원
                    </div>
                </div>
            </div>

            {/* Scale */}
            <div className={`absolute bottom-24 left-4 z-10 flex flex-col items-start ${uiTransitionClass}`}>
                 <div className="h-2 w-16 border-b-2 border-l-2 border-r-2 border-gray-600 mb-1"></div>
                 <span className="text-[10px] font-bold text-gray-800 ml-1">100m</span>
            </div>

            {/* FAB */}
            <div className={`absolute bottom-24 right-4 z-10 ${uiTransitionClass}`}>
                <button className="w-14 h-14 bg-[#00D07C] rounded-full flex items-center justify-center shadow-lg text-white">
                    <Plus size={32} />
                </button>
            </div>
        </div>

        {/* Map Filter Header */}
        <div className={`flex flex-col w-full absolute top-0 left-0 z-20 bg-white border-b border-gray-200 shadow-sm ${uiTransitionClass}`}>
            <div className="flex justify-between items-center px-4 py-2">
                <div className="flex items-center font-bold text-base text-gray-800">
                    송파구 가락동 <ChevronDown size={18} className="ml-1" />
                </div>
                <div className="flex items-center text-blue-600 font-medium text-xs">
                    <SlidersHorizontal size={14} className="mr-1" />
                    조건변경
                </div>
            </div>
            <div className="flex px-4 py-2 space-x-2 overflow-x-auto no-scrollbar w-full">
                <button className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 whitespace-nowrap bg-white shadow-sm">매매,전세,월세</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 whitespace-nowrap bg-white shadow-sm">아파트,재건축</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 whitespace-nowrap bg-white shadow-sm">면적 전체</button>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className={`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-6 pt-3 px-4 flex flex-col justify-center items-center shadow-[0_-4px_15px_rgba(0,0,0,0.1)] z-50 rounded-t-2xl w-full ${uiTransitionClass}`}>
             <div className="w-10 h-1 bg-gray-300 rounded-full mb-3"></div>
             <div className="flex items-center w-full justify-center">
                <span className="font-bold text-base text-gray-900 mr-1">단지 목록</span>
                <span className="font-bold text-base text-red-500">8</span>
             </div>
        </div>
      </div>
    );
  };

  const renderInfoView = () => (
    <div className="flex flex-col h-full overflow-y-auto bg-white pb-20 w-full">
      <div className="flex h-52 w-full overflow-x-auto no-scrollbar bg-gray-100">
        <div className="min-w-[45%] h-full bg-gray-200 relative mr-0.5">
           <img src="https://landthumb-phinf.pstatic.net/20200720_108/apt_realimage_1595216455109O0Jnd_JPEG/10b306abde0ce9d201cfd86fa95dd15e.JPG?type=m562" className="w-full h-full object-cover" alt="Building" />
        </div>
        <div className="min-w-[45%] h-full bg-gray-200 relative mr-0.5">
           <img src="https://landthumb-phinf.pstatic.net/20200720_72/apt_realimage_1595216440249D7XxM_JPEG/d043fb6743a1768688469c89cd525e76.JPG?type=m562" className="w-full h-full object-cover" alt="Complex" />
           <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">30</div>
        </div>
        <div className="min-w-[30%] h-full bg-gray-100 relative">
           <div className="w-full h-full bg-gray-200 relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
               <div className="text-green-600 mb-0.5">📍</div>
               <span className="text-[10px] text-gray-600 font-bold">{coin.nameKr}</span>
             </div>
             <div className="absolute bottom-2 left-2 right-2 h-px bg-gray-400"></div>
             <div className="absolute bottom-1 right-2 text-[8px] text-gray-500">300m</div>
           </div>
        </div>
      </div>

      <div className="flex flex-col px-4 py-2 text-sm text-gray-900 w-full">
          <div className="flex py-3 border-b border-gray-100 items-center justify-between">
              <span className="w-24 text-gray-500 font-normal">위치</span>
              <div className="flex-1 flex justify-end items-center font-medium">
                 <span>서울시 송파구 송파대로 345</span>
                 <ChevronDown size={16} className="ml-1 text-gray-400" />
              </div>
          </div>
           <div className="flex py-3 border-b border-gray-100 items-center justify-between">
              <span className="text-gray-500 font-normal">사용승인일</span>
              <span className="font-medium">2018. 12. 28. <span className="text-gray-400 font-normal">(7년차)</span></span>
          </div>
           <div className="flex py-3 border-b border-gray-100 items-center justify-between">
              <span className="text-gray-500 font-normal">세대수</span>
              <span className="font-medium text-right">9,510세대 <span className="text-gray-400 font-normal">(기타임대 1401세대 포함)</span></span>
          </div>
           <div className="flex py-3 border-b border-gray-100 items-center justify-between">
              <span className="text-gray-500 font-normal">난방</span>
              <span className="font-medium">지역난방 / 열병합</span>
          </div>
           <div className="flex py-3 border-b border-gray-100 items-center justify-between">
              <span className="text-gray-500 font-normal">주차</span>
              <span className="font-medium">12,602대 <span className="text-gray-400 font-normal">(세대당 1.32대)</span></span>
          </div>
          <div className="flex py-3 border-b border-gray-100 items-center justify-between">
              <span className="text-gray-500 font-normal">전기차 충전시설</span>
              <div className="flex items-center space-x-2">
                 <span className="font-medium">256대</span>
                 <button className="border border-gray-300 rounded px-1.5 py-0.5 text-[11px] text-gray-700 bg-white">상세보기</button>
              </div>
          </div>
          <div className="flex py-3 border-b border-gray-100 items-center justify-between">
              <span className="text-gray-500 font-normal">용적률/건폐율</span>
              <span className="font-medium">285% / 19%</span>
          </div>
          <div className="flex py-3 border-b border-gray-100 items-center justify-between">
              <span className="text-gray-500 font-normal">관리사무소 전화</span>
              <span className="font-medium underline underline-offset-2">02-403-8330</span>
          </div>
           <div className="flex py-3 border-b border-gray-100 items-start justify-between">
              <span className="text-gray-500 font-normal w-20 shrink-0">건설사</span>
              <span className="font-medium text-right leading-relaxed">에이치디씨현대산업개발, 현대건설, 삼성물산</span>
          </div>
      </div>
    </div>
  );

  const renderOrderView = () => (
    <div className="flex w-full h-full bg-white">
        <div className="w-[40%] overflow-y-auto no-scrollbar bg-white border-r border-gray-200 relative pb-20 text-xs">
            <div className="flex flex-col">
                {orderBookData.asks.map((item, i) => (
                    <OrderRow key={`ask-${i}`} item={item} type="sell" />
                ))}
            </div>
            
            <div className="border-t border-gray-100">
                {orderBookData.bids.map((item, i) => (
                    <OrderRow key={`bid-${i}`} item={item} type="buy" />
                ))}
            </div>
        </div>

        <div className="w-[60%] flex flex-col bg-white h-full overflow-y-auto pb-20">
            <div className="flex border-b border-gray-200 w-full">
                <button 
                   onClick={() => setOrderTab('buy')}
                   className={`flex-1 py-3 text-sm font-bold flex items-center justify-center ${orderTab === 'buy' ? 'text-red-500 bg-white' : 'text-gray-400 bg-gray-100'}`}
                >
                   매수
                </button>
                <button 
                   onClick={() => setOrderTab('sell')}
                   className={`flex-1 py-3 text-sm font-medium flex items-center justify-center border-l border-gray-200 ${orderTab === 'sell' ? 'text-blue-600 bg-white' : 'text-gray-400 bg-gray-100'}`}
                >
                   매도
                </button>
                <button 
                   onClick={() => setOrderTab('history')}
                   className="flex-1 py-3 text-sm font-medium text-gray-400 bg-gray-100 flex items-center justify-center border-l border-gray-200"
                >
                   거래내역
                </button>
            </div>

            <div className="px-3 pt-4 flex flex-col h-full w-full">
                <div className="flex space-x-3 mb-4 w-full">
                    {[
                      { id: 'limit', label: '지정' },
                      { id: 'market', label: '시장' },
                      { id: 'reserve', label: '예약' }
                    ].map((type) => (
                      <label key={type.id} className="flex items-center space-x-1 cursor-pointer">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${orderType === type.id ? 'bg-blue-900 border-blue-900' : 'border border-gray-300 bg-white'}`}>
                              {orderType === type.id && <Check size={10} className="text-white" strokeWidth={4} />}
                          </div>
                          <span className={`text-xs ${orderType === type.id ? 'font-bold text-gray-800' : 'text-gray-500'}`} onClick={() => setOrderType(type.id as any)}>
                            {type.label}
                          </span>
                      </label>
                    ))}
                </div>
                
                <div className="flex justify-between items-end mb-3 w-full">
                    <span className="text-gray-500 text-[11px] pb-0.5">주문가능</span>
                    <span className="font-bold text-gray-900 text-[13px]">8,391,077 KRW</span>
                </div>
                
                <div className="flex mb-2 h-10 space-x-1 w-full">
                    <div className="flex-1 border border-gray-300 rounded-sm relative bg-white flex items-center focus-within:border-black">
                         <span className="absolute left-2.5 text-sm text-gray-500">수량</span>
                         <input 
                            type="text" 
                            className="w-full h-full pl-4 pr-4 text-right outline-none text-[15px] text-gray-800 bg-white"
                            value={amount}
                            placeholder="0"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                     <button className="w-[52px] bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-between px-1.5 text-sm text-gray-600">
                        <span className="text-xs">가능</span> <ChevronDown size={12}/>
                    </button>
                </div>
                
                 <div className="flex mb-2 h-10 space-x-1 w-full">
                     <div className="flex-1 border border-gray-300 rounded-sm relative bg-white flex items-center focus-within:border-black">
                         <span className="absolute left-2.5 text-sm text-gray-500">가격</span>
                         <input 
                             type="text"
                             className="w-full h-full pl-12 pr-10 text-right font-medium text-[15px] text-gray-900 outline-none bg-white"
                             value={orderPrice.toLocaleString()}
                             readOnly
                         />
                          <span className="absolute right-2.5 text-xs text-gray-400 mt-0.5">KRW</span>
                     </div>
                     <button onClick={() => setOrderPrice(p => p - 1)} className="w-8 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center text-gray-600 active:bg-gray-200">
                         <Minus size={16} strokeWidth={1.5}/>
                     </button>
                     <button onClick={() => setOrderPrice(p => p + 1)} className="w-8 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center text-gray-600 active:bg-gray-200">
                         <Plus size={16} strokeWidth={1.5}/>
                     </button>
                </div>
                
                <div className="mb-2 h-10 border border-gray-200 rounded-sm bg-gray-100 flex items-center justify-between px-3 cursor-pointer w-full">
                    <span className="text-sm text-gray-700">현재가 대비 %</span>
                    <ChevronDown size={14} className="text-gray-500"/>
                </div>

                <div className="border border-gray-300 rounded-sm h-10 relative bg-white mb-4 flex items-center focus-within:border-black w-full">
                    <span className="absolute left-2.5 text-sm text-gray-500">총액</span>
                    <input 
                        type="text" 
                        className="w-full h-full pl-12 pr-10 text-right outline-none text-[15px] font-medium text-gray-900 bg-white" 
                        value={calculateTotal().toLocaleString()}
                        placeholder="0"
                        readOnly
                    />
                    <span className="absolute right-2.5 text-xs text-gray-400 mt-0.5">KRW</span>
                </div>

                <div className="flex mt-4 gap-2 w-full">
                    <button 
                        onClick={() => { setAmount(''); setOrderPrice(coin.price); }} 
                        className="flex-1 bg-gray-600 py-3 rounded hover:bg-gray-500 transition-colors text-white"
                    >
                        초기화
                    </button>
                    <button 
                        className={`flex-1 text-white py-3 rounded font-bold transition-colors ${
                            orderTab === 'buy' 
                                ? 'bg-red-600 hover:bg-red-500' 
                                : 'bg-blue-600 hover:bg-blue-500'
                        }`}
                    >
                        {orderTab === 'buy' ? '매수' : '매도'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-sm w-full h-full" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* Dark Overlay - visible when selector is open */}
      {isSizeSelectorOpen && (
          <div 
              className="fixed inset-0 bg-black/50 z-[55] transition-opacity duration-200"
              onClick={() => setIsSizeSelectorOpen(false)}
          />
      )}

      {/* HEADER - Z-index 60 to sit above overlay, with bg-white to be opaque */}
      <div className="flex flex-col px-4 py-3 bg-white border-b border-gray-200 w-full relative z-[60]">
        <div className="flex items-center justify-between mb-2 w-full">
            <div className="flex items-center">
                <button onClick={onBack} className="mr-2"><ArrowLeft size={24} className="text-blue-900" /></button>
                <h1 className="text-xl font-bold text-blue-900 mr-2">{coin.nameKr}</h1>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsSizeSelectorOpen(!isSizeSelectorOpen)}
                        className="bg-blue-900 text-white px-2 h-6 text-xs font-bold flex items-center justify-center rounded leading-none pt-[1px] ml-1"
                    >
                        <span className="mr-0.5">{getSizeText(selectedSize)}</span>
                        {isSizeSelectorOpen ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
                    </button>
                </div>
            </div>
            <div className="flex space-x-4 text-blue-900">
                <Bell size={24} strokeWidth={1.5} />
                <Star size={24} strokeWidth={1.5} />
                <Share size={24} strokeWidth={1.5} />
            </div>
        </div>
        
        {/* Dropdown Menu - Inside Header container (z-60) but absolute positioned */}
        {isSizeSelectorOpen && (
            <div className="absolute top-[44px] left-0 right-0 bg-white z-[70] shadow-xl border-b border-gray-200 max-h-[60vh] overflow-y-auto">
                <div className="bg-gray-100 px-4 py-2 text-xs font-medium text-gray-500 border-y border-gray-200">평형 (타입)</div>
                {sizeOptions.map((size) => (
                    <button 
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`w-full text-left px-4 py-3 text-sm border-b border-gray-50 flex items-center justify-between active:bg-gray-50 ${size === selectedSize ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-gray-800'}`}
                    >
                        {getSizeText(size)}
                        {size === selectedSize && <Check size={16} className="text-blue-600" />}
                    </button>
                ))}
            </div>
        )}

        <div className="flex items-baseline w-full mt-0.5 mb-1">
             <span className={`text-2xl font-bold ${mainColor} mr-2 tracking-tight`}>{tickerPrice.toLocaleString()}</span>
             <span className={`text-lg ${mainColor} font-bold mr-2`}>{isUp ? '+' : ''}{currentChangeRate.toFixed(2)}%</span>
             <span className={`text-lg ${mainColor} font-medium`}>{isUp ? '▲' : isZero ? '-' : '▼'} {Math.abs(Math.round(tickerPrice - coin.prevPrice)).toLocaleString()}</span>
        </div>
        
        <div className="flex flex-wrap items-center text-xs text-gray-500 w-full mt-1 leading-relaxed">
            <span className="font-bold text-blue-900">{pyeongPrice.toLocaleString()}만원/평</span>
            <span className="mx-2 text-gray-300 text-[10px]">|</span>
            <span className="text-gray-600">209동</span>
            <span className="mx-2 text-gray-300 text-[10px]">|</span>
            <span className="text-gray-600">18평(전용11)</span>
            
            <span className="mx-2 text-gray-300 text-[10px]">|</span>

            <span>21/26층</span>
            <span className="mx-2 text-gray-300 text-[10px]">|</span>
            <span>남서향</span>

            <button 
                onClick={() => setUnitMode(prev => prev === 'm2' ? 'pyeong' : 'm2')}
                className="border border-gray-300 text-gray-900 px-2 h-6 text-xs font-medium flex items-center justify-center rounded leading-none bg-white ml-auto"
            >
                <RotateCw size={11} className="mr-1 text-gray-500" />
                <span className="pt-[1px]">{unitMode === 'm2' ? 'm²' : '평'}</span>
            </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-200 bg-[#101169] text-white w-full relative z-40">
        {['주문', '호가주문', '차트', '지도', '정보'].map((item) => (
        <button 
            key={item} 
            onClick={() => setActiveTab(item)}
            className={`flex-1 py-2 text-center active:bg-transparent ${activeTab === item ? 'font-bold text-white border-b-2 border-white' : 'text-gray-300 opacity-80'}`}
            style={{ backgroundColor: 'transparent' }}
        >
            {item}
        </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden relative w-full h-full">
         {activeTab === '정보' ? renderInfoView() : activeTab === '지도' ? renderMarketPriceView() : renderOrderView()}
      </div>
    </div>
  );
};

export default TradingView;
