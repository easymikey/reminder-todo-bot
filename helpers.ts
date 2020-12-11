const getLocaleDate = (
  stamp: number,
  dateOptions: Intl.DateTimeFormatOptions,
) => new Date(stamp).toLocaleString(undefined, dateOptions);

export { getLocaleDate };
