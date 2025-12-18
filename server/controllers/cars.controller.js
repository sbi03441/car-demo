import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getAllColors,
  createColor,
  updateColor,
  deleteColor,
  getAllOptions,
  createOption,
  updateOption,
  deleteOption,
  getCarColors,
  updateCarColors,
  getCarOptions,
  updateCarOptions
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

/**
 * 특정 차량의 사용 가능한 색상 조회 (공개)
 */
export async function getAvailableCarColors(req, res) {
  try {
    const { carId } = req.params;
    const colors = await getCarColors(carId);

    res.status(200).json({
      success: true,
      data: colors
    });
  } catch (error) {
    console.error('차량 색상 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '차량 색상 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 특정 차량의 사용 가능한 옵션 조회 (공개)
 */
export async function getAvailableCarOptions(req, res) {
  try {
    const { carId } = req.params;
    const options = await getCarOptions(carId);

    res.status(200).json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('차량 옵션 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '차량 옵션 조회 중 오류가 발생했습니다.'
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

// ========================================
// 색상 관리 (관리자)
// ========================================

/**
 * 색상 생성 (관리자)
 */
export async function createColorController(req, res) {
  try {
    const { code, name, hex, price } = req.body;

    if (!code || !name || !hex) {
      return res.status(400).json({
        success: false,
        message: '코드, 이름, 색상값은 필수입니다.'
      });
    }

    const newColor = await createColor({ code, name, hex, price: price || 0 });

    res.status(201).json({
      success: true,
      message: '색상이 생성되었습니다.',
      data: newColor
    });
  } catch (error) {
    console.error('색상 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: '색상 생성 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 색상 수정 (관리자)
 */
export async function updateColorController(req, res) {
  try {
    const { id } = req.params;
    const { code, name, hex, price } = req.body;

    if (!code || !name || !hex) {
      return res.status(400).json({
        success: false,
        message: '코드, 이름, 색상값은 필수입니다.'
      });
    }

    const updatedColor = await updateColor(id, { code, name, hex, price: price || 0 });

    res.status(200).json({
      success: true,
      message: '색상이 수정되었습니다.',
      data: updatedColor
    });
  } catch (error) {
    console.error('색상 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '색상 수정 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 색상 삭제 (관리자)
 */
export async function deleteColorController(req, res) {
  try {
    const { id } = req.params;
    await deleteColor(id);

    res.status(200).json({
      success: true,
      message: '색상이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('색상 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '색상 삭제 중 오류가 발생했습니다.'
    });
  }
}

// ========================================
// 옵션 관리 (관리자)
// ========================================

/**
 * 옵션 생성 (관리자)
 */
export async function createOptionController(req, res) {
  try {
    const { code, name, price } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: '코드와 이름은 필수입니다.'
      });
    }

    const newOption = await createOption({ code, name, price: price || 0 });

    res.status(201).json({
      success: true,
      message: '옵션이 생성되었습니다.',
      data: newOption
    });
  } catch (error) {
    console.error('옵션 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: '옵션 생성 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 옵션 수정 (관리자)
 */
export async function updateOptionController(req, res) {
  try {
    const { id } = req.params;
    const { code, name, price } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: '코드와 이름은 필수입니다.'
      });
    }

    const updatedOption = await updateOption(id, { code, name, price: price || 0 });

    res.status(200).json({
      success: true,
      message: '옵션이 수정되었습니다.',
      data: updatedOption
    });
  } catch (error) {
    console.error('옵션 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '옵션 수정 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 옵션 삭제 (관리자)
 */
export async function deleteOptionController(req, res) {
  try {
    const { id } = req.params;
    await deleteOption(id);

    res.status(200).json({
      success: true,
      message: '옵션이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('옵션 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '옵션 삭제 중 오류가 발생했습니다.'
    });
  }
}

// ========================================
// 차량별 색상/옵션 관계 관리 (관리자)
// ========================================

/**
 * 특정 차량의 색상 목록 조회 (관리자)
 */
export async function getCarColorsController(req, res) {
  try {
    const { carId } = req.params;
    const colors = await getCarColors(carId);

    res.status(200).json({
      success: true,
      data: colors
    });
  } catch (error) {
    console.error('차량 색상 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '차량 색상 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 차량의 색상 관계 업데이트 (관리자)
 */
export async function updateCarColorsController(req, res) {
  try {
    const { carId } = req.params;
    const { colorIds } = req.body;

    if (!Array.isArray(colorIds)) {
      return res.status(400).json({
        success: false,
        message: 'colorIds는 배열이어야 합니다.'
      });
    }

    await updateCarColors(carId, colorIds);

    res.status(200).json({
      success: true,
      message: '차량 색상이 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('차량 색상 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '차량 색상 업데이트 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 특정 차량의 옵션 목록 조회 (관리자)
 */
export async function getCarOptionsController(req, res) {
  try {
    const { carId } = req.params;
    const options = await getCarOptions(carId);

    res.status(200).json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('차량 옵션 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '차량 옵션 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 차량의 옵션 관계 업데이트 (관리자)
 */
export async function updateCarOptionsController(req, res) {
  try {
    const { carId } = req.params;
    const { optionIds } = req.body;

    if (!Array.isArray(optionIds)) {
      return res.status(400).json({
        success: false,
        message: 'optionIds는 배열이어야 합니다.'
      });
    }

    await updateCarOptions(carId, optionIds);

    res.status(200).json({
      success: true,
      message: '차량 옵션이 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('차량 옵션 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '차량 옵션 업데이트 중 오류가 발생했습니다.'
    });
  }
}

export default {
  getCars,
  getCar,
  getColors,
  getOptions,
  getAvailableCarColors,
  getAvailableCarOptions,
  createCarController,
  updateCarController,
  deleteCarController,
  createColorController,
  updateColorController,
  deleteColorController,
  createOptionController,
  updateOptionController,
  deleteOptionController,
  getCarColorsController,
  updateCarColorsController,
  getCarOptionsController,
  updateCarOptionsController
};
