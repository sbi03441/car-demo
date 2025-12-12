import {
  getAllFAQs,
  getFAQsByCategory,
  getFAQById,
  getAllFAQsForAdmin,
  createFAQ,
  updateFAQ,
  deleteFAQ
} from '../models/faq.model.js';

/**
 * 모든 FAQ 조회
 */
export async function getFAQs(req, res) {
  try {
    const { category } = req.query;

    let faqs;
    if (category) {
      faqs = await getFAQsByCategory(category);
    } else {
      faqs = await getAllFAQs();
    }

    res.status(200).json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error('FAQ 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: 'FAQ 목록 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 특정 FAQ 조회
 */
export async function getFAQ(req, res) {
  try {
    const { id } = req.params;
    const faq = await getFAQById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ를 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      data: faq
    });
  } catch (error) {
    console.error('FAQ 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: 'FAQ 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 모든 FAQ 조회 (관리자용 - 비활성화 포함)
 */
export async function getAdminFAQs(req, res) {
  try {
    const faqs = await getAllFAQsForAdmin();

    res.status(200).json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error('FAQ 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: 'FAQ 목록 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * FAQ 생성 (관리자)
 */
export async function createFAQController(req, res) {
  try {
    const { category, question, answer, displayOrder, isActive } = req.body;

    // 입력 검증
    if (!category || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: '카테고리, 질문, 답변은 필수입니다.'
      });
    }

    const faqId = await createFAQ({
      category,
      question,
      answer,
      displayOrder,
      isActive
    });

    res.status(201).json({
      success: true,
      message: 'FAQ가 생성되었습니다.',
      data: { id: faqId }
    });
  } catch (error) {
    console.error('FAQ 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: 'FAQ 생성 중 오류가 발생했습니다.'
    });
  }
}

/**
 * FAQ 수정 (관리자)
 */
export async function updateFAQController(req, res) {
  try {
    const { id } = req.params;
    const { category, question, answer, displayOrder, isActive } = req.body;

    // 입력 검증
    if (!category || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: '카테고리, 질문, 답변은 필수입니다.'
      });
    }

    // FAQ 존재 확인
    const existingFAQ = await getFAQById(id);
    if (!existingFAQ) {
      return res.status(404).json({
        success: false,
        message: 'FAQ를 찾을 수 없습니다.'
      });
    }

    await updateFAQ(id, {
      category,
      question,
      answer,
      displayOrder,
      isActive
    });

    res.status(200).json({
      success: true,
      message: 'FAQ가 수정되었습니다.'
    });
  } catch (error) {
    console.error('FAQ 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: 'FAQ 수정 중 오류가 발생했습니다.'
    });
  }
}

/**
 * FAQ 삭제 (관리자)
 */
export async function deleteFAQController(req, res) {
  try {
    const { id } = req.params;

    // FAQ 존재 확인
    const existingFAQ = await getFAQById(id);
    if (!existingFAQ) {
      return res.status(404).json({
        success: false,
        message: 'FAQ를 찾을 수 없습니다.'
      });
    }

    await deleteFAQ(id);

    res.status(200).json({
      success: true,
      message: 'FAQ가 삭제되었습니다.'
    });
  } catch (error) {
    console.error('FAQ 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: 'FAQ 삭제 중 오류가 발생했습니다.'
    });
  }
}

export default {
  getFAQs,
  getFAQ,
  getAdminFAQs,
  createFAQController,
  updateFAQController,
  deleteFAQController
};
