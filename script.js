// --- 1. KHAI BÁO CÁC PHẦN TỬ ---
const addBtn = document.getElementById("addBtn");
const taskNameInput = document.getElementById("taskNameInput");
const assigneeInput = document.getElementById("assigneeInput");
const todoList = document.getElementById("todo-list");
const lists = document.querySelectorAll(".task-list");
const searchInput = document.getElementById("searchInput");
const darkModeBtn = document.getElementById("darkModeBtn");

// --- 2. DARK MODE ---
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode"),
  );
});

// --- 3. TÌM KIẾM CÔNG VIỆC ---
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".task-card").forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(keyword) ? "block" : "none";
  });
});

// --- 4. HÀM GẮN SỰ KIỆN (XÓA & KÉO THẢ) ---
function ganSuKien(card) {
  const deleteBtn = card.querySelector(".delete-btn");
  if (deleteBtn) {
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm("Bạn có chắc muốn xóa công việc này?")) {
        card.remove();
        saveBoard(); // Ghi chép lại sau khi xóa
      }
    };
  }

  card.addEventListener("dragstart", () => card.classList.add("dragging"));
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    saveBoard(); // Ghi chép lại vị trí mới
  });
}

// --- 5. XƯỞNG ĐÚC THẺ (Tách hàm theo chuẩn DRY) ---
// Thay vì viết lặp lại, ta tạo một "xưởng" chuyên nặn thẻ
function createTaskCard(taskName, assignee) {
  const card = document.createElement("div");
  card.classList.add("task-card");
  card.setAttribute("draggable", "true");

  const deleteSpan = document.createElement("span");
  deleteSpan.classList.add("delete-btn");
  deleteSpan.style.cssText =
    "float: right; cursor: pointer; color: red; font-weight: bold;";
  deleteSpan.textContent = "✖";

  const pTag = document.createElement("p");
  pTag.textContent = taskName;

  const smallTag = document.createElement("small");
  smallTag.textContent = `Người làm: ${assignee}`;

  card.appendChild(deleteSpan);
  card.appendChild(pTag);
  card.appendChild(smallTag);
  card.dataset.name = taskName;
  card.dataset.assignee = assignee;

  ganSuKien(card); // Đưa đi huấn luyện luôn
  return card; // Trả về cái thẻ hoàn chỉnh
}

// --- 6. XỬ LÝ NÚT THÊM VIỆC ---
addBtn.addEventListener("click", () => {
  const taskName = taskNameInput.value.trim();
  const assignee = assigneeInput.value.trim();

  if (taskName === "") {
    alert("Vui lòng nhập tên công việc!");
    return;
  }

  // Chuyển đơn đặt hàng cho Xưởng đúc thẻ (Phần 5)
  const newTaskCard = createTaskCard(taskName, assignee);

  todoList.appendChild(newTaskCard);
  taskNameInput.value = "";
  assigneeInput.value = "";
  saveBoard(); // Ghi chép lại việc mới
});

// --- 7. KÉO THẢ THÔNG MINH ---
function getDragAfterElement(list, y) {
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
      if (afterElement == null) {
        list.appendChild(draggingTask);
      } else {
        list.insertBefore(draggingTask, afterElement);
      }
    }
  });
});

// --- 8. LƯU DỮ LIỆU ---
function saveBoard() {
  const allTasks = [];
  document.querySelectorAll(".task-card").forEach((card) => {
    const taskName = card.querySelector("p").textContent;
    const assignee = card
      .querySelector("small")
      .textContent.replace("Người làm: ", "");
    const columnID = card.parentElement.id;

    allTasks.push({ name: taskName, assignee: assignee, column: columnID });
  });
  localStorage.setItem("taskBoard", JSON.stringify(allTasks));
}

// --- 9. KHÔI PHỤC DỮ LIỆU ---
function loadBoard() {
  const savedData = localStorage.getItem("taskBoard");

  // XỬ LÝ NGOẠI LỆ: Nếu là người dùng mới tinh (két sắt trống)
  if (!savedData) {
    // Tìm cái thẻ viết sẵn trong HTML, dạy nó kéo thả, rồi lưu nó làm vốn liếng ban đầu!
    document.querySelectorAll(".task-card").forEach((card) => ganSuKien(card));
    saveBoard();
    return; // Dừng tại đây
  }

  // Nếu đã có dữ liệu cũ
  const allTasks = JSON.parse(savedData);
  document.querySelectorAll(".task-card").forEach((card) => card.remove()); // Dọn dẹp

  allTasks.forEach((task) => {
    // Lại nhờ Xưởng đúc thẻ (Phần 5) làm việc
    const newTaskCard = createTaskCard(task.name, task.assignee);
    const column = document.getElementById(task.column);
    if (column) {
      column.appendChild(newTaskCard);
    }
  });
}

// Khởi động
loadBoard();
