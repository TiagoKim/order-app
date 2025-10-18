const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./server/config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://cozy-coffee-frontend.onrender.com' // Render 프론트엔드 URL
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'COZY 커피 주문 앱 API 서버가 실행 중입니다.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API 라우트
app.use('/api/menus', require('./server/routes/menus'));
app.use('/api/orders', require('./server/routes/orders'));

// 404 에러 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 API 엔드포인트를 찾을 수 없습니다.',
    error_code: 'NOT_FOUND'
  });
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error('🚨 서버 오류 발생:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '서버 내부 오류가 발생했습니다.',
    error_code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 초기화
    await initializeDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📱 프론트엔드 URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🌐 API 서버 URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();
