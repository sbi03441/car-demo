import { execute } from '../config/database.js';

/**
 * 새 견적 생성
 */
export async function createQuote(quoteData) {
  const {
    userId,
    carId,
    colorCode,
    optionCodes = [],
    discountName = '',
    discountAmount = 0,
    deliveryRegion = '',
    deliveryFee = 0,
    subtotal,
    total
  } = quoteData;

  // 견적 생성
  const sql = `
    INSERT INTO quotes (user_id, car_id, color_code, discount_name, discount_amount, delivery_region, delivery_fee, subtotal, total)
    VALUES (:userId, :carId, :colorCode, :discountName, :discountAmount, :deliveryRegion, :deliveryFee, :subtotal, :total)
  `;

  await execute(sql, {
    userId: userId || null,
    carId,
    colorCode,
    discountName,
    discountAmount,
    deliveryRegion,
    deliveryFee,
    subtotal,
    total
  });

  // 생성된 견적 조회
  const result = await execute(
    'SELECT * FROM quotes WHERE car_id = :carId AND total = :total ORDER BY id DESC',
    { carId, total }
  );
  const quote = result.rows[0];

  // 옵션 추가
  if (optionCodes.length > 0) {
    for (const optionCode of optionCodes) {
      await execute(
        'INSERT INTO quote_options (quote_id, option_code) VALUES (:quoteId, :optionCode)',
        { quoteId: quote.ID, optionCode }
      );
    }
  }

  return await getQuoteById(quote.ID);
}

/**
 * ID로 견적 조회 (옵션 포함)
 */
export async function getQuoteById(id) {
  const sql = `
    SELECT
      q.id, q.user_id as "userId", q.car_id as "carId", q.color_code as "colorCode",
      q.discount_name as "discountName", q.discount_amount as "discountAmount",
      q.delivery_region as "deliveryRegion", q.delivery_fee as "deliveryFee",
      q.subtotal, q.total, q.created_at as "createdAt"
    FROM quotes q
    WHERE q.id = :id
  `;
  const result = await execute(sql, { id });

  if (result.rows.length === 0) {
    return null;
  }

  const quote = result.rows[0];

  // 옵션 조회
  const optionsSql = `
    SELECT option_code as "optionCode"
    FROM quote_options
    WHERE quote_id = :quoteId
  `;
  const optionsResult = await execute(optionsSql, { quoteId: id });
  quote.optionCodes = optionsResult.rows.map(o => o.optionCode);

  return quote;
}

/**
 * 사용자 ID로 견적 목록 조회
 */
export async function getQuotesByUserId(userId) {
  const sql = `
    SELECT
      q.id, q.user_id as "userId", q.car_id as "carId", q.color_code as "colorCode",
      q.discount_name as "discountName", q.discount_amount as "discountAmount",
      q.delivery_region as "deliveryRegion", q.delivery_fee as "deliveryFee",
      q.subtotal, q.total, q.created_at as "createdAt",
      c.name as "carName", c.brand as "carBrand", c.base_price as "carBasePrice", c.image_url as "carImageUrl",
      col.name as "colorName", col.hex as "colorHex"
    FROM quotes q
    JOIN cars c ON q.car_id = c.id
    LEFT JOIN colors col ON q.color_code = col.code
    WHERE q.user_id = :userId
    ORDER BY q.created_at DESC
  `;
  const result = await execute(sql, { userId });

  // 각 견적의 옵션 조회 (옵션 이름 포함)
  for (const quote of result.rows) {
    const optionsSql = `
      SELECT
        qo.option_code as "optionCode",
        o.name as "optionName",
        o.price as "optionPrice"
      FROM quote_options qo
      JOIN options o ON qo.option_code = o.code
      WHERE qo.quote_id = :quoteId
    `;
    const optionsResult = await execute(optionsSql, { quoteId: quote.ID });
    quote.options = optionsResult.rows;
  }

  return result.rows;
}

/**
 * 모든 견적 조회 (관리자용)
 */
export async function getAllQuotes() {
  const sql = `
    SELECT
      q.id, q.user_id as "userId", q.car_id as "carId", q.color_code as "colorCode",
      q.discount_name as "discountName", q.discount_amount as "discountAmount",
      q.delivery_region as "deliveryRegion", q.delivery_fee as "deliveryFee",
      q.subtotal, q.total, q.created_at as "createdAt",
      c.name as "carName", c.brand as "carBrand",
      u.email as "userEmail", u.name as "userName"
    FROM quotes q
    JOIN cars c ON q.car_id = c.id
    LEFT JOIN users u ON q.user_id = u.id
    ORDER BY q.created_at DESC
  `;
  const result = await execute(sql);

  // 각 견적의 옵션 조회
  for (const quote of result.rows) {
    const optionsSql = `
      SELECT option_code as "optionCode"
      FROM quote_options
      WHERE quote_id = :quoteId
    `;
    const optionsResult = await execute(optionsSql, { quoteId: quote.ID });
    quote.optionCodes = optionsResult.rows.map(o => o.optionCode);
  }

  return result.rows;
}

/**
 * 견적 수정
 */
export async function updateQuote(id, quoteData) {
  const {
    carId,
    colorCode,
    optionCodes = [],
    discountName = '',
    discountAmount = 0,
    deliveryRegion = '',
    deliveryFee = 0,
    subtotal,
    total
  } = quoteData;

  // 견적 기본 정보 업데이트
  const sql = `
    UPDATE quotes
    SET car_id = :carId,
        color_code = :colorCode,
        discount_name = :discountName,
        discount_amount = :discountAmount,
        delivery_region = :deliveryRegion,
        delivery_fee = :deliveryFee,
        subtotal = :subtotal,
        total = :total
    WHERE id = :id
  `;

  await execute(sql, {
    id,
    carId,
    colorCode,
    discountName,
    discountAmount,
    deliveryRegion,
    deliveryFee,
    subtotal,
    total
  });

  // 기존 옵션 모두 삭제
  await execute('DELETE FROM quote_options WHERE quote_id = :quoteId', { quoteId: id });

  // 새 옵션 추가
  if (optionCodes.length > 0) {
    for (const optionCode of optionCodes) {
      await execute(
        'INSERT INTO quote_options (quote_id, option_code) VALUES (:quoteId, :optionCode)',
        { quoteId: id, optionCode }
      );
    }
  }

  // 수정된 견적 반환
  return await getQuoteById(id);
}

/**
 * 견적 삭제
 */
export async function deleteQuote(id) {
  const sql = 'DELETE FROM quotes WHERE id = :id';
  await execute(sql, { id });
}

export default {
  createQuote,
  getQuoteById,
  getQuotesByUserId,
  getAllQuotes,
  updateQuote,
  deleteQuote
};