// Makes a cumulus coverage map off the main thread (see weather.ts).

import { makeWeather } from './weather.ts';

self.onmessage = (e: MessageEvent<number>) => {
  const w = makeWeather(e.data);
  (self as unknown as Worker).postMessage({ seed: e.data, ...w }, [w.data.buffer, w.sorted.buffer]);
};
