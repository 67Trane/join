// Div References
const showDetail = document.getElementById('contact-detail');
const detailRef = document.getElementById('detail');
const addDialogRef = document.getElementById('add-contact');
const contactListRef = document.getElementById('contact-list');
const listContentRef = document.getElementById('list-content-outter');
const addButtonRef = document.getElementById('add-button');
const editButtonRef = document.getElementById('edit-button');
const editBoxRef = document.getElementById('edit-box');
const editContactRef = document.getElementById('edit-contact');
let currentSelectedElement = null;

// Firebase References
let baseUrl = 'https://join-318-default-rtdb.europe-west1.firebasedatabase.app/';
let currentId;
let isCurrentUser

// Data Storage
let db = [];
let inputData;
let organizedContacts = {};


/**
 * Initializes Contact List
 */

async function initializeContactList() {
    init();
    try {
        db = [];  
        await getData("contacts");  
    } finally {
        listContentRef.innerHTML = '';
        renderContactGroups();
        if (currentId) {
            selectElement(currentId);
        }
    }
}

/**
 * Renders Contact List into DOM
 */
function renderContactGroups() {
    listContentRef.innerHTML = '';
    organizedContacts = {};
    groupContactsByInitials();
    sortContactGroups();
    renderContacts(organizedContacts);
}

function groupContactsByInitials() {
    for (let i = 0; i < db.length; i++) {
        let contact = db[i];
        let initials = getContactInitials(contact.nameIn);
        let letter = initials[1];

        if (!organizedContacts[letter]) {
            organizedContacts[letter] = [];
        }
        organizedContacts[letter].push({
            ...contact,
            initials: initials
        });
    }
}

function sortContactGroups() {
    const letters = Object.keys(organizedContacts);
    for (let i = 0; i < letters.length; i++) {
        let currentLetter = letters[i];
        organizedContacts[currentLetter].sort(function (a, b) {
            return a.nameIn.localeCompare(b.nameIn);
        });
    }
}

function renderContacts(organizedContacts) {
    let sortedInitials = Object.keys(organizedContacts).sort();
    let globalIndex = 0;

    for (let index = 0; index < sortedInitials.length; index++) {
        let initial = sortedInitials[index];
        renderInitialGroup(initial, index, organizedContacts[initial], globalIndex);
        globalIndex += organizedContacts[initial].length;
    }
}

function renderInitialGroup(initial, index, contacts, globalIndex) {
    listContentRef.innerHTML += contactTemplateInitial(initial, index);
    let currentContactRef = document.getElementById(`list-content-inner-${index}`);
    renderContactsForInitial(currentContactRef, contacts, globalIndex);
}

function renderContactsForInitial(containerRef, contacts, globalIndex) {
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let currentName = contact.nameIn;
        let currentEmail = contact.emailIn;
        let currentPhone = contact.phoneIn;
        let initials = contact.initials;
        let contactId = contact.id; 
        let color = contact.color;
        let indexCard = globalIndex + i;
        let user = contact.isUser

        containerRef.innerHTML += getContactsTemplate(currentName, currentEmail, currentPhone, contactId, initials[0], initials[initials.length - 1], color, indexCard, user);
    }
}

/**
 * Add Contact Dialog
 */

function openAddContactDialog() {
    addDialogRef.classList.remove('d-none');
    addDialogRef.innerHTML = addDialogTemplate();
    editButtonRef.classList.add('d-none');
    addButtonRef.classList.add('d-none');
}

function closeAddContactDialog() {
    addDialogRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    addButtonRef.classList.remove('d-none');
}

/**
 * Add Contact Logic
 */

function getInputValues() {
    const nameInput = document.getElementById('name').value.trim();
    const emailInput = document.getElementById('email').value.trim();
    const phoneInput = document.getElementById('phone').value.trim();

    if (!nameInput || !emailInput || !phoneInput) {
        alert('Bitte füllen Sie alle Felder aus.');
        return;
    }

    inputData = {
        nameIn: nameInput,
        emailIn: emailInput,
        phoneIn: phoneInput,
        isUser: false,
        color: getRandomColor()
    };

    pushData(inputData);
}

/**
 * Detail Dialog
 */
function openDetailDialog(name, email, phone, id, first, last, color, indexCard, user) {
    if (window.innerWidth >= 1024) {
        openDetailReferenceDesk(name, email, phone, id, first, last, color, user);
    } else {
        openDetailReferenceMob(name, email, phone, id, first, last, color, user);
    }
}

function selectElement(contactId) {
    const selectedElement = document.getElementById(`contact-card-${contactId}`);
    if (!selectedElement) {
        console.error(`Element mit ID contact-card-${contactId} konnte nicht gefunden werden.`);
        return;
    }
    if (currentSelectedElement && currentSelectedElement !== selectedElement) {
        currentSelectedElement.classList.remove('selected');
    }
    selectedElement.classList.add('selected');
    currentSelectedElement = selectedElement;
}

function openDetailReferenceMob(name, email, phone, id, first, last, color, user) {
    currentId = id; 
    showDetail.classList.remove('d-none');
    detailRef.classList.remove('d-none');
    contactListRef.classList.add('d-none');
    editButtonRef.classList.remove('d-none');
    editBoxRef.classList.add('d-none');
    addButtonRef.classList.add('d-none');
    getDetailTemplateMob(name, email, phone, id, first, last, color, user);
    selectElement(id);
}

function openDetailReferenceDesk(name, email, phone, id, first, last, color, user) {
    console.log(user)
    currentId = id;
    document.getElementById('detail-desk').innerHTML = detailTemplate(name, email, phone, id, first, last, color, user);
    selectElement(id);
}

function getDetailTemplateMob(name, email, phone, id, first, last, color, user) {
    detailRef.innerHTML = detailTemplate(name, email, phone, id, first, last, color, user);
}

function closeDetailDialog() {
    showDetail.classList.add('d-none');
    detailRef.classList.add('d-none');
    editButtonRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    addButtonRef.classList.remove('d-none');
    listContentRef.classList.remove('d-none');
}

/**
 * Edit / Delete
 */
function stopPropagation(event) {
    event.stopPropagation();
}

function showEditBox(event) {
    stopPropagation(event);
    editBoxRef.classList.remove('d-none');
}

function hideEditBox() {
    editBoxRef.classList.add('d-none');
}

function closeEditContactDialog() {
    editContactRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    if (window.innerWidth <= 1024) {
        listContentRef.classList.remove('d-none');
    }
}

function openEditContactDialog(id, name, email, user) {
    console.log("Editing user: ", user);
    editContactRef.classList.remove('d-none');
    editContactRef.innerHTML = showEditOverlay(name, email, user);
    currentId = id;
    
    const contact = db.find(contact => contact.id === currentId);
    isCurrentUser = contact.isUser; 
    console.log("isCurrentUser: ", isCurrentUser);
    
    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const phoneInput = document.getElementById('edit-phone');
    if (contact && nameInput && emailInput && phoneInput) {
        nameInput.value = contact.nameIn;
        emailInput.value = contact.emailIn;
        phoneInput.value = contact.phoneIn;
    }

    if (window.innerWidth <= 1024) {
        listContentRef.classList.add('d-none');
    }
}

function closeEditContactDialog() {
    editContactRef.classList.add('d-none');
    contactListRef.classList.remove('d-none');
    if (window.innerWidth <= 1024) {
        listContentRef.classList.remove('d-none');
    }
    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const phoneInput = document.getElementById('edit-phone');
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
}

/**
 * Update Contact Logic
 */

function getUpdatedContactData() {
    const nameIn = document.getElementById('edit-name').value.trim();
    const emailIn = document.getElementById('edit-email').value.trim();
    const phoneIn = document.getElementById('edit-phone').value.trim();
    const color = getRandomColor();
    const isUser = isCurrentUser; 
    
    if (!nameIn || !emailIn || !phoneIn) {
        alert('Bitte füllen Sie alle Felder aus.');
        return null;
    }
    return { nameIn, emailIn, phoneIn, color, isUser };
}

async function updateContact() {
    const updatedData = getUpdatedContactData();
    if (!updatedData) return;

    const success = await sendUpdateRequest(currentId, updatedData);
    if (success) {
        updateLocalDatabase(currentId, updatedData);
        closeEditContactDialog();
        initializeContactList();
        selectElement(currentId);
        updateDetailView(updatedData);
        
        if (updatedData.isUser) {
            await updateAccount();
        }
    } else {
        alert("Fehler beim Aktualisieren des Kontakts.");
    }
}

function updateLocalDatabase(contactId, updatedData) {
    const contactIndex = db.findIndex(contact => contact.id === contactId);
    if (contactIndex > -1) {
        db[contactIndex] = { id: contactId, ...updatedData };
    }
}

function updateDetailView(updatedData) {
    const initials = getContactInitials(updatedData.nameIn);
    if (!showDetail.classList.contains('d-none')) {
        getDetailTemplateMob(
            updatedData.nameIn,
            updatedData.emailIn,
            updatedData.phoneIn,
            currentId,  
            initials[0],
            initials[1],
            updatedData.color
        );
    }

    openDetailReferenceDesk(
        updatedData.nameIn,
        updatedData.emailIn,
        updatedData.phoneIn,
        currentId,  
        initials[0],   
        initials[1], 
        updatedData.color
    );
}