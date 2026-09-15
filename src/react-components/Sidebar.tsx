import * as React from "react";

export function Sidebar() {
    return (
        <aside id="sidebar">
            <img id="company-logo" src="./assets/company-logo.svg" alt="Construction company"/>
            <ul id="nav-buttons">
                <li id="nav-projects-btn"><span className="material-symbols-rounded">home_work</span>Projects</li>
                <li id="nav-users-btn"><span className="material-symbols-rounded">supervisor_account</span>Users</li>
            </ul>
        </aside>
    )

}