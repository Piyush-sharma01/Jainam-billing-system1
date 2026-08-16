// A tiny in-memory store for the logged-in user, readable both from React
// components (App.jsx) and from plain JS modules like services/api.js
// (which can't use React state/hooks). Nothing here is persisted to
// localStorage — this matches the "always require login on page load"
// behavior the app already has.

let currentUser = null;

export function setCurrentUser(user) {
  currentUser = user;
}

export function getCurrentUser() {
  return currentUser;
}

export function clearCurrentUser() {
  currentUser = null;
}
