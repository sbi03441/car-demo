import {
  getAllShowrooms,
  getShowroomById,
  getShowroomsByRegion,
  createShowroom,
  updateShowroom,
  deleteShowroom
} from '../models/showroom.model.js';

/**
 * 모든 전시장 조회
 */
export async function getShowrooms(req, res) {
  try {
    const { region } = req.query;

    let showrooms;
    if (region) {
      showrooms = await getShowroomsByRegion(region);
    } else {
      showrooms = await getAllShowrooms();
    }

    res.status(200).json({
      success: true,
      data: showrooms
    });
  } catch (error) {
    console.error('전시장 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '전시장 목록 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 특정 전시장 조회
 */
export async function getShowroom(req, res) {
  try {
    const { id } = req.params;
    const showroom = await getShowroomById(id);

    if (!showroom) {
      return res.status(404).json({
        success: false,
        message: '전시장을 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      data: showroom
    });
  } catch (error) {
    console.error('전시장 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '전시장 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 전시장 생성 (관리자)
 */
export async function createShowroomController(req, res) {
  try {
    const { name, address, phone, hours, services, imageUrl, region } = req.body;

    // 입력 검증
    if (!name || !address || !phone || !region) {
      return res.status(400).json({
        success: false,
        message: '이름, 주소, 전화번호, 지역은 필수입니다.'
      });
    }

    const showroomId = await createShowroom({
      name,
      address,
      phone,
      hours,
      services,
      imageUrl,
      region
    });

    res.status(201).json({
      success: true,
      message: '전시장이 생성되었습니다.',
      data: { id: showroomId }
    });
  } catch (error) {
    console.error('전시장 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: '전시장 생성 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 전시장 수정 (관리자)
 */
export async function updateShowroomController(req, res) {
  try {
    const { id } = req.params;
    const { name, address, phone, hours, services, imageUrl, region } = req.body;

    // 입력 검증
    if (!name || !address || !phone || !region) {
      return res.status(400).json({
        success: false,
        message: '이름, 주소, 전화번호, 지역은 필수입니다.'
      });
    }

    // 전시장 존재 확인
    const existingShowroom = await getShowroomById(id);
    if (!existingShowroom) {
      return res.status(404).json({
        success: false,
        message: '전시장을 찾을 수 없습니다.'
      });
    }

    await updateShowroom(id, {
      name,
      address,
      phone,
      hours,
      services,
      imageUrl,
      region
    });

    res.status(200).json({
      success: true,
      message: '전시장이 수정되었습니다.'
    });
  } catch (error) {
    console.error('전시장 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '전시장 수정 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 전시장 삭제 (관리자)
 */
export async function deleteShowroomController(req, res) {
  try {
    const { id } = req.params;

    // 전시장 존재 확인
    const existingShowroom = await getShowroomById(id);
    if (!existingShowroom) {
      return res.status(404).json({
        success: false,
        message: '전시장을 찾을 수 없습니다.'
      });
    }

    await deleteShowroom(id);

    res.status(200).json({
      success: true,
      message: '전시장이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('전시장 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '전시장 삭제 중 오류가 발생했습니다.'
    });
  }
}

export default {
  getShowrooms,
  getShowroom,
  createShowroomController,
  updateShowroomController,
  deleteShowroomController
};
