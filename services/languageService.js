const fetch = require('node-fetch'); 

async function getLanguagesFromAPI() {
  const url = 'https://text-translator2.p.rapidapi.com/getLanguages';  
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'ea86ec0756msh17e532df1e1c9c9p170c20jsnebad0933d91c',
      'x-rapidapi-host': 'text-translator2.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const languages = result.data.languages; 
    return languages; 
  } catch (error) {
    console.error('Error fetching languages:', error);
    return [];
  }
}

module.exports = { getLanguagesFromAPI };