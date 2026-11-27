/* =====================================================================
   Community Learning Center Management - JavaScript (Beginner Friendly)
   =====================================================================
   How this file is organized:
   1. Starter Demo Data & LocalStorage Helpers
   2. Small Helper Functions (IDs, HTML safety, Toast alerts, Selects)
   3. Login, Demo Switch & Role-Based Access
   4. Home Page (Stats, Schedule Table, Learner Profile Update)
   5. Manage Page - Learners & Instructors
   6. Manage Page - Classes, Clash Check & Learner Enrollment
   7. Manage Page - Attendance & Progress Notes
   8. Manage Page - Learner Personal Records
   9. Reports & Notices Page (Announcements, KPIs, Bar Reports)
   10. Page Initialization
   ===================================================================== */

const STORAGE_KEY = "clc_platform_data_v1";
const SESSION_KEY = "clc_current_user_v1";

// Fixed demo admin account (kept simple, no signup flow needed)
const ADMIN_ACCOUNT = {
  id: "admin-1",
  username: "admin",
  password: "admin123",
  role: "admin",
  name: "Center Coordinator"
};

// Used to sort the weekly schedule from Monday to Saturday
const DAY_ORDER = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
};

const TIME_ORDER = {
  "09:00 AM": 1,
  "10:30 AM": 2,
  "02:00 PM": 3,
  "04:00 PM": 4
};

// Starter data loaded on first visit or when clicking "Reset Demo Data"
const DEFAULT_DATA = {
  instructors: [
    {
      id: "inst-1",
      username: "instructor1",
      password: "inst123",
      name: "Ms. Ananya Rao",
      email: "ananya@clc.org",
      phone: "9876501001",
      specialty: "English & Communication"
    },
    {
      id: "inst-2",
      username: "instructor2",
      password: "inst123",
      name: "Mr. Vikram Nair",
      email: "vikram@clc.org",
      phone: "9876501002",
      specialty: "Mathematics & Coding"
    }
  ],
  learners: [
    {
      id: "lrn-1",
      username: "learner1",
      password: "learn123",
      name: "Aarav Mehta",
      email: "aarav@mail.com",
      phone: "9876543210",
      address: "Sector 5, City Center"
    },
    {
      id: "lrn-2",
      username: "learner2",
      password: "learn123",
      name: "Diya Sharma",
      email: "diya@mail.com",
      phone: "9876543211",
      address: "Green Park"
    },
    {
      id: "lrn-3",
      username: "learner3",
      password: "learn123",
      name: "Rohan Verma",
      email: "rohan@mail.com",
      phone: "9876543212",
      address: "Lake View"
    },
    {
      id: "lrn-4",
      username: "learner4",
      password: "learn123",
      name: "Meera Nair",
      email: "meera@mail.com",
      phone: "9876543213",
      address: "Station Road"
    }
  ],
  classes: [
    {
      id: "cls-1",
      name: "Spoken English Basics",
      subject: "English",
      instructorId: "inst-1",
      day: "Monday",
      time: "09:00 AM",
      room: "Room 101",
      capacity: 20,
      learnerIds: ["lrn-1", "lrn-2", "lrn-3"]
    },
    {
      id: "cls-2",
      name: "Basic Computer & Web",
      subject: "Coding",
      instructorId: "inst-2",
      day: "Wednesday",
      time: "10:30 AM",
      room: "Lab 1",
      capacity: 15,
      learnerIds: ["lrn-1", "lrn-4"]
    },
    {
      id: "cls-3",
      name: "Everyday Math Lab",
      subject: "Mathematics",
      instructorId: "inst-2",
      day: "Friday",
      time: "04:00 PM",
      room: "Room 102",
      capacity: 20,
      learnerIds: ["lrn-2", "lrn-3", "lrn-4"]
    }
  ],
  attendance: [
    { id: "att-1", classId: "cls-1", date: "2026-11-23", learnerId: "lrn-1", status: "present" },
    { id: "att-2", classId: "cls-1", date: "2026-11-23", learnerId: "lrn-2", status: "present" },
    { id: "att-3", classId: "cls-1", date: "2026-11-23", learnerId: "lrn-3", status: "late" },
    { id: "att-4", classId: "cls-2", date: "2026-11-25", learnerId: "lrn-1", status: "present" },
    { id: "att-5", classId: "cls-2", date: "2026-11-25", learnerId: "lrn-4", status: "absent" },
    { id: "att-6", classId: "cls-3", date: "2026-11-20", learnerId: "lrn-2", status: "present" },
    { id: "att-7", classId: "cls-3", date: "2026-11-20", learnerId: "lrn-3", status: "present" },
    { id: "att-8", classId: "cls-3", date: "2026-11-20", learnerId: "lrn-4", status: "present" }
  ],
  progressNotes: [
    {
      id: "note-1",
      classId: "cls-1",
      learnerId: "lrn-1",
      instructorName: "Ms. Ananya Rao",
      rating: 5,
      comment: "Speaks clearly during group activities and helps classmates.",
      date: "2026-11-24"
    },
    {
      id: "note-2",
      classId: "cls-2",
      learnerId: "lrn-1",
      instructorName: "Mr. Vikram Nair",
      rating: 4,
      comment: "Completed HTML layout practice cleanly; continue CSS spacing exercises.",
      date: "2026-11-25"
    },
    {
      id: "note-3",
      classId: "cls-3",
      learnerId: "lrn-2",
      instructorName: "Mr. Vikram Nair",
      rating: 5,
      comment: "Strong problem-solving speed in fraction and percentage worksheets.",
      date: "2026-11-21"
    }
  ],
  announcements: [
    {
      id: "ann-1",
      title: "Weekend Study Lab Open",
      target: "all",
      message: "The community library and computer lab will stay open this Saturday from 10:00 AM to 2:00 PM.",
      author: "Center Coordinator",
      authorUsername: "admin",
      date: "2026-11-24"
    },
    {
      id: "ann-2",
      title: "Bring Practice Notebooks",
      target: "cls-1",
      message: "Please bring your vocabulary notebook for Monday's speaking practice session.",
      author: "Ms. Ananya Rao",
      authorUsername: "instructor1",
      date: "2026-11-25"
    },
    {
      id: "ann-3",
      title: "Monthly Volunteer Check-In",
      target: "instructors",
      message: "Volunteer instructors will meet for 15 minutes after Friday classes to review attendance logs.",
      author: "Center Coordinator",
      authorUsername: "admin",
      date: "2026-11-26"
    }
  ]
};

let toastTimer = null;
let activeTabName = "";

/* =====================================================================
   1. LocalStorage Read / Write
   ===================================================================== */

// Make a clean copy of starter data so edits never mutate DEFAULT_DATA
function cloneDefaultData() {
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const freshData = cloneDefaultData();
    saveData(freshData);
    return freshData;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    const freshData = cloneDefaultData();
    saveData(freshData);
    return freshData;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetDemoData() {
  const confirmed = window.confirm("Reset all learners, classes, attendance, and notices back to starter demo data?");
  if (!confirmed) {
    return;
  }

  saveData(cloneDefaultData());
  localStorage.removeItem(SESSION_KEY);
  activeTabName = "";
  initPage();
  showToast("Demo data restored.", "ok");
}

/* =====================================================================
   2. Small Helper Functions
   ===================================================================== */

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

// Prevent HTML characters in user input from breaking table/card markup
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function findById(list, id) {
  return list.find(function (item) {
    return item.id === id;
  });
}

function createUniqueId(prefix) {
  return prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

// Create simple usernames like learner5 or instructor3 without duplicates
function createUniqueUsername(data, prefix) {
  let num = 1;
  while (true) {
    const candidate = prefix + num;
    const inInstructors = data.instructors.some(function (inst) {
      return inst.username === candidate;
    });
    const inLearners = data.learners.some(function (lrn) {
      return lrn.username === candidate;
    });
    if (candidate !== ADMIN_ACCOUNT.username && !inInstructors && !inLearners) {
      return candidate;
    }
    num = num + 1;
  }
}

function showToast(message, type) {
  const toast = document.getElementById("toast-msg");
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.className = type === "err" ? "toast no-print err" : "toast no-print ok";
  toast.style.display = "block";

  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(function () {
    toast.style.display = "none";
  }, 3500);
}

// Reusable helper to fill any <select> dropdown safely
function populateSelect(selectId, items, getValue, getLabel, emptyText) {
  const select = document.getElementById(selectId);
  if (!select) {
    return;
  }

  const previousValue = select.value;
  select.innerHTML = "";

  if (items.length === 0) {
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = emptyText;
    select.appendChild(emptyOption);
    return;
  }

  for (const item of items) {
    const option = document.createElement("option");
    option.value = getValue(item);
    option.textContent = getLabel(item);
    select.appendChild(option);
  }

  // Keep the previously selected value if it still exists
  const stillExists = items.some(function (item) {
    return getValue(item) === previousValue;
  });
  if (stillExists) {
    select.value = previousValue;
  }
}

function sortClassesBySchedule(classes) {
  return classes.slice().sort(function (a, b) {
    const dayDiff = (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99);
    if (dayDiff !== 0) {
      return dayDiff;
    }
    return (TIME_ORDER[a.time] || 99) - (TIME_ORDER[b.time] || 99);
  });
}

function getInstructorName(data, instructorId) {
  const instructor = findById(data.instructors, instructorId);
  return instructor ? instructor.name : "Unassigned";
}

function getAccessibleClasses(data, user) {
  if (!user) {
    return [];
  }
  if (user.role === "admin") {
    return sortClassesBySchedule(data.classes);
  }
  if (user.role === "instructor") {
    return sortClassesBySchedule(
      data.classes.filter(function (cls) {
        return cls.instructorId === user.id;
      })
    );
  }
  return sortClassesBySchedule(
    data.classes.filter(function (cls) {
      return cls.learnerIds.includes(user.id);
    })
  );
}

function getVisibleAnnouncements(data, user) {
  if (!user) {
    return [];
  }
  if (user.role === "admin") {
    return data.announcements;
  }

  const myClassIds = getAccessibleClasses(data, user).map(function (cls) {
    return cls.id;
  });

  return data.announcements.filter(function (notice) {
    if (notice.target === "all") {
      return true;
    }
    if (user.role === "instructor" && notice.target === "instructors") {
      return true;
    }
    if (user.role === "learner" && notice.target === "learners") {
      return true;
    }
    return myClassIds.includes(notice.target);
  });
}

function calculateAttendancePercent(records) {
  if (records.length === 0) {
    return 0;
  }
  const presentCount = records.filter(function (rec) {
    return rec.status === "present" || rec.status === "late";
  }).length;
  return Math.round((presentCount / records.length) * 100);
}

/* =====================================================================
   3. Login, Demo Switch & Role-Based Access
   ===================================================================== */

function findAccountByUsername(data, username) {
  const cleanName = String(username || "").trim().toLowerCase();
  if (cleanName === ADMIN_ACCOUNT.username) {
    return ADMIN_ACCOUNT;
  }

  for (const inst of data.instructors) {
    if (inst.username.toLowerCase() === cleanName) {
      return {
        id: inst.id,
        username: inst.username,
        password: inst.password,
        role: "instructor",
        name: inst.name
      };
    }
  }

  for (const lrn of data.learners) {
    if (lrn.username.toLowerCase() === cleanName) {
      return {
        id: lrn.id,
        username: lrn.username,
        password: lrn.password,
        role: "learner",
        name: lrn.name
      };
    }
  }

  return null;
}

function getCurrentUser(data) {
  const savedUsername = localStorage.getItem(SESSION_KEY);
  if (!savedUsername) {
    return null;
  }
  return findAccountByUsername(data, savedUsername);
}

function handleLogin(event) {
  event.preventDefault();
  const data = loadData();
  const usernameInput = document.getElementById("login-username").value.trim();
  const passwordInput = document.getElementById("login-password").value;

  const account = findAccountByUsername(data, usernameInput);
  if (!account || account.password !== passwordInput) {
    showToast("Invalid username or password. Try a Quick Demo button below.", "err");
    return;
  }

  localStorage.setItem(SESSION_KEY, account.username);
  document.getElementById("login-form").reset();
  activeTabName = "";
  initPage();
  showToast(`Signed in as ${account.name} (${account.role}).`, "ok");
}

function quickLogin(username) {
  const data = loadData();
  const account = findAccountByUsername(data, username);
  if (!account) {
    showToast("Demo account not found. Reset demo data if needed.", "err");
    return;
  }

  localStorage.setItem(SESSION_KEY, account.username);
  activeTabName = "";
  initPage();
  showToast(`Signed in as ${account.name} (${account.role}).`, "ok");
}

function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  activeTabName = "";
  initPage();
  showToast("Signed out.", "ok");
}

function updateTopbarAndRole(user) {
  const badge = document.getElementById("nav-user-badge");
  const nameEl = document.getElementById("nav-user-name");

  if (!user) {
    document.body.dataset.role = "guest";
    if (badge) badge.textContent = "Guest";
    if (nameEl) nameEl.textContent = "Not Signed In";
    return;
  }

  document.body.dataset.role = user.role;
  if (badge) badge.textContent = user.role;
  if (nameEl) nameEl.textContent = user.name;
}

/* =====================================================================
   4. Home Page (Stats, Schedule & Learner Contact Update)
   ===================================================================== */

function renderHomePage(data, user) {
  renderHomeSchedule(data);
  if (!user) {
    return;
  }

  const greeting = document.getElementById("dash-greeting");
  const visibleNotices = getVisibleAnnouncements(data, user);

  if (user.role === "admin") {
    greeting.textContent = `Signed in as ${user.name}. You have full center management access.`;
    setStatCard(1, data.learners.length, "Learners");
    setStatCard(2, data.instructors.length, "Volunteer Instructors");
    setStatCard(3, data.classes.length, "Active Classes");
    setStatCard(4, visibleNotices.length, "Announcements");
  } else if (user.role === "instructor") {
    const myClasses = getAccessibleClasses(data, user);
    const myLearnerIds = [];
    for (const cls of myClasses) {
      for (const lrnId of cls.learnerIds) {
        if (!myLearnerIds.includes(lrnId)) {
          myLearnerIds.push(lrnId);
        }
      }
    }
    const myClassIds = myClasses.map(function (cls) {
      return cls.id;
    });
    const myNotes = data.progressNotes.filter(function (note) {
      return myClassIds.includes(note.classId);
    });

    greeting.textContent = `Welcome, ${user.name}. Mark attendance and share learner progress notes.`;
    setStatCard(1, myClasses.length, "My Classes");
    setStatCard(2, myLearnerIds.length, "My Learners");
    setStatCard(3, myNotes.length, "Progress Notes");
    setStatCard(4, visibleNotices.length, "Visible Notices");
  } else {
    const myClasses = getAccessibleClasses(data, user);
    const myAttendance = data.attendance.filter(function (rec) {
      return rec.learnerId === user.id;
    });
    const myNotes = data.progressNotes.filter(function (note) {
      return note.learnerId === user.id;
    });
    const myRate = calculateAttendancePercent(myAttendance);

    greeting.textContent = `Welcome, ${user.name}. Check your schedule, attendance, and contact details.`;
    setStatCard(1, myClasses.length, "Enrolled Classes");
    setStatCard(2, myRate + "%", "My Attendance");
    setStatCard(3, myNotes.length, "Feedback Notes");
    setStatCard(4, visibleNotices.length, "Visible Notices");
    fillLearnerProfileForm(data, user.id);
  }
}

function setStatCard(index, value, label) {
  const valEl = document.getElementById("stat-" + index + "-val");
  const lblEl = document.getElementById("stat-" + index + "-lbl");
  if (valEl) valEl.textContent = value;
  if (lblEl) lblEl.textContent = label;
}

function renderHomeSchedule(data) {
  const tbody = document.getElementById("home-schedule-tbody");
  if (!tbody) {
    return;
  }

  const sorted = sortClassesBySchedule(data.classes);
  if (sorted.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">No classes scheduled yet.</td></tr>';
    return;
  }

  let html = "";
  for (const cls of sorted) {
    html += `
      <tr>
        <td>${escapeHtml(cls.day)}</td>
        <td>${escapeHtml(cls.time)}</td>
        <td><strong>${escapeHtml(cls.name)}</strong></td>
        <td>${escapeHtml(cls.subject)}</td>
        <td>${escapeHtml(getInstructorName(data, cls.instructorId))}</td>
        <td>${escapeHtml(cls.room)}</td>
        <td>${cls.learnerIds.length} / ${cls.capacity}</td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function fillLearnerProfileForm(data, learnerId) {
  const learner = findById(data.learners, learnerId);
  if (!learner) {
    return;
  }
  document.getElementById("prof-name").value = learner.name;
  document.getElementById("prof-email").value = learner.email;
  document.getElementById("prof-phone").value = learner.phone;
  document.getElementById("prof-address").value = learner.address;
}

function saveLearnerProfile(event) {
  event.preventDefault();
  const data = loadData();
  const user = getCurrentUser(data);
  if (!user || user.role !== "learner") {
    return;
  }

  const learner = findById(data.learners, user.id);
  if (!learner) {
    return;
  }

  learner.name = document.getElementById("prof-name").value.trim();
  learner.email = document.getElementById("prof-email").value.trim();
  learner.phone = document.getElementById("prof-phone").value.trim();
  learner.address = document.getElementById("prof-address").value.trim();

  saveData(data);
  initPage();
  showToast("Contact profile updated.", "ok");
}

/* =====================================================================
   5. Manage Page - Tabs, Learners & Volunteer Instructors
   ===================================================================== */

function getDefaultTabForRole(role) {
  if (role === "admin") return "learners";
  if (role === "instructor") return "attendance";
  if (role === "learner") return "myrecords";
  return "";
}

function isTabAllowedForRole(tabName, role) {
  if (role === "admin") {
    return ["learners", "classes", "attendance", "progress"].includes(tabName);
  }
  if (role === "instructor") {
    return ["attendance", "progress"].includes(tabName);
  }
  if (role === "learner") {
    return tabName === "myrecords";
  }
  return false;
}

function showTab(tabName) {
  const data = loadData();
  const user = getCurrentUser(data);
  if (!user) {
    return;
  }

  const targetTab = isTabAllowedForRole(tabName, user.role)
    ? tabName
    : getDefaultTabForRole(user.role);

  activeTabName = targetTab;

  const buttons = document.querySelectorAll(".tab-btn");
  for (const btn of buttons) {
    btn.classList.remove("active");
  }

  const panels = document.querySelectorAll(".tab-panel");
  for (const panel of panels) {
    panel.classList.remove("active");
  }

  const activeBtn = document.getElementById("tab-btn-" + targetTab);
  const activePanel = document.getElementById("tab-" + targetTab);
  if (activeBtn) activeBtn.classList.add("active");
  if (activePanel) activePanel.classList.add("active");
}

function renderManagePage(data, user) {
  if (!user) {
    return;
  }

  showTab(activeTabName || getDefaultTabForRole(user.role));

  if (user.role === "admin") {
    renderLearners();
    renderInstructors(data);
    renderClasses(data);
  }

  if (user.role === "admin" || user.role === "instructor") {
    const accessible = getAccessibleClasses(data, user);
    populateSelect(
      "att-class",
      accessible,
      function (cls) { return cls.id; },
      function (cls) { return `${cls.name} (${cls.day} ${cls.time})`; },
      "No assigned classes"
    );
    populateSelect(
      "prog-class",
      accessible,
      function (cls) { return cls.id; },
      function (cls) { return cls.name; },
      "No assigned classes"
    );

    const dateInput = document.getElementById("att-date");
    if (dateInput && !dateInput.value) {
      dateInput.value = getTodayDate();
    }

    renderAttendanceSheet();
    populateProgressLearners();
    renderProgressNotes(data, user);
  }

  if (user.role === "learner") {
    renderLearnerRecords(data, user);
  }
}

function saveLearner(event) {
  event.preventDefault();
  const data = loadData();
  const editId = document.getElementById("learner-edit-id").value;
  const name = document.getElementById("learner-name").value.trim();
  const email = document.getElementById("learner-email").value.trim();
  const phone = document.getElementById("learner-phone").value.trim();
  const address = document.getElementById("learner-address").value.trim();

  // Check duplicate email across other learners
  const duplicate = data.learners.some(function (lrn) {
    return lrn.email.toLowerCase() === email.toLowerCase() && lrn.id !== editId;
  });
  if (duplicate) {
    showToast("A learner with that email is already registered.", "err");
    return;
  }

  if (editId) {
    const existing = findById(data.learners, editId);
    if (!existing) {
      return;
    }
    existing.name = name;
    existing.email = email;
    existing.phone = phone;
    existing.address = address;
    showToast(`Updated learner ${name}.`, "ok");
  } else {
    const username = createUniqueUsername(data, "learner");
    data.learners.push({
      id: createUniqueId("lrn"),
      username: username,
      password: "learn123",
      name: name,
      email: email,
      phone: phone,
      address: address
    });
    showToast(`Registered ${name} (login: ${username} / learn123).`, "ok");
  }

  saveData(data);
  resetLearnerForm();
  renderManagePage(data, getCurrentUser(data));
}

function editLearner(learnerId) {
  const data = loadData();
  const learner = findById(data.learners, learnerId);
  if (!learner) {
    return;
  }

  document.getElementById("learner-edit-id").value = learner.id;
  document.getElementById("learner-name").value = learner.name;
  document.getElementById("learner-email").value = learner.email;
  document.getElementById("learner-phone").value = learner.phone;
  document.getElementById("learner-address").value = learner.address;
  document.getElementById("learner-form-heading").textContent = "Edit Learner Details";
}

function resetLearnerForm() {
  const form = document.getElementById("learner-form");
  if (form) form.reset();
  const editInput = document.getElementById("learner-edit-id");
  if (editInput) editInput.value = "";
  const heading = document.getElementById("learner-form-heading");
  if (heading) heading.textContent = "Register New Learner";
}

function deleteLearner(learnerId) {
  const data = loadData();
  const learner = findById(data.learners, learnerId);
  if (!learner) {
    return;
  }

  if (!window.confirm(`Remove learner ${learner.name}?`)) {
    return;
  }

  data.learners = data.learners.filter(function (lrn) {
    return lrn.id !== learnerId;
  });

  // Clean up enrollments, attendance, and progress notes for the removed learner
  for (const cls of data.classes) {
    cls.learnerIds = cls.learnerIds.filter(function (id) {
      return id !== learnerId;
    });
  }
  data.attendance = data.attendance.filter(function (rec) {
    return rec.learnerId !== learnerId;
  });
  data.progressNotes = data.progressNotes.filter(function (note) {
    return note.learnerId !== learnerId;
  });

  if (document.getElementById("learner-edit-id").value === learnerId) {
    resetLearnerForm();
  }

  saveData(data);
  renderManagePage(data, getCurrentUser(data));
  showToast(`Removed learner ${learner.name}.`, "ok");
}

function renderLearners() {
  const tbody = document.getElementById("learners-tbody");
  const countEl = document.getElementById("learner-count");
  const searchInput = document.getElementById("learner-search");
  if (!tbody || !countEl) {
    return;
  }

  const data = loadData();
  countEl.textContent = data.learners.length;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const filtered = data.learners.filter(function (lrn) {
    return (
      lrn.name.toLowerCase().includes(query) ||
      lrn.email.toLowerCase().includes(query) ||
      lrn.username.toLowerCase().includes(query)
    );
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-msg">No matching learners found.</td></tr>';
    return;
  }

  let html = "";
  for (const lrn of filtered) {
    const enrolledCount = data.classes.filter(function (cls) {
      return cls.learnerIds.includes(lrn.id);
    }).length;

    html += `
      <tr>
        <td>
          <strong>${escapeHtml(lrn.name)}</strong>
          <span class="sub-text">Login: ${escapeHtml(lrn.username)} / ${escapeHtml(lrn.password)}</span>
        </td>
        <td>
          ${escapeHtml(lrn.email)}
          <span class="sub-text">${escapeHtml(lrn.phone)} &bull; ${escapeHtml(lrn.address)}</span>
        </td>
        <td>${enrolledCount} class(es)</td>
        <td>
          <div class="btn-row">
            <button type="button" class="btn btn-sm btn-outline" onclick="editLearner('${escapeHtml(lrn.id)}')">Edit</button>
            <button type="button" class="btn btn-sm btn-danger" onclick="deleteLearner('${escapeHtml(lrn.id)}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function saveInstructor(event) {
  event.preventDefault();
  const data = loadData();
  const name = document.getElementById("inst-name").value.trim();
  const email = document.getElementById("inst-email").value.trim();
  const phone = document.getElementById("inst-phone").value.trim();
  const specialty = document.getElementById("inst-spec").value.trim();

  const duplicate = data.instructors.some(function (inst) {
    return inst.email.toLowerCase() === email.toLowerCase();
  });
  if (duplicate) {
    showToast("An instructor with that email already exists.", "err");
    return;
  }

  const username = createUniqueUsername(data, "instructor");
  data.instructors.push({
    id: createUniqueId("inst"),
    username: username,
    password: "inst123",
    name: name,
    email: email,
    phone: phone,
    specialty: specialty
  });

  saveData(data);
  document.getElementById("instructor-form").reset();
  renderInstructors(data);
  showToast(`Added volunteer instructor ${name} (login: ${username} / inst123).`, "ok");
}

function renderInstructors(data) {
  const tbody = document.getElementById("instructors-tbody");
  if (!tbody) {
    return;
  }

  populateSelect(
    "cls-instructor",
    data.instructors,
    function (inst) { return inst.id; },
    function (inst) { return `${inst.name} (${inst.specialty})`; },
    "Add an instructor first"
  );

  if (data.instructors.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty-msg">No volunteer instructors added yet.</td></tr>';
    return;
  }

  let html = "";
  for (const inst of data.instructors) {
    const classCount = data.classes.filter(function (cls) {
      return cls.instructorId === inst.id;
    }).length;

    html += `
      <tr>
        <td>
          <strong>${escapeHtml(inst.name)}</strong>
          <span class="sub-text">${escapeHtml(inst.username)} / ${escapeHtml(inst.password)}</span>
        </td>
        <td>${escapeHtml(inst.specialty)}</td>
        <td>${classCount}</td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

/* =====================================================================
   6. Manage Page - Classes, Schedule Clash Check & Enrollment
   ===================================================================== */

function saveClass(event) {
  event.preventDefault();
  const data = loadData();

  const name = document.getElementById("cls-name").value.trim();
  const subject = document.getElementById("cls-subject").value.trim();
  const instructorId = document.getElementById("cls-instructor").value;
  const day = document.getElementById("cls-day").value;
  const time = document.getElementById("cls-time").value;
  const room = document.getElementById("cls-room").value.trim();
  const capacity = Number(document.getElementById("cls-capacity").value);

  if (!instructorId) {
    showToast("Please add and select an instructor first.", "err");
    return;
  }

  // Prevent assigning the same instructor to two classes at the same day & time
  const instructorClash = data.classes.find(function (cls) {
    return cls.instructorId === instructorId && cls.day === day && cls.time === time;
  });
  if (instructorClash) {
    showToast(`Schedule clash: instructor already teaches "${instructorClash.name}" on ${day} at ${time}.`, "err");
    return;
  }

  // Prevent booking the same room twice at the same day & time
  const roomClash = data.classes.find(function (cls) {
    return cls.room.toLowerCase() === room.toLowerCase() && cls.day === day && cls.time === time;
  });
  if (roomClash) {
    showToast(`Room clash: ${room} is already booked on ${day} at ${time}.`, "err");
    return;
  }

  data.classes.push({
    id: createUniqueId("cls"),
    name: name,
    subject: subject,
    instructorId: instructorId,
    day: day,
    time: time,
    room: room,
    capacity: capacity,
    learnerIds: []
  });

  saveData(data);
  document.getElementById("class-form").reset();
  document.getElementById("cls-capacity").value = 20;
  renderManagePage(data, getCurrentUser(data));
  showToast(`Class "${name}" created.`, "ok");
}

function renderClasses(data) {
  const tbody = document.getElementById("classes-tbody");
  if (!tbody) {
    return;
  }

  const sorted = sortClassesBySchedule(data.classes);
  if (sorted.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">No classes created yet.</td></tr>';
    return;
  }

  let html = "";
  for (const cls of sorted) {
    html += `
      <tr>
        <td>
          <strong>${escapeHtml(cls.name)}</strong>
          <span class="sub-text">${escapeHtml(cls.subject)}</span>
        </td>
        <td>${escapeHtml(cls.day)} &bull; ${escapeHtml(cls.time)} (${escapeHtml(cls.room)})</td>
        <td>${escapeHtml(getInstructorName(data, cls.instructorId))}</td>
        <td>${cls.learnerIds.length} / ${cls.capacity}</td>
        <td>
          <div class="btn-row">
            <button type="button" class="btn btn-sm btn-outline" onclick="openEnrollPanel('${escapeHtml(cls.id)}')">Enroll</button>
            <button type="button" class="btn btn-sm btn-danger" onclick="deleteClass('${escapeHtml(cls.id)}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function openEnrollPanel(classId) {
  const data = loadData();
  const cls = findById(data.classes, classId);
  if (!cls) {
    return;
  }

  document.getElementById("enroll-class-id").value = cls.id;
  document.getElementById("enroll-class-title").textContent =
    `Enroll Learners in ${cls.name} (Capacity: ${cls.capacity})`;

  const box = document.getElementById("enroll-checkboxes");
  if (data.learners.length === 0) {
    box.innerHTML = '<p class="empty-msg">No registered learners yet.</p>';
  } else {
    let html = "";
    for (const lrn of data.learners) {
      const checkedAttr = cls.learnerIds.includes(lrn.id) ? "checked" : "";
      html += `
        <label class="check-item">
          <input type="checkbox" value="${escapeHtml(lrn.id)}" ${checkedAttr}>
          <span>${escapeHtml(lrn.name)}</span>
        </label>
      `;
    }
    box.innerHTML = html;
  }

  const panel = document.getElementById("enroll-panel");
  panel.style.display = "block";
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeEnrollPanel() {
  const panel = document.getElementById("enroll-panel");
  if (panel) {
    panel.style.display = "none";
  }
}

function saveEnrollment() {
  const data = loadData();
  const classId = document.getElementById("enroll-class-id").value;
  const cls = findById(data.classes, classId);
  if (!cls) {
    return;
  }

  const checkedBoxes = document.querySelectorAll('#enroll-checkboxes input[type="checkbox"]:checked');
  const selectedIds = [];
  for (const box of checkedBoxes) {
    selectedIds.push(box.value);
  }

  if (selectedIds.length > cls.capacity) {
    showToast(`Cannot enroll ${selectedIds.length} learners (max capacity is ${cls.capacity}).`, "err");
    return;
  }

  cls.learnerIds = selectedIds;
  saveData(data);
  closeEnrollPanel();
  renderManagePage(data, getCurrentUser(data));
  showToast(`Saved enrollment for ${cls.name} (${selectedIds.length} learners).`, "ok");
}

function deleteClass(classId) {
  const data = loadData();
  const cls = findById(data.classes, classId);
  if (!cls) {
    return;
  }

  if (!window.confirm(`Delete class "${cls.name}" and its attendance/notes?`)) {
    return;
  }

  data.classes = data.classes.filter(function (item) {
    return item.id !== classId;
  });
  data.attendance = data.attendance.filter(function (rec) {
    return rec.classId !== classId;
  });
  data.progressNotes = data.progressNotes.filter(function (note) {
    return note.classId !== classId;
  });

  if (document.getElementById("enroll-class-id").value === classId) {
    closeEnrollPanel();
  }

  saveData(data);
  renderManagePage(data, getCurrentUser(data));
  showToast(`Deleted class "${cls.name}".`, "ok");
}

/* =====================================================================
   7. Manage Page - Attendance & Progress Notes
   ===================================================================== */

function renderAttendanceSheet() {
  const tbody = document.getElementById("att-tbody");
  const classSelect = document.getElementById("att-class");
  const dateInput = document.getElementById("att-date");
  if (!tbody || !classSelect || !dateInput) {
    return;
  }

  const data = loadData();
  const classId = classSelect.value;
  const date = dateInput.value || getTodayDate();
  const cls = findById(data.classes, classId);

  if (!cls) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty-msg">No class available to mark attendance.</td></tr>';
    return;
  }

  const enrolledLearners = data.learners.filter(function (lrn) {
    return cls.learnerIds.includes(lrn.id);
  });

  if (enrolledLearners.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty-msg">No learners enrolled in this class yet.</td></tr>';
    return;
  }

  let html = "";
  for (const lrn of enrolledLearners) {
    const existing = data.attendance.find(function (rec) {
      return rec.classId === classId && rec.date === date && rec.learnerId === lrn.id;
    });
    const currentStatus = existing ? existing.status : "present";
    const radioName = "att-status-" + lrn.id;

    html += `
      <tr>
        <td><strong>${escapeHtml(lrn.name)}</strong></td>
        <td>${escapeHtml(lrn.phone)}</td>
        <td>
          <div class="radio-group">
            <label class="radio-pill">
              <input type="radio" name="${escapeHtml(radioName)}" value="present" ${currentStatus === "present" ? "checked" : ""}>
              Present
            </label>
            <label class="radio-pill">
              <input type="radio" name="${escapeHtml(radioName)}" value="late" ${currentStatus === "late" ? "checked" : ""}>
              Late
            </label>
            <label class="radio-pill">
              <input type="radio" name="${escapeHtml(radioName)}" value="absent" ${currentStatus === "absent" ? "checked" : ""}>
              Absent
            </label>
          </div>
        </td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function saveAttendance() {
  const data = loadData();
  const classId = document.getElementById("att-class").value;
  const date = document.getElementById("att-date").value;
  const cls = findById(data.classes, classId);

  if (!cls || !date) {
    showToast("Please select a class and date first.", "err");
    return;
  }

  const enrolledLearners = data.learners.filter(function (lrn) {
    return cls.learnerIds.includes(lrn.id);
  });
  if (enrolledLearners.length === 0) {
    showToast("No enrolled learners in this class to mark.", "err");
    return;
  }

  for (const lrn of enrolledLearners) {
    const checked = document.querySelector(`input[name="att-status-${lrn.id}"]:checked`);
    const status = checked ? checked.value : "present";

    const existing = data.attendance.find(function (rec) {
      return rec.classId === classId && rec.date === date && rec.learnerId === lrn.id;
    });

    if (existing) {
      existing.status = status;
    } else {
      data.attendance.push({
        id: createUniqueId("att"),
        classId: classId,
        date: date,
        learnerId: lrn.id,
        status: status
      });
    }
  }

  saveData(data);
  showToast(`Attendance saved for ${cls.name} (${date}).`, "ok");
}

function populateProgressLearners() {
  const classSelect = document.getElementById("prog-class");
  if (!classSelect) {
    return;
  }

  const data = loadData();
  const cls = findById(data.classes, classSelect.value);
  const enrolled = cls
    ? data.learners.filter(function (lrn) { return cls.learnerIds.includes(lrn.id); })
    : [];

  populateSelect(
    "prog-learner",
    enrolled,
    function (lrn) { return lrn.id; },
    function (lrn) { return lrn.name; },
    "No learners enrolled in this class"
  );
}

function saveProgressNote(event) {
  event.preventDefault();
  const data = loadData();
  const user = getCurrentUser(data);
  if (!user) {
    return;
  }

  const classId = document.getElementById("prog-class").value;
  const learnerId = document.getElementById("prog-learner").value;
  const rating = Number(document.getElementById("prog-rating").value);
  const comment = document.getElementById("prog-comment").value.trim();

  if (!classId || !learnerId) {
    showToast("Select a class with enrolled learners before saving a note.", "err");
    return;
  }

  const cls = findById(data.classes, classId);
  const authorName = user.role === "admin" && cls
    ? `${user.name} (${getInstructorName(data, cls.instructorId)})`
    : user.name;

  data.progressNotes.unshift({
    id: createUniqueId("note"),
    classId: classId,
    learnerId: learnerId,
    instructorName: authorName,
    rating: rating,
    comment: comment,
    date: getTodayDate()
  });

  saveData(data);
  document.getElementById("prog-comment").value = "";
  renderProgressNotes(data, user);
  showToast("Progress note saved.", "ok");
}

function renderProgressNotes(data, user) {
  const listEl = document.getElementById("prog-list");
  if (!listEl) {
    return;
  }

  const visibleClassIds = getAccessibleClasses(data, user).map(function (cls) {
    return cls.id;
  });

  const notes = user.role === "admin"
    ? data.progressNotes
    : data.progressNotes.filter(function (note) {
        return visibleClassIds.includes(note.classId);
      });

  if (notes.length === 0) {
    listEl.innerHTML = '<p class="empty-msg">No progress notes recorded yet.</p>';
    return;
  }

  let html = "";
  for (const note of notes) {
    const lrn = findById(data.learners, note.learnerId);
    const cls = findById(data.classes, note.classId);
    const stars = "★".repeat(note.rating) + "☆".repeat(5 - note.rating);

    html += `
      <div class="feed-item">
        <div class="feed-top">
          <strong>${escapeHtml(lrn ? lrn.name : "Learner")} &bull; ${escapeHtml(cls ? cls.name : "Class")}</strong>
          <span class="stars">${stars}</span>
        </div>
        <p>${escapeHtml(note.comment)}</p>
        <span class="sub-text">By ${escapeHtml(note.instructorName)} on ${escapeHtml(note.date)}</span>
      </div>
    `;
  }
  listEl.innerHTML = html;
}

/* =====================================================================
   8. Manage Page - Learner Personal Records
   ===================================================================== */

function renderLearnerRecords(data, user) {
  const myClassesEl = document.getElementById("my-classes-list");
  const myNotesEl = document.getElementById("my-notes-list");
  const myAttTbody = document.getElementById("my-att-tbody");
  if (!myClassesEl || !myNotesEl || !myAttTbody) {
    return;
  }

  const myClasses = getAccessibleClasses(data, user);
  if (myClasses.length === 0) {
    myClassesEl.innerHTML = '<p class="empty-msg">You are not enrolled in any classes yet.</p>';
  } else {
    let classesHtml = "";
    for (const cls of myClasses) {
      classesHtml += `
        <div class="feed-item">
          <div class="feed-top">
            <strong>${escapeHtml(cls.name)}</strong>
            <span class="pill">${escapeHtml(cls.day)} &bull; ${escapeHtml(cls.time)}</span>
          </div>
          <p class="muted">Subject: ${escapeHtml(cls.subject)} &bull; Room: ${escapeHtml(cls.room)}</p>
          <span class="sub-text">Instructor: ${escapeHtml(getInstructorName(data, cls.instructorId))}</span>
        </div>
      `;
    }
    myClassesEl.innerHTML = classesHtml;
  }

  const myNotes = data.progressNotes.filter(function (note) {
    return note.learnerId === user.id;
  });
  if (myNotes.length === 0) {
    myNotesEl.innerHTML = '<p class="empty-msg">No instructor progress feedback yet.</p>';
  } else {
    let notesHtml = "";
    for (const note of myNotes) {
      const cls = findById(data.classes, note.classId);
      const stars = "★".repeat(note.rating) + "☆".repeat(5 - note.rating);
      notesHtml += `
        <div class="feed-item">
          <div class="feed-top">
            <strong>${escapeHtml(cls ? cls.name : "Class")}</strong>
            <span class="stars">${stars}</span>
          </div>
          <p>${escapeHtml(note.comment)}</p>
          <span class="sub-text">By ${escapeHtml(note.instructorName)} on ${escapeHtml(note.date)}</span>
        </div>
      `;
    }
    myNotesEl.innerHTML = notesHtml;
  }

  const myAttendance = data.attendance
    .filter(function (rec) {
      return rec.learnerId === user.id;
    })
    .slice()
    .sort(function (a, b) {
      return b.date.localeCompare(a.date);
    });

  if (myAttendance.length === 0) {
    myAttTbody.innerHTML = '<tr><td colspan="3" class="empty-msg">No attendance recorded yet.</td></tr>';
  } else {
    let attHtml = "";
    for (const rec of myAttendance) {
      const cls = findById(data.classes, rec.classId);
      attHtml += `
        <tr>
          <td>${escapeHtml(rec.date)}</td>
          <td>${escapeHtml(cls ? cls.name : "Class")}</td>
          <td><span class="status-tag tag-${escapeHtml(rec.status)}">${escapeHtml(rec.status)}</span></td>
        </tr>
      `;
    }
    myAttTbody.innerHTML = attHtml;
  }
}

/* =====================================================================
   9. Reports & Notices Page
   ===================================================================== */

function getTargetLabel(data, target) {
  if (target === "all") return "All Center Members";
  if (target === "learners") return "All Learners";
  if (target === "instructors") return "Volunteer Instructors";
  const cls = findById(data.classes, target);
  return cls ? "Class: " + cls.name : "General Notice";
}

function populateNoticeDropdowns(data, user) {
  const targetOptions = [
    { value: "all", label: "All Center Members" },
    { value: "learners", label: "All Learners" }
  ];
  if (user.role === "admin") {
    targetOptions.push({ value: "instructors", label: "Volunteer Instructors" });
  }
  for (const cls of getAccessibleClasses(data, user)) {
    targetOptions.push({ value: cls.id, label: "Class: " + cls.name });
  }
  populateSelect(
    "notice-target",
    targetOptions,
    function (opt) { return opt.value; },
    function (opt) { return opt.label; },
    "All Center Members"
  );

  const filterOptions = [
    { value: "all", label: "All Visible Notices" },
    { value: "general", label: "Center-Wide Notices" },
    { value: "learners", label: "Learner Notices" }
  ];
  if (user.role !== "learner") {
    filterOptions.push({ value: "instructors", label: "Instructor Notices" });
  }
  for (const cls of getAccessibleClasses(data, user)) {
    filterOptions.push({ value: cls.id, label: "Class: " + cls.name });
  }
  populateSelect(
    "notice-filter",
    filterOptions,
    function (opt) { return opt.value; },
    function (opt) { return opt.label; },
    "All Visible Notices"
  );
}

function saveAnnouncement(event) {
  event.preventDefault();
  const data = loadData();
  const user = getCurrentUser(data);
  if (!user || user.role === "learner") {
    return;
  }

  const title = document.getElementById("notice-title").value.trim();
  const target = document.getElementById("notice-target").value;
  const message = document.getElementById("notice-msg").value.trim();

  data.announcements.unshift({
    id: createUniqueId("ann"),
    title: title,
    target: target,
    message: message,
    author: user.name,
    authorUsername: user.username,
    date: getTodayDate()
  });

  saveData(data);
  document.getElementById("notice-form").reset();
  renderAnnouncements();
  showToast("Announcement published.", "ok");
}

function deleteAnnouncement(noticeId) {
  const data = loadData();
  data.announcements = data.announcements.filter(function (item) {
    return item.id !== noticeId;
  });
  saveData(data);
  renderAnnouncements();
  showToast("Announcement removed.", "ok");
}

function renderAnnouncements() {
  const listEl = document.getElementById("notices-list");
  if (!listEl) {
    return;
  }

  const data = loadData();
  const user = getCurrentUser(data);
  if (!user) {
    return;
  }

  const filterVal = document.getElementById("notice-filter").value || "all";
  let visible = getVisibleAnnouncements(data, user);

  if (filterVal === "general") {
    visible = visible.filter(function (n) { return n.target === "all"; });
  } else if (filterVal !== "all") {
    visible = visible.filter(function (n) { return n.target === filterVal; });
  }

  if (visible.length === 0) {
    listEl.innerHTML = '<p class="empty-msg">No announcements match this filter.</p>';
    return;
  }

  let html = "";
  for (const notice of visible) {
    const canDelete = user.role === "admin" || notice.authorUsername === user.username;
    const deleteBtn = canDelete
      ? `<button type="button" class="btn btn-sm btn-danger no-print" onclick="deleteAnnouncement('${escapeHtml(notice.id)}')">Delete</button>`
      : "";

    html += `
      <div class="feed-item">
        <div class="feed-top">
          <strong>${escapeHtml(notice.title)}</strong>
          <span class="pill">${escapeHtml(getTargetLabel(data, notice.target))}</span>
        </div>
        <p>${escapeHtml(notice.message)}</p>
        <div class="feed-top section-gap-sm">
          <span class="sub-text">Posted by ${escapeHtml(notice.author)} on ${escapeHtml(notice.date)}</span>
          ${deleteBtn}
        </div>
      </div>
    `;
  }
  listEl.innerHTML = html;
}

// Reusable helper to draw horizontal CSS bar rows inside Reports cards
function renderProgressBars(containerId, items, emptyText) {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  if (items.length === 0) {
    container.innerHTML = `<p class="empty-msg">${escapeHtml(emptyText)}</p>`;
    return;
  }

  let html = "";
  for (const item of items) {
    const fillClass = item.accent ? "bar-fill accent" : "bar-fill";
    const widthPct = Math.min(100, Math.max(0, item.percent));
    html += `
      <div>
        <div class="bar-row-head">
          <span>${escapeHtml(item.label)}</span>
          <span>${escapeHtml(item.valueText)}</span>
        </div>
        <div class="bar-track">
          <div class="${fillClass}" style="width: ${widthPct}%"></div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

function renderReportsPage(data, user) {
  if (!user) {
    return;
  }

  populateNoticeDropdowns(data, user);
  renderAnnouncements();

  // Overall KPI metrics
  const totalRate = calculateAttendancePercent(data.attendance);
  let capacityPercentSum = 0;
  for (const cls of data.classes) {
    capacityPercentSum += cls.capacity > 0 ? (cls.learnerIds.length / cls.capacity) * 100 : 0;
  }
  const avgFill = data.classes.length > 0
    ? Math.round(capacityPercentSum / data.classes.length)
    : 0;

  document.getElementById("rep-att-rate").textContent = totalRate + "%";
  document.getElementById("rep-sessions").textContent = data.attendance.length;
  document.getElementById("rep-avg-fill").textContent = avgFill + "%";
  document.getElementById("rep-notes-count").textContent = data.progressNotes.length;

  // Learner personal summary
  if (user.role === "learner") {
    const summaryEl = document.getElementById("rep-my-summary");
    const myAtt = data.attendance.filter(function (rec) { return rec.learnerId === user.id; });
    const present = myAtt.filter(function (rec) { return rec.status === "present"; }).length;
    const late = myAtt.filter(function (rec) { return rec.status === "late"; }).length;
    const absent = myAtt.filter(function (rec) { return rec.status === "absent"; }).length;
    const myPct = calculateAttendancePercent(myAtt);

    summaryEl.innerHTML = `
      <div class="feed-item">
        <div class="feed-top">
          <strong>${escapeHtml(user.name)}</strong>
          <span class="pill">Overall Attendance: ${myPct}%</span>
        </div>
        <p class="muted">
          Total Records: ${myAtt.length} &bull; Present: ${present} &bull; Late: ${late} &bull; Absent: ${absent}
        </p>
      </div>
    `;
  }

  // Attendance % by Class bars
  const sortedClasses = sortClassesBySchedule(data.classes);
  const attBarItems = sortedClasses.map(function (cls) {
    const records = data.attendance.filter(function (rec) {
      return rec.classId === cls.id;
    });
    const pct = calculateAttendancePercent(records);
    return {
      label: cls.name,
      valueText: records.length > 0 ? `${pct}% (${records.length} logs)` : "No logs yet",
      percent: pct,
      accent: false
    };
  });
  renderProgressBars("rep-att-bars", attBarItems, "No classes available.");

  // Class Strength bars
  const strengthBarItems = sortedClasses.map(function (cls) {
    const pct = cls.capacity > 0 ? Math.round((cls.learnerIds.length / cls.capacity) * 100) : 0;
    return {
      label: cls.name,
      valueText: `${cls.learnerIds.length} / ${cls.capacity} (${pct}%)`,
      percent: pct,
      accent: true
    };
  });
  renderProgressBars("rep-strength-bars", strengthBarItems, "No classes available.");

  // Instructor Teaching Load bars (Admin only)
  if (user.role === "admin") {
    const maxClasses = Math.max(1, data.classes.length);
    const loadItems = data.instructors.map(function (inst) {
      const assigned = data.classes.filter(function (cls) {
        return cls.instructorId === inst.id;
      });
      let studentTotal = 0;
      for (const cls of assigned) {
        studentTotal += cls.learnerIds.length;
      }
      return {
        label: inst.name,
        valueText: `${assigned.length} class(es) \u2022 ${studentTotal} seat(s)`,
        percent: Math.round((assigned.length / maxClasses) * 100),
        accent: false
      };
    });
    renderProgressBars("rep-load-bars", loadItems, "No volunteer instructors added yet.");
  }
}

/* =====================================================================
   10. Page Initialization
   ===================================================================== */

function initPage() {
  const data = loadData();
  const user = getCurrentUser(data);
  updateTopbarAndRole(user);

  if (document.getElementById("page-home")) {
    renderHomePage(data, user);
  }
  if (document.getElementById("page-manage")) {
    renderManagePage(data, user);
  }
  if (document.getElementById("page-reports")) {
    renderReportsPage(data, user);
  }
}

document.addEventListener("DOMContentLoaded", initPage);
