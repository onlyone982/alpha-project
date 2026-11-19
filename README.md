# alpha-project

motivation, arc season, self improvement journey

자기개발용 나만의 홈 대시보드. 기능 명세는 [SPEC.md](./SPEC.md)에 있습니다.

## 내 컴퓨터에서 실행하기

[Node.js](https://nodejs.org) LTS 버전이 설치돼 있어야 합니다. 터미널에서 순서대로 실행하세요.

```bash
git clone https://github.com/onlyone982/alpha-project.git
```

```bash
cd alpha-project
```

```bash
git checkout claude/fervent-maxwell-dtgqtg
```

```bash
npm install
```

```bash
npm run dev
```

브라우저에서 http://localhost:5173 을 엽니다.
Firebase 설정이 없어도 로그인 화면의 **"설정 없이 레이아웃 미리보기"** 버튼으로 화면을 볼 수 있습니다. (데이터 저장은 안 됨)

그 밖의 명령: `npm test`(단위 테스트), `npm run build`(배포용 빌드)

## Firebase 연결 (처음 한 번)

> **Storage(사진 저장)는 지금 켜지 않아도 됩니다.** 사진 기능은 6단계부터 쓰고,
> 새 프로젝트에서 Storage를 켜려면 Blaze 요금제가 필요해서 그때 따로 정합니다.

**1. 프로젝트 만들기**
[Firebase 콘솔](https://console.firebase.google.com) → 프로젝트 만들기. Google 애널리틱스는 꺼도 됩니다.

**2. Google 로그인 켜기**
왼쪽 메뉴 **빌드 → Authentication** → 시작하기 → 로그인 방법 탭 → **Google** → 사용 설정 → 지원 이메일 선택 → 저장

**3. Firestore 만들기**
왼쪽 메뉴 **빌드 → Firestore Database** → 데이터베이스 만들기
- 버전을 고르는 화면이 나오면 **Standard**
- 위치는 `asia-northeast3 (Seoul)`. 위치는 나중에 바꿀 수 없습니다.
- 보안 규칙은 **프로덕션 모드**로 시작 (아래 6번에서 내 규칙으로 바꿉니다)

**4. 웹 앱 등록하고 설정값 받기**
1. 왼쪽 위 **프로젝트 개요** 옆 ⚙ 톱니바퀴 → **프로젝트 설정**
2. **일반** 탭을 맨 아래로 스크롤 → **내 앱** 영역에서 `</>` 아이콘(웹) 클릭
   - 프로젝트를 막 만들었다면 **프로젝트 개요** 첫 화면의 "앱을 추가하여 시작하기" 아래 `</>` 아이콘도 같은 기능입니다
3. 앱 닉네임 입력 (예: `alpha-web`). "Firebase 호스팅도 설정"은 체크하지 않아도 됩니다 → **앱 등록**
4. "Firebase SDK 추가" 화면에 아래처럼 생긴 코드가 나옵니다. 이 값들을 복사하세요.
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "내프로젝트.firebaseapp.com",
     projectId: "내프로젝트",
     storageBucket: "내프로젝트.firebasestorage.app",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef..."
   };
   ```
   창을 닫았어도 다시 **프로젝트 설정 → 일반 → 내 앱**에서 앱을 고르고 "SDK 설정 및 구성"의 **구성**을 선택하면 볼 수 있습니다.

**5. `.env` 만들기**
프로젝트 폴더의 `.env.example`을 복사해서 이름을 `.env`로 바꾸고, 4번의 값을 그대로 옮깁니다. (따옴표 없이)
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=내프로젝트.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=내프로젝트
VITE_FIREBASE_STORAGE_BUCKET=내프로젝트.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef...
```
저장한 뒤 `npm run dev`를 껐다가 다시 켭니다. (Ctrl+C 후 다시 실행)

**6. 로그인하고 내 UID 등록하기**
1. http://localhost:5173 → **Google로 로그인** → 화면에 **내 UID**가 나옵니다 (복사 버튼 있음)
2. Firebase 콘솔 → **Firestore Database → 규칙** 탭
3. 이 저장소의 `firestore.rules` 내용을 전부 붙여넣고, `ALLOWED_UID`를 내 UID로 바꾼 뒤 **게시**
4. 앱을 새로고침하면 대시보드가 열립니다

내 컴퓨터의 `firestore.rules` 파일에서도 `ALLOWED_UID`를 같은 UID로 바꿔 두면 콘솔과 파일이 같아집니다.
(터미널로 배포하고 싶다면 `npx firebase-tools login` → `npx firebase-tools use --add` → `npx firebase-tools deploy --only firestore:rules`)

## 폴더 구조

```
src/
  auth/        로그인 상태 (AuthProvider, RequireAuth)
  components/  공용 화면 조각 (Hero, WidgetGrid)
  hooks/       React 훅 (useNow, useUserProfile)
  lib/         UI와 분리된 순수 로직 + Firebase (나중에 앱으로 옮길 때 재사용)
  pages/       페이지 (로그인, 대시보드, 위젯 상세, 접근 설정)
  widgets/     위젯 컴포넌트 + registry.ts (위치/순서 관리)
```

위젯 위치를 바꾸려면 `src/widgets/registry.ts`의 `desktop`(PC 칸)과 `mobileOrder`(모바일 순서)만 고치면 됩니다.
색은 `src/index.css` 맨 위의 `--arc-*` 변수에서 바꿉니다.
