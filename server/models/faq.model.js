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

/**
 * 모든 FAQ 조회 (관리자용 - 비활성화 포함)
 */
export async function getAllFAQsForAdmin() {
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
 * FAQ 생성
 */
export async function createFAQ(faqData) {
  const { category, question, answer, displayOrder = 0, isActive = 1 } = faqData;

  const sql = `
    INSERT INTO faqs (category, question, answer, display_order, is_active)
    VALUES (:category, :question, :answer, :displayOrder, :isActive)
    RETURNING id INTO :id
  `;

  const binds = {
    category,
    question,
    answer,
    displayOrder,
    isActive,
    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
  };

  const result = await execute(sql, binds);
  return result.outBinds.id[0];
}

/**
 * FAQ 수정
 */
export async function updateFAQ(id, faqData) {
  const { category, question, answer, displayOrder, isActive } = faqData;

  const sql = `
    UPDATE faqs
    SET
      category = :category,
      question = :question,
      answer = :answer,
      display_order = :displayOrder,
      is_active = :isActive,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = :id
  `;

  await execute(sql, {
    id,
    category,
    question,
    answer,
    displayOrder,
    isActive
  });
}

/**
 * FAQ 삭제
 */
export async function deleteFAQ(id) {
  const sql = 'DELETE FROM faqs WHERE id = :id';
  await execute(sql, { id });
}

export default {
  getAllFAQs,
  getFAQsByCategory,
  getFAQById,
  getAllFAQsForAdmin,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
