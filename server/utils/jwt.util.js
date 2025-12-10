import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * JWT 토큰 생성
 * @param {object} payload - 토큰에 담을 데이터
 * @returns {string} JWT 토큰
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * JWT 토큰 검증
 * @param {string} token - JWT 토큰
 * @returns {object} 디코딩된 페이로드
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * JWT 토큰에서 사용자 ID 추출
 * @param {string} token - JWT 토큰
 * @returns {number} 사용자 ID
 */
export function getUserIdFromToken(token) {
  const decoded = verifyToken(token);
  return decoded.userId;
}

export default {
  generateToken,
  verifyToken,
  getUserIdFromToken
};
