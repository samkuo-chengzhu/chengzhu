-- 0006_fix_glc43_add6499.sql
UPDATE cars SET wholesale_price=3500000, suggested_retail=3580000, mileage_km=18000, updated_at=datetime('now') WHERE id='glc43-366009';
INSERT INTO cars (id,status,brand,model,model_year,region_spec,mileage_km,fuel,drivetrain,horsepower,exterior_color,wholesale_price,suggested_retail,accident_free) VALUES ('glc300coupe-6499','in_stock','Mercedes-Benz','GLC 300 4MATIC Coupé',2024,'韓規',NULL,'汽油','4MATIC',258,'北極白',2730000,2830000,1);
INSERT INTO car_photos (car_id,url,caption,sort_order) VALUES ('glc300coupe-6499','assets/glc300coupe-6499/01.jpg','實拍',0);
INSERT INTO car_photos (car_id,url,caption,sort_order) VALUES ('glc300coupe-6499','assets/glc300coupe-6499/02.jpg','實拍',1);
INSERT INTO car_photos (car_id,url,caption,sort_order) VALUES ('glc300coupe-6499','assets/glc300coupe-6499/03.jpg','實拍',2);
INSERT INTO car_photos (car_id,url,caption,sort_order) VALUES ('glc300coupe-6499','assets/glc300coupe-6499/04.jpg','實拍',3);
INSERT INTO car_photos (car_id,url,caption,sort_order) VALUES ('glc300coupe-6499','assets/glc300coupe-6499/05.jpg','實拍',4);
INSERT INTO car_photos (car_id,url,caption,sort_order) VALUES ('glc300coupe-6499','assets/glc300coupe-6499/06.jpg','實拍',5);
INSERT INTO car_photos (car_id,url,caption,sort_order) VALUES ('glc300coupe-6499','assets/glc300coupe-6499/07.jpg','實拍',6);
INSERT INTO car_photos (car_id,url,caption,sort_order) VALUES ('glc300coupe-6499','assets/glc300coupe-6499/08.jpg','實拍',7);
