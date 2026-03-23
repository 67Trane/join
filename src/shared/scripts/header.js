/**
 * Fetches the current user's data and updates the header and greeting.
 * 
 * @async
 * @throws {Error} Throws an error if the network request fails.
 */
function loadUserName() {
  fetch(currentUserURL)
    .then((response) => response.json())
    .then((result) => updateUserName(result))
    .catch((error) => console.log('Error fetching datas:', error));
}

/**
 * Writes the current user's name into the greeting and header avatar.
 * 
 * @param {Object} result - The user data object retrieved from the server.
 * @param {string} result.nameIn - The name of the current user.
 */
function updateUserName(result) {
  if (!result?.nameIn) {
    return;
  }

  const name = result.nameIn;
  const firstLetter = name[0];
  const greetingName = document.getElementById('greet-name');
  const headerUserIcon = document.getElementById('header-user-icon');

  currentName = name;

  if (greetingName) {
    greetingName.innerHTML = name;
  }

  if (headerUserIcon) {
    headerUserIcon.innerHTML = firstLetter;
  }
}


