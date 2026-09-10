
import{IProject, ProjectStatus, UserRole } from "./class/Project"
import {ProjectsManager} from"./class/ProjectsManager"


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
    if(navProjectsBtn) {
        navProjectsBtn.addEventListener("click", () => {
            const projectPage = document.getElementById("project-page")
            const detailsPage = document.getElementById("project-details")
            if(!projectPage || !detailsPage) {return}

            detailsPage.style.display = "none"
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