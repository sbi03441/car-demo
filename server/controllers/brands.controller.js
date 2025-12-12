import { getBrandInfo, getBrandById } from '../models/brand.model.js';

/**
 * 브랜드 정보 조회
 */
export async function getBrand(req, res) {
  try {
    const brand = await getBrandInfo();

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: '브랜드 정보를 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      data: brand
    });
  } catch (error) {
    console.error('브랜드 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '브랜드 정보 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * ID로 브랜드 조회
 */
export async function getBrandByIdController(req, res) {
  try {
    const { id } = req.params;
    const brand = await getBrandById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: '브랜드를 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      data: brand
    });
  } catch (error) {
    console.error('브랜드 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '브랜드 조회 중 오류가 발생했습니다.'
    });
  }
}

export default {
  getBrand,
  getBrandByIdController
};
