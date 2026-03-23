const BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/";

const PRIORITY_CONFIG = {
  urgent: {
    buttonColor: "rgb(255, 61, 0)",
    activeIcon: "/join/assets/img/urgent white.svg",
    defaultIcon: "/join/assets/img/urgent.svg",
  },
  medium: {
    buttonColor: "rgb(255, 168, 0)",
    activeIcon: "/join/assets/img/Capa 2 white.svg",
    defaultIcon: "/join/assets/img/Capa 2.svg",
  },
  low: {
    buttonColor: "rgb(122, 226, 41)",
    activeIcon: "/join/assets/img/low white.svg",
    defaultIcon: "/join/assets/img/low.svg",
  },
};

const state = {
  task: createEmptyTask(),
  taskMeta: {
    id: "",
    category: "",
    status: "",
  },
  preselectedAssignedNames: [],
  selectedContactColors: [],
  selectedContactIds: [],
  subtaskIdCounter: 0,
};

window.tasks = state.task;

function getElement(id) {
  return document.getElementById(id);
}

function initBoardCardEdit() {
  loadContacts();
  dropDown();
  setMinimumDate();
}

async function loadContacts() {
  try {
    const response = await fetch(`${BASE_URL}/contacts.json`);
    const contacts = await response.json();
    renderContacts(contacts || {});
  } catch (error) {
    console.error("Failed to load contacts", error);
  }
}

function getContactInitials(fullName) {
  const [firstName = "", lastName = ""] = fullName.split(" ");
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

function renderContacts(contactsById) {
  const contactContainer = getElement("all-contacts");
  const contactsImageContainer = getElement("contacts-imges");
  const assignedNames = getAssignedNamesFromCard();
  const contacts = Object.values(contactsById);
  const contactNames = contacts.map((contact) => contact?.nameIn || "Contact not found");
  const contactColors = contacts.map((contact) => contact?.color || "rgb(42, 54, 71)");

  contactContainer.innerHTML = "";
  contactsImageContainer.innerHTML = '<p class="amount d-none" id="over-amount"></p>';

  contacts.forEach((contact, index) => {
    const name = contactNames[index];
    const initials = getContactInitials(name);

    contactContainer.innerHTML += renderAssignedTo(contactNames, index, initials[0] || "", initials[1] || "", contactColors);
    contactsImageContainer.innerHTML += renderContactsImages(initials, index);

    if (assignedNames.includes(name)) {
      assignedToChecked(index, true);
    }
  });
}

function getAssignedNamesFromCard() {
  const rawAssignedNames = getElement("deliver-names")?.textContent || "";
  const assignedNames = rawAssignedNames
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  return assignedNames.length ? assignedNames : state.preselectedAssignedNames;
}

/**
 * Gets the task metadata required to update the correct Firebase record.
 *
 * @returns {{id: string, category: string, status: string}} The task metadata.
 */
function getTaskMetaFromCard() {
  const taskMeta = {
    category: getElement("deliver-category")?.textContent?.trim() || "",
    status: getElement("deliver-status")?.textContent?.trim() || "",
    id: getElement("deliver-cardId")?.textContent?.trim() || "",
  };

  return {
    id: taskMeta.id || state.taskMeta.id,
    category: taskMeta.category || state.taskMeta.category,
    status: taskMeta.status || state.taskMeta.status,
  };
}

/**
 * Stores immutable task metadata for the current edit session.
 *
 * @param {{id: string, category: string, status: string, assignedto?: string[]}} taskMeta - Metadata passed in from the board.
 */
function setEditTaskMeta(taskMeta) {
  state.taskMeta = {
    id: taskMeta?.id || "",
    category: taskMeta?.category || "",
    status: taskMeta?.status || "",
  };
  state.preselectedAssignedNames = Array.isArray(taskMeta?.assignedto) ? taskMeta.assignedto : [];
}

function inputTyping() {
  getElement("input-title").style.border = "";
  getElement("title-required").classList.add("d-none");
}

function getDescription() {
  state.task.description = getElement("text-area").value.trim();
}

function getDate() {
  const dateInput = getElement("input-date");
  state.task.date = dateInput.value;
  dateInput.style.border = "";
  getElement("date-required").classList.add("d-none");
}

function getSubtasks() {
  const subtaskItems = getElement("subtasklist").querySelectorAll("li");
  const subtasks = {};

  subtaskItems.forEach((item) => {
    const label = item.textContent.trim();
    if (label) {
      subtasks[label] = "inwork";
    }
  });

  state.task.subtask = subtasks;
}

function getTitle() {
  const titleInput = getElement("input-title");
  const title = titleInput.value.trim();

  if (!title) {
    titleInput.style.border = "1px solid rgb(248, 84, 103)";
    getElement("title-required").classList.remove("d-none");
    return;
  }

  state.task.title = title;
}

function selectedPrio(priority) {
  Object.entries(PRIORITY_CONFIG).forEach(([key, config]) => {
    const button = getElement(key);
    const icon = getElement(`${key}-img`);
    const isActive = key === priority;

    button.style.backgroundColor = isActive ? config.buttonColor : "white";
    button.style.color = isActive ? "white" : "black";
    icon.src = isActive ? config.activeIcon : config.defaultIcon;
  });

  state.task.prio = priority;
}

function assignedToChecked(id, forceChecked = false) {
  const checkbox = getElement(`cbtest-19-${id}`);
  const contactRow = getElement(`contact${id}`);
  const selectedAvatar = getElement(`contact-initals1${id}`);
  const contactAvatar = getElement(`contact-initals${id}`);
  const contactName = getElement(`contacts-name${id}`)?.textContent?.trim();
  const color = contactAvatar?.style?.backgroundColor || "";

  if (!checkbox || !contactRow || !selectedAvatar || !contactName) {
    return;
  }

  checkbox.checked = forceChecked ? true : !checkbox.checked;

  if (checkbox.checked) {
    selectContact(id, contactName, color, contactRow, selectedAvatar);
    return;
  }

  deselectContact(id, contactName, contactRow, selectedAvatar);
}

function selectContact(id, contactName, color, contactRow, selectedAvatar) {
  if (!state.task.assignedto.includes(contactName)) {
    state.task.assignedto.push(contactName);
  }

  if (!state.selectedContactIds.includes(String(id))) {
    state.selectedContactIds.push(String(id));
  }

  contactRow.classList.add("background");
  selectedAvatar.classList.remove("d-none");
  selectedAvatar.style.backgroundColor = color;
  syncSelectedColors();
  updateVisibleContactAvatars();
}

function deselectContact(id, contactName, contactRow, selectedAvatar) {
  state.task.assignedto = state.task.assignedto.filter((name) => name !== contactName);
  state.selectedContactIds = state.selectedContactIds.filter((entry) => entry !== String(id));

  contactRow.classList.remove("background");
  selectedAvatar.classList.add("d-none");
  syncSelectedColors();
  updateVisibleContactAvatars();
}

function updateVisibleContactAvatars() {
  const avatars = getElement("contacts-imges").querySelectorAll(".contact-initals");
  const overflowBadge = getElement("over-amount");

  avatars.forEach((avatar) => avatar.classList.add("d-none"));
  state.selectedContactIds.forEach((contactId, index) => {
    const avatar = getElement(`contact-initals1${contactId}`);
    if (avatar && index < 5) {
      avatar.classList.remove("d-none");
    }
  });

  if (state.selectedContactIds.length > 5) {
    overflowBadge.textContent = `+${state.selectedContactIds.length - 5}`;
    overflowBadge.classList.remove("d-none");
  } else {
    overflowBadge.classList.add("d-none");
  }
}

function syncSelectedColors() {
  state.selectedContactColors = state.selectedContactIds
    .map((contactId) => getElement(`contact-initals${contactId}`)?.style?.backgroundColor || "")
    .filter(Boolean);

  state.task.color = [...state.selectedContactColors];
}

function addSubtask() {
  const input = getElement("input-subtask");
  const addIcon = getElement("add-img");
  const actionButtons = getElement("ok-notok-section");
  const subtaskList = getElement("subtasklist");
  const subtaskSearchBar = getElement("subtask-search-bar");
  const requiredHint = getElement("subtask-required");

  if (!input.dataset.listenerAttached) {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addToSubtask();
        return;
      }

      subtaskSearchBar.classList.remove("notfound");
      requiredHint.classList.add("d-none");
    });

    input.dataset.listenerAttached = "true";
  }

  addIcon.classList.add("d-none");
  actionButtons.classList.remove("d-none");
  subtaskList.classList.remove("d-none");
}

function cancelSubtaskInput() {
  getElement("input-subtask").value = "";
  getElement("add-img").classList.remove("d-none");
  getElement("ok-notok-section").classList.add("d-none");
}

function addToSubtask() {
  const input = getElement("input-subtask");
  const subtaskTitle = input.value.trim();

  if (!subtaskTitle) {
    subtaskIsEmpty();
    return;
  }

  const nextSubtaskId = getNextSubtaskId();
  getElement("subtasklist").innerHTML += renderAddToSubtaskList(nextSubtaskId, subtaskTitle);
  input.value = "";
  getElement("subtask-search-bar").classList.remove("notfound");
  getElement("subtask-required").classList.add("d-none");
}

function getNextSubtaskId() {
  const existingIds = Array.from(getElement("subtasklist").children)
    .map((row) => Number(row.id.replace("id-", "")))
    .filter((id) => !Number.isNaN(id));

  state.subtaskIdCounter = existingIds.length ? Math.max(...existingIds) + 1 : 1;
  return state.subtaskIdCounter;
}

function deleteSubtask(id) {
  getElement(`id-${id}`)?.remove();
}

function editSubtask(id) {
  const subtaskRow = getElement(`id-${id}`);
  const subtaskLabel = getElement(`subtask${id}`);
  const actions = getElement(`edit-delete${id}`);

  if (!subtaskRow || !subtaskLabel || !actions) {
    return;
  }

  subtaskLabel.innerHTML = renderInputfieldEdit(id, subtaskLabel.textContent.trim());
  actions.innerHTML = renderEditOptions(id);
  subtaskRow.classList.replace("task", "onedit");
}

function edited(id) {
  const subtaskRow = getElement(`id-${id}`);
  const subtaskLabel = getElement(`subtask${id}`);
  const actions = getElement(`edit-delete${id}`);
  const updatedTitle = getElement(`newtask${id}`)?.value?.trim();

  if (!subtaskRow || !subtaskLabel || !actions || !updatedTitle) {
    return;
  }

  subtaskLabel.textContent = updatedTitle;
  actions.innerHTML = renderEditDoneImages(id);
  subtaskRow.classList.replace("onedit", "task");
}

function subtaskIsEmpty() {
  getElement("subtask-search-bar").classList.add("notfound");
  getElement("subtask-required").classList.remove("d-none");
}

function finishEditingOpenSubtasks() {
  const editingRows = Array.from(getElement("subtasklist").getElementsByClassName("onedit"));

  editingRows.forEach((row) => {
    const subtaskId = row.id.replace("id-", "");
    edited(subtaskId);
  });
}

function validateRequiredFields() {
  const hasTitle = Boolean(state.task.title);
  const hasDate = Boolean(state.task.date);

  if (!hasDate) {
    const dateInput = getElement("input-date");
    dateInput.style.border = "1px solid rgb(255, 129, 144)";
    getElement("date-required").classList.remove("d-none");
  }

  return hasTitle && hasDate;
}

async function updateServer() {
  const taskMeta = getTaskMetaFromCard();
  const normalizedTask = normalizeTask({
    ...state.task,
    id: taskMeta.id,
    category: taskMeta.category,
    status: taskMeta.status,
  });

  state.task = normalizedTask;
  window.tasks = state.task;

  await fetch(`${BASE_URL}/addTask/${taskMeta.id}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizedTask),
  });
}

async function getAllInfos() {
  finishEditingOpenSubtasks();
  getTitle();
  getDescription();
  getSubtasks();
  getDate();

  if (!validateRequiredFields()) {
    return;
  }

  await updateServer();
  successDisplay();
  setTimeout(() => {
    parent.closeWindow("edit-card");
  }, 1000);
}

function setMinimumDate() {
  const dateInput = getElement("input-date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
}

function successDisplay() {
  getElement("success-container").classList.remove("d-none");
}


