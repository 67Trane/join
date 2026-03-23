let isDropdownOpen = false;

/**
 * Attaches the assigned-contact dropdown behavior for the current page.
 */
function dropDown() {
  const dropdown = document.getElementById("all-contacts");
  const dropdownToggle = document.getElementById("contacts-searchfield");
  const arrow = document.getElementById("arrow-down");

  if (!dropdown || !dropdownToggle || !arrow || dropdownToggle.dataset.dropdownBound === "true") {
    return;
  }

  dropdownToggle.dataset.dropdownBound = "true";

  document.addEventListener("click", (event) => {
    const clickedToggle = dropdownToggle.contains(event.target);
    const clickedArrow = arrow.contains(event.target);
    const clickedDropdown = dropdown.contains(event.target);

    if (clickedToggle || clickedArrow) {
      toggleAssignedList();
      return;
    }

    if (!clickedDropdown) {
      closeAssignedList();
    }
  });
}

/**
 * Toggles the assigned-contact dropdown.
 */
function toggleAssignedList() {
  if (isDropdownOpen) {
    closeAssignedList();
    return;
  }

  openAssignedList();
}

/**
 * Calls optional page-specific hooks when the dropdown changes its state.
 *
 * @param {"open"|"close"} action - The dropdown action.
 */
function runDropdownHook(action) {
  if (action === "open" && typeof prepairForLimitContacts === "function") {
    prepairForLimitContacts();
  }

  if (action === "close" && typeof limitContactsImgs === "function") {
    limitContactsImgs();
  }
}

/**
 * Closes the dropdown list of contacts.
 */
function closeAssignedList() {
  const placeholder = document.getElementById("assigne-placeholder");
  const contactImages = document.getElementById("contacts-imges");
  const search = document.getElementById("search-container");
  const dropdown = document.getElementById("all-contacts");
  const dropdownToggle = document.getElementById("contacts-searchfield");
  const arrow = document.getElementById("arrow-down");

  if (!dropdown || !dropdownToggle || !search || !contactImages || !arrow) {
    return;
  }

  if (placeholder) {
    placeholder.style.display = "";
  }

  dropdown.classList.add("d-none");
  search.classList.add("d-none");
  dropdown.style.animation = "";
  arrow.style.animation = "";
  contactImages.classList.remove("d-none");
  dropdownToggle.classList.remove("focused");
  isDropdownOpen = false;
  runDropdownHook("close");
}

/**
 * Opens the dropdown list of contacts.
 */
function openAssignedList() {
  const placeholder = document.getElementById("assigne-placeholder");
  const input = document.getElementById("myInput");
  const contactImages = document.getElementById("contacts-imges");
  const search = document.getElementById("search-container");
  const dropdown = document.getElementById("all-contacts");
  const dropdownToggle = document.getElementById("contacts-searchfield");
  const arrow = document.getElementById("arrow-down");

  if (!dropdown || !dropdownToggle || !search || !contactImages || !arrow) {
    return;
  }

  dropdown.classList.remove("d-none");
  search.classList.remove("d-none");
  dropdown.style.animation = "slowdropdown 0.7s forwards";
  arrow.style.animation = "rotate 0.5s forwards";
  contactImages.classList.add("d-none");

  if (input) {
    input.focus();
  }

  if (placeholder) {
    placeholder.style.display = "none";
  }

  dropdownToggle.classList.add("focused");
  isDropdownOpen = true;
  runDropdownHook("open");
}

/**
 * Filters the contact list based on user input.
 */
function filterFunction() {
  const input = document.getElementById("myInput");
  const contactContainer = document.getElementById("all-contacts");
  const noContact = document.getElementById("noContact");

  if (!input || !contactContainer || !noContact) {
    return;
  }

  const filter = input.value.toUpperCase();
  const contactNames = contactContainer.getElementsByTagName("p");
  let visibleContacts = 0;

  noContact.classList.add("d-none");

  for (let i = 0; i < contactNames.length; i++) {
    const label = contactNames[i].textContent || contactNames[i].innerText;
    const row = contactNames[i].parentElement.parentElement;
    const isVisible = label.toUpperCase().includes(filter);

    row.style.display = isVisible ? "" : "none";
    if (isVisible) {
      visibleContacts++;
    }
  }

  if (visibleContacts === 0) {
    noContact.classList.remove("d-none");
  }
}
