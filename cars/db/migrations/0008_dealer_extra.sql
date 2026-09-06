-- 0004_dealer_extra.sql ─ 車商申請補欄位（收車類型、備註）
-- business_card 欄位已在 0001 建立；此處補上 brands（JSON 陣列字串）與 note
ALTER TABLE dealers ADD COLUMN brands TEXT;
ALTER TABLE dealers ADD COLUMN note TEXT;
