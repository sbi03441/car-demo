import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
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

// ========================================
// 관리자 전용 컨트롤러
// ========================================

/**
 * 차량 생성 (관리자)
 */
export async function createCarController(req, res) {
  try {
    const { name, basePrice, imageUrl, brand, engine, power, fuelEfficiency, safetyRating, dimensions, description, features } = req.body;

    // 입력 검증
    if (!name || !basePrice) {
      return res.status(400).json({
        success: false,
        message: '차량 이름과 가격은 필수입니다.'
      });
    }

    const newCar = await createCar({
      name,
      basePrice,
      imageUrl,
      brand,
      engine,
      power,
      fuelEfficiency,
      safetyRating,
      dimensions,
      description,
      features
    });

    res.status(201).json({
      success: true,
      message: '차량이 생성되었습니다.',
      data: newCar
    });
  } catch (error) {
    console.error('차량 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: '차량 생성 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 차량 수정 (관리자)
 */
export async function updateCarController(req, res) {
  try {
    const { id } = req.params;
    const { name, basePrice, imageUrl, brand, engine, power, fuelEfficiency, safetyRating, dimensions, description, features } = req.body;

    // 입력 검증
    if (!name || !basePrice) {
      return res.status(400).json({
        success: false,
        message: '차량 이름과 가격은 필수입니다.'
      });
    }

    // 차량 존재 확인
    const existingCar = await getCarById(id);
    if (!existingCar) {
      return res.status(404).json({
        success: false,
        message: '차량을 찾을 수 없습니다.'
      });
    }

    const updatedCar = await updateCar(id, {
      name,
      basePrice,
      imageUrl,
      brand,
      engine,
      power,
      fuelEfficiency,
      safetyRating,
      dimensions,
      description,
      features
    });

    res.status(200).json({
      success: true,
      message: '차량이 수정되었습니다.',
      data: updatedCar
    });
  } catch (error) {
    console.error('차량 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '차량 수정 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 차량 삭제 (관리자)
 */
export async function deleteCarController(req, res) {
  try {
    const { id } = req.params;

    // 차량 존재 확인
    const existingCar = await getCarById(id);
    if (!existingCar) {
      return res.status(404).json({
        success: false,
        message: '차량을 찾을 수 없습니다.'
      });
    }

    await deleteCar(id);

    res.status(200).json({
      success: true,
      message: '차량이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('차량 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '차량 삭제 중 오류가 발생했습니다.'
    });
  }
}

export default {
  getCars,
  getCar,
  getColors,
  getOptions,
  createCarController,
  updateCarController,
  deleteCarController
};
