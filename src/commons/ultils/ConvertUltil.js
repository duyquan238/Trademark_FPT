export const booleanToString = (bool) => {
    if (typeof(bool) === "boolean") {bool+= ""}
    return bool
  };

export const stringToBoolean = (str) => {
    if(str === "true") {
      str = true
    } 
    if(str === "false") {
      str = false
    } 
    return str
}