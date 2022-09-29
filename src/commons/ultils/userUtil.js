import { DEPARTMENTS, ROLES } from "../constants/userConstants"


export const getDepartmentName = (id) => {
    if(id === null) return ""
    let department = DEPARTMENTS.find(item => item.id === id)
    return department?department.name:""
}

export const getRoleId = (name) => {
    if(name === null) return ""
    let role = ROLES.find(item => item.name === name)
    return role?role.id:null
}