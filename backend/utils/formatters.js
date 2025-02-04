import moment from "moment-timezone";

export const fullName = (firstName, lastName) => {
  const fname = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const lname = lastName.charAt(0).toUpperCase() + lastName.slice(1);
  return `${fname} ${lname}`;
};

export const dateSouthAfrica = moment.tz(Date.now(), "Africa/Johannesburg");
