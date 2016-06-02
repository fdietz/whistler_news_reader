/* eslint no-console: 0*/
import Perf from 'react-addons-perf';

const styling = 'background: #CEE; color: #222';

export const performance = store => next => action => {
  const start = window.performance.now();
  const result = next(action);
  const end = window.performance.now();

  const duration = (end - start).toFixed(2);
  console.log(`%c PERF: Action ${action.type} took ${duration} ms.`, styling);

  return result;
};

export const reactPerformance = store => next => action => {
  Perf.start();
  const result = next(action);
  Perf.stop();

  Perf.printWasted();

  return result;
};
