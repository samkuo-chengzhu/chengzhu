import type { Env, Identity, Role } from './types';

// 解析請求身分 ─ 整個批發價 gating 的關鍵。
// 1) DEV 模式：Authorization: Bearer dev:<role> 直接模擬（僅本機/測試）
// 2) 正式：Authorization: Bearer <LIFF access token> → 向 LINE 驗證取得 userId → 查 dealers 表
export async function resolveIdentity(authHeader: string | undefined, env: Env): Promise<Identity> {
  const token = (authHeader ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return { role: 'guest' };

  if (env.DEV_MODE === '1' && token.startsWith('dev:')) {
    const r = token.slice(4) as Role;
    return { role: (['guest', 'pending', 'dealer'] as Role[]).includes(r) ? r : 'guest' };
  }

  const userId = await verifyLineToken(token);
  if (!userId) return { role: 'guest' };

  const dealer = await env.DB
    .prepare('SELECT id, status FROM dealers WHERE line_user_id = ?')
    .bind(userId)
    .first<{ id: string; status: string }>();

  if (!dealer) return { role: 'guest', userId };
  const role: Role = dealer.status === 'verified' ? 'dealer' : dealer.status === 'pending' ? 'pending' : 'guest';
  return { role, userId, dealerId: dealer.id };
}

// 用 LIFF access token 向 LINE 驗證身分（成功代表 token 有效），回傳 userId
async function verifyLineToken(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const p = (await res.json()) as { userId?: string };
    return p.userId ?? null;
  } catch {
    return null;
  }
}
