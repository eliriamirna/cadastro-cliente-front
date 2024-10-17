export const customFetch = async (endpoint: string, options: any = {}, isJson = true) => {
    const url = process.env?.REACT_APP_API_URL || 'http://localhost:5000'
  
    const headers = {
      ...options.headers,
    };
  
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }
  
    const config = {
      ...options,
      headers,
    };
  
    const response = await fetch(`${url}${endpoint}`, config);
  
    return response;
  };