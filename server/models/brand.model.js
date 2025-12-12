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

export default {
  getBrandInfo,
  getBrandById
};
