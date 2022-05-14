const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getTimeFromMins = (mins) => (Math.trunc(mins/60) === 0) ? `${mins % 60}m` : `${Math.trunc(mins/60)}h ${mins % 60}m`;


export {getRandomInteger, getTimeFromMins};
