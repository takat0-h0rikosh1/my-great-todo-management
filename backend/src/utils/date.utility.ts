const getTokyoNow = (): Date => {
  const now = new Date();
  const timeZoneOffset = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() + timeZoneOffset + 9 * 60 * 60 * 1000);
};

// return today formated yyyy-MM-dd
export const getTodayString = () => {
  const asiaTokyoTime = getTokyoNow();
  const isoString = asiaTokyoTime.toISOString();
  return isoString.substring(0, 10);
};

export const getTodayISOString = () => {
  const dateString = getTodayString();
  return dateString + 'T00:00:00.000Z';
};
