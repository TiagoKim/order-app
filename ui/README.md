# COZY Coffee Order App - Frontend

커피 주문 앱의 프론트엔드 React 애플리케이션입니다.

## 개발 환경 설정

1. 의존성 설치:
```bash
npm install
```

2. 환경변수 설정:
```bash
cp .env.example .env
# .env 파일에서 VITE_API_BASE_URL을 수정하세요
```

3. 개발 서버 실행:
```bash
npm run dev
```

## 빌드 및 배포

### 로컬 빌드
```bash
npm run build
npm run preview
```

### Render 배포

1. Render.com에 로그인
2. "New +" → "Static Site" 선택
3. GitHub 저장소 연결
4. 빌드 설정:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. 환경변수 설정:
   - `VITE_API_BASE_URL`: 백엔드 API URL (예: `https://your-backend-app.onrender.com/api`)

## 환경변수

- `VITE_API_BASE_URL`: 백엔드 API의 기본 URL

## 기술 스택

- React 19
- Vite
- CSS3
- Fetch API