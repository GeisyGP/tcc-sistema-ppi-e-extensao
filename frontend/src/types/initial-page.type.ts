export enum MenuItens {
    COURSES = "COURSES",
    SUBJECTS = "SUBJECTS",
    PPIS = "PPIS",
    PROJECTS = "PROJECTS",
    USERS = "USERS",
}

export interface InitialPage {
    userInfo: boolean
    menuItens: Array<MenuItens>
    projects: boolean
}
