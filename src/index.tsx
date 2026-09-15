import * as THREE from "three"
import * as ReactDom from "react-dom/client"
import { Sidebar } from "./react-components/Sidebar"
import{IProject, ProjectStatus, UserRole } from "./class/Project"
import {ProjectsManager} from"./class/ProjectsManager"


const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDom.createRoot(rootElement)
appRoot.render(
    <Sidebar />
)

declare global {
    interface Window {
        editUser: (event: Event, element: HTMLElement) => void
    }
}


function toggleModal(id: string) {
    const modal = document.getElementById(id)
    if (!(modal && modal instanceof HTMLDialogElement)) {
        console.warn("The provided modal wasn't found. ID:", id)
        return
    }
    modal.open ? modal.close() : modal.showModal()
}

function closeModal(id: string) { //It closes the form window
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        modal.close()
    }else {
        console.warn("The provided modal wasn't found. ID:",id)
    }
}

const projectListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectListUI)

//This document object is provided by the browser, and its main purpose is to help in the interaction.
const newProjectBtn=document.getElementById("new-project-btn") //przeglądarka szuka w HTML elementu z id="new-project-btn" i zapisuje go do zmiennej. Teraz newProjectBtn to jest ten przycisk.
if (newProjectBtn) {
    newProjectBtn.addEventListener('click', () => toggleModal("new-project-modal")) //Mówisz przyciskowi: *"Czekaj na kliknięcie, a gdy to nastąpi — wykonaj funkcję `showModal`"
} else {
    console.warn("New project bottom was not found.")
}

const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault() // to powoduje, ze jak się kliknie na buttom formularz nie znika.
        const formData = new FormData(projectForm)

        const defaultDate = new Date ()
        defaultDate.setFullYear(defaultDate.getFullYear() + 1)
        
        const projectData:IProject = {
            acronym:formData.get("acronym") as string,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            userRole: formData.get("userRole") as UserRole,
            projectStatus: formData.get("projectStatus") as ProjectStatus,
            finishDate: formData.get("finishDate") ? new Date(formData.get("finishDate") as string) : defaultDate,
            cost: Number(formData.get("cost")) 
        }

        try{
            const project = projectsManager.newProject(projectData)
            projectForm.reset()
            closeModal("new-project-modal")
        } catch(error){
            const errorModal = document.getElementById("error-modal")
            const errorMessage = document.getElementById("error-message")

            if (errorMessage && error instanceof Error) {
                errorMessage.textContent = error.message
            }
           
            if(errorModal && errorModal instanceof HTMLDialogElement){
                errorModal.showModal()
            }
        }
        const errorCloseBtn = document.getElementById("error-close-btn")
        if (errorCloseBtn) {
            errorCloseBtn.addEventListener('click', () => closeModal("error-modal"))
        } else {
            console.warn("Error close button was not found.")
        }
        
    })
} else {
    console.warn("The project form was not found. Check the ID.")
}

const cancelBtn = document.getElementById("cancel-btn")
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => closeModal("new-project-modal"))
} else {
    console.warn("Cancel button was not found.")
}

projectsManager.newProject({
    acronym: "HC",
    name: "Hospital Center",
    description: "A 900,000 sq. ft. smart-medical facility featuring 636 private patient rooms.",
    userRole: "Engineer",
    projectStatus: "Pending",
    finishDate: new Date("2025-01-01"),
    cost: 2542000
})

const exportProjectsBtn = document.getElementById("export-projects-btn")
if(exportProjectsBtn) {
    exportProjectsBtn.addEventListener("click", () => {  //"click"  = "czekaj na kliknięcie" ; () => {} = "gdy ktoś kliknie - wykonaj ten kod"
        projectsManager.exportToJSON()
    })
} else {
    console.warn("Export button was not found.")}

const importProjectsBtn = document.getElementById("import-projects-btn")
if(importProjectsBtn) {
    importProjectsBtn.addEventListener("click", () => {  //"click"  = "czekaj na kliknięcie" ; () => {} = "gdy ktoś kliknie - wykonaj ten kod"
        projectsManager.importFromJSON()
    })
} else {
    console.warn("Export button was not found.")}


    const navProjectsBtn = document.getElementById("nav-projects-btn")
    if (navProjectsBtn) {
        navProjectsBtn.addEventListener("click", () => {
            const projectPage = document.getElementById("project-page")
            const detailsPage = document.getElementById("project-details")
            const usersPage = document.getElementById("Users-details")  // ← sprawdź nazwę
            if (!projectPage || !detailsPage) { return }
            detailsPage.style.display = "none"
            if (usersPage) { usersPage.style.display = "none" }
            projectPage.style.display = "grid"
        })
        
    } else{
        console.warn ("Nav projects button was not found.")
    }

    const backBtn = document.getElementById("back-btn")
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            const projectPage = document.getElementById("project-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectPage || !detailsPage) { return }
            detailsPage.style.display = "none"
            projectPage.style.display = "grid"
        })
    }

    const navUsersBtn = document.getElementById("nav-users-btn")
    if (navUsersBtn) {
        navUsersBtn.addEventListener("click", () => {
            const projectPage = document.getElementById("project-page")
            const detailsPage = document.getElementById("project-details")
            const usersPage = document.getElementById("Users-details")
            if (!projectPage || !detailsPage || !usersPage) { return }
            projectPage.style.display = "none"
            detailsPage.style.display = "none"
            usersPage.style.display = "grid"
        })
    }


    const searchUserInput = document.getElementById("search-user-input")
    if (searchUserInput && searchUserInput instanceof HTMLInputElement) {
        searchUserInput.addEventListener("input", () => {
            const searchValue = searchUserInput.value.toLowerCase()
            const userRows = document.querySelectorAll(".user-row")
            userRows.forEach(row => {
                const name = row.querySelector("h4")?.textContent?.toLowerCase() || ""
                if (name.includes(searchValue)) {
                    (row as HTMLElement).style.display = "flex"
                } else {
                    (row as HTMLElement).style.display = "none"
                }
            })
        })
    }
    
    const deleteUserBtns = document.querySelectorAll(".delete-user-btn")
    document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement
        if (target.classList.contains("delete-user-btn")) {
            e.stopPropagation()
            const userCard = target.closest(".user-card")
            if (userCard) {
                userCard.remove()
            }
        }
    })
    
    const cancelEditUserBtn = document.getElementById("cancel-edit-user-btn")
    if (cancelEditUserBtn) {
        cancelEditUserBtn.addEventListener("click", () => {
            const modal = document.getElementById("edit-user-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                modal.close()
            }
        })
    }


    const editUserBtns = document.querySelectorAll(".edit-user-btn")

    document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement
        if (target.classList.contains("edit-user-btn")) {
            e.stopPropagation()
            e.preventDefault()
            const modal = document.getElementById("edit-user-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                const userCard = target.closest(".user-card")
                if (userCard) {
                    userCard.classList.add("editing")
                    const name = userCard.querySelector(".user-row h4")?.textContent || ""
                    const role = userCard.querySelectorAll("h4")[1]?.textContent || ""
                    const assignedProject = userCard.querySelectorAll("h4")[2]?.textContent || ""
                    const phone = userCard.querySelector(".user-details-content p:nth-child(1) span")?.textContent || ""
                    const email = userCard.querySelector(".user-details-content p:nth-child(2) span")?.textContent || ""
                    const notes = userCard.querySelector(".user-details-content p:nth-child(3) span")?.textContent || ""
                    const form = document.getElementById("edit-user-form") as HTMLFormElement
                    if (form) {
                        const nameInput = form.elements.namedItem("userName") as HTMLInputElement
                        const roleInput = form.elements.namedItem("userRole") as HTMLInputElement
                        const assignedProjectInput = form.elements.namedItem("assignedProject") as HTMLInputElement
                        const phoneInput = form.elements.namedItem("phone") as HTMLInputElement
                        const emailInput = form.elements.namedItem("email") as HTMLInputElement
                        const notesInput = form.elements.namedItem("notes") as HTMLTextAreaElement
                        if (nameInput) nameInput.value = name
                        if (roleInput) roleInput.value = role
                        if (assignedProjectInput) assignedProjectInput.value = assignedProject
                        if (phoneInput) phoneInput.value = phone
                        if (emailInput) emailInput.value = email
                        if (notesInput) notesInput.value = notes
                    }
                }
                modal.showModal()
            }
        }
    })

    const editUserForm = document.getElementById("edit-user-form")
    if (editUserForm && editUserForm instanceof HTMLFormElement) {
        editUserForm.onsubmit = (e) => {
            e.preventDefault()
            const formData = new FormData(editUserForm)
            const status = formData.get("userStatus") as string
            const name = formData.get("userName") as string
            const role = formData.get("userRole") as string


            const activeUserCard = document.querySelector(".user-card.editing")
            if (activeUserCard) {

                const photoFile = (editUserForm.querySelector("input[name='userPhoto']") as HTMLInputElement).files?.[0]
                if (photoFile) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                        const photoSrc = event.target?.result as string
                        const avatarEl = activeUserCard.querySelector(".user-avatar") as HTMLImageElement
                        if (avatarEl && photoSrc) {
                            avatarEl.src = photoSrc
                        }
                    }
                    reader.readAsDataURL(photoFile)
                }

                const nameEl = activeUserCard.querySelector(".user-row h4")
                if (nameEl) nameEl.textContent = name


                const roleEl = activeUserCard.querySelectorAll("h4")[1]
                if (roleEl) roleEl.textContent = role


                const statusBtn = activeUserCard.querySelector(".status-btn") as HTMLElement
                if (statusBtn) {
                    statusBtn.textContent = status
                    statusBtn.style.backgroundColor = 
                        status === "Active" ? "green" :
                        status === "Pending" ? "#FB923C" :
                        "#686868"
                }
                activeUserCard.classList.remove("editing")
            }

            const modal = document.getElementById("edit-user-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                modal.close()
            }
        }
    }

    const newUserBtn = document.getElementById("new-user-btn")
    if (newUserBtn) {
        newUserBtn.addEventListener("click", () => {
            const modal = document.getElementById("new-user-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                modal.showModal()
            }
        })
    }

    const cancelNewUserBtn = document.getElementById("cancel-new-user-btn")
    if (cancelNewUserBtn) {
        cancelNewUserBtn.addEventListener("click", () => {
            const modal = document.getElementById("new-user-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                modal.close()
            }
        })
    }

    const newUserForm = document.getElementById("new-user-form")
    if (newUserForm && newUserForm instanceof HTMLFormElement) {
        newUserForm.onsubmit = (e) => {
            e.preventDefault()
            const formData = new FormData(newUserForm)
            
            const userName = formData.get("userName") as string
            const userRole = formData.get("userRole") as string
            const userStatus = formData.get("userStatus") as string
            const assignedProject = formData.get("assignedProject") as string
            const phone = formData.get("phone") as string
            const email = formData.get("email") as string
            const notes = formData.get("notes") as string
            const address = formData.get("address") as string
            const companyName = formData.get("companyName") as string

            const statusColor = userStatus === "Active" ? "green" :
                            userStatus === "Pending" ? "#FB923C" : "#686868"

            const usersList = document.getElementById("user-list")
            if (!usersList) { return }

            const userCount = usersList.querySelectorAll(".user-card").length + 1

            const createUser = (photoSrc: string) => {
                const newUser = document.createElement("details")
                newUser.className = "user-row user-card"
                newUser.innerHTML = `
                    <summary style="list-style: none;">
                        <div class="user-main-info" style="display: grid; grid-template-columns: 50px 2fr 1fr 1fr 1fr 50px 50px; align-items: center; padding: 20px 10px;">
                            <span class="user-index">${userCount}</span>
                            <div style="display: flex; column-gap: 8px; align-items: center;">
                                <img class="user-avatar" src="${photoSrc}" style="width: 30px; height: 30px; border-radius: 50%;">
                                <h4 style="margin: 0;">${userName}</h4>
                            </div>
                            <h4>${userRole}</h4>
                            <h4>${assignedProject}</h4>
                            <div class="status-btn" style="display:flex; align-items: center; justify-content: center; border-radius: 20px; background-color: ${statusColor}; width: 100px; padding: 8px;">
                                <p>${userStatus}</p>
                            </div>
                            <span class="material-symbols-rounded edit-user-btn" style="cursor: pointer; color: #029AE0; font-size: 20px; margin-left: 10px;">edit_square</span>
                            <span class="material-symbols-rounded delete-user-btn" style="cursor: pointer; color: #029AE0; font-size: 20px;">delete</span>
                        </div>
                    </summary>
                    <hr style="border: 1px solid; color: #333333; margin: 0px 20px;">
                    <div style="padding: 10px 45px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; color: #969696; font-size: 14px;">
                        <div class="user-details-content">
                            <p>Phone: <span style="color: white;">${phone}</span></p>
                            <p>Email: <span style="color: white;">${email}</span></p>
                            <p>Notes: <span style="color: white;">${notes}</span></p>
                        </div>
                        <div class="user-details-content">
                            <p>Company Name: <span style="color: white;">${companyName}</span></p>
                            <p>Address: <span style="color: white;">${address}</span></p>
                        </div>
                    </div>
                `
                usersList.appendChild(newUser)
            }

            const photoFile = (newUserForm.querySelector("input[name='userPhoto']") as HTMLInputElement).files?.[0]
            if (photoFile) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    const photoSrc = event.target?.result as string
                    createUser(photoSrc)
                }
                reader.readAsDataURL(photoFile)
            } else {
                createUser("")
            }

            newUserForm.reset()
            const modal = document.getElementById("new-user-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                modal.close()
            }
        }
    }

