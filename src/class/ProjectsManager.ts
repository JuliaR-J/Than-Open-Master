import {IProject, Project, ITodo, UserRole, ProjectStatus, TodoStatus} from "./Project"

export class ProjectsManager {
list: Project [] = [] //this means {} array of projects
ui:HTMLElement

constructor (container: HTMLElement) {
    this.ui = container
}

newProject(data: IProject) {
    if (data.name.length < 5) {
        throw new Error(`Project name must be at least 5 characters long.`)
    }
    const projectNames = this.list.map((project) => { //I want to not create a project if there is already a projcet with a given name. map is taking project names
        return project.name //it returns project names
    })
    const nameInUse = projectNames.includes(data.name)
    if (nameInUse)  {
        throw new Error(`A project with the name "${data.name}" already exists.`)
    }
    
    
    const project = new Project(data)
    project.ui.addEventListener("click", () => {
        const projectPage = document.getElementById("project-page")
        const detailsPage = document.getElementById("project-details")
        if(!projectPage || !detailsPage) {return} // || is a logid operator OR

       
        projectPage.style.display = "none"
        detailsPage.style.display = "grid"
        this.setDetailsPage(project)
    })
    this.ui.append(project.ui)
    this.list.push(project)
    return project
}

private setDetailsPage(project:Project) {
    const detailsAcronym = document.getElementById("details-acronym")
    if (detailsAcronym) {
    detailsAcronym.textContent = project.acronym
    detailsAcronym.style.backgroundColor = project.color }      

    
    const detailsPage = document.getElementById("project-details")
    if (!detailsPage) {return}
    const name = detailsPage.querySelector("[data-project-info='name']")
    if (name) {name.textContent = project.name}
    const description = detailsPage.querySelector("[data-project-info='description']")
    if (description) {description.textContent = project.description}


    const cardName = detailsPage.querySelector("[data-project-info='cardName']")
    if (cardName) {cardName.textContent = project.name}
    const cardDescription = detailsPage.querySelector("[data-project-info='cardDescription']")
    if (cardDescription) {cardDescription.textContent = project.description}
    const status = detailsPage.querySelector("[data-project-info='projectStatus']")
    if (status) {status.textContent = project.projectStatus }
    const cost = detailsPage.querySelector("[data-project-info='cost']")
    if (cost) {cost.textContent = `$ ${project.cost.toLocaleString("en-US")}` }
    const role = detailsPage.querySelector("[data-project-info='userRole']")
    if (role) { role.textContent = project.userRole }
    const finishDate = detailsPage.querySelector("[data-project-info='finishDate']")
    if (finishDate) { finishDate.textContent = project.finishDate.toDateString() }

    const addTodoBtn = document.getElementById("add-todo-btn")
    if (addTodoBtn) {
        addTodoBtn.onclick = () => {
            const modal = document.getElementById("new-todo-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                modal.showModal()
            }
        }
    }
    const cancelTodoBtn = document.getElementById("cancel-todo-btn")
    if (cancelTodoBtn) {
        cancelTodoBtn.onclick = () => {
            const modal = document.getElementById("new-todo-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                modal.close()
            }
        }
    }

    const todoForm = document.getElementById("new-todo-form")
    if (todoForm && todoForm instanceof HTMLFormElement) {
        todoForm.onsubmit = (e) => {
            e.preventDefault()
            const formData = new FormData(todoForm)
            
            const todoData: ITodo = {
                name: formData.get("todoName") as string,
                type: formData.get("todoType") as string,
                date: new Date(formData.get("todoDate") as string),
                status: formData.get("todoStatus") as TodoStatus
            }

            project.todoList.push(todoData)  // save to the project
            this.updateTodoList(project)     // update UI
            
            todoForm.reset()
            const modal = document.getElementById("new-todo-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                modal.close()
            }
        }
    }

    const editBtn = document.getElementById("edit-project-btn")
    if (editBtn) {
        editBtn.onclick = () => {
            const modal = document.getElementById("edit-project-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                const form = document.getElementById("edit-project-form") as HTMLFormElement
                if (form) {
                    (form.elements.namedItem("name") as HTMLInputElement).value = project.name;
                    (form.elements.namedItem("description") as HTMLTextAreaElement).value = project.description;
                    (form.elements.namedItem("userRole") as HTMLSelectElement).value = project.userRole;
                    (form.elements.namedItem("projectStatus") as HTMLSelectElement).value = project.projectStatus;
                    (form.elements.namedItem("cost") as HTMLInputElement).value = project.cost.toString();
                    (form.elements.namedItem("finishDate") as HTMLInputElement).value = project.finishDate.toISOString().split("T")[0];
                }
                modal.showModal()
            }
        }
    }

    const cancelEditBtn = document.getElementById("cancel-edit-btn")
    if (cancelEditBtn) {
        cancelEditBtn.onclick = () => {
            const modal = document.getElementById("edit-project-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                modal.close()
            }
        }
    }

    const editForm = document.getElementById("edit-project-form")
    if (editForm && editForm instanceof HTMLFormElement) {
        editForm.onsubmit = (e) => {
            e.preventDefault()
            const formData = new FormData(editForm)
            project.name = formData.get("name") as string
            project.description = formData.get("description") as string
            project.userRole = formData.get("userRole") as UserRole
            project.projectStatus = formData.get("projectStatus") as ProjectStatus
            project.finishDate = new Date(formData.get("finishDate") as string)
            project.cost = Number(formData.get("cost"))
            this.setDetailsPage(project)
            const modal = document.getElementById("edit-project-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                modal.close()
            }
        }
    }
}

private updateTodoList(project: Project) {
    const todoListUI = document.getElementById("todo-list")
    if (!todoListUI) { return }
    
    todoListUI.innerHTML = ""
    
    for (const todo of project.todoList) {
        const icon = todo.type === "Construction" ? "construction" : 
                     todo.type === "Design" ? "design_services" :
                     todo.type === "Review" ? "rate_review" :
                     todo.type === "Meeting" ? "groups" : "task"

        const bgColor = todo.status === "to-do" ? "rgba(146, 64, 14, 0.4)" :
                    todo.status === "in-progress" ? "rgba(6, 95, 70, 0.4)" :
                    "rgba(55, 65, 81, 0.4)"

        const todoItem = document.createElement("div")
        todoItem.className = "todo-item"
        todoItem.style.backgroundColor = bgColor
        todoItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; column-gap: 15px; align-items: center;">
                    <span class="material-symbols-rounded" style="padding: 10px; background-color: #686868; border-radius: 10px;">${icon}</span>
                    <p>${todo.name}</p>
                </div>
                <div style="display: flex; align-items: center; column-gap: 10px;">
                    <p style="text-wrap: nowrap;">${new Date(todo.date).toDateString()}</p>
                    <span class="material-symbols-rounded delete-todo-btn" style="cursor: pointer;">delete</span>
                </div>
            </div>
            `
        todoListUI.appendChild(todoItem)
        const deleteBtn = todoItem.querySelector(".delete-todo-btn")
                if (deleteBtn) {
                    deleteBtn.addEventListener("click", (e) => {
                        e.stopPropagation()  // zapobiega otwarciu modalu edycji
                        project.todoList = project.todoList.filter(t => t !== todo)
                        this.updateTodoList(project)
                    })
                }
        todoItem.addEventListener("click", () => {
            console.log("Todo clicked!")  // ← dodaj tymczasowo
            const modal = document.getElementById("edit-todo-modal")
            console.log("Modal found:", modal)  // ← dodaj
            if (modal && modal instanceof HTMLDialogElement) {
                const form = document.getElementById("edit-todo-form") as HTMLFormElement
                if (form) {
                    (form.elements.namedItem("todoName") as HTMLInputElement).value = todo.name;
                    (form.elements.namedItem("todoType") as HTMLSelectElement).value = todo.type;
                    (form.elements.namedItem("todoStatus") as HTMLSelectElement).value = todo.status;
                    const todoDate = new Date(todo.date)
                    const dateValue = isNaN(todoDate.getTime()) ? "" : todoDate.toISOString().split("T")[0] 
                    ;(form.elements.namedItem("todoDate") as HTMLInputElement).value = dateValue
                }
                modal.showModal()

                const editTodoForm = document.getElementById("edit-todo-form")
                if (editTodoForm && editTodoForm instanceof HTMLFormElement) {
                    editTodoForm.onsubmit = (e) => {
                        e.preventDefault()
                        const formData = new FormData(editTodoForm)
                        todo.name = formData.get("todoName") as string
                        todo.type = formData.get("todoType") as string
                        todo.status = formData.get("todoStatus") as TodoStatus
                        todo.date = new Date(formData.get("todoDate") as string)
                        this.updateTodoList(project)
                        modal.close()
                    }
                }

                const cancelEditTodoBtn = document.getElementById("cancel-edit-todo-btn")
                if (cancelEditTodoBtn) {
                    cancelEditTodoBtn.onclick = () => modal.close()
                }

            }
        })

    }
}

getProject(id:string){
   const project = this.list.find((project) => {
        return project.id === id //ts sprawdza czy id ma ta sama wartość i typ
    })
    return project
}


deleteProject(id:string){

    const project = this.getProject(id)
    if (!project) {return} //if the project id is not found than finish the function
    project.ui.remove()  //if the project is found than remove ui from the page

    const remaining = this.list.filter((project) => { // !== zachowaj projekty które nie są tym id
        return project.id !== id
    })
    this.list = remaining
}

getTotalCost () {
    return this.list.reduce(
    (total, project) => {  // total = suma dotychczasowa, project = aktualny projekt
        return total + project.cost  // dodaj koszt do sumy
    }, 
    0  // ← wartość startowa (zaczynamy od 0)
)
}


getProjectName(name:string) {
    const project = this.list.find(project => project.name === name) // search through the list for a project whose name matches the given name
    return project? project.name : null  // if project was found return its name, otherwise return null
}


exportToJSON(fileName: string = "projects") {
   const json = JSON.stringify(this.list, null, 2) // this.list = tablica obiektów Project // null = bez filtrowania // 2 = wcięcie 2 spacje (czytelny format)
   const blob = new Blob([json], {type: 'application/json'}) // Blob = Binary Large Object - plik w pamięci przeglądarki // type: 'application/json' = mówi przeglądarce że to plik JSON
   const url = URL.createObjectURL(blob)
   // Stwórz niewidoczny przycisk <a> i kliknij go a na końcu usuń tymczasowy link
   const a = document.createElement('a') // tworzymy html element
   a.href = url
   a.download = fileName
   a.click()
   URL.revokeObjectURL(url)
}


importFromJSON() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener("load", () => {
        const json = reader.result
        if (!json) { return }
        const projects: IProject[] = JSON.parse(json as string)
        for (const project of projects) {
            const existingProject = this.list.find(p => p.name === project.name)
            if (existingProject) {
                existingProject.description = project.description
                existingProject.userRole = project.userRole
                existingProject.projectStatus = project.projectStatus
                existingProject.finishDate = new Date(project.finishDate)
                existingProject.cost = project.cost
                existingProject.todoList = project.todoList || []  
                existingProject.ui.remove()
                existingProject.ui = null as any
                existingProject.setUI()
                this.ui.append(existingProject.ui)
                this.updateTodoList(existingProject) 

                existingProject.ui.addEventListener("click", () => {
                    const projectPage = document.getElementById("project-page")
                    const detailsPage = document.getElementById("project-details")
                    if (!projectPage || !detailsPage) { return }
                    projectPage.style.display = "none"
                    detailsPage.style.display = "grid"
                    this.setDetailsPage(existingProject)
                })

            } else {
                try {
                    this.newProject(project)
                } catch (error) {
                    console.warn("Could not import project:", error)
                }
            }
        }
    })
    input.addEventListener('change', () => {
        const filesList = input.files
        if (!filesList) { return }
        reader.readAsText(filesList[0])
    })
    input.click()
}

}
