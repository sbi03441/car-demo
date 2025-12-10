import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializePool, closePool } from './config/database.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import carsRoutes from './routes/cars.routes.js';
import quotesRoutes from './routes/quotes.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// Middleware
// ========================================

// CORS 설정
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// JSON 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅 (개발 환경)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ========================================
// Routes
// ========================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Car Demo API Server',
    version: '1.0.0'
  });
});

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/admin', adminRoutes);

// ========================================
// Error Handling
// ========================================

// 404 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 경로를 찾을 수 없습니다.'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 오류:', err);
  res.status(500).json({
    success: false,
    message: '서버 내부 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ========================================
// Server Start
// ========================================

async function startServer() {
  try {
    // 데이터베이스 연결 풀 초기화
    await initializePool();

    // 서버 시작
    app.listen(PORT, () => {
      console.log('');
      console.log('========================================');
      console.log(`🚗 Car Demo API Server`);
      console.log(`📡 서버 실행: http://localhost:${PORT}`);
      console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 CORS 허용: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
      console.log('========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n서버를 종료합니다...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n서버를 종료합니다...');
  await closePool();
  process.exit(0);
});

startServer();
