import React, { useState, useEffect, useRef } from 'react';
import BottomNav from './components/BottomNav';
import ExchangeView from './components/ExchangeView';
import InvestmentView from './components/InvestmentView';
import CoinInfoView from './components/CoinInfoView';
import TradingView from './components/TradingView';
import CrowdFundingView from './components/CrowdFundingView';
import { TabId, Coin } from './types';
import { COINS } from './constants';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabId>('exchange');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [coins, setCoins] = useState<Coin[]>(COINS);

  useEffect(() => {
    let isMounted = true;
    const activeTimeouts = new Set<ReturnType<typeof setTimeout>>();

    // The Data Engine: Concurrent Recursive Updates
    const scheduleUpdate = () => {
      if (!isMounted) return;

      setCoins((prevCoins) => {
        // Pick a random coin to update
        const randomIndex = Math.floor(Math.random() * prevCoins.length);
        const newCoins = [...prevCoins];
        const coin = newCoins[randomIndex];

        // Price Fluctuation Math: 0.5% volatility
        const fluctuation = (Math.random() - 0.5) * (coin.price * 0.005);
        let newPrice = Math.max(0, coin.price + fluctuation);

        // Rounding logic to maintain realistic price ticks
        if (newPrice > 100000) newPrice = Math.round(newPrice / 100) * 100;
        else if (newPrice > 1000) newPrice = Math.round(newPrice);
        else if (newPrice > 100) newPrice = Math.round(newPrice * 10) / 10;
        else newPrice = Math.round(newPrice * 100) / 100;

        // Volume Logic
        let addedVolume = 0;
        if (Math.random() < 0.3) {
           const tradeSize = Math.random() * 500; 
           addedVolume = (tradeSize * newPrice) / 1000000;
        }

        // Recalculate change rate
        const changeRate = ((newPrice - coin.prevPrice) / coin.prevPrice) * 100;

        newCoins[randomIndex] = {
          ...coin,
          price: newPrice,
          changeRate: changeRate,
          volume24h: coin.volume24h + addedVolume
        };
        
        return newCoins;
      });

      // Schedule the next update with a RANDOM delay (50ms to 750ms)
      const randomDelay = Math.random() * 700 + 50; 
      const timeoutId = setTimeout(() => {
          activeTimeouts.delete(timeoutId);
          scheduleUpdate();
      }, randomDelay);
      activeTimeouts.add(timeoutId);
    };

    // Start 5 concurrent loops
    for (let i = 0; i < 5; i++) {
        scheduleUpdate();
    }

    return () => {
      isMounted = false;
      activeTimeouts.forEach(clearTimeout);
    };
  }, []);

  const selectedCoin = coins.find((c) => c.id === selectedCoinId) || null;

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoinId(coin.id);
  };

  const renderView = () => {
    if (selectedCoin) {
      return (
        <div className="h-full bg-white">
          <TradingView coin={selectedCoin} onBack={() => setSelectedCoinId(null)} />
        </div>
      );
    }

    switch (currentTab) {
      case 'exchange':
        return <ExchangeView coins={coins} onCoinClick={handleCoinClick} />;
      case 'investment':
        return <InvestmentView />;
      case 'info':
        return <CoinInfoView coins={coins} />;
      case 'deposit':
        return <CrowdFundingView />;
      case 'more':
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white">
            <p>준비 중인 기능입니다.</p>
          </div>
        );
      default:
        return <ExchangeView coins={coins} onCoinClick={handleCoinClick} />;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {renderView()}
      </div>

      {/* Bottom Nav - Hide if in Trading View */}
      {!selectedCoin && (
        <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
      )}
    </div>
  );
};

export default App;
