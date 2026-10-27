import { NextResponse } from 'next/server';

function isValidInternalUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (!url.startsWith('/') || url.startsWith('//') || url.includes('://') || url.includes('javascript:')) {
    return false;
  }
  if (url === '/' || url === '/campaigns' || url === '/dashboard') {
    return true;
  }
  if (/^\/campaigns\/[^/]+$/.test(url)) {
    return true;
  }
  if (/^\/dashboard(\/.*)?$/.test(url)) {
    return true;
  }
  return false;
}

export async function POST(request: Request) {
  try {
    const { transcript, lang, page } = await request.json();
    const text = (transcript || '').toLowerCase().trim();
    const language = lang === 'bn' ? 'bn' : 'en';

    let matchedUrl: string | null = null;
    let replyText = language === 'bn' ? 'আমি আপনার অনুরোধ প্রক্রিয়া করেছি।' : 'I have processed your request.';

    // Intent mapping for en + bn navigation phrases
    if (
      text.includes('dashboard') ||
      text.includes('ড্যাশবোর্ড') ||
      text.includes('take me to my dashboard') ||
      text.includes('ড্যাশবোর্ডে যাও') ||
      text.includes('my dashboard')
    ) {
      matchedUrl = '/dashboard';
      replyText = language === 'bn' ? 'আপনাকে ড্যাশবোর্ডে নিয়ে যাচ্ছি।' : 'Taking you to your dashboard.';
    } else if (
      text.includes('home') ||
      text.includes('হোম') ||
      text.includes('homepage') ||
      text.includes('মূল পাতা')
    ) {
      matchedUrl = '/';
      replyText = language === 'bn' ? 'আপনাকে হোম পেজে নিয়ে যাচ্ছি।' : 'Taking you to the home page.';
    } else if (
      text.includes('campaign') ||
      text.includes('campaigns') ||
      text.includes('ক্যাম্পেইন') ||
      text.includes('show campaigns')
    ) {
      if (text.includes('tech') || text.includes('technology') || text.includes('টেক')) {
        matchedUrl = '/campaigns?category=Technology';
        replyText = language === 'bn' ? 'টেকনোলজি ক্যাম্পেইনগুলো দেখাচ্ছি।' : 'Showing technology campaigns.';
      } else {
        matchedUrl = '/campaigns';
        replyText = language === 'bn' ? 'সব ক্যাম্পেইনগুলো দেখাচ্ছি।' : 'Showing all campaigns.';
      }
    }

    // Try OpenAI API if OPENAI_API_KEY is available and no direct intent matched
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && !matchedUrl) {
      try {
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
                content: `You are an AI voice assistant for a crowdfunding platform. Return JSON with format: {"reply": string, "action": {"type":"navigate","url": string} | null}. 
Map dashboard phrases (en + bn: "dashboard", "ড্যাশবোর্ড", "take me to my dashboard", "ড্যাশবোর্ডে যাও") to /dashboard.
Map home phrases to /.
Map campaigns phrases to /campaigns (with optional ?category= if specified).
Never ask for confirmation when the user asks to go/open/show something. Whitelist only internal routes (/, /campaigns, /campaigns/<id>, /dashboard); drop anything else.`
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
              if (parsed.action && parsed.action.type === 'navigate' && isValidInternalUrl(parsed.action.url)) {
                matchedUrl = parsed.action.url;
              }
            }
          }
        }
      } catch (e) {
        // Fallback to intent mapping
      }
    }

    const action = isValidInternalUrl(matchedUrl!) ? { type: 'navigate', url: matchedUrl } : null;

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
