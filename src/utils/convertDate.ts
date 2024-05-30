const convertDate = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formatter.format(date);
};

export default convertDate;
