export interface VoiceRoute {
  path: string;
  en: string[];
  bn: string[];
}

export const ROUTES: Record<string, VoiceRoute> = {
  home: {
    path: '/',
    en: ['home', 'homepage', 'main', 'landing', 'start'],
    bn: ['হোম', 'মূল পাতা', 'হোম পেজ'],
  },
  campaigns: {
    path: '/campaigns',
    en: ['campaigns', 'all campaigns', 'explore campaigns', 'browse projects', 'projects'],
    bn: ['ক্যাম্পেইন', 'সব ক্যাম্পেইন', 'প্রজেক্ট দেখুন', 'সব প্রজেক্ট', 'ক্যাম্পেইনগুলো'],
  },
  campaignDetail: {
    path: '/campaigns/:id',
    en: ['campaign detail', 'this campaign', 'project details'],
    bn: ['ক্যাম্পেইন ডিটেইলস', 'এই ক্যাম্পেইন'],
  },
  login: {
    path: '/login',
    en: ['login', 'signin', 'log in', 'sign in'],
    bn: ['লগইন', 'প্রবেশ', 'সাইন ইন'],
  },
  register: {
    path: '/register',
    en: ['register', 'signup', 'sign up', 'create account'],
    bn: ['রেজিস্ট্রেশন', 'সাইন আপ', 'অ্যাকাউন্ট তৈরি'],
  },
  profile: {
    path: '/profile',
    en: ['profile', 'my profile', 'account settings', 'user profile'],
    bn: ['প্রোফাইল', 'আমার প্রোফাইল', 'অ্যাকাউন্ট সেটিংস'],
  },
  dashboard: {
    path: '/dashboard',
    en: ['dashboard', 'my dashboard', 'overview', 'main dashboard'],
    bn: ['ড্যাশবোর্ড', 'আমার ড্যাশবোর্ড', 'ওভারভিউ'],
  },
  supporter_home: {
    path: '/dashboard/supporter-home',
    en: ['supporter home', 'supporter dashboard', 'backer home', 'supporter main'],
    bn: ['সাপোর্টার হোম', 'সাপোর্টার ড্যাশবোর্ড'],
  },
  builder_home: {
    path: '/dashboard/builder-home',
    en: ['builder home', 'creator dashboard', 'builder dashboard', 'creator home'],
    bn: ['নির্মাতা হোম', 'ক্রিয়েটর ড্যাশবোর্ড'],
  },
  admin_home: {
    path: '/dashboard/admin-home',
    en: ['admin home', 'admin dashboard', 'admin overview', 'admin main'],
    bn: ['অ্যাডমিন হোম', 'অ্যাডমিন ড্যাশবোর্ড', 'অ্যাডমিন ওভারভিউ'],
  },
  manage_users: {
    path: '/dashboard/manage-users',
    en: ['manage users', 'users', 'user management', 'show users', 'all users', 'admin users'],
    bn: ['ইউজার', 'ব্যবহারকারী', 'ব্যবহারকারী পরিচালনা', 'ইউজার ম্যানেজমেন্ট', 'ইউজার লিস্ট', 'সব ইউজার'],
  },
  manage_campaigns: {
    path: '/dashboard/manage-campaigns',
    en: ['manage campaigns', 'campaigns admin', 'approve campaigns', 'edit campaigns', 'builder campaigns'],
    bn: ['ক্যাম্পেইন পরিচালনা', 'ম্যানেজ ক্যাম্পেইন', 'ক্যাম্পেইন ম্যানেজমেন্ট', 'ক্যাম্পেইন সমূহ'],
  },
  campaign_approvals: {
    path: '/dashboard/campaign-approvals',
    en: ['campaign approvals', 'approve campaigns', 'review campaigns', 'pending campaigns'],
    bn: ['ক্যাম্পেইন অনুমোদন', 'অনুমোদন', 'ক্যাম্পেইন রিভিউ'],
  },
  withdrawal_requests: {
    path: '/dashboard/withdrawal-requests',
    en: ['withdrawal requests', 'withdraw requests', 'pending withdrawals', 'withdrawal approval'],
    bn: ['উইথড্রয়াল রিকোয়েস্ট', 'টাকা তোলার আবেদন', 'উইথড্র রিকোয়েস্ট'],
  },
  withdrawals: {
    path: '/dashboard/withdrawals',
    en: ['withdrawals', 'withdraw funds', 'request withdrawal', 'withdraw'],
    bn: ['উইথড্রয়াল', 'টাকা তোলা', 'উইথড্র'],
  },
  reports: {
    path: '/dashboard/reports',
    en: ['reports', 'campaign reports', 'reported campaigns', 'platform reports'],
    bn: ['রিপোর্ট', 'ক্যাম্পেইন রিপোর্ট', 'অভিযোগ', 'রিপোর্টস'],
  },
  add_campaign: {
    path: '/dashboard/add-campaign',
    en: ['add campaign', 'create campaign', 'new campaign', 'start campaign'],
    bn: ['নতুন ক্যাম্পেইন', 'ক্যাম্পেইন তৈরি', 'ক্যাম্পেইন যোগ করুন'],
  },
  my_campaigns: {
    path: '/dashboard/my-campaigns',
    en: ['my campaigns', 'created campaigns', 'builder projects'],
    bn: ['আমার ক্যাম্পেইন', 'আমার প্রজেক্ট'],
  },
  my_contributions: {
    path: '/dashboard/my-contributions',
    en: ['my contributions', 'backed campaigns', 'pledges', 'my donations'],
    bn: ['আমার অনুদান', 'আমার কন্ট্রিবিউশন', 'সাপোর্ট করা ক্যাম্পেইন'],
  },
  payment_history: {
    path: '/dashboard/payment-history',
    en: ['payment history', 'transactions', 'payments', 'billing'],
    bn: ['পেমেন্ট হিস্ট্রি', 'লেনদেন', 'পেমেন্ট ইতিহাস', 'পেমেন্ট'],
  },
  purchase_credit: {
    path: '/dashboard/purchase-credit',
    en: ['purchase credit', 'buy credits', 'add credits', 'credits'],
    bn: ['ক্রেডিট কিনুন', 'ক্রেডিট পার্চেস', 'ক্রেডিট'],
  },
};

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

export function matchRouteDeterministic(transcript: string): string | null {
  const text = (transcript || '').toLowerCase().trim();
  if (!text) return null;

  const navVerbs = ['go', 'open', 'show', 'take', 'view', 'navigate', 'visit', 'access', 'jao', 'dekhao', 'khulo', 'যাও', 'দেখাও', 'খোলো', 'নিয়ে যাও', 'প্রবেশ', 'দেখতে', 'খুলুন', 'যান'];
  const hasVerb = navVerbs.some(v => text.includes(v));

  const matches: string[] = [];
  for (const [key, route] of Object.entries(ROUTES)) {
    const allKeywords = [...route.en, ...route.bn];
    for (const kw of allKeywords) {
      const kwLower = kw.toLowerCase();
      if (text.includes(kwLower)) {
        if (hasVerb || text.length <= kwLower.length + 5 || text.split(/\s+/).length <= 4) {
          if (!matches.includes(key)) {
            matches.push(key);
          }
        }
      }
    }
  }

  if (matches.length === 1) {
    return matches[0];
  }
  return null;
}
