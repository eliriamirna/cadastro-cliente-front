export const customFetch = async (endpoint: string, options: any = {}, isJson = true) => {
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
  
    const response = await fetch(`${endpoint}`, config);
  
    return response;
  };