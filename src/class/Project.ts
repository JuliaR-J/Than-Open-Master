import{v4 as uuidv4} from 'uuid'
export type ProjectStatus = "pending" | "avtive" | "finished"  // | means or
export type UserRole = "architect" | "engineer" | "developer"


export interface IProject {
    //To satrify IProject
    acronym: string
    name: string
    description: string
    userRole: UserRole
    projectStatus: ProjectStatus
    finishDate: Date
    cost: number 

} //here we describe object datatyoes


export class Project implements IProject{ //implements means that class Project has to have (mandatory) prpoerties defined in the interface
    acronym: string
    name: string
    description: string
    userRole: "architect" | "engineer" | "developer"
    projectStatus: "pending" | "avtive" | "finished" // | means or
    finishDate: Date //here is an object template
 

    //Class internals
    ui!: HTMLElement
    cost: number=0
    progress: number= 0
    id:string

    constructor(data: IProject) {
        this.acronym = data.name
        .split(" ")           // splits the name into words ["Residential", "Building"]
        .map(word => word[0]) // takes the first letter of each word ["R", "B"]
        .join("")             // joins them into a single string "RB"
        .toUpperCase()        // converts to uppercase "RB"

        
        this.name = data.name
        this.description = data.description
        this.userRole = data.userRole
        this.projectStatus = data.projectStatus
        this.finishDate = data.finishDate
        this.cost = data.cost 
        this.id = uuidv4 ()
        this.setUI()
    }
  
    // creates a project card UI fdfdsf
    setUI() {        //Project card UI
        if (this.ui) {return}
        this.ui = document.createElement("article")
        this.ui.className = "project-card"
        this.ui.innerHTML = `
                    <div class="card-header">
                        <p style="background-color: #4ADE80; padding: 10px; align-items: baseline; border-radius: 8px; aspect-ratio: 1;">${this.acronym}</p>
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
                            <P>${this.cost}</P>
                        </div>
                        <div class="card-properties">
                            <p style="color: #969696;">Estimated progress</p>
                            <P>${this.progress * 100}%</P>
                        </div>
                    </div>`
    }}
