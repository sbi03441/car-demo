import oracledb from 'oracledb';
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

/**
 * 전시장 생성 (관리자)
 */
export async function createShowroom(showroomData) {
  const { name, address, phone, hours, services, imageUrl, region } = showroomData;

  const sql = `
    INSERT INTO showrooms (name, address, phone, hours, services, image_url, region)
    VALUES (:name, :address, :phone, :hours, :services, :imageUrl, :region)
    RETURNING id INTO :id
  `;

  const binds = {
    name,
    address,
    phone,
    hours,
    services,
    imageUrl,
    region,
    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
  };

  const result = await execute(sql, binds);
  return result.outBinds.id[0];
}

/**
 * 전시장 수정 (관리자)
 */
export async function updateShowroom(id, showroomData) {
  const { name, address, phone, hours, services, imageUrl, region } = showroomData;

  const sql = `
    UPDATE showrooms
    SET
      name = :name,
      address = :address,
      phone = :phone,
      hours = :hours,
      services = :services,
      image_url = :imageUrl,
      region = :region
    WHERE id = :id
  `;

  await execute(sql, {
    id,
    name,
    address,
    phone,
    hours,
    services,
    imageUrl,
    region
  });
}

/**
 * 전시장 삭제 (관리자)
 */
export async function deleteShowroom(id) {
  const sql = 'DELETE FROM showrooms WHERE id = :id';
  await execute(sql, { id });
}

export default {
  getAllShowrooms,
  getShowroomById,
  getShowroomsByRegion,
  createShowroom,
  updateShowroom,
  deleteShowroom
};
