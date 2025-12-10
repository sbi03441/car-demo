import {
  createQuote,
  getQuoteById,
  getQuotesByUserId,
  updateQuote,
  deleteQuote
} from '../models/quote.model.js';
import { validationResult } from 'express-validator';

/**
 * 견적 생성
 */
export async function saveQuote(req, res) {
  try {
    // 로그인 필수 확인
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }

    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '입력 데이터가 유효하지 않습니다.',
        errors: errors.array()
      });
    }

    const quoteData = {
      ...req.body,
      userId: req.user.userId
    };

    const quote = await createQuote(quoteData);

    res.status(201).json({
      success: true,
      message: '견적이 저장되었습니다.',
      data: quote
    });
  } catch (error) {
    console.error('견적 저장 오류:', error);
    res.status(500).json({
      success: false,
      message: '견적 저장 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 내 견적 목록 조회
 */
export async function getMyQuotes(req, res) {
  try {
    const quotes = await getQuotesByUserId(req.user.userId);

    res.status(200).json({
      success: true,
      data: quotes
    });
  } catch (error) {
    console.error('견적 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '견적 목록 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 특정 견적 조회
 */
export async function getQuote(req, res) {
  try {
    const { id } = req.params;
    const quote = await getQuoteById(id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: '견적을 찾을 수 없습니다.'
      });
    }

    // 권한 확인
    // - userId가 null인 견적: 누구나 조회 가능 (비로그인 견적)
    // - userId가 있는 견적: 본인이거나 관리자만 조회 가능
    if (req.user) {
      const userId = quote.userId || quote.USERID;
      if (userId !== null && userId !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: '권한이 없습니다.'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('견적 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '견적 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 견적 수정
 */
export async function modifyQuote(req, res) {
  try {
    const { id } = req.params;
    const quote = await getQuoteById(id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: '견적을 찾을 수 없습니다.'
      });
    }

    // 권한 확인 (본인 견적이거나 관리자인 경우에만 수정 가능)
    const userId = quote.userId || quote.USERID;
    if (userId !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '권한이 없습니다.'
      });
    }

    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '입력 데이터가 유효하지 않습니다.',
        errors: errors.array()
      });
    }

    const updatedQuote = await updateQuote(id, req.body);

    res.status(200).json({
      success: true,
      message: '견적이 수정되었습니다.',
      data: updatedQuote
    });
  } catch (error) {
    console.error('견적 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '견적 수정 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 견적 삭제
 */
export async function removeQuote(req, res) {
  try {
    const { id } = req.params;
    const quote = await getQuoteById(id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: '견적을 찾을 수 없습니다.'
      });
    }

    // 권한 확인 (본인 견적이거나 관리자인 경우에만 삭제 가능)
    const userId = quote.userId || quote.USERID;
    if (userId !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: '권한이 없습니다.'
      });
    }

    await deleteQuote(id);

    res.status(200).json({
      success: true,
      message: '견적이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('견적 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '견적 삭제 중 오류가 발생했습니다.'
    });
  }
}

export default {
  saveQuote,
  getMyQuotes,
  getQuote,
  modifyQuote,
  removeQuote
};
