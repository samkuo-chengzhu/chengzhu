import type { Env } from '../types';
import { lineClient } from './client';

function siteUrl(env: Env) { return env.SITE_URL || 'https://chengzhu-cars.kuo-tinghow.workers.dev'; }

// 加好友歡迎訊息（深黑金 Flex）
function welcomeMessage(env: Env) {
  const base = siteUrl(env);
  return {
    type: 'flex',
    altText: '歡迎加入橙築車商批發',
    contents: {
      type: 'bubble',
      body: {
        type: 'box', layout: 'vertical', backgroundColor: '#141417', paddingAll: '18px', spacing: 'sm',
        contents: [
          { type: 'text', text: '橙築車商批發', weight: 'bold', size: 'lg', color: '#E7C977' },
          { type: 'text', text: '日本・韓國進口車・車商專屬批發', size: 'xs', color: '#9A9AA3' },
          { type: 'text', text: '可瀏覽各狀態車源；申請成為車商並通過審核後，即可看到批發底價並線上下訂鎖車。', size: 'sm', color: '#F3F3F5', wrap: true, margin: 'md' },
        ],
      },
      footer: {
        type: 'box', layout: 'vertical', spacing: 'sm', backgroundColor: '#141417', paddingAll: '14px',
        contents: [
          { type: 'button', style: 'primary', color: '#9C7C3C', action: { type: 'uri', label: '⭐ 申請成為車商', uri: `${base}/apply.html` } },
          { type: 'button', style: 'secondary', height: 'sm', action: { type: 'uri', label: '🚗 先逛批發車源', uri: `${base}/list.html` } },
        ],
      },
    },
  };
}

// 處理 webhook events
export async function handleEvents(events: any[], env: Env): Promise<void> {
  const client = lineClient(env.LINE_CHANNEL_ACCESS_TOKEN || '');
  for (const e of events) {
    try {
      if (e.type === 'follow') {
        await client.reply(e.replyToken, [welcomeMessage(env)]);
      } else if (e.type === 'message' && e.message?.type === 'text') {
        const t = String(e.message.text || '').trim();
        if (t.includes('車源') || t.includes('批發') || t.includes('車')) {
          await client.reply(e.replyToken, [{ type: 'text', text: `批發車源請點：${siteUrl(env)}/list.html` }]);
        }
      }
      // TODO postback（圖文選單 tap）、approve 後 linkRichMenuToUser 切車商版 ─ 下一步接
    } catch (err) {
      console.error('handleEvents error', err);
    }
  }
}
