import Vue from "vue";

function formatNumber(num) {
  return num >= 10 ? num : "0" + num;
}

Vue.filter("formatDate", function(date) {
  let newDate = new Date(date);
  let year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  let day = newDate.getDate();
  let hour = newDate.getHours();
  let minute = newDate.getMinutes();
  let second = newDate.getSeconds();
  day = formatNumber(day);
  hour = formatNumber(hour);
  minute = formatNumber(minute);
  second = formatNumber(second);

  let now = new Date().getFullYear();
  if (now === year) {
    return [month, day].join(".") + " " + [hour, minute, second].join(":");
  } else {
    return [year, month, day].join(".") + [hour, minute, second].join(":");
  }
});
export { formateDate };
