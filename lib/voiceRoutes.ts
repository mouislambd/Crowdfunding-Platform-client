export interface VoiceRoute {
  path: string;
  en: string[];
  bn: string[];
}

export const ROUTES: Record<string, VoiceRoute> = {
  home: {
    path: '/',
    en: ['home', 'homepage', 'main', 'landing'],
    bn: ['হোম', 'মূল পাতা', 'হোম পেজ'],
  },
  campaigns: {
    path: '/campaigns',
    en: ['campaigns', 'all campaigns', 'explore campaigns', 'browse projects'],
    bn: ['ক্যাম্পেইন', 'সব ক্যাম্পেইন', 'প্রজেক্ট দেখুন', 'সব প্রজেক্ট'],
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
  dashboardAddCampaign: {
    path: '/dashboard/add-campaign',
    en: ['add campaign', 'create campaign', 'new campaign', 'start campaign'],
    bn: ['নতুন ক্যাম্পেইন', 'ক্যাম্পেইন তৈরি', 'ক্যাম্পেইন যোগ করুন'],
  },
  dashboardAdminHome: {
    path: '/dashboard/admin-home',
    en: ['admin home', 'admin dashboard', 'admin overview'],
    bn: ['অ্যাডমিন হোম', 'অ্যাডমিন ড্যাশবোর্ড'],
  },
  dashboardBuilderHome: {
    path: '/dashboard/builder-home',
    en: ['builder home', 'creator dashboard', 'builder dashboard'],
    bn: ['নির্মাতা হোম', 'ক্রিয়েটর ড্যাশবোর্ড'],
  },
  dashboardCampaignApprovals: {
    path: '/dashboard/campaign-approvals',
    en: ['campaign approvals', 'approve campaigns', 'review campaigns', 'pending campaigns'],
    bn: ['ক্যাম্পেইন অনুমোদন', 'অনুমোদন', 'ক্যাম্পেইন রিভিউ'],
  },
  dashboardManageCampaigns: {
    path: '/dashboard/manage-campaigns',
    en: ['manage campaigns', 'edit campaigns', 'builder campaigns'],
    bn: ['ক্যাম্পেইন পরিচালনা', 'ম্যানেজ ক্যাম্পেইন'],
  },
  dashboardManageUsers: {
    path: '/dashboard/manage-users',
    en: ['manage users', 'show users', 'admin users', 'user management'],
    bn: ['ব্যবহারকারী পরিচালনা', 'ইউজার ম্যানেজমেন্ট', 'ইউজার লিস্ট'],
  },
  dashboardMyCampaigns: {
    path: '/dashboard/my-campaigns',
    en: ['my campaigns', 'created campaigns', 'builder projects'],
    bn: ['আমার ক্যাম্পেইন', 'আমার প্রজেক্ট'],
  },
  dashboardMyContributions: {
    path: '/dashboard/my-contributions',
    en: ['my contributions', 'backed campaigns', 'pledges', 'my donations'],
    bn: ['আমার অনুদান', 'আমার কন্ট্রিবিউশন', 'সাপোর্ট করা ক্যাম্পেইন'],
  },
  dashboardPaymentHistory: {
    path: '/dashboard/payment-history',
    en: ['payment history', 'transactions', 'payments', 'billing'],
    bn: ['পেমেন্ট হিস্ট্রি', 'লেনদেন', 'পেমেন্ট ইতিহাস'],
  },
  dashboardPurchaseCredit: {
    path: '/dashboard/purchase-credit',
    en: ['purchase credit', 'buy credits', 'add credits', 'credits'],
    bn: ['ক্রেডিট কিনুন', 'ক্রেডিট পার্চেস', 'ক্রেডিট'],
  },
  dashboardReports: {
    path: '/dashboard/reports',
    en: ['reports', 'campaign reports', 'reported campaigns', 'platform reports'],
    bn: ['রিপোর্ট', 'ক্যাম্পেইন রিপোর্ট', 'অভিযোগ'],
  },
  dashboardSupporterHome: {
    path: '/dashboard/supporter-home',
    en: ['supporter home', 'supporter dashboard', 'backer home'],
    bn: ['সাপোর্টার হোম', 'সাপোর্টার ড্যাশবোর্ড'],
  },
  dashboardWithdrawalRequests: {
    path: '/dashboard/withdrawal-requests',
    en: ['withdrawal requests', 'withdraw requests', 'pending withdrawals'],
    bn: ['উইথড্রয়াল রিকোয়েস্ট', 'টাকা তোলার আবেদন'],
  },
  dashboardWithdrawals: {
    path: '/dashboard/withdrawals',
    en: ['withdrawals', 'withdraw funds', 'request withdrawal'],
    bn: ['উইথড্রয়াল', 'টাকা তোলা'],
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
