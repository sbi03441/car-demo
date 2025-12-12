import { getAllFAQs, getFAQsByCategory, getFAQById } from '../models/faq.model.js';

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

export default {
  getFAQs,
  getFAQ
};
