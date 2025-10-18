# 커피 주문 앱

## 1. 프로젝트 개요

### 1.1 프로젝트명

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

## 2. 기술 스택
- 프론트엔드 : HTML, CSS, 리액트, 자바스크립트
- 백엔드 : Node.js, Express
- 데이터베이스 : PostgreSQL

## 3. 기본 사항
- 프론트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 메뉴는 커피와 스무디 메뉴만 있음

## 4. 화면별 상세 요구사항

### 4.1 주문하기 화면 (Order Screen)

#### 4.1.1 화면 구성
- **헤더 영역**: 브랜드명 "COZY"와 네비게이션 버튼 ("주문하기", "관리자")
- **상품 선택 영역**: 커피 메뉴 카드들이 가로로 배치
- **장바구니 영역**: 선택한 상품들과 총 금액, 주문 버튼

#### 4.1.2 헤더 영역 요구사항
- **브랜드명**: 왼쪽 상단에 "COZY" 표시 (다크 그린 테두리)
- **네비게이션**: 오른쪽 상단에 "주문하기", "관리자" 버튼 (다크 그린 테두리)
- **활성 상태**: 현재 화면인 "주문하기" 버튼은 하이라이트 처리

#### 4.1.3 상품 카드 요구사항
각 상품 카드는 다음 요소들을 포함:

**기본 정보**
- 상품 이미지 (플레이스홀더)
- 상품명 (예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼")
- 기본 가격 (예: "4,000원", "5,000원")
- 간단한 설명 ("간단한 설명...")

**커스터마이징 옵션**
- "샷 추가 (+500원)" 체크박스
- "시럽 추가 (+0원)" 체크박스

**액션 버튼**
- "담기" 버튼 (라이트 그레이 테두리)

#### 4.1.4 장바구니 영역 요구사항
- **제목**: "장바구니" 표시
- **상품 목록**: 
  - 상품명과 옵션 정보 (예: "아메리카노(ICE) (샷 추가) X 1")
  - 개별 가격 (예: "4,500원")
- **총 금액**: "총 금액" 라벨과 함께 총합 표시 (굵은 글씨)
- **주문 버튼**: "주문하기" 버튼 (라이트 그레이 테두리)

#### 4.1.5 기능 요구사항
- **상품 추가**: "담기" 버튼 클릭 시 선택된 옵션과 함께 장바구니에 추가
- **가격 계산**: 기본 가격 + 옵션 가격을 실시간으로 계산
- **수량 관리**: 동일 상품 추가 시 수량 증가
- **장바구니 업데이트**: 상품 추가/제거 시 총 금액 자동 업데이트
- **주문 처리**: "주문하기" 버튼 클릭 시 주문 완료 처리

#### 4.1.6 UI/UX 요구사항
- **반응형 디자인**: 다양한 화면 크기에 대응
- **직관적 인터페이스**: 사용자가 쉽게 이해할 수 있는 레이아웃
- **시각적 피드백**: 버튼 클릭, 상품 선택 시 적절한 피드백 제공
- **일관된 디자인**: 전체 화면에서 일관된 색상과 스타일 적용

### 4.2 관리자 화면 (Admin Screen)

#### 4.2.1 화면 구성
- **헤더 영역**: 브랜드명 "COZY"와 네비게이션 버튼 ("주문하기", "관리자")
- **관리자 대시보드**: 주문 현황 요약 정보
- **재고 현황**: 메뉴별 재고 수량 및 관리 기능
- **주문 현황**: 실시간 주문 목록 및 처리 기능

#### 4.2.2 헤더 영역 요구사항
- **브랜드명**: 왼쪽 상단에 "COZY" 표시 (다크 그린 테두리)
- **네비게이션**: 오른쪽 상단에 "주문하기", "관리자" 버튼 (다크 그린 테두리)
- **활성 상태**: 현재 화면인 "관리자" 버튼은 하이라이트 처리

#### 4.2.3 관리자 대시보드 요구사항
- **제목**: "관리자 대시보드" 표시
- **주문 현황 요약**: 
  - 총 주문 수
  - 주문 접수 수
  - 제조 중인 주문 수
  - 제조 완료된 주문 수
- **형식**: "총 주문 X / 주문 접수 X / 제조 중 X / 제조 완료 X"

#### 4.2.4 재고 현황 요구사항
- **제목**: "재고 현황" 표시
- **메뉴별 재고 카드**: 각 메뉴마다 개별 카드 제공
  - 메뉴명 (예: "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼")
  - 현재 재고 수량 (예: "10개")
  - 수량 조절 버튼: "+" 및 "-" 버튼
- **카드 스타일**: 라이트 그레이 배경, 다크 그레이 테두리

#### 4.2.5 주문 현황 요구사항
- **제목**: "주문 현황" 표시
- **주문 목록**: 각 주문마다 다음 정보 표시
  - 주문 시간 (예: "7월 31일 13:00")
  - 메뉴 및 수량 (예: "아메리카노(ICE) x 1")
  - 주문 금액 (예: "4,000원")
  - 액션 버튼: "주문 접수" 버튼
- **카드 스타일**: 라이트 그레이 배경, 다크 그레이 테두리

#### 4.2.6 기능 요구사항
- **재고 관리**: 
  - "+" 버튼으로 재고 수량 증가
  - "-" 버튼으로 재고 수량 감소
  - 실시간 재고 수량 업데이트
- **주문 처리**:
  - "주문 접수" 버튼으로 주문 상태 변경
  - 주문 상태별 필터링 기능
  - 주문 완료 처리
- **대시보드 업데이트**:
  - 주문 현황 실시간 업데이트
  - 재고 부족 알림 기능

#### 4.2.7 UI/UX 요구사항
- **반응형 디자인**: 다양한 화면 크기에 대응
- **직관적 인터페이스**: 관리자가 쉽게 파악할 수 있는 레이아웃
- **실시간 업데이트**: 주문 및 재고 상태 실시간 반영
- **시각적 구분**: 각 섹션별 명확한 구분선과 배경색
- **일관된 디자인**: 주문하기 화면과 일관된 색상 및 스타일

## 5. 백엔드 개발 요구사항

### 5.1 데이터 모델 설계

#### 5.1.1 Menus 테이블
메뉴 정보를 저장하는 테이블

**필드 구성:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 메뉴 고유 ID
- `name` (VARCHAR(100), NOT NULL): 메뉴 이름 (예: "아메리카노(ICE)")
- `description` (TEXT): 메뉴 설명
- `price` (INTEGER, NOT NULL): 기본 가격 (원 단위)
- `image_url` (VARCHAR(500)): 메뉴 이미지 URL
- `stock_quantity` (INTEGER, DEFAULT 0): 재고 수량
- `category` (VARCHAR(50)): 메뉴 카테고리 (예: "coffee", "smoothie")
- `is_available` (BOOLEAN, DEFAULT true): 판매 가능 여부
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 시간
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 수정 시간

#### 5.1.2 Options 테이블
메뉴 옵션 정보를 저장하는 테이블

**필드 구성:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 옵션 고유 ID
- `name` (VARCHAR(100), NOT NULL): 옵션 이름 (예: "샷 추가")
- `price` (INTEGER, DEFAULT 0): 옵션 추가 가격 (원 단위)
- `menu_id` (INTEGER, FOREIGN KEY): 연결된 메뉴 ID
- `is_available` (BOOLEAN, DEFAULT true): 옵션 사용 가능 여부
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 시간
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 수정 시간

#### 5.1.3 Orders 테이블
주문 정보를 저장하는 테이블

**필드 구성:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 주문 고유 ID
- `order_number` (VARCHAR(20), UNIQUE): 주문 번호 (예: "ORD-20240731-001")
- `order_time` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 주문 시간
- `status` (ENUM('received', 'preparing', 'completed', 'cancelled'), DEFAULT 'received'): 주문 상태
- `total_amount` (INTEGER, NOT NULL): 총 주문 금액
- `customer_name` (VARCHAR(100)): 고객 이름 (선택사항)
- `customer_phone` (VARCHAR(20)): 고객 전화번호 (선택사항)
- `notes` (TEXT): 특이사항 또는 요청사항
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 시간
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 수정 시간

#### 5.1.4 Order_Items 테이블
주문 상세 내역을 저장하는 테이블

**필드 구성:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 주문 아이템 고유 ID
- `order_id` (INTEGER, FOREIGN KEY): 주문 ID
- `menu_id` (INTEGER, FOREIGN KEY): 메뉴 ID
- `quantity` (INTEGER, NOT NULL): 주문 수량
- `unit_price` (INTEGER, NOT NULL): 단위 가격 (옵션 포함)
- `total_price` (INTEGER, NOT NULL): 아이템 총 가격
- `options` (JSON): 선택된 옵션 정보
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 시간

### 5.2 데이터 스키마를 위한 사용자 흐름

#### 5.2.1 메뉴 조회 및 표시 흐름
1. **프론트엔드**: 메뉴 목록 조회 API 호출
2. **백엔드**: Menus 테이블에서 `is_available = true`인 메뉴들을 조회
3. **백엔드**: 각 메뉴의 Options 테이블에서 사용 가능한 옵션들을 조회
4. **백엔드**: 메뉴 정보와 옵션 정보를 JSON 형태로 반환
5. **프론트엔드**: 받은 데이터를 화면에 표시
6. **관리자 화면**: 재고 수량(`stock_quantity`) 정보를 별도로 표시

#### 5.2.2 주문 처리 흐름
1. **사용자**: 장바구니에서 '주문하기' 버튼 클릭
2. **프론트엔드**: 주문 정보를 JSON 형태로 구성
3. **백엔드**: 주문 정보 유효성 검사
4. **백엔드**: 재고 수량 확인 및 차감
5. **백엔드**: Orders 테이블에 주문 정보 저장
6. **백엔드**: Order_Items 테이블에 주문 상세 내역 저장
7. **백엔드**: 주문 번호 생성 및 반환
8. **프론트엔드**: 주문 완료 메시지 표시

#### 5.2.3 주문 상태 관리 흐름
1. **관리자**: 관리자 화면에서 주문 목록 조회
2. **백엔드**: Orders 테이블에서 주문 목록 반환
3. **관리자**: '주문 접수' → '제조 중' → '완료' 버튼 클릭
4. **백엔드**: Orders 테이블의 `status` 필드 업데이트
5. **프론트엔드**: 실시간으로 주문 상태 반영

### 5.3 API 설계

#### 5.3.1 메뉴 관련 API

**GET /api/menus**
- **목적**: 사용 가능한 메뉴 목록 조회
- **응답 예시**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "description": "시원하고 깔끔한 아이스 아메리카노",
      "price": 4000,
      "image_url": "https://example.com/americano-ice.jpg",
      "stock_quantity": 10,
      "category": "coffee",
      "options": [
        {
          "id": 1,
          "name": "샷 추가",
          "price": 500
        },
        {
          "id": 2,
          "name": "시럽 추가",
          "price": 0
        }
      ]
    }
  ]
}
```

**GET /api/menus/inventory**
- **목적**: 관리자용 재고 정보 조회
- **응답 예시**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "stock_quantity": 10
    }
  ]
}
```

**PUT /api/menus/:id/inventory**
- **목적**: 재고 수량 수정
- **요청 본문**:
```json
{
  "stock_quantity": 15
}
```

#### 5.3.2 주문 관련 API

**POST /api/orders**
- **목적**: 새 주문 생성
- **요청 본문**:
```json
{
  "items": [
    {
      "menu_id": 1,
      "quantity": 2,
      "options": [
        {
          "option_id": 1,
          "name": "샷 추가",
          "price": 500
        }
      ]
    }
  ],
  "customer_name": "홍길동",
  "customer_phone": "010-1234-5678",
  "notes": "아이스 많이"
}
```
- **응답 예시**:
```json
{
  "success": true,
  "data": {
    "order_id": 123,
    "order_number": "ORD-20240731-001",
    "total_amount": 9000,
    "order_time": "2024-07-31T13:00:00Z"
  }
}
```

**GET /api/orders**
- **목적**: 주문 목록 조회 (관리자용)
- **쿼리 파라미터**: 
  - `status`: 주문 상태 필터 (received, preparing, completed, cancelled)
  - `limit`: 페이지당 항목 수 (기본값: 20)
  - `offset`: 페이지 오프셋 (기본값: 0)
- **응답 예시**:
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 123,
        "order_number": "ORD-20240731-001",
        "order_time": "2024-07-31T13:00:00Z",
        "status": "received",
        "total_amount": 9000,
        "customer_name": "홍길동",
        "items": [
          {
            "menu_name": "아메리카노(ICE)",
            "quantity": 2,
            "unit_price": 4500,
            "total_price": 9000,
            "options": ["샷 추가"]
          }
        ]
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0
  }
}
```

**GET /api/orders/:id**
- **목적**: 특정 주문 상세 정보 조회
- **응답 예시**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "order_number": "ORD-20240731-001",
    "order_time": "2024-07-31T13:00:00Z",
    "status": "received",
    "total_amount": 9000,
    "customer_name": "홍길동",
    "customer_phone": "010-1234-5678",
    "notes": "아이스 많이",
    "items": [
      {
        "menu_name": "아메리카노(ICE)",
        "quantity": 2,
        "unit_price": 4500,
        "total_price": 9000,
        "options": ["샷 추가"]
      }
    ]
  }
}
```

**PUT /api/orders/:id/status**
- **목적**: 주문 상태 변경
- **요청 본문**:
```json
{
  "status": "preparing"
}
```

#### 5.3.3 통계 관련 API

**GET /api/orders/stats**
- **목적**: 주문 통계 조회 (관리자 대시보드용)
- **응답 예시**:
```json
{
  "success": true,
  "data": {
    "total_orders": 150,
    "received_orders": 5,
    "preparing_orders": 3,
    "completed_orders": 140,
    "cancelled_orders": 2
  }
}
```

### 5.4 에러 처리 및 응답 형식

#### 5.4.1 표준 응답 형식
```json
{
  "success": true|false,
  "data": {},
  "message": "성공 메시지 또는 에러 메시지",
  "error_code": "ERROR_CODE" // 에러 시에만 포함
}
```

#### 5.4.2 주요 에러 코드
- `INVALID_REQUEST`: 잘못된 요청 데이터
- `MENU_NOT_FOUND`: 메뉴를 찾을 수 없음
- `INSUFFICIENT_STOCK`: 재고 부족
- `ORDER_NOT_FOUND`: 주문을 찾을 수 없음
- `INVALID_STATUS`: 잘못된 주문 상태
- `DATABASE_ERROR`: 데이터베이스 오류
- `INTERNAL_ERROR`: 서버 내부 오류

### 5.5 보안 및 검증 요구사항

#### 5.5.1 입력 데이터 검증
- 모든 숫자 필드: 양수만 허용
- 문자열 필드: 길이 제한 및 특수문자 검증
- 이메일/전화번호: 형식 검증
- JSON 데이터: 스키마 검증

#### 5.5.2 데이터베이스 제약조건
- 외래키 제약조건 설정
- 인덱스 최적화 (주문 시간, 메뉴 ID 등)
- 트랜잭션 처리 (주문 생성 시 재고 차감과 주문 저장)

#### 5.5.3 API 보안
- CORS 설정
- 요청 크기 제한
- SQL Injection 방지
- XSS 공격 방지
