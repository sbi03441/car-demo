-- ========================================
-- Car Demo Database Schema (Oracle)
-- ========================================

-- 시퀀스 삭제 (재실행 시)
DROP SEQUENCE users_seq;
DROP SEQUENCE cars_seq;
DROP SEQUENCE car_features_seq;
DROP SEQUENCE colors_seq;
DROP SEQUENCE options_seq;
DROP SEQUENCE quotes_seq;
DROP SEQUENCE quote_options_seq;

-- 테이블 삭제 (재실행 시)
DROP TABLE quote_options CASCADE CONSTRAINTS;
DROP TABLE quotes CASCADE CONSTRAINTS;
DROP TABLE options CASCADE CONSTRAINTS;
DROP TABLE colors CASCADE CONSTRAINTS;
DROP TABLE car_features CASCADE CONSTRAINTS;
DROP TABLE cars CASCADE CONSTRAINTS;
DROP TABLE users CASCADE CONSTRAINTS;

-- ========================================
-- 1. USERS 테이블 (사용자)
-- ========================================
CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    email VARCHAR2(255) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    name VARCHAR2(100) NOT NULL,
    is_admin NUMBER(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER users_bir
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT users_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

-- ========================================
-- 2. CARS 테이블 (차량)
-- ========================================
CREATE TABLE cars (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    base_price NUMBER NOT NULL,
    image_url VARCHAR2(500),
    brand VARCHAR2(50) NOT NULL,
    engine VARCHAR2(100),
    power VARCHAR2(50),
    fuel_efficiency VARCHAR2(50),
    safety_rating VARCHAR2(10),
    dimensions VARCHAR2(100),
    description VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE cars_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER cars_bir
BEFORE INSERT ON cars
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT cars_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

-- ========================================
-- 3. CAR_FEATURES 테이블 (차량 특징)
-- ========================================
CREATE TABLE car_features (
    id NUMBER PRIMARY KEY,
    car_id NUMBER NOT NULL,
    feature_name VARCHAR2(200) NOT NULL,
    CONSTRAINT fk_car_features_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

CREATE SEQUENCE car_features_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER car_features_bir
BEFORE INSERT ON car_features
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT car_features_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

-- ========================================
-- 4. COLORS 테이블 (색상 옵션)
-- ========================================
CREATE TABLE colors (
    id NUMBER PRIMARY KEY,
    code VARCHAR2(50) UNIQUE NOT NULL,
    name VARCHAR2(100) NOT NULL,
    hex VARCHAR2(10) NOT NULL,
    price NUMBER DEFAULT 0
);

CREATE SEQUENCE colors_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER colors_bir
BEFORE INSERT ON colors
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT colors_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

-- ========================================
-- 5. OPTIONS 테이블 (추가 옵션)
-- ========================================
CREATE TABLE options (
    id NUMBER PRIMARY KEY,
    code VARCHAR2(50) UNIQUE NOT NULL,
    name VARCHAR2(100) NOT NULL,
    price NUMBER DEFAULT 0
);

CREATE SEQUENCE options_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER options_bir
BEFORE INSERT ON options
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT options_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

-- ========================================
-- 6. QUOTES 테이블 (견적서)
-- ========================================
CREATE TABLE quotes (
    id NUMBER PRIMARY KEY,
    user_id NUMBER,
    car_id NUMBER NOT NULL,
    color_code VARCHAR2(50) NOT NULL,
    discount_name VARCHAR2(100),
    discount_amount NUMBER DEFAULT 0,
    delivery_region VARCHAR2(100),
    delivery_fee NUMBER DEFAULT 0,
    subtotal NUMBER NOT NULL,
    total NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quotes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_quotes_car FOREIGN KEY (car_id) REFERENCES cars(id)
);

CREATE SEQUENCE quotes_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER quotes_bir
BEFORE INSERT ON quotes
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT quotes_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

-- ========================================
-- 7. QUOTE_OPTIONS 테이블 (견적-옵션 매핑)
-- ========================================
CREATE TABLE quote_options (
    id NUMBER PRIMARY KEY,
    quote_id NUMBER NOT NULL,
    option_code VARCHAR2(50) NOT NULL,
    CONSTRAINT fk_quote_options_quote FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
);

CREATE SEQUENCE quote_options_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER quote_options_bir
BEFORE INSERT ON quote_options
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT quote_options_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/

-- ========================================
-- 초기 데이터 삽입
-- ========================================

-- 차량 데이터
INSERT INTO cars (id, name, base_price, image_url, brand, engine, power, fuel_efficiency, safety_rating, dimensions, description)
VALUES (1, 'Genesis GV80', 65000000, 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&h=800&fit=crop&crop=center',
        'Genesis', '3.5L V6 터보', '380마력', '9.2km/L', '5★', '4,945 × 1,975 × 1,715mm',
        '럭셔리 SUV의 새로운 기준을 제시하는 Genesis GV80. 우아함과 성능이 조화된 프리미엄 모델입니다.');

INSERT INTO cars (id, name, base_price, image_url, brand, engine, power, fuel_efficiency, safety_rating, dimensions, description)
VALUES (2, 'BMW X5', 78000000, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=800&fit=crop&crop=center',
        'BMW', '3.0L 직렬 6기통 터보', '340마력', '10.1km/L', '5★', '4,922 × 2,004 × 1,745mm',
        '역동적인 주행 성능과 BMW만의 독창성이 돋보이는 프리미엄 SAV입니다.');

INSERT INTO cars (id, name, base_price, image_url, brand, engine, power, fuel_efficiency, safety_rating, dimensions, description)
VALUES (3, 'Tesla Model Y', 59000000, 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=1200&h=800&fit=crop&crop=center',
        'Tesla', '듀얼 모터 전기', '456마력', '4.1km/kWh', '5★', '4,751 × 1,921 × 1,624mm',
        '지속 가능한 미래를 위한 전기 SUV. 혁신적인 기술과 친환경 모빌리티의 완벽한 조합입니다.');

INSERT INTO cars (id, name, base_price, image_url, brand, engine, power, fuel_efficiency, safety_rating, dimensions, description)
VALUES (4, 'Audi Q7', 82000000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&crop=center',
        'Audi', '3.0L V6 터보', '340마력', '9.8km/L', '5★', '5,063 × 1,970 × 1,741mm',
        'Audi의 플래그십 SUV로 혁신적인 디자인과 최첨단 기술이 집약된 모델입니다.');

INSERT INTO cars (id, name, base_price, image_url, brand, engine, power, fuel_efficiency, safety_rating, dimensions, description)
VALUES (5, 'Mercedes GLE', 89000000, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&h=800&fit=crop&crop=center',
        'Mercedes-Benz', '3.0L 직렬 6기통 터보', '367마력', '9.5km/L', '5★', '4,924 × 2,020 × 1,706mm',
        'Mercedes-Benz의 프리미엄 SUV로 편안함과 고급스러움을 동시에 제공합니다.');

INSERT INTO cars (id, name, base_price, image_url, brand, engine, power, fuel_efficiency, safety_rating, dimensions, description)
VALUES (6, 'Porsche Cayenne', 95000000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&fit=crop&crop=center',
        'Porsche', '3.0L V6 터보', '340마력', '9.7km/L', '5★', '4,918 × 1,983 × 1,696mm',
        '스포츠카의 DNA를 담은 SUV. Porsche만의 독특한 주행 감성을 경험할 수 있습니다.');

-- 차량 특징
INSERT INTO car_features (car_id, feature_name) VALUES (1, '어댑티브 크루즈 컨트롤');
INSERT INTO car_features (car_id, feature_name) VALUES (1, '헤드업 디스플레이');
INSERT INTO car_features (car_id, feature_name) VALUES (1, '에어 서스펜션');
INSERT INTO car_features (car_id, feature_name) VALUES (1, '프리미엄 사운드 시스템');

INSERT INTO car_features (car_id, feature_name) VALUES (2, 'xDrive 4륜구동');
INSERT INTO car_features (car_id, feature_name) VALUES (2, 'iDrive 7.0');
INSERT INTO car_features (car_id, feature_name) VALUES (2, '파노라마 선루프');
INSERT INTO car_features (car_id, feature_name) VALUES (2, '하만카돈 사운드');

INSERT INTO car_features (car_id, feature_name) VALUES (3, '오토파일럿');
INSERT INTO car_features (car_id, feature_name) VALUES (3, '15인치 터치스크린');
INSERT INTO car_features (car_id, feature_name) VALUES (3, '글래스루프');
INSERT INTO car_features (car_id, feature_name) VALUES (3, '슈퍼차저 네트워크');

INSERT INTO car_features (car_id, feature_name) VALUES (4, '콰트로 4륜구동');
INSERT INTO car_features (car_id, feature_name) VALUES (4, '버추얼 콕핏');
INSERT INTO car_features (car_id, feature_name) VALUES (4, '에어 서스펜션');
INSERT INTO car_features (car_id, feature_name) VALUES (4, '매트릭스 LED 헤드라이트');

INSERT INTO car_features (car_id, feature_name) VALUES (5, '4MATIC 4륜구동');
INSERT INTO car_features (car_id, feature_name) VALUES (5, 'MBUX 인포테인먼트');
INSERT INTO car_features (car_id, feature_name) VALUES (5, '에어바디 컨트롤');
INSERT INTO car_features (car_id, feature_name) VALUES (5, '부메스터 사운드');

INSERT INTO car_features (car_id, feature_name) VALUES (6, '포르쉐 트랙션 매니지먼트');
INSERT INTO car_features (car_id, feature_name) VALUES (6, '스포츠 크로노 패키지');
INSERT INTO car_features (car_id, feature_name) VALUES (6, '어댑티브 에어 서스펜션');
INSERT INTO car_features (car_id, feature_name) VALUES (6, 'BOSE 사운드');

-- 색상 옵션
INSERT INTO colors (code, name, hex, price) VALUES ('white', '펄 화이트', '#f8f9fa', 0);
INSERT INTO colors (code, name, hex, price) VALUES ('black', '미드나이트 블랙', '#1a1a1a', 500000);
INSERT INTO colors (code, name, hex, price) VALUES ('gray', '메탈릭 그레이', '#6c757d', 300000);
INSERT INTO colors (code, name, hex, price) VALUES ('blue', '딥 블루', '#1e40af', 800000);

-- 추가 옵션
INSERT INTO options (code, name, price) VALUES ('sunroof', '파노라마 선루프', 1400000);
INSERT INTO options (code, name, price) VALUES ('hud', '헤드업 디스플레이', 900000);
INSERT INTO options (code, name, price) VALUES ('sound', '프리미엄 사운드', 1200000);

COMMIT;

-- ========================================
-- 인덱스 생성 (성능 최적화)
-- ========================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_car_features_car_id ON car_features(car_id);
CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_car_id ON quotes(car_id);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
CREATE INDEX idx_quote_options_quote_id ON quote_options(quote_id);

-- ========================================
-- 스키마 생성 완료
-- ========================================
