# EiE 고려대학교 영어교육 프로그램 랜딩페이지

EiE 고려대학교 국제어학원의 가맹 상담을 위한 랜딩페이지입니다.

## 📁 프로젝트 구조

```
랜딩페이지/
├── 📄 index.html          # 메인 HTML 파일 (페이지 구조)
├── 📄 style.css           # 스타일시트 (디자인)
├── 📄 main.js             # JavaScript (상호작용 기능)
├── 📄 vite.config.js      # Vite 빌드 도구 설정
├── 📄 package.json        # npm 프로젝트 설정
├── 📄 package-lock.json   # npm 의존성 버전 잠금
├── 📄 .gitignore          # Git 제외 파일 목록
├── 📁 public/             # 정적 파일 (이미지 등)
│   └── 📁 assets/         # 이미지 리소스
│       ├── 📁 EIE로고/
│       ├── 📁 core-competency/
│       ├── 📁 고려대학교 사진/
│       ├── 📁 말하기대회 사진/
│       ├── 📁 원장단, 세미나 등/
│       ├── 📁 support/
│       ├── 📁 학원 사진/
│       └── 📁 홍보물/
└── 📁 node_modules/       # npm 패키지 (자동 생성)
```

## 📋 주요 파일 설명

### 핵심 파일 (반드시 필요)

#### `index.html`
- **역할**: 웹페이지의 HTML 구조
- **내용**: 
  - Hero 섹션 (메인 비주얼)
  - Intro 섹션 (브랜드 소개)
  - Core Competency (4가지 핵심 전략)
  - Franchise Support (가맹 지원)
  - Unique Strength (차별화 요소)
  - Process (개설 절차)
  - Consulting (상담 신청)

#### `style.css`
- **역할**: 웹페이지의 모든 디자인과 스타일
- **내용**:
  - 색상, 폰트, 레이아웃 정의
  - 반응형 디자인 (PC/모바일)
  - 애니메이션 효과

#### `main.js`
- **역할**: 페이지의 상호작용 기능
- **기능**:
  - 모바일 메뉴 토글
  - 스크롤 애니메이션 (요소가 화면에 나타날 때)

### 설정 파일

#### `package.json`
- **역할**: npm 프로젝트 설정 및 의존성 관리
- **내용**:
  - 프로젝트 이름: `eie-landing-page`
  - 개발 서버 실행 명령어: `npm run dev`
  - 빌드 명령어: `npm run build`
  - 필요 패키지: Vite (빌드 도구)

#### `vite.config.js`
- **역할**: Vite 빌드 도구 설정
- **용도**: 개발 서버 및 프로덕션 빌드 설정

#### `.gitignore`
- **역할**: Git 버전 관리에서 제외할 파일 목록
- **제외 항목**: node_modules, dist, 로그 파일 등

### 이미지 폴더 (`public/assets/`)

| 폴더명 | 용도 | 파일 수 |
|--------|------|---------|
| `EIE로고/` | 헤더 로고 | 1개 |
| `core-competency/` | 핵심 전략 섹션 이미지 | 4개 |
| `고려대학교 사진/` | Hero/Intro 배경 이미지 | 2개 |
| `말하기대회 사진/` | Strength 섹션 | 2개 |
| `원장단, 세미나 등/` | 커뮤니티 이미지 | 3개 |
| `support/` | 가맹 지원 항목 | 8개 |
| `학원 사진/` | 학원 현장 | 4개 |
| `홍보물/` | 홍보 포스터 | 5개 |

## 🚀 프로젝트 전달 방법

### 방법 1: 전체 폴더 압축 전달 (권장)

#### 전달할 파일 목록
```
✅ index.html
✅ style.css
✅ main.js
✅ vite.config.js
✅ package.json
✅ package-lock.json
✅ .gitignore
✅ public/ 폴더 전체
❌ node_modules/ (제외 - 자동 생성됨)
```

#### 압축 방법
1. `랜딩페이지` 폴더를 선택
2. 마우스 우클릭 → "압축" 또는 "보내기" → "ZIP 압축 파일"
3. `eie-landing-page.zip` 생성
4. **중요**: `node_modules` 폴더는 제외하고 압축하세요 (용량 절약)

### 방법 2: Git 저장소로 공유

```bash
# 프로젝트 폴더에서
git init
git add .
git commit -m "EiE 랜딩페이지 초기 버전"
git remote add origin <저장소 URL>
git push -u origin main
```

## 📦 설치 및 실행 가이드

프로젝트를 받은 사람이 실행하는 방법입니다.

### 사전 요구사항
- **Node.js** 설치 필요 (v16 이상 권장)
  - 다운로드: https://nodejs.org/

### 설치 및 실행 단계

```bash
# 1. 프로젝트 폴더로 이동
cd 랜딩페이지

# 2. 패키지 설치 (최초 1회만)
npm install

# 3. 개발 서버 실행
npm run dev
```

### 실행 후
- 브라우저에서 자동으로 열림 (보통 `http://localhost:5173`)
- 또는 터미널에 표시된 주소로 접속

### 프로덕션 빌드 (배포용)

```bash
# 빌드 실행
npm run build

# dist/ 폴더에 최적화된 파일 생성됨
# dist/ 폴더를 웹 호스팅 서비스에 업로드
```

## 🎯 프로젝트 특징

- ✅ **외부 의존성 없음**: 모든 이미지가 로컬에 저장
- ✅ **경량화**: Vite만 사용하여 빠른 빌드
- ✅ **반응형 디자인**: PC와 모바일 모두 최적화
- ✅ **스크롤 애니메이션**: 부드러운 UX
- ✅ **모바일 메뉴**: 햄버거 메뉴 지원

## 🛠️ 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션
- **JavaScript (ES6+)**: 모듈 시스템, Intersection Observer
- **Vite**: 빌드 도구 및 개발 서버
- **Google Fonts**: Noto Sans KR, Montserrat

## 📝 수정 가이드

### 텍스트 수정
- `index.html` 파일에서 원하는 텍스트 검색 후 수정

### 디자인 수정
- `style.css` 파일에서:
  - `:root` 섹션에서 색상 변경
  - 폰트 크기, 간격 등 조정

### 이미지 교체
- `public/assets/` 해당 폴더에 이미지 교체
- `index.html`에서 이미지 경로 확인

## 🌐 배포 방법

### Vercel (권장)
1. https://vercel.com 접속
2. GitHub 연동 또는 폴더 드래그 앤 드롭
3. 자동 빌드 및 배포

### Netlify
1. https://netlify.com 접속  
2. 프로젝트 폴더 드래그 앤 드롭
3. 빌드 명령어: `npm run build`
4. 배포 디렉토리: `dist`

### GitHub Pages
```bash
npm run build
# dist/ 폴더를 gh-pages 브랜치에 푸시
```

## 📞 문의

프로젝트 관련 문의사항이 있으시면 연락주세요.

---

**마지막 업데이트**: 2025-12-30  
**버전**: 1.0.0
