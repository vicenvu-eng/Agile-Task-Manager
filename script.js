// --- 1. KHAI BÁO CÁC PHẦN TỬ ---
const addBtn = document.getElementById("addBtn");
const taskNameInput = document.getElementById("taskNameInput");
const assigneeInput = document.getElementById("assigneeInput");
const todoList = document.getElementById("todo-list");
const lists = document.querySelectorAll(".task-list");

// --- 2. HÀM DÙNG CHUNG: Gắn sự kiện Xóa và Kéo thả cho 1 thẻ bất kỳ ---
function ganSuKien(card) {
  // A. Xử lý nút Xóa (Tìm nút xóa bên trong thẻ)
  const deleteBtn = card.querySelector(".delete-btn");
  if (deleteBtn) {
    deleteBtn.onclick = (e) => {
      e.stopPropagation(); // Ngăn lỗi nổi bọt sự kiện
      if (confirm("Bạn có chắc muốn xóa công việc này?")) {
        card.remove();
      }
    };
  }

  // B. Xử lý Kéo (dragstart)
  card.addEventListener("dragstart", () => {
    card.classList.add("dragging");
  });

  // C. Xử lý Thả xong (dragend)
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });
}

// --- 3. ÁP DỤNG CHO CÁC THẺ CŨ (Đã có sẵn trong HTML khi load trang) ---
const existingTasks = document.querySelectorAll(".task-card");
existingTasks.forEach((task) => {
  ganSuKien(task);
});

// --- 4. XỬ LÝ KHI NHẤN NÚT THÊM CÔNG VIỆC MỚI ---
addBtn.addEventListener("click", () => {
  const taskName = taskNameInput.value.trim();
  const assignee = assigneeInput.value.trim();

  if (taskName === "") {
    alert("Vui lòng nhập tên công việc!");
    return;
  }

  // Tạo thẻ div mới
  const newTaskCard = document.createElement("div");
  newTaskCard.classList.add("task-card");
  newTaskCard.setAttribute("draggable", "true");

  // Chèn HTML (Bắt buộc phải có thẻ span class="delete-btn" ở đây)
  newTaskCard.innerHTML = `
        <span class="delete-btn" style="float: right; cursor: pointer; color: red; font-weight: bold;">✖</span>
        <p>${taskName}</p>
        <small>Người làm: ${assignee}</small>
    `;

  // Gọi hàm gắn sự kiện cho thẻ mới này
  ganSuKien(newTaskCard);

  // Thêm vào danh sách và xóa ô nhập
  todoList.appendChild(newTaskCard);
  taskNameInput.value = "";
  assigneeInput.value = "";
});

// --- 5. XỬ LÝ KÉO LƯỚT QUA CÁC CỘT (DRAG OVER) ---
lists.forEach((list) => {
  list.addEventListener("dragover", (e) => {
    e.preventDefault(); // Cho phép thả thẻ vào
    const draggingTask = document.querySelector(".dragging");
    if (draggingTask) {
      list.appendChild(draggingTask);
    }
  });
});
