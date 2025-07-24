/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------
----------------------------------------------------------------------------------
------------------JavaScriptでFirebase接続
----------------------------------------------------------------------------------
----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/



import {
  db,
  auth,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onAuthStateChanged,
} from "./firebase-app.js";

// DOM要素を取得
const projectForm = document.getElementById("projectForm");
const projectTableBody = document.getElementById("projectTableBody");
const loadingElement = document.getElementById("loading");
const updateBtn = document.getElementById("updateBtn");
const cancelBtn = document.getElementById("cancelBtn");

let editId = null;

// フォーム送信処理
projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (editId) {
    await updateProject(editId);
  } else {
    await addProject();
  }
});

// キャンセルボタンの処理
cancelBtn.addEventListener("click", () => {
  resetForm();
});

// 案件を追加する関数
const addProject = async () => {
  const projectData = getFormData();

  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      createdAt: new Date(),
      userId: auth.currentUser.uid,
    });
    console.log("Document written with ID: ", docRef.id);
    alert("案件が追加されました");
    resetForm();
    loadProjects();
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("エラーが発生しました: " + e.message);
  }
};

// フォームデータを取得する関数
const getFormData = () => {
  return {
    projectName: projectForm.projectName.value,
    domain: projectForm.domain.value,
    plan: projectForm.plan.value,
    amount: Number(projectForm.amount.value),
    orderDate: projectForm.orderDate.value,
    contractStart: projectForm.contractStart.value,
    contractEnd: projectForm.contractEnd.value,
    projectNotes: projectForm.projectNotes.value,
    clientName: projectForm.clientName.value,
    contactName: projectForm.contactName.value,
    phone: projectForm.phone.value,
    email: projectForm.email.value,
    clientNotes: projectForm.clientNotes.value,
    department: projectForm.department.value,
    storeName: projectForm.storeName.value,
    staffName: projectForm.staffName.value,
    staffNumber: projectForm.staffNumber.value,
    directorName: projectForm.directorName.value,
    staffNotes: projectForm.staffNotes.value,
    status: projectForm.status.value,
    deadline: projectForm.deadline.value,
  };
};

// フォームをリセットする関数
const resetForm = () => {
  projectForm.reset();
  editId = null;
  updateBtn.style.display = "none";
  cancelBtn.style.display = "none";
  projectForm.querySelector(".submit-btn").style.display = "block";
};

// 認証状態の監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ユーザーがログインしている場合
    loadProjects();
  } else {
    // ユーザーがログインしていない場合
    window.location.href = "login.html";
  }
});

// ログアウト機能を追加する場合
const addLogoutButton = () => {
  const header = document.querySelector('header');
  const logoutBtn = document.createElement('button');
  logoutBtn.id = 'logoutBtn';
  logoutBtn.textContent = 'ログアウト';
  logoutBtn.classList.add('logout-btn');
  header.appendChild(logoutBtn);
  
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      window.location.href = 'login.html';
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  });
};

// 初期化関数を更新
const initApp = () => {
  loadingElement.style.display = 'block';
  addLogoutButton();
};

window.addEventListener("DOMContentLoaded", initApp);


/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------
----------------------------------------------------------------------------------
------------------データ一覧表示
----------------------------------------------------------------------------------
----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/


// 案件を読み込む関数
const loadProjects = async () => {
  try {
    loadingElement.style.display = "block";
    projectTableBody.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects = [];

    querySnapshot.forEach((doc) => {
      // ログインユーザーの案件のみ表示
      if (doc.data().userId === auth.currentUser.uid) {
        projects.push({
          id: doc.id,
          ...doc.data(),
        });
      }
    });

    // 作成日順にソート
    projects.sort((a, b) => a.createdAt - b.createdAt);

    // テーブルに表示
    if (projects.length === 0) {
      projectTableBody.innerHTML =
        '<tr><td colspan="6">登録された案件がありません</td></tr>';
    } else {
      projects.forEach((project) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${project.domain || '-'}</td>
          <td>${project.clientName || '-'}</td>
          <td>${project.contactName || '-'}</td>
          <td>${project.directorName || '-'}</td>
          <td>${project.contractEnd || '-'}</td>
          <td>
            <button class="edit-btn" data-id="${project.id}">編集</button>
            <button class="delete-btn" data-id="${project.id}">削除</button>
          </td>
        `;

        projectTableBody.appendChild(row);
      });

      // 編集・削除ボタンのイベントを設定
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          editProject(e.target.dataset.id, projects);
        });
      });

      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          deleteProject(e.target.dataset.id);
        });
      });
    }
  } catch (error) {
    console.error("Error loading projects: ", error);
    alert("データの読み込み中にエラーが発生しました");
  } finally {
    loadingElement.style.display = "none";
  }
};

// ステータスを日本語に変換
const getStatusText = (status) => {
  const statusMap = {
    pending: "未着手",
    in_progress: "進行中",
    completed: "完了",
    canceled: "キャンセル",
  };
  return statusMap[status] || status;
};
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------
----------------------------------------------------------------------------------
------------------編集・削除機能の追加
----------------------------------------------------------------------------------
----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
// 案件を編集する関数
const editProject = (id, projects) => {
  const project = projects.find(p => p.id === id);
  if (!project) return;
  
  editId = id;
  
  // フォームにデータをセット
  projectForm.projectName.value = project.projectName || '';
  projectForm.domain.value = project.domain || '';
  projectForm.plan.value = project.plan || 'basic';
  projectForm.amount.value = project.amount || '';
  projectForm.orderDate.value = project.orderDate || '';
  projectForm.contractPeriod.value = project.contractPeriod || '';
  projectForm.projectNotes.value = project.projectNotes || '';
  projectForm.clientName.value = project.clientName || '';
  projectForm.contactName.value = project.contactName || '';
  projectForm.phone.value = project.phone || '';
  projectForm.email.value = project.email || '';
  projectForm.clientNotes.value = project.clientNotes || '';
  projectForm.department.value = project.department || '';
  projectForm.storeName.value = project.storeName || '';
  projectForm.staffName.value = project.staffName || '';
  projectForm.staffNumber.value = project.staffNumber || '';
  projectForm.directorName.value = project.directorName || '';
  projectForm.staffNotes.value = project.staffNotes || '';
  projectForm.status.value = project.status || 'pending';
  projectForm.deadline.value = project.deadline || '';
  
  // ボタンの表示を切り替え
  projectForm.querySelector('.submit-btn').style.display = 'none';
  updateBtn.style.display = 'inline-block';
  cancelBtn.style.display = 'inline-block';
  
  // フォームまでスクロール
  document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
};

// 案件を更新する関数
const updateProject = async (id) => {
  const projectData = getFormData();
  
  try {
    await updateDoc(doc(db, "projects", id), {
      ...projectData,
      updatedAt: new Date()
    });
    alert("案件が更新されました");
    resetForm();
    loadProjects();
  } catch (error) {
    console.error("Error updating document: ", error);
    alert("更新中にエラーが発生しました: " + error.message);
  }
};

// 案件を削除する関数
const deleteProject = async (id) => {
  if (!confirm("本当にこの案件を削除しますか？")) return;
  
  try {
    await deleteDoc(doc(db, "projects", id));
    alert("案件が削除されました");
    loadProjects();
  } catch (error) {
    console.error("Error deleting document: ", error);
    alert("削除中にエラーが発生しました: " + error.message);
  }
};

