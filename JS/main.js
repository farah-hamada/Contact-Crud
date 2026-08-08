var fullNameInput = document.getElementById("fullname");
var phoneNumberInput = document.getElementById("phonenumber");
var emailAddressInput = document.getElementById("emailaddress");
var addressInput = document.getElementById("address");
var groupInput = document.getElementById("group");
var notesInput = document.getElementById("notes");
var favCheckInput = document.getElementById("favCheck");
var emergencyCheckInput = document.getElementById("emergencyCheck");
var imgBtn = document.getElementById("img");          
var imgInput = document.getElementById("imgInput");   
var submitBtn = document.getElementById("submitBtn");
var totalCountEl = document.getElementById("totalCount");
var favCountEl = document.getElementById("favCount");
var emergencyCountEl = document.getElementById("emergencyCount");
var searchInput = document.getElementById("searchInput");
var manageSubtitleEl = document.querySelector(".all-con-p");
var contactsRow = document.querySelector(".row.g-4");

var favSidePanel = document.getElementById("favSidePanel");
var emergencySidePanel = document.getElementById("emergencySidePanel");

if (imgBtn && imgInput) {
    imgBtn.addEventListener("click", function() {
        imgInput.click();
    });
}

var allContact = [];
var updatedIndex = null; 

if (localStorage.getItem("new Contact") !== null) {
    allContact = JSON.parse(localStorage.getItem("new Contact"));
    displayContact();
}

function validateForm() {
    if (fullNameInput.value.trim() === "") {
        Swal.fire({
            title: "Missing Name",
            text: "Please enter a name for the contact!",
            icon: "warning",
            confirmButtonColor: "#F27474"
        });
        return false;
    }

    if (phoneNumberInput.value.trim() === "") {
        Swal.fire({
            title: "Missing Phone",
            text: "Please enter a phone number!",
            icon: "warning",
            confirmButtonColor: "#F27474"
        });
        return false;
    }

    return true;
}

function addNewContact(e) {
    if (e) e.preventDefault(); 

    if (validateForm() === false) {
        return;
    }

    var imageSrc = (imgInput.files && imgInput.files[0]) ? URL.createObjectURL(imgInput.files[0]) : null;

    if (updatedIndex === null) {
        var Contact = {
            fullName: fullNameInput.value,
            phone: phoneNumberInput.value,
            email: emailAddressInput.value,
            address: addressInput.value,
            group: groupInput.value,
            notes: notesInput.value,
            img: imageSrc,
            isFav: favCheckInput.checked,        
            isEmergency: emergencyCheckInput.checked,
        };

        allContact.push(Contact);

        Swal.fire({
            title: "Success!",
            text: "Contact saved successfully.",
            icon: "success",
            confirmButtonColor: "#059669"
        });
    } else {
        allContact[updatedIndex].fullName = fullNameInput.value;
        allContact[updatedIndex].phone = phoneNumberInput.value;
        allContact[updatedIndex].email = emailAddressInput.value;
        allContact[updatedIndex].address = addressInput.value;
        allContact[updatedIndex].group = groupInput.value;
        allContact[updatedIndex].notes = notesInput.value;
        allContact[updatedIndex].isFav = favCheckInput.checked;
        allContact[updatedIndex].isEmergency = emergencyCheckInput.checked;

        if (imageSrc !== null) {
            allContact[updatedIndex].img = imageSrc;
        }

        Swal.fire({
            title: "Updated!",
            text: "Contact updated successfully.",
            icon: "success",
            confirmButtonColor: "#059669"
        });

        updatedIndex = null; 
    }

    localStorage.setItem("new Contact", JSON.stringify(allContact));
    displayContact();
    clearInputs();
}

function setupUpdate(index) {
    updatedIndex = index; 

    fullNameInput.value = allContact[index].fullName || "";
    phoneNumberInput.value = allContact[index].phone || "";
    emailAddressInput.value = allContact[index].email || "";
    addressInput.value = allContact[index].address || "";
    groupInput.value = allContact[index].group || "";
    notesInput.value = allContact[index].notes || "";
    favCheckInput.checked = allContact[index].isFav || false;
    emergencyCheckInput.checked = allContact[index].isEmergency || false;

    var myModalElement = document.getElementById('addContactModal'); 
    if (myModalElement) {
        var contactModal = bootstrap.Modal.getInstance(myModalElement) || new bootstrap.Modal(myModalElement);
        contactModal.show();
    }
}

function toggleStatus(index, property) {
    allContact[index][property] = !allContact[index][property];
    localStorage.setItem("new Contact", JSON.stringify(allContact));
    displayContact();
}

function clearInputs() {
    fullNameInput.value = "";
    phoneNumberInput.value = "";
    emailAddressInput.value = "";
    addressInput.value = "";
    groupInput.value = "";
    notesInput.value = "";
    if (imgInput) imgInput.value = "";
    favCheckInput.checked = false;
    emergencyCheckInput.checked = false;

    updatedIndex = null; 
}

function updateStatsAndSidePanels() {
    var totalCount = allContact.length;
    var favList = [];
    var emergencyList = [];

    for (var i = 0; i < allContact.length; i++) {
        if (allContact[i].isFav === true) {
            favList.push(allContact[i]);
        }
        if (allContact[i].isEmergency === true) {
            emergencyList.push(allContact[i]);
        }
    }

    if (totalCountEl) {
        totalCountEl.innerHTML = totalCount;
    }
    
    if (favCountEl) {
        favCountEl.innerHTML = favList.length;
    }
    
    if (emergencyCountEl) {
        emergencyCountEl.innerHTML = emergencyList.length;
    }
    
    if (manageSubtitleEl) {
        manageSubtitleEl.innerHTML = `Manage and organize your ${totalCount} contacts`;
    }

    if (favSidePanel) {
        if (favList.length === 0) {
            favSidePanel.innerHTML = "No favorites yet";
        } else {
            var favHtml = "";
            for (var j = 0; j < favList.length; j++) {
                var currentFav = favList[j];

                var favInitials = "C";
                if (currentFav.fullName !== undefined && currentFav.fullName.trim() !== "") {
                    var nameParts = currentFav.fullName.trim().split(" ");
                    
                    var firstLetter = "";
                    if (nameParts[0] !== undefined) {
                        firstLetter = nameParts[0][0].toUpperCase();
                    }
                    
                    var secondLetter = "";
                    if (nameParts.length > 1 && nameParts[1] !== undefined) {
                        secondLetter = nameParts[1][0].toUpperCase();
                    }
                    
                    favInitials = firstLetter + secondLetter;
                }

                favHtml += `
                <div class="d-flex align-items-center justify-content-between p-2 mb-2 bg-white rounded-3 border border-light-subtle shadow-sm">
                    <div class="d-flex align-items-center gap-2 overflow-hidden">
                        <div class="text-white fw-bold bg-letter-orange rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width:36px; height:36px; font-size:13px;">${favInitials}</div>
                        <div class="text-start text-truncate">
                            <h6 class="m-0 fw-bold text-dark text-truncate" style="font-size: 14px;">${currentFav.fullName}</h6>
                            <span class="text-muted text-truncate d-block" style="font-size: 11px;">${currentFav.phone}</span>
                        </div>
                    </div>
                    <a href="tel:${currentFav.phone}" class="btn btn-sm bg-soft-green text-success rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width:32px; height:32px;">
                        <i class="fa-solid fa-phone fa-xs"></i>
                    </a>
                </div>`;
            }
            favSidePanel.innerHTML = favHtml;
        }
    }

    if (emergencySidePanel) {
        if (emergencyList.length === 0) {
            emergencySidePanel.innerHTML = "No emergency contacts";
        } else {
            var emergencyHtml = "";
            for (var k = 0; k < emergencyList.length; k++) {
                var currentEmergency = emergencyList[k];

                var emergencyInitials = "C";
                if (currentEmergency.fullName !== undefined && currentEmergency.fullName.trim() !== "") {
                    var nameParts = currentEmergency.fullName.trim().split(" ");
                    
                    var firstLetter = "";
                    if (nameParts[0] !== undefined) {
                        firstLetter = nameParts[0][0].toUpperCase();
                    }
                    
                    var secondLetter = "";
                    if (nameParts.length > 1 && nameParts[1] !== undefined) {
                        secondLetter = nameParts[1][0].toUpperCase();
                    }
                    
                    emergencyInitials = firstLetter + secondLetter;
                }

                emergencyHtml += `
                <div class="d-flex align-items-center justify-content-between p-2 mb-2 bg-white rounded-3 border border-light-subtle shadow-sm">
                    <div class="d-flex align-items-center gap-2 overflow-hidden">
                        <div class="text-white fw-bold bg-letter-red rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width:36px; height:36px; font-size:13px;">${emergencyInitials}</div>
                        <div class="text-start text-truncate">
                            <h6 class="m-0 fw-bold text-dark text-truncate" style="font-size: 14px;">${currentEmergency.fullName}</h6>
                            <span class="text-muted text-truncate d-block" style="font-size: 11px;">${currentEmergency.phone}</span>
                        </div>
                    </div>
                    <a href="tel:${currentEmergency.phone}" class="btn btn-sm bg-soft-pink text-danger rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width:32px; height:32px;">
                        <i class="fa-solid fa-phone fa-xs"></i>
                    </a>
                </div>`;
            }
            emergencySidePanel.innerHTML = emergencyHtml;
        }
    }
}

function displayContact() {
    var term = "";

    if (searchInput !== null && searchInput !== undefined) {
        term = searchInput.value.trim().toLowerCase();
    }
    
    var cartoona = "";
    var matchCount = 0;
    for (var i = 0; i < allContact.length; i++) {
        var name = "";
        if (allContact[i].fullName) {
            name = allContact[i].fullName.toLowerCase();
        }

        var phone = "";
        if (allContact[i].phone) {
            phone = allContact[i].phone.toLowerCase();
        }

        var email = "";
        if (allContact[i].email) {
            email = allContact[i].email.toLowerCase();
        }

        if (name.includes(term) || phone.includes(term) || email.includes(term)) {
            matchCount++;

            var initials = "C";
            
            if (allContact[i].fullName !== undefined && allContact[i].fullName.trim() !== "") {
                var nameParts = allContact[i].fullName.trim().split(" ");
                
                var firstLetter = "";
                if (nameParts[0] !== undefined) {
                    firstLetter = nameParts[0][0].toUpperCase();
                }
                
                var secondLetter = "";
                if (nameParts.length > 1 && nameParts[1] !== undefined) {
                    secondLetter = nameParts[1][0].toUpperCase();
                }
                
                initials = firstLetter + secondLetter;
            }

            var avatarHTML = "";
            if (allContact[i].img !== null && allContact[i].img !== "") {
                avatarHTML = '<img src="' + allContact[i].img + '" class="avatar-size rounded-4 object-fit-cover" alt="Profile">';
            } else {
                avatarHTML = '<div class="avatar-size text-white fw-bold fs-5 d-flex align-items-center justify-content-center bg-letter-orange rounded-4">' + initials + '</div>';
            }

            var starBadge = "";
            if (allContact[i].isFav === true) {
                starBadge = '<span class="badge-top-right position-absolute rounded-circle text-white d-flex align-items-center justify-content-center border border-2 border-white bg-warning"><i class="fa-solid fa-star"></i></span>';
            }

            var emergencyBadge = "";
            if (allContact[i].isEmergency === true) {
                emergencyBadge = '<span class="badge-bottom-right position-absolute rounded-circle text-white d-flex align-items-center justify-content-center border border-2 border-white bg-danger"><i class="fa-solid fa-heart-pulse"></i></span>';
            }

            var emailHTML = "";
            if (allContact[i].email !== undefined && allContact[i].email.trim() !== "") {
                emailHTML = `
                <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="icon-box bg-soft-purple rounded-3 d-inline-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-envelope"></i>
                    </span>
                    <span class="phone">${allContact[i].email}</span>
                </div>`;
            }

            var addressHTML = "";
            if (allContact[i].address !== undefined && allContact[i].address.trim() !== "") {
                addressHTML = `
                <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="icon-box bg-soft-green rounded-3 d-inline-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-location-dot"></i>
                    </span>
                    <span class="phone">${allContact[i].address}</span>
                </div>`;
            }

            var emailActionBtn = "";
            if (allContact[i].email !== undefined && allContact[i].email.trim() !== "") {
                emailActionBtn = `
                <a href="mailto:${allContact[i].email}" class="btn btn-action bg-soft-purple rounded-3 border-0 d-inline-flex align-items-center justify-content-center hover-effect-purple">
                    <i class="fa-solid fa-envelope"></i>
                </a>`;
            }

            var groupBadge = "";
            if (
                allContact[i].group !== undefined && 
                allContact[i].group.trim() !== "" && 
                allContact[i].group !== "Select a group" &&
                allContact[i].group !== "Select Group"
            ) {
                groupBadge = `<span class="badge bg-soft-blue fw-medium px-3 py-2 rounded-3">${allContact[i].group}</span>`;
            }

            var emergencyBadgeTag = "";
            if (allContact[i].isEmergency === true) {
                emergencyBadgeTag = '<span class="badge bg-soft-pink fw-medium px-3 py-2 rounded-3"><i class="fa-solid fa-heart me-1"></i> Emergency</span>';
            }

            var tagsRowHTML = "";
            if (groupBadge !== "" || emergencyBadgeTag !== "") {
                tagsRowHTML = `<div class="d-flex gap-2 mt-2">${groupBadge} ${emergencyBadgeTag}</div>`;
            }

            var starIconClass = allContact[i].isFav ? "fa-solid fa-star text-warning" : "fa-regular fa-star";
            var emergencyIconClass = allContact[i].isEmergency ? "fa-solid fa-heart-pulse text-danger" : "fa-regular fa-heart";

            cartoona += `
            <div class="col-12 col-md-6 d-flex">
                <div class="card border-0 rounded-4 shadow-sm bg-white overflow-hidden h-100 w-100 d-flex flex-column justify-content-between">
                    <div class="card-body">
                        <div class="d-flex align-items-center gap-3 mb-2">
                            <div class="position-relative">
                                ${avatarHTML}
                                ${starBadge}
                                ${emergencyBadge}
                            </div>

                            <div>
                                <h6 class="name mb-1 fw-bold">${allContact[i].fullName}</h6>
                                <div class="d-flex align-items-center gap-2">
                                    <span class="icon-box bg-soft-blue rounded-3 d-inline-flex align-items-center justify-content-center">
                                        <i class="fa-solid fa-phone"></i>
                                    </span>
                                    <span class="phone text-muted">${allContact[i].phone}</span>
                                </div>
                            </div>
                        </div>

                        ${emailHTML}
                        ${addressHTML}
                        ${tagsRowHTML}
                    </div>

                    <div class="card-footer bg-body-tertiary border-top border-light-subtle d-flex align-items-center justify-content-between py-2">
                        <div class="d-flex gap-2">
                            <a href="tel:${allContact[i].phone}" class="btn btn-action bg-soft-green rounded-3 border-0 d-inline-flex align-items-center justify-content-center hover-effect-green">
                                <i class="fa-solid fa-phone"></i>
                            </a>
                            ${emailActionBtn}
                        </div>

                        <div class="d-flex align-items-center gap-1">
                            <button onclick="toggleStatus(${i}, 'isFav')" class="btn btn-action bg-soft-yellow rounded-3 border-0 d-inline-flex align-items-center justify-content-center hover-effect-yellow">
                                <i class="${starIconClass}"></i>
                            </button>
                            <button onclick="toggleStatus(${i}, 'isEmergency')" class="btn btn-action bg-soft-pink rounded-3 border-0 d-inline-flex align-items-center justify-content-center hover-effect-pink">
                                <i class="${emergencyIconClass}"></i>
                            </button>
                            <button onclick="setupUpdate(${i})" class="btn btn-action rounded-3 border-0 d-inline-flex align-items-center justify-content-center hover-effect-edit">
                                <i class="fa-solid fa-pen hover-effect-edit"></i>
                            </button>
                            <button onclick="deleteContact(${i})" class="btn btn-action rounded-3 border-0 d-inline-flex align-items-center justify-content-center hover-effect-trash">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        }
    }

    if (allContact.length === 0 || matchCount === 0) {
        contactsRow.innerHTML = `
        <div class="col-12">
            <div class="empty-state-card d-flex flex-column align-items-center justify-content-center text-center p-5 rounded-4 m-5">
                <div class="empty-icon-wrapper rounded-4 d-flex align-items-center justify-content-center m-3">
                    <i class="fa-solid fa-address-book fs-3 text-secondary"></i>
                </div>
                <h3 class="no-con m-0">No contacts found</h3>
                <p class="click mt-1">Click "Add Contact" to get started</p>
            </div>
        </div>`;
    } else {
        contactsRow.innerHTML = cartoona;
    }

    updateStatsAndSidePanels(); 
}

function deleteContact(index) {
    var contactName = "this contact";
    
    if (allContact[index] !== undefined && allContact[index] !== null) {
        contactName = allContact[index].fullName;
    }

    Swal.fire({
        title: "Delete Contact?",
        text: "Are you sure you want to delete " + contactName + "? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#4b5563",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            allContact.splice(index, 1);
            localStorage.setItem("new Contact", JSON.stringify(allContact));
            displayContact();

            Swal.fire({
                title: "Deleted!",
                text: "Contact has been deleted successfully.",
                icon: "success",
                confirmButtonColor: "#059669"
            });
        }
    });
}

if (searchInput) {
    searchInput.addEventListener("input", function() {
        displayContact();
    });
}