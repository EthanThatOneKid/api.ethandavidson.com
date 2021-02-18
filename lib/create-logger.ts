export const createLogger = (quiet = false) =>
  (...messages: any[]) => !quiet && console.log(...messages);

export default createLogger;
