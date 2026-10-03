// A tiny store for the logged-in user, readable both from React components
// (App.jsx) and from plain JS modules like services/api.js (which can't use
// React state/hooks). Backed by localStorage so the session survives a page
// refresh instead of forcing a fresh login every time.

const STORAGE_KEY = "jainam_current_user";

let currentUser = null;
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  currentUser = stored ? JSON.parse(stored) : null;
} catch {
  currentUser = null;
}

export function setCurrentUser(user) {
  currentUser = user;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — session
    // just won't survive a refresh in that case.
  }
}

export function getCurrentUser() {
  return currentUser;
}

export function clearCurrentUser() {
  currentUser = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
