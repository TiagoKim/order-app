// 환경 설정 예시 파일
// 실제 사용 시 .env 파일을 생성하고 이 내용을 복사하세요

module.exports = {
  // 서버 설정
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // 프론트엔드 URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // 데이터베이스 설정 (향후 PostgreSQL 연동 시 사용)
  DATABASE: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT || 5432,
    NAME: process.env.DB_NAME || 'cozy_coffee',
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || 'password'
  },
  
  // JWT 설정 (향후 인증 기능 추가 시 사용)
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-secret-key',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h'
  }
};
