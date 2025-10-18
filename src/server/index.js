// Render 배포를 위한 진입점 파일
// 실제 서버 코드는 server/app.js에 있음

const path = require('path');

// server/app.js 파일을 실행
require(path.join(__dirname, '../../server/app.js'));
