# COZY Coffee Order App

커피 주문 앱의 풀스택 애플리케이션입니다.

## 프로젝트 구조

```
order_app/
├── server/          # 백엔드 (Express.js + PostgreSQL)
├── ui/             # 프론트엔드 (React + Vite)
├── docs/           # 문서
└── src/            # Render 배포용 진입점
```

## 로컬 개발

### 전체 애플리케이션 실행
```bash
npm run dev
```

### 개별 실행
```bash
# 백엔드만 실행
cd server && npm run dev

# 프론트엔드만 실행
cd ui && npm run dev
```

## Render 배포

### 백엔드 배포
1. Render.com에서 "New Web Service" 선택
2. GitHub 저장소 연결
3. 설정:
   - Build Command: `npm run render-postbuild`
   - Start Command: `npm run render-start`
   - Environment: Node

### 프론트엔드 배포
1. Render.com에서 "New Static Site" 선택
2. GitHub 저장소 연결
3. 설정:
   - Build Command: `cd ui && npm install && npm run build`
   - Publish Directory: `ui/dist`

## 환경변수

### 백엔드
- `NODE_ENV`: production
- `PORT`: 10000 (Render 기본값)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: PostgreSQL 연결 정보
- `FRONTEND_URL`: 프론트엔드 URL

### 프론트엔드
- `VITE_API_BASE_URL`: 백엔드 API URL

## 기술 스택

- **백엔드**: Node.js, Express.js, PostgreSQL
- **프론트엔드**: React, Vite, CSS3
- **배포**: Render
