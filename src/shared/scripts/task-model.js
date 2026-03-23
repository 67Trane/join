/**
 * @file Shared task model helpers used to keep task data consistent across the app.
 */

/**
 * Creates a new task object with the canonical project-wide shape.
 *
 * @returns {Object} A normalized empty task object.
 */
function createEmptyTask() {
  return {
    id: "",
    title: "",
    description: "",
    assignedto: [],
    date: "",
    prio: "",
    category: "",
    subtask: {},
    status: "",
    color: [],
    inits: [],
  };
}

/**
 * Normalizes string, array, or object values into a clean string array.
 *
 * @param {string|string[]|Object|null|undefined} value - The value to normalize.
 * @returns {string[]} A trimmed string array.
 */
function normalizeStringList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((entry) => `${entry}`.trim()).filter(Boolean);
  }

  if (typeof value === "object") {
    return Object.values(value).map((entry) => `${entry}`.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((entry) => entry.trim()).filter(Boolean);
  }

  return [];
}

/**
 * Converts legacy subtask formats into the canonical object format.
 *
 * @param {string|string[]|Object|null|undefined} subtasks - The subtasks to normalize.
 * @returns {Object<string, string>} A subtask object keyed by title.
 */
function normalizeSubtaskMap(subtasks) {
  if (!subtasks) {
    return {};
  }

  if (typeof subtasks === "string") {
    const matches = subtasks.match(/'([^']*)'/g) || [];
    return buildSubtaskMap(matches.map((entry) => entry.replace(/'/g, "")));
  }

  if (Array.isArray(subtasks)) {
    return buildSubtaskMap(subtasks);
  }

  if (typeof subtasks === "object") {
    return Object.fromEntries(
      Object.entries(subtasks)
        .map(([label, status]) => [label.trim(), status === "done" ? "done" : "inwork"])
        .filter(([label]) => Boolean(label))
    );
  }

  return {};
}

/**
 * Builds a subtask object from a list of labels.
 *
 * @param {string[]} subtasks - The subtask labels.
 * @returns {Object<string, string>} A subtask object with default status values.
 */
function buildSubtaskMap(subtasks) {
  const normalizedSubtasks = {};

  for (let i = 0; i < subtasks.length; i++) {
    const label = `${subtasks[i]}`.trim();
    if (label) {
      normalizedSubtasks[label] = "inwork";
    }
  }

  return normalizedSubtasks;
}

/**
 * Creates the initials for a single contact name.
 *
 * @param {string} fullName - The contact name.
 * @returns {string} The computed initials.
 */
function getContactInitialsFromName(fullName) {
  const [firstName = "", lastName = ""] = `${fullName}`.trim().split(" ");
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

/**
 * Creates the initials array for all assigned contacts in a task.
 *
 * @param {Object} task - The task object.
 * @returns {string[]} The initials for each assigned contact.
 */
function getAssignedInitials(task) {
  return normalizeStringList(task.assignedto).map((name) => getContactInitialsFromName(name));
}

/**
 * Normalizes a task into the canonical project-wide shape.
 *
 * @param {Object} task - The raw task object.
 * @returns {Object} A normalized task object.
 */
function normalizeTask(task = {}) {
  const normalizedTask = {
    ...createEmptyTask(),
    ...task,
  };

  normalizedTask.id = normalizedTask.id ? `${normalizedTask.id}` : "";
  normalizedTask.title = normalizedTask.title ? `${normalizedTask.title}` : "";
  normalizedTask.description = normalizedTask.description ? `${normalizedTask.description}` : "";
  normalizedTask.date = normalizedTask.date ? `${normalizedTask.date}` : "";
  normalizedTask.prio = normalizedTask.prio ? `${normalizedTask.prio}` : "";
  normalizedTask.category = normalizedTask.category ? `${normalizedTask.category}` : "";
  normalizedTask.status = normalizedTask.status ? `${normalizedTask.status}` : "";
  normalizedTask.assignedto = normalizeStringList(normalizedTask.assignedto);
  normalizedTask.color = normalizeStringList(normalizedTask.color);
  normalizedTask.subtask = normalizeSubtaskMap(normalizedTask.subtask);
  normalizedTask.inits = getAssignedInitials(normalizedTask);

  return normalizedTask;
}


