import {
  getBrandInfo,
  getBrandById,
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand
} from '../models/brand.model.js';

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

/**
 * 모든 브랜드 조회 (관리자용)
 */
export async function getAdminBrands(req, res) {
  try {
    const brands = await getAllBrands();

    res.status(200).json({
      success: true,
      data: brands
    });
  } catch (error) {
    console.error('브랜드 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '브랜드 목록 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 브랜드 생성 (관리자)
 */
export async function createBrandController(req, res) {
  try {
    const { name, logo, tagline, description, heritage, keyTech, philosophy, values } = req.body;

    // 입력 검증
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '브랜드 이름은 필수입니다.'
      });
    }

    const brandId = await createBrand({
      name,
      logo,
      tagline,
      description,
      heritage,
      keyTech,
      philosophy,
      values
    });

    res.status(201).json({
      success: true,
      message: '브랜드가 생성되었습니다.',
      data: { id: brandId }
    });
  } catch (error) {
    console.error('브랜드 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: '브랜드 생성 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 브랜드 수정 (관리자)
 */
export async function updateBrandController(req, res) {
  try {
    const { id } = req.params;
    const { name, logo, tagline, description, heritage, keyTech, philosophy, values } = req.body;

    // 입력 검증
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '브랜드 이름은 필수입니다.'
      });
    }

    // 브랜드 존재 확인
    const existingBrand = await getBrandById(id);
    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: '브랜드를 찾을 수 없습니다.'
      });
    }

    await updateBrand(id, {
      name,
      logo,
      tagline,
      description,
      heritage,
      keyTech,
      philosophy,
      values
    });

    res.status(200).json({
      success: true,
      message: '브랜드가 수정되었습니다.'
    });
  } catch (error) {
    console.error('브랜드 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '브랜드 수정 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 브랜드 삭제 (관리자)
 */
export async function deleteBrandController(req, res) {
  try {
    const { id } = req.params;

    // 브랜드 존재 확인
    const existingBrand = await getBrandById(id);
    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: '브랜드를 찾을 수 없습니다.'
      });
    }

    await deleteBrand(id);

    res.status(200).json({
      success: true,
      message: '브랜드가 삭제되었습니다.'
    });
  } catch (error) {
    console.error('브랜드 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '브랜드 삭제 중 오류가 발생했습니다.'
    });
  }
}

export default {
  getBrand,
  getBrandByIdController,
  getAdminBrands,
  createBrandController,
  updateBrandController,
  deleteBrandController
};
