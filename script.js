// --- 1. KHAI BÁO CÁC PHẦN TỬ ---
const addBtn = document.getElementById("addBtn");
const taskNameInput = document.getElementById("taskNameInput");
const assigneeInput = document.getElementById("assigneeInput");
const todoList = document.getElementById("todo-list");
const lists = document.querySelectorAll(".task-list");
const searchInput = document.getElementById("searchInput");
const darkModeBtn = document.getElementById("darkModeBtn");

// --- 2. DARK MODE VỚI LOCAL STORAGE ---
// Kiểm tra khi vừa load trang
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  // Áp dụng dark mode nếu đã lưu trạng thái trước đó
}

// Xử lý khi bấm nút toggle
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode"),
  );
});

// --- 3. TÌM KIẾM CÔNG VIỆC  ---
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".task-card").forEach((card) => {
    // Chỉ lấy text nội dung, bỏ qua nút X
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(keyword) ? "block" : "none";
  });
});

// --- 4. HÀM DÙNG CHUNG: Gắn sự kiện Xóa và Kéo thả ---
function ganSuKien(card) {
  // A. Xóa có xác nhận
  const deleteBtn = card.querySelector(".delete-btn");
  if (deleteBtn) {
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm("Bạn có chắc muốn xóa công việc này?")) {
        card.remove();
      }
    };
  }

  // B. Bắt đầu kéo
  card.addEventListener("dragstart", () => {
    card.classList.add("dragging");
  });

  // C. Kết thúc kéo
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });
}

// --- 5. ÁP DỤNG CHO CÁC THẺ CŨ ---
const existingTasks = document.querySelectorAll(".task-card");
existingTasks.forEach((task) => {
  ganSuKien(task);
});

// --- 6. XỬ LÝ NÚT THÊM - CHỐNG LỖI XSS ---
addBtn.addEventListener("click", () => {
  const taskName = taskNameInput.value.trim();
  const assignee = assigneeInput.value.trim();

  if (taskName === "") {
    alert("Vui lòng nhập tên công việc!");
    return;
  }

  // Thay vì innerHTML, dùng createElement để chống mã độc
  const newTaskCard = document.createElement("div");
  newTaskCard.classList.add("task-card");
  newTaskCard.setAttribute("draggable", "true");

  const deleteSpan = document.createElement("span");
  deleteSpan.classList.add("delete-btn");
  deleteSpan.style.cssText =
    "float: right; cursor: pointer; color: red; font-weight: bold;";
  deleteSpan.textContent = "✖";

  const pTag = document.createElement("p");
  pTag.textContent = taskName;

  const smallTag = document.createElement("small");
  smallTag.textContent = `Người làm: ${assignee}`;

  // Lắp ráp các bộ phận vào thẻ
  newTaskCard.appendChild(deleteSpan);
  newTaskCard.appendChild(pTag);
  newTaskCard.appendChild(smallTag);

  // Gắn sự kiện và thả vào bảng
  ganSuKien(newTaskCard);
  todoList.appendChild(newTaskCard);

  // Dọn dẹp
  taskNameInput.value = "";
  assigneeInput.value = "";
});

// --- 7. KÉO THẢ THÔNG MINH - CHÈN VÀO GIỮA  ---
// Hàm phụ trợ: Tính toán vị trí thả dựa vào tọa độ chuột (Y)
function getDragAfterElement(list, y) {
  // Lấy tất cả thẻ đang nằm yên trong cột (không phải thẻ đang bị kéo)
  const draggableElements = [
    ...list.querySelectorAll(".task-card:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}

lists.forEach((list) => {
  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggingTask = document.querySelector(".dragging");

    if (draggingTask) {
      const afterElement = getDragAfterElement(list, e.clientY);
      // Nếu không tìm thấy vị trí chèn giữa -> thả vào cuối cột
      if (afterElement == null) {
        list.appendChild(draggingTask);
      } else {
        // Nếu tìm thấy vị trí -> chèn nó lên phía trên thẻ đó
        list.insertBefore(draggingTask, afterElement);
      }
    }
  });
});

// --- 8. LƯU DỮ LIỆU VÀO TRÌNH DUYỆT (LOCAL STORAGE) ---
function saveBoard() {
  const allTasks = []; // Tạo 1 cái balo rỗng để chứa dữ liệu

  // Đi kiển tra từng thẻ công việc trên bảng
  document.querySelectorAll(".task-card").forEach((card) => {
    const taskName = card.querySelector("p").textContent;
    const assignee = card
      .querySelector("small")
      .textContent.replace("Người làm: ", "");
    const columnID = card.parentElement.id; // Lấy id của cột hiện tại

    // Đẩy dữ liệu vào balo
    allTasks.push({
      name: taskName,
      assignee: assignee,
      column: columnID,
    });
  });

  // Khóa balo cất vào Local Storage
  localStorage.setItem("taskBoard", JSON.stringify(allTasks));
}
