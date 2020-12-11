const getLocaleDate = (
  stamp: number,
  dateOptions: Intl.DateTimeFormatOptions,
) => new Date(stamp).toLocaleString('en-US', dateOptions);

export { getLocaleDate };
