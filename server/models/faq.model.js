import { execute } from '../config/database.js';
import oracledb from 'oracledb';

/**
 * 모든 FAQ 조회 (활성화된 것만)
 */
export async function getAllFAQs() {
  const sql = `
    SELECT
      id as "id",
      category as "category",
      question as "question",
      answer as "answer",
      display_order as "displayOrder",
      is_active as "isActive",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM faqs
    WHERE is_active = 1
    ORDER BY display_order, id
  `;

  const result = await execute(sql, [], {
    fetchInfo: {
      answer: { type: oracledb.STRING }
    }
  });

  return result.rows;
}

/**
 * 카테고리별 FAQ 조회
 */
export async function getFAQsByCategory(category) {
  const sql = `
    SELECT
      id as "id",
      category as "category",
      question as "question",
      answer as "answer",
      display_order as "displayOrder",
      is_active as "isActive",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM faqs
    WHERE category = :category AND is_active = 1
    ORDER BY display_order, id
  `;

  const result = await execute(sql, { category }, {
    fetchInfo: {
      answer: { type: oracledb.STRING }
    }
  });

  return result.rows;
}

/**
 * ID로 FAQ 조회
 */
export async function getFAQById(id) {
  const sql = `
    SELECT
      id as "id",
      category as "category",
      question as "question",
      answer as "answer",
      display_order as "displayOrder",
      is_active as "isActive",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM faqs
    WHERE id = :id
  `;

  const result = await execute(sql, { id }, {
    fetchInfo: {
      answer: { type: oracledb.STRING }
    }
  });

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

export default {
  getAllFAQs,
  getFAQsByCategory,
  getFAQById
};
