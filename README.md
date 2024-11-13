## 📄 Service Introduction (ver2)
- 반려견의 삶과 건강에 매우 중요한 산책을 매일 할 수 있도록 동기부여하고 쉽게 기록할 수 있는 일기장 서비스입니다.
- 출석 도장, 로그인/아웃, 회원가입/탈퇴, 즐겨찾기, 정렬 등 다양한 기능을 사용할 수 있습니다.
- URL : https://new-walking-diary.netlify.app/
- 문서 (ver1) : https://www.notion.so/gombobbang/ee5a768d7569407dba2768e4d3042cba
<br />

## 🧰 Tech
<div>
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
  <img src="https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
  <img src="https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34">
  <img src="https://img.shields.io/badge/cloudianry-3448c5.svg?style=for-the-badge&logo=cloudinary&logoColor=white">
</div>
<br />

## 🗃️ Architecture
<pre>
  📦 walking-diary
 ┣ 📂public
 ┣ 📂src
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📜cloudinary.js
 ┃ ┃ ┗ 📜firebase.js
 ┃ ┣ 📂component
 ┃ ┃ ┣ 📂Alert
 ┃ ┃ ┣ 📂Button
 ┃ ┃ ┣ 📂DiaryFile
 ┃ ┃ ┣ 📂DiaryOptions
 ┃ ┃ ┣ 📂DiaryWriting
 ┃ ┃ ┣ 📂Header
 ┃ ┃ ┣ 📂Loading
 ┃ ┃ ┗ 📜ProtectedRoute.jsx
 ┃ ┣ 📂context
 ┃ ┃ ┣ 📜alertContext.jsx
 ┃ ┃ ┣ 📜submitContext.jsx
 ┃ ┃ ┗ 📜userContext.jsx
 ┃ ┣ 📂pages
 ┃ ┃ ┣ 📂Banner
 ┃ ┃ ┣ 📂Diaries
 ┃ ┃ ┣ 📂Diary
 ┃ ┃ ┣ 📂Join
 ┃ ┃ ┣ 📂Login
 ┃ ┃ ┗ 📂MyPage
 ┃ ┣ 📜App.js
 ┃ ┣ 📜index.css
 ┗ ┗ 📜index.js
</pre>
<br />

## 🧑🏻 Members
- 김보경
    - 기획 : 서비스 아이템 및 기능 선정, 기능별 요구 사항 정리, 스케줄 관리
    - 디자인 : 페이지별 시안 작업
    - 프론트엔드 : 마크업부터 동적 개발까지 담당
    - 백엔드 : Firebase api 기반 통신
<br />

## 💻  More about service
- 전체 페이지 스타일링, 모바일 기반 반응형 페이지 작업
- Firebase auth api 기반 회원 가입, 탈퇴, 로그인, 로그아웃 기능 구현
    - 통신 실패 시 적절한 경고창을 띄워 UX 개선
- Firebase realtime Database 기반 일기장 CRUD, 즐겨찾기, 출석 체크 기능 구현
    - 동일한 UI의 일기 확인, 쓰기, 수정 페이지는 컴포넌트를 재사용할 수 있도록 설계
    - TanStack Query를 사용하여 불필요한 데이터 재요청 방지
- Firebase realtime Database 기반 마이페이지 비밀번호, 반려견 이름 변경 기능 구현
- Memoization을 통해 데이터 정렬 기능을 작업하여 불필요한 반복 작업 최소화
<br />

<p align="center">
  <img src="https://res.cloudinary.com/dxm4cqfuw/image/upload/v1728306349/main.JPG_wwyea1.jpg" align="center" width="45%">
  <img src="https://res.cloudinary.com/dxm4cqfuw/image/upload/v1728306349/banner.JPG_lgxk6u.jpg" align="center" width="45%">
</p>
<p align="center">
  <img src="https://res.cloudinary.com/dxm4cqfuw/image/upload/v1728306349/join.JPG_wgjmdn.jpg" align="center" width="45%">
  <img src="https://res.cloudinary.com/dxm4cqfuw/image/upload/v1728306349/login.JPG_wppzzc.jpg" align="center" width="45%">
</p>
<p align="center">
  <img src="https://res.cloudinary.com/dxm4cqfuw/image/upload/v1728306349/mypage.JPG_s5qn1u.jpg" align="center" width="45%">
  <img src="https://res.cloudinary.com/dxm4cqfuw/image/upload/v1728306349/diaries.JPG_kligzz.jpg" align="center" width="45%">
</p>
<p align="center">
  <img src="https://res.cloudinary.com/dxm4cqfuw/image/upload/v1728306349/diary_read.JPG_hhcm3a.jpg" align="center" width="45%">
  <img src="https://res.cloudinary.com/dxm4cqfuw/image/upload/v1728306349/diary_write.JPG_m6jtoc.jpg" align="center" width="45%">
</p>
