# COZY 커피 주문 앱 - 백엔드 서버

Express.js를 사용한 커피 주문 앱의 백엔드 API 서버입니다.

## 🚀 시작하기

### 필수 요구사항
- Node.js (v14 이상)
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 설정**
   ```bash
   # .env 파일 생성 (config.example.js 참고)
   cp config.example.js .env
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **프로덕션 서버 실행**
   ```bash
   npm start
   ```

## 📡 API 엔드포인트

### 메뉴 관련 API
- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/inventory` - 재고 정보 조회
- `PUT /api/menus/:id/inventory` - 재고 수량 수정

### 주문 관련 API
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 특정 주문 조회
- `POST /api/orders` - 새 주문 생성
- `PUT /api/orders/:id/status` - 주문 상태 변경
- `GET /api/orders/stats` - 주문 통계 조회

## 🛠️ 기술 스택

- **Node.js** - 런타임 환경
- **Express.js** - 웹 프레임워크
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - 환경 변수 관리
- **nodemon** - 개발 시 자동 재시작

## 📁 프로젝트 구조

```
server/
├── app.js                 # 메인 애플리케이션 파일
├── routes/                # API 라우트
│   ├── menus.js          # 메뉴 관련 라우트
│   └── orders.js         # 주문 관련 라우트
├── config.example.js     # 환경 설정 예시
├── package.json          # 프로젝트 설정
└── README.md            # 프로젝트 문서
```

## 🔧 개발 명령어

- `npm start` - 프로덕션 서버 실행
- `npm run dev` - 개발 서버 실행 (nodemon 사용)
- `npm test` - 테스트 실행 (향후 구현 예정)

## 📝 API 응답 형식

모든 API는 다음과 같은 표준 형식으로 응답합니다:

```json
{
  "success": true|false,
  "data": {},
  "message": "응답 메시지",
  "error_code": "ERROR_CODE" // 에러 시에만 포함
}
```

## 🚧 향후 계획

- [ ] PostgreSQL 데이터베이스 연동
- [ ] JWT 인증 시스템
- [ ] API 문서화 (Swagger)
- [ ] 단위 테스트 추가
- [ ] 로깅 시스템
- [ ] 에러 모니터링

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해 주세요.
