export const getDateFromFileName = (fileName: string) => {
  const sDate = fileName.slice(0, 8);
  const date = new Date(
    Number(sDate.slice(0, 4)),
    Number(sDate.slice(4, 6)) - 1,
    Number(sDate.slice(6, 8))
  );
  return date;
};

// format: YYYY/MM/DD
export const formatDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
};
