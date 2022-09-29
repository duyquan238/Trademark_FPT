import { CATEGORIES, TASK_STATUS, TASK_PRIORITY } from "../constants/taskContants"

export const getCategoryName = (id) => {
    if(id === null) return ""
    let category = CATEGORIES.find(item => item.id == id)
    return category?category.name:""
}

export const getTaskStatusName = (id) => {
    if(id === null) return ""
    let status = TASK_STATUS.find(item => item.id == id)
    return status?status.name:""
}

export const getTaskPriorityName = (id) => {
    if(id === null) return ""
    let priority = TASK_PRIORITY.find(item => item.id == id)
    return priority?priority.name:""
}

export const getCategoryId = (name) => {
    if(name === null) return ""
    let category = CATEGORIES.find(item => item.name == name)
    return category?category.id:""
}

export const getTaskStatusId = (name) => {
    if(name === null) return ""
    let status = TASK_STATUS.find(item => item.name == name)
    return status?status.id:""
}

export const getTaskPriorityId = (name) => {
    if(name === null) return ""
    let priority = TASK_PRIORITY.find(item => item.name == name)
    return priority?priority.id:""
}