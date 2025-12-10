import { findUserByEmail, createUser, verifyPassword } from '../models/user.model.js';
import { generateToken } from '../utils/jwt.util.js';
import { validationResult } from 'express-validator';

/**
 * 회원가입
 */
export async function register(req, res) {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '입력 데이터가 유효하지 않습니다.',
        errors: errors.array()
      });
    }

    const { email, password, name } = req.body;

    // 이메일 중복 확인
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '이미 사용중인 이메일입니다.'
      });
    }

    // 사용자 생성
    const user = await createUser(email, password, name);

    // JWT 토큰 생성
    const token = generateToken({
      userId: user.ID || user.id,
      email: user.EMAIL || user.email,
      isAdmin: user.IS_ADMIN || user.isAdmin || 0
    });

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      data: {
        user: {
          id: user.ID || user.id,
          email: user.EMAIL || user.email,
          name: user.NAME || user.name,
          isAdmin: user.IS_ADMIN || user.isAdmin || 0
        },
        token
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({
      success: false,
      message: '회원가입 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 로그인
 */
export async function login(req, res) {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '입력 데이터가 유효하지 않습니다.',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // 사용자 조회
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 일치하지 않습니다.'
      });
    }

    // 비밀번호 확인
    const isPasswordValid = await verifyPassword(password, user.PASSWORD || user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 일치하지 않습니다.'
      });
    }

    // JWT 토큰 생성
    const token = generateToken({
      userId: user.ID || user.id,
      email: user.EMAIL || user.email,
      isAdmin: user.IS_ADMIN || user.isAdmin || 0
    });

    res.status(200).json({
      success: true,
      message: '로그인이 완료되었습니다.',
      data: {
        user: {
          id: user.ID || user.id,
          email: user.EMAIL || user.email,
          name: user.NAME || user.name,
          isAdmin: user.IS_ADMIN || user.isAdmin || 0
        },
        token
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '로그인 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 현재 사용자 정보 조회
 */
export async function getMe(req, res) {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.ID || user.id,
        email: user.EMAIL || user.email,
        name: user.NAME || user.name,
        isAdmin: user.IS_ADMIN || user.isAdmin || 0,
        createdAt: user.CREATED_AT || user.createdAt
      }
    });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '사용자 정보 조회 중 오류가 발생했습니다.'
    });
  }
}

export default {
  register,
  login,
  getMe
};
