import { execute } from '../config/database.js';

/**
 * 모든 차량 조회 (특징 포함)
 */
export async function getAllCars() {
  const sql = `
    SELECT
      c.id, c.name, c.base_price as "basePrice", c.image_url as "image",
      c.brand, c.engine, c.power, c.fuel_efficiency as "fuelEfficiency",
      c.safety_rating as "safetyRating", c.dimensions, c.description
    FROM cars c
    ORDER BY c.id
  `;
  const result = await execute(sql);

  // 각 차량의 특징 조회
  for (const car of result.rows) {
    const featuresSql = `
      SELECT feature_name as "featureName"
      FROM car_features
      WHERE car_id = :carId
      ORDER BY id
    `;
    const featuresResult = await execute(featuresSql, { carId: car.ID });
    car.features = featuresResult.rows.map(f => f.featureName);
  }

  return result.rows;
}

/**
 * ID로 차량 조회 (특징 포함)
 */
export async function getCarById(id) {
  const sql = `
    SELECT
      c.id, c.name, c.base_price as "basePrice", c.image_url as "image",
      c.brand, c.engine, c.power, c.fuel_efficiency as "fuelEfficiency",
      c.safety_rating as "safetyRating", c.dimensions, c.description
    FROM cars c
    WHERE c.id = :id
  `;
  const result = await execute(sql, { id });

  if (result.rows.length === 0) {
    return null;
  }

  const car = result.rows[0];

  // 차량 특징 조회
  const featuresSql = `
    SELECT feature_name as "featureName"
    FROM car_features
    WHERE car_id = :carId
    ORDER BY id
  `;
  const featuresResult = await execute(featuresSql, { carId: id });
  car.features = featuresResult.rows.map(f => f.featureName);

  return car;
}

/**
 * 새 차량 생성 (관리자용)
 */
export async function createCar(carData) {
  const { name, basePrice, imageUrl, brand, engine, power, fuelEfficiency, safetyRating, dimensions, description, features } = carData;

  const sql = `
    INSERT INTO cars (name, base_price, image_url, brand, engine, power, fuel_efficiency, safety_rating, dimensions, description)
    VALUES (:name, :basePrice, :imageUrl, :brand, :engine, :power, :fuelEfficiency, :safetyRating, :dimensions, :description)
  `;

  await execute(sql, {
    name,
    basePrice,
    imageUrl,
    brand,
    engine,
    power,
    fuelEfficiency,
    safetyRating,
    dimensions,
    description
  });

  // 생성된 차량 조회
  const cars = await execute('SELECT * FROM cars WHERE name = :name ORDER BY id DESC', { name });
  const newCar = cars.rows[0];

  // 특징 추가
  if (features && features.length > 0) {
    for (const feature of features) {
      await execute(
        'INSERT INTO car_features (car_id, feature_name) VALUES (:carId, :featureName)',
        { carId: newCar.ID, featureName: feature }
      );
    }
  }

  return await getCarById(newCar.ID);
}

/**
 * 차량 업데이트 (관리자용)
 */
export async function updateCar(id, carData) {
  const { name, basePrice, imageUrl, brand, engine, power, fuelEfficiency, safetyRating, dimensions, description, features } = carData;

  const sql = `
    UPDATE cars
    SET name = :name, base_price = :basePrice, image_url = :imageUrl, brand = :brand,
        engine = :engine, power = :power, fuel_efficiency = :fuelEfficiency,
        safety_rating = :safetyRating, dimensions = :dimensions, description = :description
    WHERE id = :id
  `;

  await execute(sql, {
    id,
    name,
    basePrice,
    imageUrl,
    brand,
    engine,
    power,
    fuelEfficiency,
    safetyRating,
    dimensions,
    description
  });

  // 기존 특징 삭제
  await execute('DELETE FROM car_features WHERE car_id = :id', { id });

  // 새 특징 추가
  if (features && features.length > 0) {
    for (const feature of features) {
      await execute(
        'INSERT INTO car_features (car_id, feature_name) VALUES (:carId, :featureName)',
        { carId: id, featureName: feature }
      );
    }
  }

  return await getCarById(id);
}

/**
 * 차량 삭제 (관리자용)
 */
export async function deleteCar(id) {
  const sql = 'DELETE FROM cars WHERE id = :id';
  await execute(sql, { id });
}

/**
 * 모든 색상 조회
 */
export async function getAllColors() {
  const sql = `
    SELECT id, code, name, hex, price
    FROM colors
    ORDER BY id
  `;
  const result = await execute(sql);
  return result.rows;
}

/**
 * 색상 생성 (관리자용)
 */
export async function createColor(colorData) {
  const { code, name, hex, price } = colorData;
  const sql = `
    INSERT INTO colors (code, name, hex, price)
    VALUES (:code, :name, :hex, :price)
  `;
  await execute(sql, { code, name, hex, price });

  // 생성된 색상 조회
  const result = await execute('SELECT * FROM colors WHERE code = :code', { code });
  return result.rows[0];
}

/**
 * 색상 업데이트 (관리자용)
 */
export async function updateColor(id, colorData) {
  const { code, name, hex, price } = colorData;
  const sql = `
    UPDATE colors
    SET code = :code, name = :name, hex = :hex, price = :price
    WHERE id = :id
  `;
  await execute(sql, { id, code, name, hex, price });

  // 업데이트된 색상 조회
  const result = await execute('SELECT * FROM colors WHERE id = :id', { id });
  return result.rows[0];
}

/**
 * 색상 삭제 (관리자용)
 */
export async function deleteColor(id) {
  const sql = 'DELETE FROM colors WHERE id = :id';
  await execute(sql, { id });
}

/**
 * 모든 옵션 조회
 */
export async function getAllOptions() {
  const sql = `
    SELECT id, code, name, price
    FROM options
    ORDER BY id
  `;
  const result = await execute(sql);
  return result.rows;
}

/**
 * 옵션 생성 (관리자용)
 */
export async function createOption(optionData) {
  const { code, name, price } = optionData;
  const sql = `
    INSERT INTO options (code, name, price)
    VALUES (:code, :name, :price)
  `;
  await execute(sql, { code, name, price });

  // 생성된 옵션 조회
  const result = await execute('SELECT * FROM options WHERE code = :code', { code });
  return result.rows[0];
}

/**
 * 옵션 업데이트 (관리자용)
 */
export async function updateOption(id, optionData) {
  const { code, name, price } = optionData;
  const sql = `
    UPDATE options
    SET code = :code, name = :name, price = :price
    WHERE id = :id
  `;
  await execute(sql, { id, code, name, price });

  // 업데이트된 옵션 조회
  const result = await execute('SELECT * FROM options WHERE id = :id', { id });
  return result.rows[0];
}

/**
 * 옵션 삭제 (관리자용)
 */
export async function deleteOption(id) {
  const sql = 'DELETE FROM options WHERE id = :id';
  await execute(sql, { id });
}

/**
 * 차량별 색상 관계 관리
 */

/**
 * 특정 차량의 색상 목록 조회
 */
export async function getCarColors(carId) {
  const sql = `
    SELECT c.id, c.code, c.name, c.hex, c.price
    FROM colors c
    INNER JOIN car_colors cc ON c.id = cc.color_id
    WHERE cc.car_id = :carId
    ORDER BY c.id
  `;
  const result = await execute(sql, { carId });
  return result.rows;
}

/**
 * 차량에 색상 추가
 */
export async function addCarColor(carId, colorId) {
  const sql = `
    INSERT INTO car_colors (car_id, color_id)
    VALUES (:carId, :colorId)
  `;
  await execute(sql, { carId, colorId });
}

/**
 * 차량의 색상 삭제
 */
export async function removeCarColor(carId, colorId) {
  const sql = `
    DELETE FROM car_colors
    WHERE car_id = :carId AND color_id = :colorId
  `;
  await execute(sql, { carId, colorId });
}

/**
 * 차량의 모든 색상 관계 삭제
 */
export async function removeAllCarColors(carId) {
  const sql = `DELETE FROM car_colors WHERE car_id = :carId`;
  await execute(sql, { carId });
}

/**
 * 차량 색상 관계 업데이트 (기존 삭제 후 새로 추가)
 */
export async function updateCarColors(carId, colorIds) {
  // 기존 색상 관계 삭제
  await removeAllCarColors(carId);

  // 새 색상 관계 추가
  if (colorIds && colorIds.length > 0) {
    for (const colorId of colorIds) {
      await addCarColor(carId, colorId);
    }
  }
}

/**
 * 차량별 옵션 관계 관리
 */

/**
 * 특정 차량의 옵션 목록 조회
 */
export async function getCarOptions(carId) {
  const sql = `
    SELECT o.id, o.code, o.name, o.price
    FROM options o
    INNER JOIN car_options co ON o.id = co.option_id
    WHERE co.car_id = :carId
    ORDER BY o.id
  `;
  const result = await execute(sql, { carId });
  return result.rows;
}

/**
 * 차량에 옵션 추가
 */
export async function addCarOption(carId, optionId) {
  const sql = `
    INSERT INTO car_options (car_id, option_id)
    VALUES (:carId, :optionId)
  `;
  await execute(sql, { carId, optionId });
}

/**
 * 차량의 옵션 삭제
 */
export async function removeCarOption(carId, optionId) {
  const sql = `
    DELETE FROM car_options
    WHERE car_id = :carId AND option_id = :optionId
  `;
  await execute(sql, { carId, optionId });
}

/**
 * 차량의 모든 옵션 관계 삭제
 */
export async function removeAllCarOptions(carId) {
  const sql = `DELETE FROM car_options WHERE car_id = :carId`;
  await execute(sql, { carId });
}

/**
 * 차량 옵션 관계 업데이트 (기존 삭제 후 새로 추가)
 */
export async function updateCarOptions(carId, optionIds) {
  // 기존 옵션 관계 삭제
  await removeAllCarOptions(carId);

  // 새 옵션 관계 추가
  if (optionIds && optionIds.length > 0) {
    for (const optionId of optionIds) {
      await addCarOption(carId, optionId);
    }
  }
}

export default {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getAllColors,
  createColor,
  updateColor,
  deleteColor,
  getAllOptions,
  createOption,
  updateOption,
  deleteOption,
  getCarColors,
  addCarColor,
  removeCarColor,
  removeAllCarColors,
  updateCarColors,
  getCarOptions,
  addCarOption,
  removeCarOption,
  removeAllCarOptions,
  updateCarOptions
};
