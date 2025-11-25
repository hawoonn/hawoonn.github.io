
import React from 'react';
import { Home, BarChart2, FileText, ArrowLeftRight, Grid } from 'lucide-react';
import { TabId } from '../types';

interface BottomNavProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const navItems: { id: TabId; label: string; icon: React.FC<any> }[] = [
    { id: 'exchange', label: '거래소', icon: Home },
    { id: 'deposit', label: '분양', icon: ArrowLeftRight },
    { id: 'info', label: '부동산정보', icon: BarChart2 },
    { id: 'investment', label: '투자내역', icon: FileText },
    { id: 'more', label: '더보기', icon: Grid },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#101169] text-white border-t border-blue-900 pb-safe h-[60px] flex items-center justify-around z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive ? 'text-white' : 'text-gray-400'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-[10px] mt-1 font-normal tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
