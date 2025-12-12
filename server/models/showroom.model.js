import { execute } from '../config/database.js';

/**
 * 모든 전시장 조회
 */
export async function getAllShowrooms() {
  const sql = `
    SELECT
      id as "id",
      name as "name",
      address as "address",
      phone as "phone",
      hours as "hours",
      services as "services",
      image_url as "imageUrl",
      region as "region",
      created_at as "createdAt"
    FROM showrooms
    ORDER BY id
  `;
  const result = await execute(sql);
  return result.rows;
}

/**
 * ID로 전시장 조회
 */
export async function getShowroomById(id) {
  const sql = `
    SELECT
      id as "id",
      name as "name",
      address as "address",
      phone as "phone",
      hours as "hours",
      services as "services",
      image_url as "imageUrl",
      region as "region",
      created_at as "createdAt"
    FROM showrooms
    WHERE id = :id
  `;
  const result = await execute(sql, { id });

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

/**
 * 지역별 전시장 조회
 */
export async function getShowroomsByRegion(region) {
  const sql = `
    SELECT
      id as "id",
      name as "name",
      address as "address",
      phone as "phone",
      hours as "hours",
      services as "services",
      image_url as "imageUrl",
      region as "region",
      created_at as "createdAt"
    FROM showrooms
    WHERE region = :region
    ORDER BY id
  `;
  const result = await execute(sql, { region });
  return result.rows;
}

export default {
  getAllShowrooms,
  getShowroomById,
  getShowroomsByRegion
};
