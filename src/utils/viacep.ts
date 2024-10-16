export const fetchCepData = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar o CEP.');
      }
  
      const data = await response.json();
  
      if (data.erro) {
        throw new Error('CEP não encontrado.');
      }
  
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  