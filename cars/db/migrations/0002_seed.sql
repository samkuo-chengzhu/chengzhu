-- 0002_seed.sql ─ 種子資料（與 demo/data/cars.json 對齊）

-- 真實車源：2025 AMG GLC43 Coupé
INSERT INTO cars (id,status,brand,model,model_year,region_spec,mileage_km,fuel,displacement_cc,drivetrain,transmission,engine,tires,horsepower,exterior_color,interior_color,vin,production_date,wholesale_price,suggested_retail,lock_days,deposit_pct,eta_weeks_min,eta_weeks_max,accident_free,highlights,spec,carfax_url,decode_url)
VALUES ('glc43-366009','reserved','Mercedes-AMG','GLC 43 4MATIC+ Coupé',2025,'韓規',6800,'汽油',1991,'4MATIC','9G 自手排','M139 2.0T + 48V','前265/後295 R21',421,'蛋白石白（金屬）','黑/炭灰皮革 · 紅安全帶','W1NKJ8HB0SF366009','2025-02-17',3280000,3780000,3,30,6,8,1,
  '["AMG 夜色外觀套件","21\" AMG 鍛造輪圈","360° 環景","HUD 抬頭顯示","全景天窗","後軸轉向","DISTRONIC 全速域 ACC","納帕真皮方向盤","前座通風 / 加熱","後座加熱","高級音響","環艙氣氛燈","無線充電 · CarPlay","指紋辨識"]',
  '{"車型系列":"GLC 43 4MATIC+ Coupé (C254)","年式 / 產地":"2025 · 德國不來梅廠","外觀色":"蛋白石白（金屬 885U）","內裝":"黑 / 炭灰皮革 · 紅色安全帶","規格別":"韓規（左駕）","排氣量":"1,991 c.c. 直四渦輪"}',
  '#','#');

INSERT INTO car_photos (car_id,url,caption,sort_order) VALUES
  ('glc43-366009','assets/01-front.jpg','正面',0),
  ('glc43-366009','assets/02-side-r.jpg','右側',1),
  ('glc43-366009','assets/03-side-l.jpg','左側',2),
  ('glc43-366009','assets/04-rear.jpg','後面',3),
  ('glc43-366009','assets/05-engine.jpg','引擎室',4),
  ('glc43-366009','assets/06-interior.jpg','內裝',5),
  ('glc43-366009','assets/07-mbux.jpg','中控螢幕',6),
  ('glc43-366009','assets/08-seat.jpg','座椅',7),
  ('glc43-366009','assets/09-trunk.jpg','後行李廂',8),
  ('glc43-366009','assets/10-wheel.jpg','輪圈',9);

-- 示意車源（無照片 → 前端自動降級為佔位圖）
INSERT INTO cars (id,status,brand,model,model_year,region_spec,mileage_km,fuel,drivetrain,horsepower,exterior_color,wholesale_price,suggested_retail,accident_free) VALUES
  ('g63-2024','in_stock','Mercedes-AMG','G 63',2024,'韓規',8000,'汽油','4MATIC',585,'曜石黑',11800000,13800000,1),
  ('m4-comp-2024','in_stock','BMW','M4 Competition',2024,'日規',12000,'汽油','RWD',530,'曜石黑',4180000,4880000,1),
  ('gle53-2025','shipping','Mercedes-AMG','GLE 53 4MATIC+ Coupé',2025,'韓規',7000,'油電','4MATIC',449,'鈰灰',4880000,5680000,1),
  ('macan-gts-2024','customs','Porsche','Macan GTS',2024,'韓規',9000,'汽油','AWD',440,'瑪瑙灰',3980000,4680000,1),
  ('rs5-2024','inspection','Audi','RS5 Sportback',2024,'日規',15000,'汽油','quattro',450,'納多灰',3680000,4280000,1),
  ('golf-r-2024','reserved','Volkswagen','Golf R',2024,'日規',11000,'汽油','4MOTION',333,'光劍藍',1880000,2280000,1);

-- 測試車商（正式上線時 line_user_id 由 LIFF 驗證後寫入）
INSERT INTO dealers (id,line_user_id,company_name,tax_id,contact_name,phone,status,tier,verified_at) VALUES
  ('d_demo01','Udemodealer0001','橙築車業（測試）','12345678','郭先生','0912345678','verified','standard',datetime('now')),
  ('d_demo02','Udemopending0002','示意車商（待審）','87654321','王先生','0987654321','pending','standard',NULL);
