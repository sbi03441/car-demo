import {
  getAllShowrooms,
  getShowroomById,
  getShowroomsByRegion
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

export default {
  getShowrooms,
  getShowroom
};
