import {
  getAllCars,
  getCarById,
  getAllColors,
  getAllOptions
} from '../models/car.model.js';

/**
 * 모든 차량 조회
 */
export async function getCars(req, res) {
  try {
    const cars = await getAllCars();

    res.status(200).json({
      success: true,
      data: cars
    });
  } catch (error) {
    console.error('차량 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '차량 목록 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 특정 차량 조회
 */
export async function getCar(req, res) {
  try {
    const { id } = req.params;
    const car = await getCarById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: '차량을 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('차량 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '차량 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 모든 색상 조회
 */
export async function getColors(req, res) {
  try {
    const colors = await getAllColors();

    res.status(200).json({
      success: true,
      data: colors
    });
  } catch (error) {
    console.error('색상 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '색상 목록 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 모든 옵션 조회
 */
export async function getOptions(req, res) {
  try {
    const options = await getAllOptions();

    res.status(200).json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('옵션 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '옵션 목록 조회 중 오류가 발생했습니다.'
    });
  }
}

export default {
  getCars,
  getCar,
  getColors,
  getOptions
};
