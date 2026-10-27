import { NextResponse } from 'next/server';
import { ROUTES } from '@/lib/voiceRoutes';

export async function POST(request: Request) {
  try {
    const { transcript, lang, campaignId, page } = await request.json();
    const text = (transcript || '').toLowerCase().trim();
    const language = lang === 'bn' ? 'bn' : 'en';

    let matchedTarget: string | null = null;
    let matchedQuery: Record<string, string> | undefined = undefined;
    let replyText = language === 'bn' ? 'আপনি কোন পেজে যেতে চান? অনুগ্রহ করে স্পষ্ট করে বলুন।' : 'Which page would you like to open? Please specify.';

    // Check intent matching against ROUTES (English and Bengali keywords)
    for (const [key, route] of Object.entries(ROUTES)) {
      const allKeywords = [...route.en, ...route.bn];
      for (const kw of allKeywords) {
        if (text.includes(kw.toLowerCase())) {
          matchedTarget = key;
          break;
        }
      }
      if (matchedTarget) break;
    }

    // Special category query handling for campaigns
    if (text.includes('tech') || text.includes('technology') || text.includes('টেক')) {
      matchedTarget = 'campaigns';
      matchedQuery = { category: 'Technology' };
    }

    // Set appropriate conversational reply based on match
    if (matchedTarget) {
      if (language === 'bn') {
        replyText = `আপনাকে অনুরোধ করা পেজে নিয়ে যাচ্ছি।`;
      } else {
        replyText = `Taking you there now.`;
      }
    }

    // Try OpenAI API if OPENAI_API_KEY is available for advanced intent matching
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
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
                content: `You are an AI voice assistant for a crowdfunding platform. Available routes:
${routesSummary}

Return JSON with format: {"reply": string, "action": {"type":"navigate","target": "<route key>", "query": {optional record}} | null}.
Phrases like "manage users", "show users", "go to X", "open X", "take me to X", "process", "ড্যাশবোর্ড", "ইউজার ম্যানেজমেন্ট" must map to the right key immediately.
Never ask for confirmation when the user asks to go/open/show something.
If nothing matches, set action to null and ask which page they want to go to in the requested language (${language}).`
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
              } else if (parsed.action === null) {
                matchedTarget = null;
              }
            }
          }
        }
      } catch (e) {
        // Fallback to our keyword intent matching above
      }
    }

    // Validate target against ROUTES
    let action: { type: 'navigate'; target: string; query?: Record<string, string> } | null = null;
    if (matchedTarget && ROUTES[matchedTarget]) {
      // If dynamic route requires campaignId, ensure campaignId is present
      if (ROUTES[matchedTarget].path.includes(':id') && !campaignId) {
        // If campaignId is missing for campaignDetail, fallback to campaigns list or keep action null
        action = null;
        replyText = language === 'bn' ? 'দয়া করে কোনো নির্দিষ্ট ক্যাম্পেইন পেজে থাকুন অথবা ক্যাম্পেইন নির্বাচন করুন।' : 'Please specify or navigate from a campaign page.';
      } else {
        action = {
          type: 'navigate',
          target: matchedTarget,
          ...(matchedQuery ? { query: matchedQuery } : {}),
        };
      }
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
