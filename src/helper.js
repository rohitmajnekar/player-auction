import Papa from 'papaparse';

export const saveDataToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
export const getDataFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
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
