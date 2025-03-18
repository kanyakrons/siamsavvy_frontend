const formatDate = (dateString) => {
  console.log("🚀 ~ formatDate ~ dateString:", dateString);
  const date = new Date(dateString);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("en-GB", options).format(date);
};

export default formatDate;
