import {IProject, Project} from "./Project"

export class ProjectsManager {
list: Project [] = [] //this means {} array of projects
ui:HTMLElement

constructor (container: HTMLElement) {
    this.ui = container
}

newProject(data: IProject) {
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
    detailsAcronym.textContent = project.acronym}      

    
    
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
    reader.addEventListener("load",() =>{
        const json = reader.result
        if (!json) {return}
        const projects: IProject[] = JSON.parse(json as string)
        for (const project of projects) {
            try {
                this.newProject(project)
            } catch (error) {

            }
        }
    })
    input.addEventListener('change', () => {
        const filesList = input.files
        if (!filesList) {return}
        reader.readAsText (filesList[0])
    })
    input.click()

}

}
