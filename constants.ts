
import { Coin, Asset, OrderBookItem } from './types';

export const COINS: Coin[] = [

  { id: 'XRP', symbol: 'XRP', name: 'Ripple', nameKr: '잠실래미안아이파크', location: '서울시 송파구 신천동', price: 2750000000, prevPrice: 2720000000, changeRate: 1.10, volume24h: 1018177 },
  { id: 'BTC', symbol: 'BTC', name: 'Bitcoin', nameKr: '헬리오시티', location: '서울시 송파구 가락동', price: 2150000000, prevPrice: 2180000000, changeRate: -1.38, volume24h: 995843 },
  { id: 'TRUST', symbol: 'TRUST', name: 'Intuition', nameKr: '두산위브더제니스오션시티', location: '부산시 남구 우암동', price: 580000000, prevPrice: 565000000, changeRate: 2.65, volume24h: 761073 },
  { id: 'ETH', symbol: 'ETH', name: 'Ethereum', nameKr: '성산시영', location: '서울시 마포구 성산동', price: 1180000000, prevPrice: 1190000000, changeRate: -0.84, volume24h: 527618 },
  { id: 'MMT', symbol: 'MMT', name: 'Momentum', nameKr: '광명자이더샵포레나', location: '경기도 광명시 광명동', price: 1050000000, prevPrice: 1020000000, changeRate: 2.94, volume24h: 486136 },
  { id: 'USDT', symbol: 'USDT', name: 'Tether', nameKr: '남산타운', location: '서울시 중구 신당동', price: 1520000000, prevPrice: 1525000000, changeRate: -0.33, volume24h: 388238 },
  { id: 'SOL', symbol: 'SOL', name: 'Solana', nameKr: '올림픽파크포레온', location: '서울시 강동구 둔촌동', price: 2450000000, prevPrice: 2380000000, changeRate: 2.94, volume24h: 305632 },
  { id: 'DOGE', symbol: 'DOGE', name: 'Dogecoin', nameKr: '파크리오', location: '서울시 송파구 신천동', price: 2250000000, prevPrice: 2280000000, changeRate: -1.32, volume24h: 169402 },
  { id: 'FLUID', symbol: 'FLUID', name: 'Fluid', nameKr: '래미안안양메가트리아', location: '경기도 안양시 만안구 안양동', price: 920000000, prevPrice: 910000000, changeRate: 1.10, volume24h: 115840 },
  { id: 'OG', symbol: 'OG', name: 'ZeroG', nameKr: '청담르엘', location: '서울시 강남구 청담동', price: 5800000000, prevPrice: 5650000000, changeRate: 2.65, volume24h: 102864 },
  { id: 'TMG', symbol: 'TMG', name: 'Trimage', nameKr: '트리마제', location: '서울시 성동구 성수동1가', price: 3950000000, prevPrice: 3900000000, changeRate: 1.28, volume24h: 45020 },
  { id: 'RONE', symbol: 'RONE', name: 'OneBailey', nameKr: '래미안원베일리', location: '서울시 서초구 반포동', price: 4950000000, prevPrice: 4850000000, changeRate: 2.06, volume24h: 32010 },
  { id: 'GDK', symbol: 'GDK', name: 'Gracium', nameKr: '고덕그라시움', location: '서울시 강동구 고덕동', price: 1680000000, prevPrice: 1700000000, changeRate: -1.18, volume24h: 89000 },
  
  // Gyeonggi Coins
  { id: 'CSZ', symbol: 'CSZ', name: 'CheolsanXi', nameKr: '철산자이더헤리티지', location: '경기도 광명시 철산동', price: 1150000000, prevPrice: 1120000000, changeRate: 2.68, volume24h: 89000 },
  { id: 'BJE', symbol: 'BJE', name: 'BokjeongEpit', nameKr: '복정역에피트', location: '경기도 성남시 수정구 복정동', price: 980000000, prevPrice: 1000000000, changeRate: -2.00, volume24h: 45000 },
  { id: 'GCI', symbol: 'GCI', name: 'GwangmyeongCentral', nameKr: '광명센트럴아이파크', location: '경기도 광명시 광명동', price: 1080000000, prevPrice: 1080000000, changeRate: 0.00, volume24h: 32000 },
  { id: 'SFP', symbol: 'SFP', name: 'SanseongForestia', nameKr: '산성역포레스티아', location: '경기도 성남시 수정구 신흥동', price: 1120000000, prevPrice: 1090000000, changeRate: 2.75, volume24h: 67000 },
  { id: 'NBR', symbol: 'NBR', name: 'NamyangjuByeollae', nameKr: '남양주별내리슈빌', location: '경기도 남양주시 별내동', price: 780000000, prevPrice: 790000000, changeRate: -1.27, volume24h: 21000 },
  { id: 'CSB', symbol: 'CSB', name: 'CheolsanXiBriere', nameKr: '철산자이브리에르', location: '경기도 광명시 철산동', price: 980000000, prevPrice: 950000000, changeRate: 3.16, volume24h: 54000 },
  { id: 'PAF', symbol: 'PAF', name: 'PyeongchonIrvine', nameKr: '평촌어바인퍼스트', location: '경기도 안양시 동안구 호계동', price: 860000000, prevPrice: 840000000, changeRate: 2.38, volume24h: 41000 },
  { id: 'SRW', symbol: 'SRW', name: 'SangnokWoosung', nameKr: '상록우성', location: '경기도 성남시 분당구 정자동', price: 1450000000, prevPrice: 1500000000, changeRate: -3.33, volume24h: 98000 },

  // Busan Coins
  { id: 'LCNT', symbol: 'LCNT', name: 'LayCounty', nameKr: '레이카운티', location: '부산시 연제구 거제동', price: 820000000, prevPrice: 810000000, changeRate: 1.23, volume24h: 45000 },
  { id: 'DRIP', symbol: 'DRIP', name: 'DongnaeRaemian', nameKr: '동래래미안아이파크', location: '부산시 동래구 온천동', price: 920000000, prevPrice: 930000000, changeRate: -1.08, volume24h: 32000 },
  { id: 'DLCL', symbol: 'DLCL', name: 'DaeyeonLotte', nameKr: '대연롯데캐슬레전드', location: '부산시 남구 대연동', price: 750000000, prevPrice: 750000000, changeRate: 0.00, volume24h: 28000 },
  { id: 'HIPK', symbol: 'HIPK', name: 'HaeundaeIpark', nameKr: '해운대아이파크(주상복합)', location: '부산시 해운대구 우동', price: 1350000000, prevPrice: 1300000000, changeRate: 3.85, volume24h: 67000 },
  { id: 'HHSW', symbol: 'HHSW', name: 'HaeundaeHillstate', nameKr: '해운대힐스테이트위브', location: '부산시 해운대구 중동', price: 980000000, prevPrice: 1000000000, changeRate: -2.00, volume24h: 15000 },
  { id: 'DDIL', symbol: 'DDIL', name: 'DaeyeonDIEL', nameKr: '대연디아이엘', location: '부산시 남구 대연동', price: 910000000, prevPrice: 900000000, changeRate: 1.11, volume24h: 54000 },
  { id: 'RMJJ', symbol: 'RMJJ', name: 'RaemianJangjeon', nameKr: '래미안장전', location: '부산시 금정구 장전동', price: 820000000, prevPrice: 810000000, changeRate: 1.23, volume24h: 21000 },
  { id: 'SIBT', symbol: 'SIBT', name: 'SamikBeach', nameKr: '삼익비치타운', location: '부산시 수영구 남천동', price: 1580000000, prevPrice: 1530000000, changeRate: 3.27, volume24h: 89000 },
  { id: 'TSCP', symbol: 'TSCP', name: 'TheSharpCentum', nameKr: '더샵센텀파크1차', location: '부산시 해운대구 재송동', price: 1100000000, prevPrice: 1120000000, changeRate: -1.79, volume24h: 41000 },

  // Incheon Coins
  { id: 'HL4', symbol: 'HL4', name: 'HillstateLake4', nameKr: '힐스테이트레이크송도4차', location: '인천시 연수구 송도동', price: 780000000, prevPrice: 760000000, changeRate: 2.63, volume24h: 56000 },
  { id: 'SCC', symbol: 'SCC', name: 'SongdoCentralCity', nameKr: '송도더샵센트럴시티', location: '인천시 연수구 송도동', price: 850000000, prevPrice: 850000000, changeRate: 0.00, volume24h: 67000 },
  { id: 'SMB', symbol: 'SMB', name: 'SongdoMarinaBay', nameKr: '더샵송도마리나베이', location: '인천시 연수구 송도동', price: 910000000, prevPrice: 920000000, changeRate: -1.09, volume24h: 43000 },
  { id: 'EPS', symbol: 'EPS', name: 'ePyeonhansesangSongdo', nameKr: 'e편한세상송도', location: '인천시 연수구 송도동', price: 680000000, prevPrice: 660000000, changeRate: 3.03, volume24h: 38000 },
  { id: 'EBG', symbol: 'EBG', name: 'ePyeonhansesangBupyeong', nameKr: 'e편한세상부평그랑힐스', location: '인천시 부평구 청천동', price: 580000000, prevPrice: 590000000, changeRate: -1.69, volume24h: 29000 },
  { id: 'GHL', symbol: 'GHL', name: 'GuwolHillstateLotte', nameKr: '구월힐스테이트,롯데캐슬골드1단지', location: '인천시 남동구 구월동', price: 490000000, prevPrice: 480000000, changeRate: 2.08, volume24h: 22000 },
  { id: 'SZS', symbol: 'SZS', name: 'SongdoXiTheStar', nameKr: '송도자이더스타', location: '인천시 연수구 송도동', price: 1020000000, prevPrice: 1000000000, changeRate: 2.00, volume24h: 75000 },
  { id: 'HST', symbol: 'HST', name: 'HillstateSongdoTerrace', nameKr: '힐스테이트송도더테라스', location: '인천시 연수구 송도동', price: 880000000, prevPrice: 890000000, changeRate: -1.12, volume24h: 51000 },
  { id: 'SSV', symbol: 'SSV', name: 'SongdoSKView', nameKr: '송도SK뷰', location: '인천시 연수구 송도동', price: 790000000, prevPrice: 800000000, changeRate: -1.25, volume24h: 46000 },
  { id: 'ISV', symbol: 'ISV', name: 'IncheonSKSkyView', nameKr: '인천SK스카이뷰', location: '인천시 미추홀구 용현동', price: 620000000, prevPrice: 610000000, changeRate: 1.64, volume24h: 33000 },

  // Daejeon Coins
  { id: 'DTSE', symbol: 'DTSE', name: 'DunsanTheSharpElif', nameKr: '둔산더샵엘리프', location: '대전시 서구 용문동', price: 820000000, prevPrice: 800000000, changeRate: 2.50, volume24h: 34000 },
  { id: 'CRV', symbol: 'CRV', name: 'Clover', nameKr: '크로바', location: '대전시 서구 둔산동', price: 1450000000, prevPrice: 1480000000, changeRate: -2.03, volume24h: 89000 },
  { id: 'DZI', symbol: 'DZI', name: 'DunsanXiIpark', nameKr: '둔산자이아이파크', location: '대전시 서구 탄방동', price: 980000000, prevPrice: 980000000, changeRate: 0.00, volume24h: 56000 },
  { id: 'DIC2', symbol: 'DIC2', name: 'DaejeonIparkCity2', nameKr: '대전아이파크시티2단지', location: '대전시 유성구 상대동', price: 1120000000, prevPrice: 1100000000, changeRate: 1.82, volume24h: 67000 },
  { id: 'TCLF', symbol: 'TCLF', name: 'TripleCityLakeFore', nameKr: '트리풀시티레이크포레', location: '대전시 서구 도안동', price: 780000000, prevPrice: 790000000, changeRate: -1.27, volume24h: 28000 },
  { id: 'EXP', symbol: 'EXP', name: 'Expo', nameKr: '엑스포', location: '대전시 유성구 전민동', price: 650000000, prevPrice: 620000000, changeRate: 4.84, volume24h: 12000 },
  { id: 'DEP', symbol: 'DEP', name: 'DomaePyeonhansesang', nameKr: '도마e편한세상포레나', location: '대전시 서구 도마동', price: 540000000, prevPrice: 550000000, changeRate: -1.82, volume24h: 15000 },
  { id: 'DUT', symbol: 'DUT', name: 'DoanWoomiLynn', nameKr: '도안우미린트리쉐이드', location: '대전시 유성구 용계동', price: 720000000, prevPrice: 710000000, changeRate: 1.41, volume24h: 22000 },
  { id: 'DRZP', symbol: 'DRZP', name: 'DoryongXiRapique', nameKr: '도룡자이라피크', location: '대전시 유성구 도룡동', price: 1050000000, prevPrice: 1080000000, changeRate: -2.78, volume24h: 41000 },
  { id: 'SSV2', symbol: 'SSV2', name: 'SinheungSKView', nameKr: '신흥SK뷰', location: '대전시 동구 신흥동', price: 480000000, prevPrice: 460000000, changeRate: 4.35, volume24h: 11000 },
];

export const ASSETS: Asset[] = [
  { symbol: '현금', balance: 1392135, avgPrice: 1, currPrice: 1, color: '#8DC63F' },
  { symbol: '헬리오시티', balance: 1, avgPrice: 5910868, currPrice: 5910868, color: '#0071B8' },
  { symbol: '청담르엘', balance: 1, avgPrice: 1163916, currPrice: 1163916, color: '#7D7D7D' },
  { symbol: '반포자이', balance: 1, avgPrice: 2944023, currPrice: 2944023, color: '#C76FBC' },
];

export const MOCK_ORDERBOOK: { asks: OrderBookItem[]; bids: OrderBookItem[] } = {
  asks: [
    { price: 2910, amount: 1767, changeRate: -0.82 },
    { price: 2909, amount: 23286, changeRate: -0.85 },
    { price: 2908, amount: 60245, changeRate: -0.89 },
    { price: 2907, amount: 37083, changeRate: -0.92 },
    { price: 2906, amount: 33161, changeRate: -0.95 },
    { price: 2905, amount: 92801, changeRate: -0.99 },
    { price: 2904, amount: 7777, changeRate: -1.02 },
  ],
  bids: [
    { price: 2903, amount: 9000, changeRate: -1.06 },
    { price: 2902, amount: 59575, changeRate: -1.09 },
    { price: 2901, amount: 97200, changeRate: -1.12 },
    { price: 2900, amount: 402234, changeRate: -1.16 },
    { price: 2899, amount: 40473, changeRate: -1.19 },
    { price: 2898, amount: 54856, changeRate: -1.23 },
    { price: 2897, amount: 48885, changeRate: -1.26 },
  ]
};

export const INDICES_DATA = [
  { name: 'Index1', data: [13300, 13250, 13100, 13150, 13204.88] },
  { name: 'Index2', data: [4020, 4010, 3990, 3980, 3985.97] }
];
