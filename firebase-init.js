// Firebase 초기화 및 애널리틱스 연동 스크립트
// Firebase v10+ (모듈 방식)을 사용합니다.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";

// TODO: 아래 설정값을 본인의 Firebase 프로젝트 설정값으로 교체하세요.
// Firebase 콘솔 -> 프로젝트 설정 -> 내 앱(웹) 설정에서 확인 가능합니다.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-YOUR_MEASUREMENT_ID" // 애널리틱스를 위해 필수
};

// apiKey가 기본값이 아닐 때만 초기화하도록 안전장치 설정
if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    console.log("🔥 Firebase Analytics가 성공적으로 연결되었습니다!");
} else {
    console.warn("⚠️ Firebase Analytics 연동 대기 중: firebase-init.js 파일에 본인의 firebaseConfig를 입력해 주세요.");
}