# alpha-project

motivation, arc season, self improvement journey

자기개발용 나만의 홈 대시보드. 기능 명세는 [SPEC.md](./SPEC.md)에 있습니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 단위 테스트
npm run build    # 배포용 빌드 (dist/)
```

Firebase 설정이 없어도 개발 서버에서는 로그인 화면의 **"설정 없이 레이아웃 미리보기"** 버튼으로 화면을 볼 수 있습니다. (데이터 저장은 안 됨)

## Firebase 연결 (처음 한 번)

1. [Firebase 콘솔](https://console.firebase.google.com)에서 새 프로젝트 만들기
2. **Authentication** → 시작하기 → 로그인 방법에서 **Google** 사용 설정
3. **Firestore Database** 만들기 (위치: `asia-northeast3` 서울 권장)
4. **Storage** 시작하기
5. 프로젝트 설정 → 내 앱 → **웹 앱(</>) 추가** → 표시되는 설정값을 복사
6. `.env.example`을 `.env`로 복사하고 값을 채우기
7. Firebase CLI 로그인 후 이 폴더를 프로젝트에 연결
   ```bash
   npx firebase-tools login
   npx firebase-tools use --add
   ```
8. `npm run dev` → Google로 로그인 → 화면에 **내 UID**가 나옵니다
9. `firestore.rules`, `storage.rules`의 `ALLOWED_UID`를 내 UID로 바꾸고 규칙 배포
   ```bash
   npx firebase-tools deploy --only firestore:rules,storage
   ```
10. 새로고침하면 대시보드가 열립니다

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
