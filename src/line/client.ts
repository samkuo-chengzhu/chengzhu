// 手寫 LINE Messaging API client（沿用橙築慣例，不用官方 SDK）
const API = 'https://api.line.me/v2/bot';
const DATA = 'https://api-data.line.me/v2/bot';

export function lineClient(token: string) {
  const json = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  return {
    // 訊息
    reply: (replyToken: string, messages: any[]) =>
      fetch(`${API}/message/reply`, { method: 'POST', headers: json, body: JSON.stringify({ replyToken, messages }) }),
    push: (to: string, messages: any[]) =>
      fetch(`${API}/message/push`, { method: 'POST', headers: json, body: JSON.stringify({ to, messages }) }),

    // 圖文選單 Rich Menu
    createRichMenu: (menu: any) =>
      fetch(`${API}/richmenu`, { method: 'POST', headers: json, body: JSON.stringify(menu) }),
    uploadRichMenuImage: (richMenuId: string, image: ArrayBuffer, contentType: string) =>
      fetch(`${DATA}/richmenu/${richMenuId}/content`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': contentType }, body: image }),
    setDefaultRichMenu: (richMenuId: string) =>
      fetch(`${API}/user/all/richmenu/${richMenuId}`, { method: 'POST', headers: json }),
    linkRichMenuToUser: (userId: string, richMenuId: string) =>
      fetch(`${API}/user/${userId}/richmenu/${richMenuId}`, { method: 'POST', headers: json }),
    listRichMenus: () => fetch(`${API}/richmenu/list`, { headers: json }),
    deleteRichMenu: (richMenuId: string) =>
      fetch(`${API}/richmenu/${richMenuId}`, { method: 'DELETE', headers: json }),
  };
}
