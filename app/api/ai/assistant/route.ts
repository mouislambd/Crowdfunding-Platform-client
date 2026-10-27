import { NextResponse } from 'next/server';
import { ROUTES, matchRouteDeterministic } from '@/lib/voiceRoutes';

export async function POST(request: Request) {
  try {
    const { transcript, lang, campaignId, page } = await request.json();
    const language = lang === 'bn' ? 'bn' : 'en';

    console.log('AI Assistant request received. Route keys count:', Object.keys(ROUTES).length, 'Current page:', page, 'Transcript:', transcript);

    let matchedTarget: string | null = null;
    let matchedQuery: Record<string, string> | undefined = undefined;
    let scrollDirection: 'down' | 'up' | 'top' | 'bottom' | null = null;
    let replyText = language === 'bn' ? 'আপনি কোন পেজে যেতে চান বা কি করতে চান? অনুগ্রহ করে স্পষ্ট করে বলুন।' : 'Which page would you like to visit or what would you like to do? Please specify.';

    // 1. Check deterministic client-side/deterministic fallback first
    const deterministicKey = matchRouteDeterministic(transcript);
    if (deterministicKey && ROUTES[deterministicKey]) {
      matchedTarget = deterministicKey;
    } else {
      // Check for scroll intent in transcript
      const lower = (transcript || '').toLowerCase();
      if (lower.includes('down') || lower.includes('নিচে') || lower.includes('niche') || lower.includes('aro niche')) {
        scrollDirection = 'down';
      } else if (lower.includes('up') || lower.includes('উপরে') || lower.includes('upore') || lower.includes('aro upore')) {
        scrollDirection = 'up';
      } else if (lower.includes('top') || lower.includes('শুরু') || lower.includes('ekdom upore')) {
        scrollDirection = 'top';
      } else if (lower.includes('bottom') || lower.includes('footer') || lower.includes('শেষ') || lower.includes('ekdom niche')) {
        scrollDirection = 'bottom';
      }
    }

    // Special category query handling for campaigns if not yet matched
    if (!matchedTarget && !scrollDirection) {
      const text = (transcript || '').toLowerCase();
      if ((text.includes('tech') || text.includes('technology') || text.includes('টেক')) && (text.includes('campaign') || text.includes('ক্যাম্পেইন'))) {
        matchedTarget = 'campaigns';
        matchedQuery = { category: 'Technology' };
      }
    }

    // 2. If no deterministic match, try OpenAI API with full ROUTES list, scroll support, and universal multilingual intent handling
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && !matchedTarget && !scrollDirection) {
      try {
        const routesSummary = Object.entries(ROUTES)
          .map(([k, r]) => `Key: "${k}", Path: "${r.path}", EN: [${r.en.join(', ')}], BN: [${r.bn.join(', ')}]`)
          .join('\n');

        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: `You are an expert, empathetic, multilingual AI voice assistant for a crowdfunding platform. Current user page: "${page}".
Available routes (single source of truth):
${routesSummary}

You must understand ALL types of users: educated, uneducated, technical, non-technical, speaking English, Bangla, or Banglish (transliterated Bangla), with spelling mistakes, slang, shorthand, or colloquial requests (e.g. "footer dekhao", "show me footer", "taka tulbo", "credit kinbo", "amar profile", "shobar niche jao", "campaigns gulo dekhao", "dashboard e nao", etc.).

Return JSON with format: 
{
  "reply": string, 
  "action": {"type":"navigate", "target": "<route key>", "query": {optional record}} | {"type":"scroll", "direction": "down" | "up" | "top" | "bottom"} | null
}.

Rules:
1. Map any navigation intent (home, campaigns, dashboard, profile, manage users, withdrawals, reports, credits, etc.) to the correct route key immediately.
2. Map any scrolling/page movement intent (scroll down, scroll up, go to footer, go to top, নিচে যাও, উপরে যাও, নিচে স্ক্রল, footer dekhao) to scroll action type.
3. Never ask for confirmation when the user asks to go/open/show/scroll something.
4. If nothing matches, set action to null and reply helpfully in the requested language (${language}).`
              },
              { role: 'user', content: `Language: ${language}. Transcript: "${transcript}". Current page: "${page}".` }
            ],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const content = aiData.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            if (parsed && typeof parsed.reply === 'string') {
              replyText = parsed.reply;
              if (parsed.action && parsed.action.type === 'navigate' && parsed.action.target && ROUTES[parsed.action.target]) {
                matchedTarget = parsed.action.target;
                matchedQuery = parsed.action.query || undefined;
              } else if (parsed.action && parsed.action.type === 'scroll' && parsed.action.direction) {
                scrollDirection = parsed.action.direction;
              } else if (parsed.action === null) {
                matchedTarget = null;
                scrollDirection = null;
              }
            }
          }
        }
      } catch (e) {
        // Fallback or maintain replyText
      }
    }

    if (matchedTarget) {
      if (language === 'bn') {
        replyText = `আপনাকে অনুরোধ করা পেজে নিয়ে যাচ্ছি।`;
      } else {
        replyText = `Taking you there now.`;
      }
    } else if (scrollDirection) {
      if (language === 'bn') {
        replyText = `স্ক্রল করা হচ্ছে।`;
      } else {
        replyText = `Scrolling now.`;
      }
    }

    // Validate target against ROUTES (never trust raw URLs)
    let action: any = null;
    if (matchedTarget && ROUTES[matchedTarget]) {
      if (ROUTES[matchedTarget].path.includes(':id') && !campaignId) {
        action = null;
        replyText = language === 'bn' ? 'দয়া করে কোনো নির্দিষ্ট ক্যাম্পেইন পেজে থাকুন অথবা ক্যাম্পেইন নির্বাচন করুন।' : 'Please specify or navigate from a campaign page.';
      } else {
        action = {
          type: 'navigate',
          target: matchedTarget,
          ...(matchedQuery ? { query: matchedQuery } : {}),
        };
      }
    } else if (scrollDirection) {
      action = {
        type: 'scroll',
        direction: scrollDirection,
      };
    }

    return NextResponse.json({
      reply: replyText,
      action,
    });
  } catch (err: any) {
    return NextResponse.json(
      { reply: 'I encountered an error processing your request.', action: null },
      { status: 500 }
    );
  }
}
