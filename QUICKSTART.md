# EiE 랜딩페이지 빠른 시작 가이드

## 📦 전달받은 파일

이 프로젝트는 다음 파일들로 구성되어 있습니다:

```
✅ index.html           (메인 페이지)
✅ style.css            (디자인)
✅ main.js              (기능)
✅ vite.config.js       (설정)
✅ package.json         (프로젝트 정보)
✅ package-lock.json    (버전 잠금)
✅ public/              (이미지 폴더)
```

## ⚡ 3단계로 실행하기

### 1단계: Node.js 설치 확인

터미널(명령 프롬프트)을 열고 다음 명령어를 입력하세요:

```bash
node --version
```

- 버전이 표시되면 ✅ 설치됨
- 에러가 나면 ❌ https://nodejs.org 에서 다운로드 후 설치

### 2단계: 패키지 설치

프로젝트 폴더에서:

```bash
npm install
```

⏱️ 약 1-2분 소요 (인터넷 속도에 따라 다름)

### 3단계: 실행

```bash
npm run dev
```

🎉 브라우저가 자동으로 열립니다!  
(또는 `http://localhost:5173` 접속)

---

## 🚀 배포하기 (웹사이트로 올리기)

### 빌드 생성
```bash
npm run build
```

→ `dist/` 폴더가 생성됩니다.

### Vercel에 배포 (무료, 가장 쉬움)
1. https://vercel.com 접속
2. GitHub 계정으로 가입
3. 프로젝트 폴더 드래그 앤 드롭
4. 완료! 자동으로 URL 생성됨

---

## ❓ 자주 묻는 질문

**Q: npm install이 안돼요**  
A: Node.js를 먼저 설치하세요

**Q: 페이지가 안 열려요**  
A: 터미널에 표시된 주소 (http://localhost:XXXX)를 복사해서 브라우저에 붙여넣으세요

**Q: 이미지를 바꾸고 싶어요**  
A: `public/assets/` 폴더에서 해당 이미지를 교체하세요

**Q: 텍스트를 수정하고 싶어요**  
A: `index.html` 파일을 텍스트 에디터로 열어서 수정하세요

---

더 자세한 내용은 `README.md` 파일을 참고하세요.
