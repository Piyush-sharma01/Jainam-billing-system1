// Simple pub/sub so any component can know "is a request in flight right now"
// without prop-drilling or a state library. api.js calls start()/stop() from
// its axios interceptors; GlobalLoadingBar subscribes to re-render on change.

let activeRequests = 0;
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn(activeRequests));
}

export function startRequest() {
  activeRequests += 1;
  notify();
}

export function stopRequest() {
  activeRequests = Math.max(0, activeRequests - 1);
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  // send current value immediately so late subscribers aren't out of sync
  fn(activeRequests);
  return () => listeners.delete(fn);
}