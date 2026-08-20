const API = window.location.origin;
let token = localStorage.getItem('token') || '';
let user = JSON.parse(localStorage.getItem('user') || 'null');

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { ...headers(), ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function saveAuth(data) {
  token = data.accessToken;
  user = data.user;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
  token = '';
  user = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  location.href = '/';
}

function showUser() {
  const el = document.getElementById('userInfo');
  if (el && user) {
    el.textContent = `Xin chào, ${user.nickname || user.username}`;
  }
}

window.gameAuth = { API, token: () => token, user: () => user, api, saveAuth, logout, showUser, headers };
