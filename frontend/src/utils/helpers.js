export const generateRandomArray = (length, min, max) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1) + min));
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const saveToHistory = async (title, type, algo, data, language = 'javascript') => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch('http://localhost:5000/api/visualizations/save', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        type,
        algo,
        data,
        language
      })
    });
    return await response.json();
  } catch (err) {
    console.error(`Failed to save ${type} history`, err);
  }
};
