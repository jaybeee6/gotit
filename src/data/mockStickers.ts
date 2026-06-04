export interface Sticker {
  id: number;
  number: string;
  name: string;
  category: string;
  owned: boolean;
  quantity: number;
}

export const CATEGORY_META: Record<
  string,
  { name: string; emoji: string; bg: string; text: string; light: string }
> = {
  FWC: { name: 'FIFA World Cup',  emoji: '🏆',  bg: 'bg-yellow-400',  text: 'text-yellow-900', light: 'bg-yellow-50' },
  MEX: { name: 'Mexico',          emoji: '🇲🇽', bg: 'bg-green-600',   text: 'text-white',      light: 'bg-green-50'  },
  RSA: { name: 'South Africa',    emoji: '🇿🇦', bg: 'bg-green-700',   text: 'text-white',      light: 'bg-green-50'  },
  KOR: { name: 'South Korea',     emoji: '🇰🇷', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  CZE: { name: 'Czech Republic',  emoji: '🇨🇿', bg: 'bg-blue-700',    text: 'text-white',      light: 'bg-blue-50'   },
  CAN: { name: 'Canada',          emoji: '🇨🇦', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  BIH: { name: 'Bosnia & Herz.',  emoji: '🇧🇦', bg: 'bg-blue-800',    text: 'text-white',      light: 'bg-blue-50'   },
  QAT: { name: 'Qatar',           emoji: '🇶🇦', bg: 'bg-rose-800',    text: 'text-white',      light: 'bg-rose-50'   },
  SUI: { name: 'Switzerland',     emoji: '🇨🇭', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  BRA: { name: 'Brazil',          emoji: '🇧🇷', bg: 'bg-green-500',   text: 'text-white',      light: 'bg-green-50'  },
  MAR: { name: 'Morocco',         emoji: '🇲🇦', bg: 'bg-red-700',     text: 'text-white',      light: 'bg-red-50'    },
  HAI: { name: 'Haiti',           emoji: '🇭🇹', bg: 'bg-blue-700',    text: 'text-white',      light: 'bg-blue-50'   },
  SCO: { name: 'Scotland',        emoji: '🏴', bg: 'bg-blue-800',    text: 'text-white',      light: 'bg-blue-50'   },
  USA: { name: 'United States',   emoji: '🇺🇸', bg: 'bg-blue-700',    text: 'text-white',      light: 'bg-blue-50'   },
  PAR: { name: 'Paraguay',        emoji: '🇵🇾', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  AUS: { name: 'Australia',       emoji: '🇦🇺', bg: 'bg-yellow-500',  text: 'text-yellow-900', light: 'bg-yellow-50' },
  TUR: { name: 'Turkey',          emoji: '🇹🇷', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  GER: { name: 'Germany',         emoji: '🇩🇪', bg: 'bg-zinc-800',    text: 'text-white',      light: 'bg-zinc-50'   },
  CUW: { name: 'Curaçao',         emoji: '🇨🇼', bg: 'bg-blue-600',    text: 'text-white',      light: 'bg-blue-50'   },
  CIV: { name: "Côte d'Ivoire",   emoji: '🇨🇮', bg: 'bg-orange-500',  text: 'text-white',      light: 'bg-orange-50' },
  ECU: { name: 'Ecuador',         emoji: '🇪🇨', bg: 'bg-yellow-500',  text: 'text-yellow-900', light: 'bg-yellow-50' },
  NED: { name: 'Netherlands',     emoji: '🇳🇱', bg: 'bg-orange-500',  text: 'text-white',      light: 'bg-orange-50' },
  JPN: { name: 'Japan',           emoji: '🇯🇵', bg: 'bg-red-500',     text: 'text-white',      light: 'bg-red-50'    },
  SWE: { name: 'Sweden',          emoji: '🇸🇪', bg: 'bg-blue-600',    text: 'text-white',      light: 'bg-blue-50'   },
  TUN: { name: 'Tunisia',         emoji: '🇹🇳', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  BEL: { name: 'Belgium',         emoji: '🇧🇪', bg: 'bg-yellow-400',  text: 'text-yellow-900', light: 'bg-yellow-50' },
  EGY: { name: 'Egypt',           emoji: '🇪🇬', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  IRN: { name: 'Iran',            emoji: '🇮🇷', bg: 'bg-green-700',   text: 'text-white',      light: 'bg-green-50'  },
  NZL: { name: 'New Zealand',     emoji: '🇳🇿', bg: 'bg-blue-800',    text: 'text-white',      light: 'bg-blue-50'   },
  ESP: { name: 'Spain',           emoji: '🇪🇸', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  CPV: { name: 'Cape Verde',      emoji: '🇨🇻', bg: 'bg-blue-700',    text: 'text-white',      light: 'bg-blue-50'   },
  KSA: { name: 'Saudi Arabia',    emoji: '🇸🇦', bg: 'bg-green-700',   text: 'text-white',      light: 'bg-green-50'  },
  URU: { name: 'Uruguay',         emoji: '🇺🇾', bg: 'bg-sky-500',     text: 'text-white',      light: 'bg-sky-50'    },
  FRA: { name: 'France',          emoji: '🇫🇷', bg: 'bg-blue-700',    text: 'text-white',      light: 'bg-blue-50'   },
  SEN: { name: 'Senegal',         emoji: '🇸🇳', bg: 'bg-green-600',   text: 'text-white',      light: 'bg-green-50'  },
  IRQ: { name: 'Iraq',            emoji: '🇮🇶', bg: 'bg-red-700',     text: 'text-white',      light: 'bg-red-50'    },
  NOR: { name: 'Norway',          emoji: '🇳🇴', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  ARG: { name: 'Argentina',       emoji: '🇦🇷', bg: 'bg-sky-400',     text: 'text-sky-900',    light: 'bg-sky-50'    },
  ALG: { name: 'Algeria',         emoji: '🇩🇿', bg: 'bg-green-600',   text: 'text-white',      light: 'bg-green-50'  },
  AUT: { name: 'Austria',         emoji: '🇦🇹', bg: 'bg-red-700',     text: 'text-white',      light: 'bg-red-50'    },
  JOR: { name: 'Jordan',          emoji: '🇯🇴', bg: 'bg-red-700',     text: 'text-white',      light: 'bg-red-50'    },
  POR: { name: 'Portugal',        emoji: '🇵🇹', bg: 'bg-red-700',     text: 'text-white',      light: 'bg-red-50'    },
  COD: { name: 'DR Congo',        emoji: '🇨🇩', bg: 'bg-blue-700',    text: 'text-white',      light: 'bg-blue-50'   },
  UZB: { name: 'Uzbekistan',      emoji: '🇺🇿', bg: 'bg-sky-500',     text: 'text-white',      light: 'bg-sky-50'    },
  COL: { name: 'Colombia',        emoji: '🇨🇴', bg: 'bg-yellow-500',  text: 'text-yellow-900', light: 'bg-yellow-50' },
  ENG: { name: 'England',         emoji: '🏴', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  CRO: { name: 'Croatia',         emoji: '🇭🇷', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  GHA: { name: 'Ghana',           emoji: '🇬🇭', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
  PAN: { name: 'Panama',          emoji: '🇵🇦', bg: 'bg-red-600',     text: 'text-white',      light: 'bg-red-50'    },
};

export const CATEGORIES = Object.keys(CATEGORY_META);

// -------------------------------------------------------------------
// Sticker list — one entry per code from the official album checklist
// -------------------------------------------------------------------
const teamDefs: Array<{ code: string; count: number }> = [
  { code: 'FWC', count: 19 },
  { code: 'MEX', count: 20 },
  { code: 'RSA', count: 20 },
  { code: 'KOR', count: 20 },
  { code: 'CZE', count: 20 },
  { code: 'CAN', count: 20 },
  { code: 'BIH', count: 20 },
  { code: 'QAT', count: 20 },
  { code: 'SUI', count: 20 },
  { code: 'BRA', count: 20 },
  { code: 'MAR', count: 20 },
  { code: 'HAI', count: 20 },
  { code: 'SCO', count: 20 },
  { code: 'USA', count: 20 },
  { code: 'PAR', count: 20 },
  { code: 'AUS', count: 20 },
  { code: 'TUR', count: 20 },
  { code: 'GER', count: 20 },
  { code: 'CUW', count: 20 },
  { code: 'CIV', count: 20 },
  { code: 'ECU', count: 20 },
  { code: 'NED', count: 20 },
  { code: 'JPN', count: 20 },
  { code: 'SWE', count: 20 },
  { code: 'TUN', count: 20 },
  { code: 'BEL', count: 20 },
  { code: 'EGY', count: 20 },
  { code: 'IRN', count: 20 },
  { code: 'NZL', count: 20 },
  { code: 'ESP', count: 20 },
  { code: 'CPV', count: 20 },
  { code: 'KSA', count: 20 },
  { code: 'URU', count: 20 },
  { code: 'FRA', count: 20 },
  { code: 'SEN', count: 20 },
  { code: 'IRQ', count: 20 },
  { code: 'NOR', count: 20 },
  { code: 'ARG', count: 20 },
  { code: 'ALG', count: 20 },
  { code: 'AUT', count: 20 },
  { code: 'JOR', count: 20 },
  { code: 'POR', count: 20 },
  { code: 'COD', count: 20 },
  { code: 'UZB', count: 20 },
  { code: 'COL', count: 20 },
  { code: 'ENG', count: 20 },
  { code: 'CRO', count: 20 },
  { code: 'GHA', count: 20 },
  { code: 'PAN', count: 20 },
];

let _id = 2;
export const mockStickers: Sticker[] = [
  // Sticker 0 — special album cover sticker
  { id: 1, number: '0', name: '', category: 'FWC', owned: false, quantity: 0 },
  ...teamDefs.flatMap(({ code, count }) =>
    Array.from({ length: count }, (_, i) => ({
      id: _id++,
      number: `${code}${i + 1}`,
      name: '',
      category: code,
      owned: false,
      quantity: 0,
    }))
  ),
];
