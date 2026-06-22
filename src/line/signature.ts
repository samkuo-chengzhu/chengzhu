// 驗證 LINE Webhook 簽章：X-Line-Signature = base64( HMAC-SHA256(channelSecret, rawBody) )
// 一定要用「原始 request body 字串」計算，不能用 parse 過的物件。
export async function verifyLineSignature(rawBody: string, signature: string | undefined, channelSecret: string): Promise<boolean> {
  if (!signature || !channelSecret) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(channelSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));
  // 等長、固定時間比較
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}
