import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { execute, initializePool, closePool } from '../config/database.js';

dotenv.config();

const SALT_ROUNDS = 10;

async function createAdminUser() {
  try {
    console.log('========================================');
    console.log('관리자 계정 생성 스크립트');
    console.log('========================================\n');

    // DB 연결
    await initializePool();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cardemo.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = '관리자';

    // 비밀번호 해시 생성
    console.log('🔐 비밀번호 해시 생성 중...');
    const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    console.log(`✅ 해시 생성 완료: ${hashedPassword}\n`);

    // 기존 관리자 계정 확인
    console.log('🔍 기존 관리자 계정 확인 중...');
    const checkSql = 'SELECT * FROM users WHERE email = :email';
    const existing = await execute(checkSql, { email: adminEmail });

    if (existing.rows.length > 0) {
      // 기존 계정이 있으면 비밀번호 업데이트
      console.log('⚠️  기존 관리자 계정이 존재합니다. 비밀번호를 업데이트합니다.\n');

      const updateSql = `
        UPDATE users
        SET password = :password, is_admin = 1, name = :name
        WHERE email = :email
      `;

      await execute(updateSql, {
        email: adminEmail,
        password: hashedPassword,
        name: adminName
      });

      console.log('✅ 관리자 계정 업데이트 완료!');
    } else {
      // 새로운 관리자 계정 생성
      console.log('📝 새로운 관리자 계정 생성 중...\n');

      const insertSql = `
        INSERT INTO users (email, password, name, is_admin)
        VALUES (:email, :password, :name, 1)
      `;

      await execute(insertSql, {
        email: adminEmail,
        password: hashedPassword,
        name: adminName
      });

      console.log('✅ 관리자 계정 생성 완료!');
    }

    // 결과 확인
    const result = await execute(checkSql, { email: adminEmail });
    const admin = result.rows[0];

    console.log('\n========================================');
    console.log('관리자 계정 정보');
    console.log('========================================');
    console.log(`이메일: ${admin.EMAIL || admin.email}`);
    console.log(`이름: ${admin.NAME || admin.name}`);
    console.log(`관리자 권한: ${admin.IS_ADMIN || admin.isAdmin ? '예' : '아니오'}`);
    console.log(`비밀번호: ${adminPassword}`);
    console.log('========================================\n');

    console.log('✅ 모든 작업이 완료되었습니다!');
    console.log('   이제 Postman에서 로그인을 테스트하세요.\n');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

createAdminUser();