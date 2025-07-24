import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from './firebase-app.js';

// DOM要素を取得
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const confirmPassword = document.getElementById('confirmPassword');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');

// フォームの切り替え
showRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});

showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// ログイン処理
loginBtn.addEventListener('click', async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    // ログイン成功後、メインページにリダイレクト
    window.location.href = 'index.html';
  } catch (error) {
    loginError.textContent = getAuthErrorMessage(error.code);
  }
});

// 新規登録処理
registerBtn.addEventListener('click', async () => {
  if (registerPassword.value !== confirmPassword.value) {
    registerError.textContent = 'パスワードが一致しません';
    return;
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value);
    // 登録成功後、メインページにリダイレクト
    window.location.href = 'index.html';
  } catch (error) {
    registerError.textContent = getAuthErrorMessage(error.code);
  }
});

// 認証状態の監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    // 既にログインしている場合はメインページにリダイレクト
    window.location.href = 'index.html';
  }
});

// エラーメッセージを日本語に変換
const getAuthErrorMessage = (errorCode) => {
  const messages = {
    'auth/invalid-email': '無効なメールアドレスです',
    'auth/user-disabled': 'このアカウントは無効化されています',
    'auth/user-not-found': 'アカウントが見つかりません',
    'auth/wrong-password': 'パスワードが間違っています',
    'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
    'auth/operation-not-allowed': 'この操作は許可されていません',
    'auth/weak-password': 'パスワードが弱すぎます（6文字以上必要）'
  };
  return messages[errorCode] || 'エラーが発生しました';
};