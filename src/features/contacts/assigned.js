/**
 * @file Task Management Functions - Handles fetching, updating, and deleting task assignments from the Firebase database.
 */

let taskDb = [];
let currentTaskId;

/**
 * Fetches tasks from the Firebase database and populates the `taskDb` array.
 * 
 * @async
 * @function getTasks
 * @param {string} path - The path to the Firebase database endpoint.
 * @returns {Promise<void>} - A promise that resolves when tasks are fetched and added to `taskDb`.
 */
async function getTasks(path) {
    let taskArray = [];

    try {
        let response = await fetch(baseUrl + path + '.json');
        let data = await response.json();
        if (data) {
            taskArray = Object.entries(data).map(([key, value]) => {
                return {
                    firebaseid: key,
                    ...normalizeTask(value)
                };
            });
            taskDb.push(...taskArray);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

/**
 * Deletes a contact assignment from all tasks where the contact is assigned.
 * 
 * @function deleteAssigned
 * @param {string} contactName - The name of the contact to be removed from task assignments.
 */
function deleteAssigned(contactName) {
    const assignedObjects = findAllAssigned(contactName);
    for (let i = 0; i < assignedObjects.length; i++) {
        removeAssignedContact(assignedObjects[i], contactName);
    }
}

/**
 * Removes one assigned contact from a task and keeps the color list aligned.
 * 
 * @param {Object} currentTaskObject - The task object that needs to be updated.
 * @param {string} contactName - The name of the contact to be removed.
 */
function removeAssignedContact(currentTaskObject, contactName) {
    const assignedContacts = normalizeStringList(currentTaskObject.assignedto);
    const assignedColors = normalizeStringList(currentTaskObject.color);
    const index = assignedContacts.indexOf(contactName);

    if (index === -1) {
        return;
    }

    assignedContacts.splice(index, 1);
    if (assignedColors.length > index) {
        assignedColors.splice(index, 1);
    }

    deleteAssignCard(currentTaskObject, assignedContacts, assignedColors);
}

/**
 * Updates the assigned contact list and color list for a task and sends the updated task data to Firebase.
 * 
 * @function deleteAssignCard
 * @param {Object} currentTaskObject - The task object that needs to be updated.
 * @param {string[]} newAssign - The updated assigned contacts.
 * @param {string[]} newColor - The updated colors.
 */
function deleteAssignCard(currentTaskObject, newAssign, newColor) {
    let taskId = currentTaskObject.firebaseid;
    const updatedData = {
        ...currentTaskObject,
        assignedto: newAssign,
        color: newColor
    };

    sendUpdateTaskRequest(taskId, updatedData);
}


/**
 * Finds and returns all tasks that a given contact is assigned to.
 * 
 * @function findAllAssigned
 * @param {string} name - The name of the contact to search for in task assignments.
 * @returns {Object[]} - An array of task objects that contain the specified contact.
 */
function findAllAssigned(name) {
    let results = [];
    for (let i = 0; i < taskDb.length; i++) {
        let assignedtoArray = normalizeStringList(taskDb[i].assignedto);
        if (assignedtoArray.includes(name)) {
            results.push(taskDb[i]);
        }
    }
    return results;
}


