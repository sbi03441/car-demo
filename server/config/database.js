import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

// Thick 모드 활성화 (Oracle Instant Client 사용)
try {
  oracledb.initOracleClient({
    libDir: 'C:\\oraclexe\\app\\oracle\\product\\11.2.0\\server\\bin'
  });
  console.log('✅ Oracle Thick 모드로 초기화되었습니다.');
} catch (err) {
  console.error('❌ Oracle Thick 모드 초기화 실패:', err);
  // 이미 초기화된 경우 무시
}

// Oracle DB 연결 설정
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionString: process.env.DB_CONNECTION_STRING
};

// 연결 풀 설정
let pool;

/**
 * Oracle DB 연결 풀 초기화
 */
export async function initializePool() {
  try {
    pool = await oracledb.createPool({
      user: dbConfig.user,
      password: dbConfig.password,
      connectionString: dbConfig.connectionString,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 2,
      poolTimeout: 60
    });
    console.log('✅ Oracle DB 연결 풀이 초기화되었습니다.');
  } catch (err) {
    console.error('❌ Oracle DB 연결 풀 초기화 실패:', err);
    throw err;
  }
}

/**
 * Oracle DB 연결 풀 종료
 */
export async function closePool() {
  try {
    if (pool) {
      await pool.close(10);
      console.log('✅ Oracle DB 연결 풀이 종료되었습니다.');
    }
  } catch (err) {
    console.error('❌ Oracle DB 연결 풀 종료 실패:', err);
    throw err;
  }
}

/**
 * DB 연결 가져오기
 */
export async function getConnection() {
  try {
    if (!pool) {
      await initializePool();
    }
    return await pool.getConnection();
  } catch (err) {
    console.error('❌ DB 연결 실패:', err);
    throw err;
  }
}

/**
 * 쿼리 실행 헬퍼 함수
 * @param {string} sql - SQL 쿼리
 * @param {array} binds - 바인딩 파라미터
 * @param {object} options - 쿼리 옵션
 */
export async function execute(sql, binds = [], options = {}) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
      fetchInfo: {
        // CLOB 타입을 문자열로 자동 변환
        ...(options.fetchInfo || {})
      },
      ...options
    });
    return result;
  } catch (err) {
    console.error('❌ 쿼리 실행 실패:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('❌ 연결 종료 실패:', err);
      }
    }
  }
}

export default {
  initializePool,
  closePool,
  getConnection,
  execute
};
