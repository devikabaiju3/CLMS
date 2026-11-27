// Community Learning Center Management - Simple Beginner JavaScript

const DATA_KEY = "clc_data_v1";
const USER_KEY = "clc_user_v1";

// Fixed demo accounts for the 3 roles (Admin, Instructor, Learner)
const DEMO_USERS = [
  { username: "admin", password: "admin123", role: "admin", name: "Center Coordinator", linkedId: "" },
  { username: "instructor1", password: "inst123", role: "instructor", name: "Ms. Ananya Rao", linkedId: "inst-1" },
  { username: "learner1", password: "learn123", role: "learner", name: "Aarav Mehta", linkedId: "lrn-1" }
];

// Starter sample data so the portal works right away
const DEFAULT_DATA = {
  instructors: [
    { id: "inst-1", name: "Ms. Ananya Rao", email: "ananya@clc.org", phone: "9876501001", specialty: "English" },
    { id: "inst-2", name: "Mr. Vikram Nair", email: "vikram@clc.org", phone: "9876501002", specialty: "Math & Coding" }
  ],
  learners: [
    { id: "lrn-1", name: "Aarav Mehta", email: "aarav@mail.com", phone: "9876543210", address: "Sector 5" },
    { id: "lrn-2", name: "Diya Sharma", email: "diya@mail.com", phone: "9876543211", address: "Green Park" },
    { id: "lrn-3", name: "Rohan Verma", email: "rohan@mail.com", phone: "9876543212", address: "Lake View" }
  ],
  classes: [
    { id: "cls-1", name: "Spoken English", subject: "English", instructorId: "inst-1", day: "Monday", time: "09:00 AM", room: "Room 101", capacity: 20, learnerIds: ["lrn-1", "lrn-2"] },
    { id: "cls-2", name: "Basic Coding", subject: "Coding", instructorId: "inst-2", day: "Wednesday", time: "10:30 AM", room: "Lab 1", capacity: 15, learnerIds: ["lrn-1", "lrn-3"] },
    { id: "cls-3", name: "Everyday Math", subject: "Math", instructorId: "inst-2", day: "Friday", time: "04:00 PM", room: "Room 102", capacity: 20, learnerIds: ["lrn-2", "lrn-3"] }
  ],
  attendance: [
    { classId: "cls-1", date: "2026-11-23", learnerId: "lrn-1", status: "present" },
    { classId: "cls-1", date: "2026-11-23", learnerId: "lrn-2", status: "late" },
    { classId: "cls-2", date: "2026-11-25", learnerId: "lrn-1", status: "present" },
    { classId: "cls-2", date: "2026-11-25", learnerId: "lrn-3", status: "absent" }
  ],
  progressNotes: [
    { classId: "cls-1", learnerId: "lrn-1", author: "Ms. Ananya Rao", rating: 5, comment: "Speaks clearly in group tasks.", date: "2026-11-24" },
    { classId: "cls-2", learnerId: "lrn-1", author: "Mr. Vikram Nair", rating: 4, comment: "Good progress with HTML and CSS.", date: "2026-11-25" }
  ],
  announcements: [
    { id: "ann-1", title: "Weekend Study Lab", target: "all", message: "Computer lab is open Saturday 10 AM to 2 PM.", author: "Center Coordinator", date: "2026-11-24" },
    { id: "ann-2", title: "Bring Practice Notebook", target: "cls-1", message: "Please bring your notebook on Monday.", author: "Ms. Ananya Rao", date: "2026-11-25" },
    { id: "ann-3", title: "Volunteer Meeting", target: "instructors", message: "Short instructor review after Friday class.", author: "Center Coordinator", date: "2026-11-26" }
  ]
};

let currentTab = "";

// ---------- 1. Small Helpers & LocalStorage ----------
function byId(id) {
  return document.getElementById(id);
}

function findById(list, id) {
  return list.find((item) => item.id === id);
}

// Escape special HTML characters so user text stays safe
function safeText(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function loadData() {
  const saved = localStorage.getItem(DATA_KEY);
  if (!saved) {
    const copy = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveData(copy);
    return copy;
  }
  return JSON.parse(saved);
}

function saveData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function resetDemoData() {
  if (!confirm("Reset all demo data back to default?")) return;
  saveData(JSON.parse(JSON.stringify(DEFAULT_DATA)));
  localStorage.removeItem(USER_KEY);
  currentTab = "";
  initPage();
  showToast("Demo data restored.", false);
}

function showToast(msg, isError) {
  const box = byId("toast-msg");
  if (!box) return;
  box.textContent = msg;
  box.className = isError ? "toast no-print err" : "toast no-print ok";
  box.style.display = "block";
  setTimeout(() => { box.style.display = "none"; }, 3000);
}

function getInstructorName(data, instId) {
  const inst = findById(data.instructors, instId);
  return inst ? inst.name : "Unassigned";
}

function calcAttendancePercent(records) {
  if (records.length === 0) return 0;
  const attended = records.filter((r) => r.status === "present" || r.status === "late").length;
  return Math.round((attended / records.length) * 100);
}

// ---------- 2. Login & Role-Based Access ----------
function getCurrentUser(data) {
  const uname = localStorage.getItem(USER_KEY);
  const found = DEMO_USERS.find((u) => u.username === uname);
  if (!found) return null;

  // Use updated learner name if learner edited their profile
  if (found.role === "learner") {
    const lrn = findById(data.learners, found.linkedId);
    if (lrn) {
      return {
        username: found.username,
        password: found.password,
        role: found.role,
        name: lrn.name,
        linkedId: found.linkedId
      };
    }
  }
  return found;
}

function handleLogin(event) {
  event.preventDefault();
  const uname = byId("login-username").value.trim().toLowerCase();
  const pwd = byId("login-password").value;
  const user = DEMO_USERS.find((u) => u.username === uname && u.password === pwd);

  if (!user) {
    showToast("Invalid username or password. Try a Quick Demo button.", true);
    return;
  }
  localStorage.setItem(USER_KEY, user.username);
  byId("login-form").reset();
  currentTab = "";
  initPage();
  showToast(`Signed in as ${user.name}.`, false);
}

function quickLogin(username) {
  const user = DEMO_USERS.find((u) => u.username === username);
  if (!user) return;
  localStorage.setItem(USER_KEY, user.username);
  currentTab = "";
  initPage();
  showToast(`Signed in as ${user.name} (${user.role}).`, false);
}

function logoutUser() {
  localStorage.removeItem(USER_KEY);
  currentTab = "";
  initPage();
  showToast("Signed out.", false);
}

// ---------- 3. Home Page ----------
function renderHome(data, user) {
  const tbody = byId("home-schedule-tbody");
  tbody.innerHTML = data.classes.length === 0
    ? '<tr><td colspan="7" class="empty-msg">No classes scheduled yet.</td></tr>'
    : data.classes.map((c) => `
      <tr>
        <td>${safeText(c.day)}</td>
        <td>${safeText(c.time)}</td>
        <td><strong>${safeText(c.name)}</strong></td>
        <td>${safeText(c.subject)}</td>
        <td>${safeText(getInstructorName(data, c.instructorId))}</td>
        <td>${safeText(c.room)}</td>
        <td>${c.learnerIds.length} / ${c.capacity}</td>
      </tr>`).join("");

  if (!user) return;
  byId("dash-greeting").textContent = `Welcome, ${user.name} (${user.role}).`;
  byId("stat-1-val").textContent = data.learners.length;
  byId("stat-2-val").textContent = data.instructors.length;
  byId("stat-3-val").textContent = data.classes.length;
  byId("stat-4-val").textContent = getVisibleNotices(data, user).length;

  if (user.role === "learner") {
    const lrn = findById(data.learners, user.linkedId);
    if (lrn) {
      byId("prof-name").value = lrn.name;
      byId("prof-email").value = lrn.email;
      byId("prof-phone").value = lrn.phone;
      byId("prof-address").value = lrn.address;
    }
  }
}

function saveLearnerProfile(event) {
  event.preventDefault();
  const data = loadData();
  const user = getCurrentUser(data);
  if (!user || user.role !== "learner") return;

  const lrn = findById(data.learners, user.linkedId);
  if (!lrn) return;
  lrn.name = byId("prof-name").value.trim();
  lrn.email = byId("prof-email").value.trim();
  lrn.phone = byId("prof-phone").value.trim();
  lrn.address = byId("prof-address").value.trim();

  saveData(data);
  initPage();
  showToast("Profile updated.", false);
}

// ---------- 4. Manage Page: Tabs, Learners, Instructors, Classes ----------
function showTab(tabName) {
  const user = getCurrentUser(loadData());
  if (!user) return;

  const allowed = user.role === "admin"
    ? ["learners", "classes", "attendance", "progress"]
    : user.role === "instructor" ? ["attendance", "progress"] : ["myrecords"];

  currentTab = allowed.includes(tabName) ? tabName : allowed[0];

  for (const btn of document.querySelectorAll(".tab-btn")) btn.classList.remove("active");
  for (const panel of document.querySelectorAll(".tab-panel")) panel.classList.remove("active");
  byId("tab-btn-" + currentTab).classList.add("active");
  byId("tab-" + currentTab).classList.add("active");
}

function renderManage(data, user) {
  if (!user) return;
  showTab(currentTab);

  if (user.role === "admin") {
    renderLearners();
    renderInstructors(data);
    renderClasses(data);
  }
  if (user.role === "admin" || user.role === "instructor") {
    const myClasses = user.role === "admin"
      ? data.classes
      : data.classes.filter((c) => c.instructorId === user.linkedId);

    const optionsHtml = myClasses.length === 0
      ? '<option value="">No assigned classes</option>'
      : myClasses.map((c) => `<option value="${safeText(c.id)}">${safeText(c.name)} (${safeText(c.day)})</option>`).join("");

    byId("att-class").innerHTML = optionsHtml;
    byId("prog-class").innerHTML = optionsHtml;
    if (!byId("att-date").value) byId("att-date").value = new Date().toISOString().slice(0, 10);

    renderAttendanceSheet();
    populateProgressLearners();
    renderProgressNotes(data);
  }
  if (user.role === "learner") {
    renderLearnerRecords(data, user);
  }
}

function saveLearner(event) {
  event.preventDefault();
  const data = loadData();
  data.learners.push({
    id: "lrn-" + Date.now(),
    name: byId("learner-name").value.trim(),
    email: byId("learner-email").value.trim(),
    phone: byId("learner-phone").value.trim(),
    address: byId("learner-address").value.trim()
  });
  saveData(data);
  byId("learner-form").reset();
  renderLearners();
  showToast("Learner registered.", false);
}

function deleteLearner(id) {
  const data = loadData();
  data.learners = data.learners.filter((l) => l.id !== id);
  data.attendance = data.attendance.filter((a) => a.learnerId !== id);
  data.progressNotes = data.progressNotes.filter((n) => n.learnerId !== id);
  for (const c of data.classes) c.learnerIds = c.learnerIds.filter((lid) => lid !== id);
  saveData(data);
  renderManage(data, getCurrentUser(data));
  showToast("Learner removed.", false);
}

function renderLearners() {
  const data = loadData();
  const query = (byId("learner-search").value || "").trim().toLowerCase();
  byId("learner-count").textContent = data.learners.length;

  const list = data.learners.filter((l) =>
    l.name.toLowerCase().includes(query) || l.email.toLowerCase().includes(query)
  );

  byId("learners-tbody").innerHTML = list.length === 0
    ? '<tr><td colspan="4" class="empty-msg">No learners found.</td></tr>'
    : list.map((l) => {
      const enrolled = data.classes.filter((c) => c.learnerIds.includes(l.id)).length;
      return `
        <tr>
          <td><strong>${safeText(l.name)}</strong><span class="sub-text">${safeText(l.address)}</span></td>
          <td>${safeText(l.email)}<span class="sub-text">${safeText(l.phone)}</span></td>
          <td>${enrolled} class(es)</td>
          <td><button type="button" class="btn btn-sm btn-danger" onclick="deleteLearner('${safeText(l.id)}')">Delete</button></td>
        </tr>`;
    }).join("");
}

function saveInstructor(event) {
  event.preventDefault();
  const data = loadData();
  data.instructors.push({
    id: "inst-" + Date.now(),
    name: byId("inst-name").value.trim(),
    email: byId("inst-email").value.trim(),
    phone: byId("inst-phone").value.trim(),
    specialty: byId("inst-spec").value.trim()
  });
  saveData(data);
  byId("instructor-form").reset();
  renderInstructors(data);
  showToast("Volunteer instructor added.", false);
}

function renderInstructors(data) {
  byId("cls-instructor").innerHTML = data.instructors.map((i) =>
    `<option value="${safeText(i.id)}">${safeText(i.name)} (${safeText(i.specialty)})</option>`
  ).join("");

  byId("instructors-tbody").innerHTML = data.instructors.map((i) => {
    const count = data.classes.filter((c) => c.instructorId === i.id).length;
    return `<tr><td><strong>${safeText(i.name)}</strong></td><td>${safeText(i.specialty)}</td><td>${count}</td></tr>`;
  }).join("");
}

function saveClass(event) {
  event.preventDefault();
  const data = loadData();
  const instructorId = byId("cls-instructor").value;
  const day = byId("cls-day").value;
  const time = byId("cls-time").value;

  // Check if the same instructor already has a class at this day and time
  const clash = data.classes.find((c) => c.instructorId === instructorId && c.day === day && c.time === time);
  if (clash) {
    showToast(`Schedule clash! Instructor already teaches ${clash.name} on ${day} at ${time}.`, true);
    return;
  }

  data.classes.push({
    id: "cls-" + Date.now(),
    name: byId("cls-name").value.trim(),
    subject: byId("cls-subject").value.trim(),
    instructorId: instructorId,
    day: day,
    time: time,
    room: byId("cls-room").value.trim(),
    capacity: Number(byId("cls-capacity").value),
    learnerIds: []
  });
  saveData(data);
  byId("class-form").reset();
  byId("cls-capacity").value = 20;
  renderManage(data, getCurrentUser(data));
  showToast("Class created.", false);
}

function renderClasses(data) {
  byId("classes-tbody").innerHTML = data.classes.length === 0
    ? '<tr><td colspan="5" class="empty-msg">No classes created yet.</td></tr>'
    : data.classes.map((c) => `
      <tr>
        <td><strong>${safeText(c.name)}</strong><span class="sub-text">${safeText(c.subject)}</span></td>
        <td>${safeText(c.day)} &bull; ${safeText(c.time)} (${safeText(c.room)})</td>
        <td>${safeText(getInstructorName(data, c.instructorId))}</td>
        <td>${c.learnerIds.length} / ${c.capacity}</td>
        <td>
          <div class="btn-row">
            <button type="button" class="btn btn-sm btn-outline" onclick="openEnrollPanel('${safeText(c.id)}')">Enroll</button>
            <button type="button" class="btn btn-sm btn-danger" onclick="deleteClass('${safeText(c.id)}')">Delete</button>
          </div>
        </td>
      </tr>`).join("");
}

function openEnrollPanel(classId) {
  const data = loadData();
  const cls = findById(data.classes, classId);
  if (!cls) return;

  byId("enroll-class-id").value = cls.id;
  byId("enroll-class-title").textContent = `Enroll Learners — ${cls.name} (Max ${cls.capacity})`;
  byId("enroll-checkboxes").innerHTML = data.learners.map((l) => `
    <label class="check-item">
      <input type="checkbox" value="${safeText(l.id)}" ${cls.learnerIds.includes(l.id) ? "checked" : ""}>
      <span>${safeText(l.name)}</span>
    </label>`).join("");
  byId("enroll-panel").style.display = "block";
}

function closeEnrollPanel() {
  byId("enroll-panel").style.display = "none";
}

function saveEnrollment() {
  const data = loadData();
  const cls = findById(data.classes, byId("enroll-class-id").value);
  if (!cls) return;

  const selected = [];
  for (const box of document.querySelectorAll('#enroll-checkboxes input[type="checkbox"]:checked')) {
    selected.push(box.value);
  }
  if (selected.length > cls.capacity) {
    showToast(`Limit exceeded! Max capacity is ${cls.capacity}.`, true);
    return;
  }

  cls.learnerIds = selected;
  saveData(data);
  closeEnrollPanel();
  renderManage(data, getCurrentUser(data));
  showToast("Enrollment saved.", false);
}

function deleteClass(id) {
  const data = loadData();
  data.classes = data.classes.filter((c) => c.id !== id);
  data.attendance = data.attendance.filter((a) => a.classId !== id);
  data.progressNotes = data.progressNotes.filter((n) => n.classId !== id);
  saveData(data);
  closeEnrollPanel();
  renderManage(data, getCurrentUser(data));
  showToast("Class deleted.", false);
}

// ---------- 5. Attendance, Progress Notes & Learner Records ----------
function renderAttendanceSheet() {
  const data = loadData();
  const cls = findById(data.classes, byId("att-class").value);
  const date = byId("att-date").value;
  const tbody = byId("att-tbody");

  if (!cls) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty-msg">No class selected.</td></tr>';
    return;
  }

  const enrolled = data.learners.filter((l) => cls.learnerIds.includes(l.id));
  if (enrolled.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty-msg">No learners enrolled in this class.</td></tr>';
    return;
  }

  tbody.innerHTML = enrolled.map((l) => {
    const old = data.attendance.find((a) => a.classId === cls.id && a.date === date && a.learnerId === l.id);
    const st = old ? old.status : "present";
    return `
      <tr>
        <td><strong>${safeText(l.name)}</strong></td>
        <td>${safeText(l.phone)}</td>
        <td>
          <div class="radio-group">
            <label class="radio-pill"><input type="radio" name="att-${safeText(l.id)}" value="present" ${st === "present" ? "checked" : ""}> Present</label>
            <label class="radio-pill"><input type="radio" name="att-${safeText(l.id)}" value="late" ${st === "late" ? "checked" : ""}> Late</label>
            <label class="radio-pill"><input type="radio" name="att-${safeText(l.id)}" value="absent" ${st === "absent" ? "checked" : ""}> Absent</label>
          </div>
        </td>
      </tr>`;
  }).join("");
}

function saveAttendance() {
  const data = loadData();
  const cls = findById(data.classes, byId("att-class").value);
  const date = byId("att-date").value;
  if (!cls || !date || cls.learnerIds.length === 0) {
    showToast("Select a class with enrolled learners and a date.", true);
    return;
  }

  for (const lrnId of cls.learnerIds) {
    const chosen = document.querySelector(`input[name="att-${lrnId}"]:checked`);
    const status = chosen ? chosen.value : "present";
    const old = data.attendance.find((a) => a.classId === cls.id && a.date === date && a.learnerId === lrnId);
    if (old) old.status = status;
    else data.attendance.push({ classId: cls.id, date: date, learnerId: lrnId, status: status });
  }
  saveData(data);
  showToast(`Attendance saved for ${cls.name}.`, false);
}

function populateProgressLearners() {
  const data = loadData();
  const cls = findById(data.classes, byId("prog-class").value);
  const enrolled = cls ? data.learners.filter((l) => cls.learnerIds.includes(l.id)) : [];

  byId("prog-learner").innerHTML = enrolled.length === 0
    ? '<option value="">No enrolled learners</option>'
    : enrolled.map((l) => `<option value="${safeText(l.id)}">${safeText(l.name)}</option>`).join("");
}

function saveProgressNote(event) {
  event.preventDefault();
  const data = loadData();
  const user = getCurrentUser(data);
  const classId = byId("prog-class").value;
  const learnerId = byId("prog-learner").value;
  if (!classId || !learnerId) {
    showToast("Select a class with enrolled learners first.", true);
    return;
  }

  data.progressNotes.unshift({
    classId: classId,
    learnerId: learnerId,
    author: user.name,
    rating: Number(byId("prog-rating").value),
    comment: byId("prog-comment").value.trim(),
    date: new Date().toISOString().slice(0, 10)
  });
  saveData(data);
  byId("prog-comment").value = "";
  renderProgressNotes(data);
  showToast("Progress note saved.", false);
}

function renderProgressNotes(data) {
  byId("prog-list").innerHTML = data.progressNotes.length === 0
    ? '<p class="empty-msg">No progress notes yet.</p>'
    : data.progressNotes.map((n) => {
      const lrn = findById(data.learners, n.learnerId);
      const cls = findById(data.classes, n.classId);
      const stars = "★".repeat(n.rating) + "☆".repeat(5 - n.rating);
      return `
        <div class="feed-item">
          <div class="feed-top"><strong>${safeText(lrn ? lrn.name : "Learner")} &bull; ${safeText(cls ? cls.name : "Class")}</strong><span class="stars">${stars}</span></div>
          <p>${safeText(n.comment)}</p>
          <span class="sub-text">By ${safeText(n.author)} on ${safeText(n.date)}</span>
        </div>`;
    }).join("");
}

function renderLearnerRecords(data, user) {
  const myClasses = data.classes.filter((c) => c.learnerIds.includes(user.linkedId));
  byId("my-classes-list").innerHTML = myClasses.length === 0
    ? '<p class="empty-msg">Not enrolled in any class yet.</p>'
    : myClasses.map((c) => `
      <div class="feed-item">
        <div class="feed-top"><strong>${safeText(c.name)}</strong><span class="pill">${safeText(c.day)} &bull; ${safeText(c.time)}</span></div>
        <p class="muted">${safeText(c.room)} &bull; Instructor: ${safeText(getInstructorName(data, c.instructorId))}</p>
      </div>`).join("");

  const myNotes = data.progressNotes.filter((n) => n.learnerId === user.linkedId);
  byId("my-notes-list").innerHTML = myNotes.length === 0
    ? '<p class="empty-msg">No feedback notes yet.</p>'
    : myNotes.map((n) => {
      const cls = findById(data.classes, n.classId);
      return `
        <div class="feed-item">
          <div class="feed-top"><strong>${safeText(cls ? cls.name : "Class")}</strong><span class="stars">${"★".repeat(n.rating)}</span></div>
          <p>${safeText(n.comment)}</p>
          <span class="sub-text">By ${safeText(n.author)} on ${safeText(n.date)}</span>
        </div>`;
    }).join("");

  const myAtt = data.attendance.filter((a) => a.learnerId === user.linkedId);
  byId("my-att-tbody").innerHTML = myAtt.length === 0
    ? '<tr><td colspan="3" class="empty-msg">No attendance recorded yet.</td></tr>'
    : myAtt.map((a) => {
      const cls = findById(data.classes, a.classId);
      return `<tr><td>${safeText(a.date)}</td><td>${safeText(cls ? cls.name : "Class")}</td><td><span class="status-tag tag-${safeText(a.status)}">${safeText(a.status)}</span></td></tr>`;
    }).join("");
}

// ---------- 6. Announcements & Summary Reports ----------
function getVisibleNotices(data, user) {
  if (user.role === "admin") return data.announcements;
  const myClassIds = data.classes
    .filter((c) => (user.role === "instructor" ? c.instructorId === user.linkedId : c.learnerIds.includes(user.linkedId)))
    .map((c) => c.id);

  return data.announcements.filter((n) =>
    n.target === "all" ||
    (user.role === "instructor" && n.target === "instructors") ||
    (user.role === "learner" && n.target === "learners") ||
    myClassIds.includes(n.target)
  );
}

function saveAnnouncement(event) {
  event.preventDefault();
  const data = loadData();
  const user = getCurrentUser(data);
  if (!user || user.role === "learner") return;

  data.announcements.unshift({
    id: "ann-" + Date.now(),
    title: byId("notice-title").value.trim(),
    target: byId("notice-target").value,
    message: byId("notice-msg").value.trim(),
    author: user.name,
    date: new Date().toISOString().slice(0, 10)
  });
  saveData(data);
  byId("notice-form").reset();
  renderAnnouncements();
  showToast("Announcement published.", false);
}

function renderAnnouncements() {
  const data = loadData();
  const user = getCurrentUser(data);
  if (!user) return;

  const filter = byId("notice-filter").value;
  const visible = getVisibleNotices(data, user).filter((n) => filter === "all" || n.target === filter);

  byId("notices-list").innerHTML = visible.length === 0
    ? '<p class="empty-msg">No announcements to show.</p>'
    : visible.map((n) => {
      const cls = findById(data.classes, n.target);
      const label = n.target === "all" ? "All" : n.target === "learners" ? "Learners" : n.target === "instructors" ? "Instructors" : (cls ? cls.name : "Class");
      return `
        <div class="feed-item">
          <div class="feed-top"><strong>${safeText(n.title)}</strong><span class="pill">${safeText(label)}</span></div>
          <p>${safeText(n.message)}</p>
          <span class="sub-text">By ${safeText(n.author)} on ${safeText(n.date)}</span>
        </div>`;
    }).join("");
}

function drawBars(boxId, rows, accent) {
  byId(boxId).innerHTML = rows.map((row) => `
    <div>
      <div class="bar-row-head"><span>${safeText(row.label)}</span><span>${safeText(row.text)}</span></div>
      <div class="bar-track"><div class="${accent ? "bar-fill accent" : "bar-fill"}" style="width: ${Math.min(100, row.pct)}%"></div></div>
    </div>`).join("");
}

function renderReports(data, user) {
  if (!user) return;
  const classOptions = data.classes.map((c) => `<option value="${safeText(c.id)}">Class: ${safeText(c.name)}</option>`).join("");
  byId("notice-target").innerHTML = '<option value="all">All Center Members</option><option value="learners">All Learners</option><option value="instructors">Volunteer Instructors</option>' + classOptions;
  const instFilter = user.role !== "learner" ? '<option value="instructors">Instructors</option>' : "";
  byId("notice-filter").innerHTML = '<option value="all">All Visible Notices</option><option value="learners">Learners</option>' + instFilter + classOptions;
  renderAnnouncements();

  // Calculate top 4 KPI stats
  let capTotal = 0;
  for (const c of data.classes) capTotal += c.capacity > 0 ? (c.learnerIds.length / c.capacity) * 100 : 0;
  byId("rep-att-rate").textContent = calcAttendancePercent(data.attendance) + "%";
  byId("rep-sessions").textContent = data.attendance.length;
  byId("rep-avg-fill").textContent = (data.classes.length ? Math.round(capTotal / data.classes.length) : 0) + "%";
  byId("rep-notes-count").textContent = data.progressNotes.length;

  if (user.role === "learner") {
    const myAtt = data.attendance.filter((a) => a.learnerId === user.linkedId);
    byId("rep-my-summary").innerHTML = `<div class="feed-item"><strong>${safeText(user.name)}</strong> &bull; Attendance Rate: <strong>${calcAttendancePercent(myAtt)}%</strong> (${myAtt.length} recorded sessions)</div>`;
  }

  drawBars("rep-att-bars", data.classes.map((c) => {
    const pct = calcAttendancePercent(data.attendance.filter((a) => a.classId === c.id));
    return { label: c.name, text: pct + "%", pct: pct };
  }), false);

  drawBars("rep-strength-bars", data.classes.map((c) => {
    const pct = c.capacity > 0 ? Math.round((c.learnerIds.length / c.capacity) * 100) : 0;
    return { label: c.name, text: `${c.learnerIds.length} / ${c.capacity}`, pct: pct };
  }), true);

  if (user.role === "admin") {
    const maxCls = Math.max(1, data.classes.length);
    drawBars("rep-load-bars", data.instructors.map((i) => {
      const count = data.classes.filter((c) => c.instructorId === i.id).length;
      return { label: i.name, text: `${count} class(es)`, pct: Math.round((count / maxCls) * 100) };
    }), false);
  }
}

// ---------- 7. Initialize Current Page ----------
function initPage() {
  const data = loadData();
  const user = getCurrentUser(data);

  document.body.dataset.role = user ? user.role : "guest";
  byId("nav-user-badge").textContent = user ? user.role : "Guest";
  byId("nav-user-name").textContent = user ? user.name : "Not Signed In";

  if (byId("page-home")) renderHome(data, user);
  if (byId("page-manage")) renderManage(data, user);
  if (byId("page-reports")) renderReports(data, user);
}

document.addEventListener("DOMContentLoaded", initPage);
