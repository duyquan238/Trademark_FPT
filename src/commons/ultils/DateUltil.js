import moment from "moment";

export const calDeadlineDate = (date, months) => {
  return moment(date, "DD-MM-YYYY").add(months, "months");
};

export const addYears = (date, years) => {
  return moment(date, "DD-MM-YYYY").add(years, "years");
};

export const dateFormat = (date, inFormat, outFormat) => {
  try {
    if (!date) {
      return "";
    }
    return moment(date, inFormat).format(outFormat);
  } catch {
    return "";
  }
};

export const dateFormat2 = (date, outFormat) => {
  try {
    if (!date) {
      return "";
    }
    return moment(date).add(7, "hours").format(outFormat);
  } catch {
    return "";
  }
};

export const now = () => {
  return moment().format("YYYY-MM-DD");
};

export const dateDiffFromNow = (date, fromFormat) => {
  let duration = moment.duration(moment(date, fromFormat).diff(moment()));
  var days = Math.ceil(duration.asDays());
  return days;
};

export const timeDiffFromNow = (date) => {
  let duration = moment.duration(moment().diff(moment(date)));
  var years = Math.floor(duration.asYears());
  var months = Math.floor(duration.asMonths());
  var weeks = Math.floor(duration.asWeeks());
  var days = Math.floor(duration.asDays());
  var hours = Math.floor(duration.asHours());
  var minutes = Math.floor(duration.asMinutes());
  if(years > 1) return years + " years ago"
  if(years > 0) return "A year ago"
  if(months > 1) return months + " months ago"
  if(months > 0) return "A month ago"
  if(weeks > 1) return weeks + " weeks ago"
  if(weeks > 0) return "A week ago"
  if(days > 1) return days + " days ago"
  if(days > 0) return "A day ago"
  if(hours > 1) return hours + " hours ago"
  if(hours > 0) return "A hour ago"
  if(minutes > 1) return minutes + " minutes ago"
  if(minutes > 0) return "A minute ago"
  return "Just now";
};