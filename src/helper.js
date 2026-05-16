import Papa from 'papaparse';

const API_BASE = 'http://localhost:5001';

export const saveDataToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getDataFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const loadAppState = async () => {
  const response = await fetch(`${API_BASE}/api/auction-state`);
  if (!response.ok) {
    throw new Error(`Failed to load auction state: ${response.statusText}`);
  }
  return response.json();
};

export const initializeAppState = async (payload) => {
  const response = await fetch(`${API_BASE}/api/auction-state/initialize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to initialize auction state: ${response.statusText}`);
  }
  return response.json();
};

export const saveAppState = async (payload) => {
  const response = await fetch(`${API_BASE}/api/auction-state/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to save auction state: ${response.statusText}`);
  }
  return response.json();
};

export const sellPlayer = async ({ photo, team_id, team_name, team_logo, sale_price }) => {
  const response = await fetch(`${API_BASE}/api/players/sell`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photo, team_id, team_name, team_logo, sale_price }),
  });
  if (!response.ok) {
    throw new Error(`Failed to mark player as sold: ${response.statusText}`);
  }
  return response.json();
};

export const unsellPlayer = async ({ photo }) => {
  const response = await fetch(`${API_BASE}/api/players/unsell`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photo }),
  });
  if (!response.ok) {
    throw new Error(`Failed to revert player sale: ${response.statusText}`);
  }
  return response.json();
};

export const parseCSV = (csvFile) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
