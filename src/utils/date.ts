// fileName: yyyymmdd.json
const formatFileNameToDate = (fileName: string) =>
  new Date(
    Number(fileName.slice(0, 4)),
    Number(fileName.slice(4, 6)) - 1,
    Number(fileName.slice(6, 8))
  );

// format: YYYY/MM/DD
const formatDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
};

export { formatFileNameToDate, formatDateToYYYYMMDD };
