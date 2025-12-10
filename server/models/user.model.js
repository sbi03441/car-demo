import { execute } from '../config/database.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * 이메일로 사용자 조회
 */
export async function findUserByEmail(email) {
  const sql = 'SELECT * FROM users WHERE email = :email';
  const result = await execute(sql, { email });
  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * ID로 사용자 조회
 */
export async function findUserById(id) {
  const sql = 'SELECT * FROM users WHERE id = :id';
  const result = await execute(sql, { id });
  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * 새 사용자 생성
 */
export async function createUser(email, password, name, isAdmin = 0) {
  // 비밀번호 해시
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // INSERT 실행
  const sql = `
    INSERT INTO users (email, password, name, is_admin)
    VALUES (:email, :password, :name, :isAdmin)
  `;

  await execute(sql, { email, password: hashedPassword, name, isAdmin });

  // 생성된 사용자 조회 후 반환
  return await findUserByEmail(email);
}

/**
 * 비밀번호 확인
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * 모든 사용자 조회 (관리자용)
 */
export async function getAllUsers() {
  const sql = `
    SELECT id, email, name, is_admin as "isAdmin", created_at as "createdAt"
    FROM users
    ORDER BY created_at DESC
  `;
  const result = await execute(sql);
  return result.rows;
}

/**
 * 사용자 삭제
 */
export async function deleteUser(id) {
  const sql = 'DELETE FROM users WHERE id = :id';
  await execute(sql, { id });
}

export default {
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
  getAllUsers,
  deleteUser
};
