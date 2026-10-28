export interface VoiceRoute {
  path: string;
  label: string;
  labelBn: string;
  keywords: string[];
  en: string[];
  bn: string[];
}

export interface ScrollAction {
  type: 'scroll';
  direction: 'down' | 'up' | 'top' | 'bottom';
  label: string;
  labelBn: string;
  keywords: string[];
}

export type VoiceAction = 
  | (VoiceRoute & { type: 'navigate'; key: string })
  | ScrollAction;

const routesObj: Record<string, VoiceRoute> = {
  home: {
    path: '/',
    label: 'Home',
    labelBn: 'হোম পেজ',
    keywords: ['home', 'homepage', 'landing', 'landing page', 'main', 'start', 'হোম', 'মূল পাতা', 'হোম পেজ', 'ল্যান্ডিং পেজ', 'hom'],
    en: ['home', 'homepage', 'landing', 'landing page', 'main', 'start'],
    bn: ['হোম', 'মূল পাতা', 'হোম পেজ', 'ল্যান্ডিং পেজ'],
  },
  campaigns: {
    path: '/campaigns',
    label: 'Campaigns',
    labelBn: 'ক্যাম্পেইনসমূহ',
    keywords: ['campaigns', 'all campaigns', 'explore campaigns', 'browse projects', 'projects', 'campains', 'kampein', 'ক্যাম্পেইন', 'সব ক্যাম্পেইন', 'প্রজেক্ট দেখুন', 'সব প্রজেক্ট', 'ক্যাম্পেইনগুলো'],
    en: ['campaigns', 'all campaigns', 'explore campaigns', 'browse projects', 'projects'],
    bn: ['ক্যাম্পেইন', 'সব ক্যাম্পেইন', 'প্রজেক্ট দেখুন', 'সব প্রজেক্ট', 'ক্যাম্পেইনগুলো'],
  },
  campaignDetail: {
    path: '/campaigns/:id',
    label: 'Campaign Details',
    labelBn: 'ক্যাম্পেইন বিবরণী',
    keywords: ['campaign detail', 'this campaign', 'project details', 'ক্যাম্পেইন ডিটেইলস', 'এই ক্যাম্পেইন'],
    en: ['campaign detail', 'this campaign', 'project details'],
    bn: ['ক্যাম্পেইন ডিটেইলস', 'এই ক্যাম্পেইন'],
  },
  login: {
    path: '/login',
    label: 'Login',
    labelBn: 'লগইন',
    keywords: ['login', 'signin', 'log in', 'sign in', 'লগইন', 'প্রবেশ', 'সাইন ইন'],
    en: ['login', 'signin', 'log in', 'sign in'],
    bn: ['লগইন', 'প্রবেশ', 'সাইন ইন'],
  },
  register: {
    path: '/register',
    label: 'Register',
    labelBn: 'রেজিস্ট্রেশন',
    keywords: ['register', 'signup', 'sign up', 'create account', 'রেজিস্ট্রেশন', 'সাইন আপ', 'অ্যাকাউন্ট তৈরি'],
    en: ['register', 'signup', 'sign up', 'create account'],
    bn: ['রেজিস্ট্রেশন', 'সাইন আপ', 'অ্যাকাউন্ট তৈরি'],
  },
  profile: {
    path: '/profile',
    label: 'Profile',
    labelBn: 'প্রোফাইল',
    keywords: ['profile', 'my profile', 'account settings', 'user profile', 'প্রোফাইল', 'আমার প্রোফাইল', 'অ্যাকাউন্ট সেটিংস'],
    en: ['profile', 'my profile', 'account settings', 'user profile'],
    bn: ['প্রোফাইল', 'আমার প্রোফাইল', 'অ্যাকাউন্ট সেটিংস'],
  },
  dashboard: {
    path: '/dashboard',
    label: 'Dashboard',
    labelBn: 'ড্যাশবোর্ড',
    keywords: ['dashboard', 'my dashboard', 'overview', 'main dashboard', 'dashbord', 'dashoard', 'dasbord', 'ড্যাশবোর্ড', 'আমার ড্যাশবোর্ড', 'ওভারভিউ'],
    en: ['dashboard', 'my dashboard', 'overview', 'main dashboard'],
    bn: ['ড্যাশবোর্ড', 'আমার ড্যাশবোর্ড', 'ওভারভিউ'],
  },
  supporter_home: {
    path: '/dashboard/supporter-home',
    label: 'Supporter Home',
    labelBn: 'সাপোর্টার হোম',
    keywords: ['supporter home', 'supporter dashboard', 'backer home', 'সাপোর্টার হোম', 'সাপোর্টার ড্যাশবোর্ড'],
    en: ['supporter home', 'supporter dashboard', 'backer home'],
    bn: ['সাপোর্টার হোম', 'সাপোর্টার ড্যাশবোর্ড'],
  },
  builder_home: {
    path: '/dashboard/builder-home',
    label: 'Builder Home',
    labelBn: 'নির্মাতা হোম',
    keywords: ['builder home', 'creator dashboard', 'builder dashboard', 'creator home', 'নির্মাতা হোম', 'ক্রিয়েটর ড্যাশবোর্ড'],
    en: ['builder home', 'creator dashboard', 'builder dashboard', 'creator home'],
    bn: ['নির্মাতা হোম', 'ক্রিয়েটর ড্যাশবোর্ড'],
  },
  admin_home: {
    path: '/dashboard/admin-home',
    label: 'Admin Home',
    labelBn: 'অ্যাডমিন হোম',
    keywords: ['admin home', 'admin dashboard', 'admin overview', 'অ্যাডমিন হোম', 'অ্যাডমিন ড্যাশবোর্ড'],
    en: ['admin home', 'admin dashboard', 'admin overview'],
    bn: ['অ্যাডমিন হোম', 'অ্যাডমিন ড্যাশবোর্ড'],
  },
  manage_users: {
    path: '/dashboard/manage-users',
    label: 'Manage Users',
    labelBn: 'ইউজার ম্যানেজমেন্ট',
    keywords: ['manage users', 'manage user', 'users', 'all users', 'user management', 'show users', 'admin users', 'mange users', 'mange user', 'usres', 'usrs', 'user list', 'ইউজার', 'ব্যবহারকারী', 'ব্যবহারকারী পরিচালনা', 'ইউজার ম্যানেজমেন্ট', 'ইউজার লিস্ট', 'সব ইউজার'],
    en: ['manage users', 'manage user', 'users', 'all users', 'user management', 'show users', 'admin users'],
    bn: ['ইউজার', 'ব্যবহারকারী', 'ব্যবহারকারী পরিচালনা', 'ইউজার ম্যানেজমেন্ট', 'ইউজার লিস্ট', 'সব ইউজার'],
  },
  manage_campaigns: {
    path: '/dashboard/manage-campaigns',
    label: 'Manage Campaigns',
    labelBn: 'ক্যাম্পেইন পরিচালনা',
    keywords: ['manage campaigns', 'campaign approval', 'campaigns admin', 'approve campaigns', 'edit campaigns', 'builder campaigns', 'mange campaigns', 'ক্যাম্পেইন পরিচালনা', 'ম্যানেজ ক্যাম্পেইন', 'ক্যাম্পেইন ম্যানেজমেন্ট', 'ক্যাম্পেইন সমূহ', 'ক্যাম্পেইন ম্যানেজ'],
    en: ['manage campaigns', 'campaign approval', 'campaigns admin', 'approve campaigns', 'edit campaigns', 'builder campaigns'],
    bn: ['ক্যাম্পেইন পরিচালনা', 'ম্যানেজ ক্যাম্পেইন', 'ক্যাম্পেইন ম্যানেজমেন্ট', 'ক্যাম্পেইন সমূহ', 'ক্যাম্পেইন ম্যানেজ'],
  },
  campaign_approvals: {
    path: '/dashboard/campaign-approvals',
    label: 'Campaign Approvals',
    labelBn: 'ক্যাম্পেইন অনুমোদন',
    keywords: ['campaign approvals', 'approve campaigns', 'review campaigns', 'pending campaigns', 'ক্যাম্পেইন অনুমোদন', 'অনুমোদন', 'ক্যাম্পেইন রিভিউ'],
    en: ['campaign approvals', 'approve campaigns', 'review campaigns', 'pending campaigns'],
    bn: ['ক্যাম্পেইন অনুমোদন', 'অনুমোদন', 'ক্যাম্পেইন রিভিউ'],
  },
  withdrawal_requests: {
    path: '/dashboard/withdrawal-requests',
    label: 'Withdrawal Requests',
    labelBn: 'উইথড্রয়াল রিকোয়েস্ট',
    keywords: ['withdrawal requests', 'withdraw requests', 'pending withdrawals', 'withdrawal approval', 'withdrwal requests', 'উইথড্রয়াল রিকোয়েস্ট', 'টাকা তোলার আবেদন', 'উইথড্র রিকোয়েস্ট'],
    en: ['withdrawal requests', 'withdraw requests', 'pending withdrawals', 'withdrawal approval'],
    bn: ['উইথড্রয়াল রিকোয়েস্ট', 'টাকা তোলার আবেদন', 'উইথড্র রিকোয়েস্ট'],
  },
  withdrawals: {
    path: '/dashboard/withdrawals',
    label: 'Withdrawals',
    labelBn: 'উইথড্রয়াল',
    keywords: ['withdrawal requests', 'withdrawals', 'withdraw funds', 'request withdrawal', 'withdraw', 'withdrawal', 'withdrwal', 'উইথড্রয়াল', 'টাকা তোলা', 'উইথড্র'],
    en: ['withdrawal requests', 'withdrawals', 'withdraw funds', 'request withdrawal', 'withdraw', 'withdrawal'],
    bn: ['উইথড্রয়াল', 'টাকা তোলা', 'উইথড্র'],
  },
  reports: {
    path: '/dashboard/reports',
    label: 'Reports',
    labelBn: 'রিপোর্টসমূহ',
    keywords: ['reports', 'report', 'campaign reports', 'reported campaigns', 'platform reports', 'riport', 'রিপোর্ট', 'ক্যাম্পেইন রিপোর্ট', 'অভিযোগ', 'রিপোর্টস'],
    en: ['reports', 'report', 'campaign reports', 'reported campaigns', 'platform reports'],
    bn: ['রিপোর্ট', 'ক্যাম্পেইন রিপোর্ট', 'অভিযোগ', 'রিপোর্টস'],
  },
  add_campaign: {
    path: '/dashboard/add-campaign',
    label: 'Add Campaign',
    labelBn: 'নতুন ক্যাম্পেইন',
    keywords: ['add campaign', 'create campaign', 'new campaign', 'start campaign', 'নতুন ক্যাম্পেইন', 'ক্যাম্পেইন তৈরি', 'ক্যাম্পেইন যোগ করুন'],
    en: ['add campaign', 'create campaign', 'new campaign', 'start campaign'],
    bn: ['নতুন ক্যাম্পেইন', 'ক্যাম্পেইন তৈরি', 'ক্যাম্পেইন যোগ করুন'],
  },
  my_campaigns: {
    path: '/dashboard/my-campaigns',
    label: 'My Campaigns',
    labelBn: 'আমার ক্যাম্পেইন',
    keywords: ['my campaigns', 'created campaigns', 'builder projects', 'আমার ক্যাম্পেইন', 'আমার প্রজেক্ট'],
    en: ['my campaigns', 'created campaigns', 'builder projects'],
    bn: ['আমার ক্যাম্পেইন', 'আমার প্রজেক্ট'],
  },
  my_contributions: {
    path: '/dashboard/my-contributions',
    label: 'My Contributions',
    labelBn: 'আমার অনুদান',
    keywords: ['my contributions', 'backed campaigns', 'pledges', 'my donations', 'আমার অনুদান', 'আমার কন্ট্রিবিউশন', 'সাপোর্ট করা ক্যাম্পেইন'],
    en: ['my contributions', 'backed campaigns', 'pledges', 'my donations'],
    bn: ['আমার অনুদান', 'আমার কন্ট্রিবিউশন', 'সাপোর্ট করা ক্যাম্পেইন'],
  },
  payment_history: {
    path: '/dashboard/payment-history',
    label: 'Payment History',
    labelBn: 'পেমেন্ট হিস্ট্রি',
    keywords: ['payment history', 'transactions', 'payments', 'billing', 'পেমেন্ট হিস্ট্রি', 'লেনদেন', 'পেমেন্ট ইতিহাস', 'পেমেন্ট'],
    en: ['payment history', 'transactions', 'payments', 'billing'],
    bn: ['পেমেন্ট হিস্ট্রি', 'লেনদেন', 'পেমেন্ট ইতিহাস', 'পেমেন্ট'],
  },
  purchase_credit: {
    path: '/dashboard/purchase-credit',
    label: 'Purchase Credit',
    labelBn: 'ক্রেডিট কিনুন',
    keywords: ['purchase credit', 'buy credits', 'add credits', 'credits', 'ক্রেডিট কিনুন', 'ক্রেডিট পার্চেস', 'ক্রেডিট'],
    en: ['purchase credit', 'buy credits', 'add credits', 'credits'],
    bn: ['ক্রেডিট কিনুন', 'ক্রেডিট পার্চেস', 'ক্রেডিট'],
  },
};

export const SCROLL_ACTIONS: ScrollAction[] = [
  {
    type: 'scroll',
    direction: 'down',
    label: 'Scrolling down',
    labelBn: 'নিচে স্ক্রল করা হচ্ছে',
    keywords: ['scroll down', 'down', 'scroll', 'scrol', 'scrool', 'sroll', 'srol', 'scroll it', 'scrol it', 'sroll it', 'scrool it', 'srool it', 'collage', 'college', 'colle', 'kole', 'page down', 'নিচে স্ক্রল', 'স্ক্রল ডাউন', 'নিচে যাও', 'niche jao', 'aro niche', 'niche', 'nich', 'downwards', 'scroll down please', 'niche namo', 'niche giye', 'aro niche jaw'],
  },
  {
    type: 'scroll',
    direction: 'up',
    label: 'Scrolling up',
    labelBn: 'উপরে স্ক্রল করা হচ্ছে',
    keywords: ['scroll up', 'up', 'scroll up please', 'page up', 'উপরে স্ক্রল', 'স্ক্রল আপ', 'উপরে যাও', 'upore jao', 'aro upore', 'upore', 'upor', 'upur', 'upwards', 'ekto upore', 'upore namo'],
  },
  {
    type: 'scroll',
    direction: 'top',
    label: 'Scrolling to top',
    labelBn: 'পৃষ্ঠার উপরে যাচ্ছি',
    keywords: ['scroll to top', 'go to top', 'top of page', 'শুরুতে যাও', 'উপরে চলো', 'top', 'shobar upore', 'ekdom upore', 'prothome jao'],
  },
  {
    type: 'scroll',
    direction: 'bottom',
    label: 'Scrolling to bottom',
    labelBn: 'পৃষ্ঠার নিচে যাচ্ছি',
    keywords: ['scroll to bottom', 'go to bottom', 'bottom of page', 'শেষে যাও', 'নিচে চলো', 'bottom', 'shobar niche', 'ekdom niche', 'shese jao', 'footer'],
  },
];

const routeArray = Object.values(routesObj);
export const ROUTES: Array<VoiceRoute> & Record<string, VoiceRoute> = Object.assign(routeArray, routesObj) as any;

export function resolveRoutePath(target: string, campaignId?: string, query?: Record<string, string>): string | null {
  const route = ROUTES[target];
  if (!route) return null;

  let path = route.path;
  if (path.includes(':id')) {
    if (!campaignId) return null;
    path = path.replace(':id', campaignId);
  }

  if (query && typeof query === 'object' && Object.keys(query).length > 0) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v) params.append(k, String(v));
    }
    const queryString = params.toString();
    if (queryString) {
      path += `?${queryString}`;
    }
  }

  return path;
}

export function matchRoute(text: string): VoiceAction | null {
  const rawText = (text || '').toLowerCase().trim();
  if (!rawText) return null;

  const normalizedText = rawText
    .replace(/scrol[l]*/g, 'scroll')
    .replace(/srol[l]*/g, 'scroll')
    .replace(/collat?ge/g, 'scroll')
    .replace(/colle?ge/g, 'scroll')
    .replace(/kole/g, 'scroll')
    .replace(/dash[b]*ord/g, 'dashboard')
    .replace(/manag[e]*/g, 'manage')
    .replace(/user[s]*/g, 'users')
    .replace(/camp[a]*ign[s]*/g, 'campaigns')
    .replace(/report[s]*/g, 'reports');

  // Strip common conversational filler words to extract core intent
  const fillerWords = new Set(['go', 'to', 'the', 'a', 'an', 'please', 'take', 'me', 'open', 'show', 'navigate', 'page', 'site', 'view', 'see', 'kindly', 'can', 'you', 'i', 'want', 'to', 'let', 's', 'karo', 'jaw', 'jao', 'dekhao', 'khulo', 'amake', 'niye', 'cholo', 'ay', 'ai', 'ektu', 'dike']);
  const tokens = normalizedText.split(/\s+/);
  const coreIntentTokens = tokens.filter(t => !fillerWords.has(t));
  const coreIntentText = coreIntentTokens.join(' ');

  let bestAction: VoiceAction | null = null;
  let bestScore = 0;

  const evaluateKeywords = (keywords: string[], action: VoiceAction) => {
    for (const kw of keywords) {
      if (!kw) continue;
      const kwLower = kw.toLowerCase();
      let score = 0;

      if (rawText.includes(kwLower) || normalizedText.includes(kwLower) || coreIntentText.includes(kwLower)) {
        score = kwLower.length * 3;
      } else {
        const kwTokens = kwLower.split(/\s+/);
        const textTokens = coreIntentTokens.length > 0 ? coreIntentTokens : normalizedText.split(/\s+/);
        let matchedTokens = 0;
        for (const kt of kwTokens) {
          if (textTokens.some(tt => tt.includes(kt) || kt.includes(tt) || (tt.length > 2 && kt.length > 2 && Math.abs(tt.length - kt.length) <= 2 && (tt.startsWith(kt.slice(0, 2)) || kt.startsWith(tt.slice(0, 2)))))) {
            matchedTokens++;
          }
        }
        if (matchedTokens > 0) {
          score = matchedTokens * 5 + kwLower.length;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestAction = action;
      }
    }
  };

  // Check ROUTES
  for (const [key, route] of Object.entries(ROUTES)) {
    if (typeof key !== 'string' || !isNaN(Number(key))) continue;
    if (!route || typeof route !== 'object' || !route.keywords) continue;

    const campaignMatch = typeof window !== 'undefined' ? window.location.pathname.match(/^\/campaigns\/([^/]+)$/) : null;
    const campaignId = campaignMatch ? campaignMatch[1] : undefined;
    const resolvedPath = resolveRoutePath(key, campaignId);
    if (!resolvedPath) continue;

    const navAction: VoiceAction = {
      ...route,
      type: 'navigate',
      path: resolvedPath,
      key,
    };

    evaluateKeywords(route.keywords, navAction);
  }

  // Check SCROLL_ACTIONS
  for (const scrollAct of SCROLL_ACTIONS) {
    evaluateKeywords(scrollAct.keywords, scrollAct);
  }

  return bestAction;
}

export function matchRouteDeterministic(transcript: string): string | null {
  const matched = matchRoute(transcript);
  return matched && matched.type === 'navigate' ? matched.key : null;
}
