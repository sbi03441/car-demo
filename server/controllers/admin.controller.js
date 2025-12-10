import {
  createCar,
  updateCar,
  deleteCar,
  createColor,
  updateColor,
  deleteColor,
  createOption,
  updateOption,
  deleteOption
} from '../models/car.model.js';
import { getAllQuotes } from '../models/quote.model.js';
import { getAllUsers, deleteUser } from '../models/user.model.js';
import { validationResult } from 'express-validator';

// ========== 차량 관리 ==========

/**
 * 차량 생성
 */
export async function addCar(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '입력 데이터가 유효하지 않습니다.',
        errors: errors.array()
      });
    }

    const car = await createCar(req.body);

    res.status(201).json({
      success: true,
      message: '차량이 생성되었습니다.',
      data: car
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
 * 차량 수정
 */
export async function editCar(req, res) {
  try {
    const { id } = req.params;
    const car = await updateCar(id, req.body);

    res.status(200).json({
      success: true,
      message: '차량이 수정되었습니다.',
      data: car
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
 * 차량 삭제
 */
export async function removeCar(req, res) {
  try {
    const { id } = req.params;
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

// ========== 색상 관리 ==========

/**
 * 색상 생성
 */
export async function addColor(req, res) {
  try {
    const color = await createColor(req.body);

    res.status(201).json({
      success: true,
      message: '색상이 생성되었습니다.',
      data: color
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
 * 색상 수정
 */
export async function editColor(req, res) {
  try {
    const { id } = req.params;
    const color = await updateColor(id, req.body);

    res.status(200).json({
      success: true,
      message: '색상이 수정되었습니다.',
      data: color
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
 * 색상 삭제
 */
export async function removeColor(req, res) {
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

// ========== 옵션 관리 ==========

/**
 * 옵션 생성
 */
export async function addOption(req, res) {
  try {
    const option = await createOption(req.body);

    res.status(201).json({
      success: true,
      message: '옵션이 생성되었습니다.',
      data: option
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
 * 옵션 수정
 */
export async function editOption(req, res) {
  try {
    const { id } = req.params;
    const option = await updateOption(id, req.body);

    res.status(200).json({
      success: true,
      message: '옵션이 수정되었습니다.',
      data: option
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
 * 옵션 삭제
 */
export async function removeOption(req, res) {
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

// ========== 견적 관리 ==========

/**
 * 모든 견적 조회
 */
export async function getQuotes(req, res) {
  try {
    const quotes = await getAllQuotes();

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

// ========== 사용자 관리 ==========

/**
 * 모든 사용자 조회
 */
export async function getUsers(req, res) {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '사용자 목록 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 사용자 삭제
 */
export async function removeUser(req, res) {
  try {
    const { id } = req.params;

    // 자기 자신은 삭제할 수 없음
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: '자기 자신은 삭제할 수 없습니다.'
      });
    }

    await deleteUser(id);

    res.status(200).json({
      success: true,
      message: '사용자가 삭제되었습니다.'
    });
  } catch (error) {
    console.error('사용자 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '사용자 삭제 중 오류가 발생했습니다.'
    });
  }
}

export default {
  addCar,
  editCar,
  removeCar,
  addColor,
  editColor,
  removeColor,
  addOption,
  editOption,
  removeOption,
  getQuotes,
  getUsers,
  removeUser
};
