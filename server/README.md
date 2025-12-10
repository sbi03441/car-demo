# Car Demo Backend API

Car Demo 프로젝트의 백엔드 API 서버입니다. Node.js + Express로 구현되었습니다.

## 기술 스택

- **Node.js** - JavaScript 런타임
- **Express** - 웹 프레임워크
- **Oracle Database** - 데이터베이스
- **JWT** - 인증 시스템
- **bcrypt** - 비밀번호 암호화

## 프로젝트 구조

```
server/
├── config/             # 설정 파일
│   └── database.js     # DB 연결 설정
├── controllers/        # 비즈니스 로직
│   ├── auth.controller.js
│   ├── cars.controller.js
│   ├── quotes.controller.js
│   └── admin.controller.js
├── models/             # 데이터 모델
│   ├── user.model.js
│   ├── car.model.js
│   └── quote.model.js
├── routes/             # API 라우트
│   ├── auth.routes.js
│   ├── cars.routes.js
│   ├── quotes.routes.js
│   └── admin.routes.js
├── middleware/         # 미들웨어
│   ├── auth.middleware.js
│   └── admin.middleware.js
├── utils/              # 유틸리티 함수
│   └── jwt.util.js
├── scripts/            # DB 스크립트
│   └── schema.sql
├── .env                # 환경 변수
├── package.json
└── index.js            # 서버 진입점
```



