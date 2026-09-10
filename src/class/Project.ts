import{v4 as uuidv4} from 'uuid'
export type ProjectStatus = "Pending" | "Active" | "Finished"  // | means or
export type UserRole = "Architect" | "Engineer" | "Developer"


export interface IProject {
    //To satrify IProject
    acronym: string
    name: string
    description: string
    userRole: UserRole
    projectStatus: ProjectStatus
    finishDate: Date
    cost: number 
    color?: string
    todoList?: ITodo[]  

} //here we describe object datatyoes

export type TodoStatus = "to-do" | "in-progress" | "done"

export interface ITodo {
    name: string
    type: string
    date: Date
    status: TodoStatus
}

export class Project implements IProject{ //implements means that class Project has to have (mandatory) prpoerties defined in the interface
    acronym: string
    name: string
    description: string
    userRole: "Architect" | "Engineer" | "Developer"
    projectStatus: "Pending" | "Active" | "Finished" // | means or
    finishDate: Date //here is an object template
 

    //Class internals
    ui!: HTMLElement
    cost: number=0
    progress: number= 0
    id:string
    color: string = ""
    todoList: ITodo[] = []

    //Random colors
    private static colors = [
    "#3730A3",
    "#065F46",
    "#92400E",
    "#1E3A5F",  
    "#4C1D95", 
    "#7F1D1D"
]
private static getRandomColor(): string {
    const index = Math.floor(Math.random() * Project.colors.length)
    return Project.colors[index]
}

    constructor(data: IProject) {
        this.acronym = data.name
        .split(" ")           // splits the name into words ["Residential", "Building"]
        .map(word => word[0]) // takes the first letter of each word ["R", "B"]
        .join("")             // joins them into a single string "RB"
        .toUpperCase()        // converts to uppercase "RB"
        .slice(0,2)

        
        this.name = data.name
        this.description = data.description
        this.userRole = data.userRole
        this.projectStatus = data.projectStatus
        this.finishDate = data.finishDate
        this.cost = data.cost 
        this.id = uuidv4 ()
        this.color = data.color || Project.getRandomColor()
        this.setUI()
    }
  
    // creates a project card UI 
    setUI() {        //Project card UI
        if (this.ui) {return}
        this.ui = document.createElement("article")
        this.ui.className = "project-card"
        this.ui.innerHTML = `
        <div class="card-header">
            <div style="background-color:${this.color}; width: 48px; height: 48px; display: flex; font-size: 18px; font-weight: bold; justify-content: center; align-items: center; border-radius: 8px; flex-shrink: 0; line-height: 1">${this.acronym}</div>
            <div>
                <h5>${this.name}</h5>
                <p style="font-size: 12px;">${this.description}</p>
            </div>
        </div>
        <div class="card-content">
            <div class="card-properties">
                <p style="color: #969696;">Status</p>
                <P>${this.projectStatus}</P>
            </div> 
            <div class="card-properties">
                <p style="color: #969696;">Role</p>
                <P>${this.userRole}</P>
            </div>
            <div class="card-properties">
                <p style="color: #969696;">Cost</p>
                <P>$ ${this.cost.toLocaleString("en-US")}</P>
            </div>
            <div class="card-properties">
                <p style="color: #969696;">Estimated progress</p>
                <P>${this.progress * 100}%</P>
            </div>
        </div>`
    }}
