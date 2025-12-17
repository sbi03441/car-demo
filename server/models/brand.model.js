import { execute } from '../config/database.js';
import oracledb from 'oracledb';

/**
 * 브랜드 정보 조회 (단일 브랜드)
 */
export async function getBrandInfo() {
  const sql = `
    SELECT
      id as "id",
      name as "name",
      logo as "logo",
      tagline as "tagline",
      description as "description",
      heritage as "heritage",
      key_tech as "keyTech",
      philosophy as "philosophy",
      brand_values as "values",
      created_at as "createdAt"
    FROM brands
    WHERE id = 1
  `;

  // CLOB 필드를 문자열로 변환
  const result = await execute(sql, [], {
    fetchInfo: {
      description: { type: oracledb.STRING },
      keyTech: { type: oracledb.STRING },
      values: { type: oracledb.STRING }
    }
  });

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

/**
 * ID로 브랜드 조회
 */
export async function getBrandById(id) {
  const sql = `
    SELECT
      id as "id",
      name as "name",
      logo as "logo",
      tagline as "tagline",
      description as "description",
      heritage as "heritage",
      key_tech as "keyTech",
      philosophy as "philosophy",
      brand_values as "values",
      created_at as "createdAt"
    FROM brands
    WHERE id = :id
  `;

  // CLOB 필드를 문자열로 변환
  const result = await execute(sql, { id }, {
    fetchInfo: {
      description: { type: oracledb.STRING },
      keyTech: { type: oracledb.STRING },
      values: { type: oracledb.STRING }
    }
  });

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

/**
 * 모든 브랜드 조회 (관리자용)
 */
export async function getAllBrands() {
  const sql = `
    SELECT
      id as "id",
      name as "name",
      logo as "logo",
      tagline as "tagline",
      description as "description",
      heritage as "heritage",
      key_tech as "keyTech",
      philosophy as "philosophy",
      brand_values as "values",
      created_at as "createdAt"
    FROM brands
    ORDER BY id
  `;

  const result = await execute(sql, [], {
    fetchInfo: {
      description: { type: oracledb.STRING },
      keyTech: { type: oracledb.STRING },
      values: { type: oracledb.STRING }
    }
  });

  return result.rows;
}

/**
 * 브랜드 생성 (관리자)
 */
export async function createBrand(brandData) {
  const { name, logo, tagline, description, heritage, keyTech, philosophy, values } = brandData;

  const sql = `
    INSERT INTO brands (name, logo, tagline, description, heritage, key_tech, philosophy, brand_values)
    VALUES (:name, :logo, :tagline, :description, :heritage, :keyTech, :philosophy, :values)
    RETURNING id INTO :id
  `;

  const binds = {
    name,
    logo,
    tagline,
    description,
    heritage,
    keyTech,
    philosophy,
    values,
    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
  };

  const result = await execute(sql, binds);
  return result.outBinds.id[0];
}

/**
 * 브랜드 수정 (관리자)
 */
export async function updateBrand(id, brandData) {
  const { name, logo, tagline, description, heritage, keyTech, philosophy, values } = brandData;

  const sql = `
    UPDATE brands
    SET
      name = :name,
      logo = :logo,
      tagline = :tagline,
      description = :description,
      heritage = :heritage,
      key_tech = :keyTech,
      philosophy = :philosophy,
      brand_values = :values
    WHERE id = :id
  `;

  await execute(sql, {
    id,
    name,
    logo,
    tagline,
    description,
    heritage,
    keyTech,
    philosophy,
    values
  });
}

/**
 * 브랜드 삭제 (관리자)
 */
export async function deleteBrand(id) {
  const sql = 'DELETE FROM brands WHERE id = :id';
  await execute(sql, { id });
}

export default {
  getBrandInfo,
  getBrandById,
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand
};
