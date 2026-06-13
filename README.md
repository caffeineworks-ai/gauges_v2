# Edge Measurement Tool

이미지 기반 필렛/챔퍼 치수 측정 및 감성어-수치 데이터 수집 도구.

제품 이미지에서 엣지 처리 수치를 측정하고, 디자인 인상 문장과 함께 Google Sheets에 누적 저장합니다. 수집된 데이터는 감성어-비율 임베딩 생성의 기초 데이터셋으로 사용됩니다.

---

## 구조

```
├── index.html       # 측정 도구 (GitHub Pages)
├── Code.gs          # Google Apps Script Web App (백엔드)
└── README.md
```

---

## 배포 방법

### 1. Apps Script Web App 설정

1. Google Sheets 새 파일 생성
2. 확장 프로그램 > Apps Script
3. `Code.gs` 내용 붙여넣기
4. 배포 > 새 배포 > 유형: **웹 앱**
   - 실행 대상: **나**
   - 액세스 권한: **모든 사용자**
5. 배포 URL 복사

> 시트 이름은 자동으로 `EdgeData`로 생성됩니다. 헤더 행도 자동 생성됩니다.

### 2. GitHub Pages 설정

1. 이 저장소를 fork 또는 clone
2. Settings > Pages > Branch: `main` / `/(root)` 설정
3. 배포된 URL로 접속

### 3. 도구 연결

1. 브라우저에서 GitHub Pages URL 접속
2. 상단 **Apps Script Web App URL** 입력
3. **Connect** 클릭

Web App URL은 브라우저 localStorage에 저장되어 다음 접속 시 자동 복원됩니다.

---

## 사용 방법

### 데이터 수집 흐름

```
이미지 URL 입력
    → Total 선 (빨강): 제품의 가장 좁은 실제 치수 기준으로 두 점 클릭
    → Part 선 (파랑): 측정할 필렛/챔퍼 부위에 두 점 클릭
    → Total Real Size 입력 (mm)
    → 비율 자동 계산 (Part / Total)
    → 메타데이터 입력 (브랜드, 카테고리, 제품명, 엣지 타입)
    → 영문 인상 문장 입력
    → Text Source URL 입력
    → Save to Sheets
```

### 측정 기준

- **Total Real Size**: 제품의 가장 좁은 치수 (mm) 입력
- **비율**: `추정 부분 크기 / 전체 크기` 로 자동 계산
- 클릭 시 가로/세로 방향 자동 보정 적용

### 레코드 관리

- **‹ ›** 버튼으로 저장된 레코드 탐색
- **Edit**: 선택 레코드를 폼에 불러와 수정
- **Delete**: 선택 레코드 삭제
- **↻ Refresh**: Sheets에서 최신 데이터 재로드

---

## 데이터 스키마

| 컬럼 | 설명 |
|------|------|
| Index | 타임스탬프 기반 고유 ID |
| Brand | 브랜드명 (예: Apple, Samsung) |
| Category | 제품 카테고리 (Mobile Device, Tablet, Laptop 등) |
| Product Name | 제품명 (예: iPhone 12) |
| Edge Type | Fillet / Chamfer |
| Total Real (mm) | 기준 치수 (가장 좁은 부분) |
| Part Est (mm) | 측정 부위 추정 치수 |
| Ratio | Part / Total 비율 |
| Description | 엣지 인상 영문 문장 |
| Text URL | 문장 출처 URL |
| Worker | 작업자 이름 |

---

## 데이터 수집 규칙

- 제품당 문장 최대 **2~3개**
- 문장은 **엣지/모서리 처리에 대한 인상**만 (가격, 성능, 기타 제외)
- 문장은 **영문**으로 입력
- Total 기준은 **제품의 가장 좁은 치수**로 통일
- 같은 제품의 중복 측정 시 부위가 다른 경우만 허용

---

## 후속 처리

수집된 CSV(Sheets 내보내기)는 Google Colab에서 임베딩 생성에 사용됩니다.

```
Ratio (수치) + Description (문장)
    → Sentence Embedding (sentence-transformers)
    → 수치-감성어 잠재공간 매핑
    → MCP 필렛/챔퍼 매핑 테이블 생성
```
---

## 기술 스택

- **Frontend**: Vanilla HTML/CSS/JS — GitHub Pages
- **Backend**: Google Apps Script Web App
- **Storage**: Google Sheets

https://script.google.com/macros/s/AKfycbyLfVkn9yAvha8LedvyhHABKb451eeSlrOCsx1iB986ybzXCLvl9r95XWFMumE4Y7s/exec
