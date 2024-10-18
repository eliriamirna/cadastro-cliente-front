import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { fetchCepData } from '../../utils/viacep';
import { useParams, useNavigate  } from 'react-router-dom'; 
import { customFetch } from '../../utils/api';
import ReactSelect from 'react-select';
import { cidades } from '../../utils/cidades';

export interface Option {
    value: string;
    label: string;
}

interface FormData {
    name: string;
    cep: string;
    address: string;
    fileName?: string;
    city: Option | null;
}

export function ClienteForm() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    cep: '',
    address: '',
    city: null,
    fileName: '',
  });

  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [availableCities, setAvailableCities] = useState<Option[]>(cidades);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, cep: value }));

    if (value.length === 8) {
      setLoadingCep(true);
      setCepError(null);

      try {
        const data = await fetchCepData(value);
        if (data) {
          const cityOption = {
                label: data.localidade,
                value: data.localidade,
            }
          setAvailableCities((prev) => {
            const isAlreadyOnList = prev.find(cityOption => cityOption.value.toUpperCase() === data.localidade.toUpperCase())
            if (!isAlreadyOnList) {
                return [
                    ...prev,
                    cityOption,
                ]
            }
            return prev;
          })
          setFormData((prev) => {
            return {
                ...prev,
                address: data.logradouro || '',
                city: cityOption,
            }
          })
        } else {
          setCepError('CEP não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setCepError('Erro ao buscar CEP');
      } finally {
        setLoadingCep(false);
      }
    }
  };

  useEffect(() => {
    const fetchClienteData = async (code: string) => {
      try {
        const response = await customFetch(`/clientes/${code}`);
        if (response.ok) {
          const data = await response.json();
          
          setFormData({
            name: data.nome || '',
            cep: data.cep || '',
            address: data.endereco || '',
            city: {
                value: data.cidade,
                label: data.cidade,
            } || null,
            fileName: data.file_name
          });

        } else {
          console.error('Erro ao buscar os dados do cliente');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };
  
    if (code) {
      fetchClienteData(code); 
    }
  }, [code]);

  const handleUpsertFieldData = async () => {
    try {
      const clientData = {
        nome: formData.name || '',
        cep: formData.cep || '',
        endereco: formData.address || '',
        cidade: formData.city?.value || '',
      };

      const url = code
        ? `/clientes/${code}` 
        : '/clientes'; 

      const method = code ? 'PUT' : 'POST';

      const response = await customFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar cliente');
      }

      const savedClient = await response.json();

      if (code) {
        alert('Cliente atualizado com sucesso!');
      } else {
        alert('Cliente criado com sucesso!');
      }

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('codigo', savedClient.codigo); 

        const uploadResponse = await customFetch('/upload', {
          method: 'POST',
          body: formData,
        }, false);

        if (!uploadResponse.ok) {
          throw new Error('Erro ao fazer upload do arquivo');
        }
      }

    navigate('/'); 
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpsertFieldData();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
        'application/pdf': ['.pdf'], 
      },
    maxFiles: 1, 
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#8bcffa] p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#0c0c0c]">Cadastro de Cliente</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite seu nome"
            required
          />
          <Input
            label="CEP"
            name="cep"
            value={formData.cep}
            onChange={handleCepChange}
            placeholder="Digite seu CEP"
            loading={loadingCep}
            error={cepError}
          />
          <Input
            label="Endereço"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Digite seu endereço"
          />
          <ReactSelect
            name="city"
            value={formData.city}
            onChange={(selectedOption) => {
                setFormData(prev => ({
                    ...prev,
                    city: selectedOption,
                }));
            }}
            options={availableCities || []}
            isClearable
            placeholder="Selecione uma cidade"
          />

            <div
                {...getRootProps()}
                className={`border-2 border-dashed p-4 rounded-lg text-center ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}
            >
                <input {...getInputProps()} />
                {
                isDragActive ?
                    <p>Solte o arquivo aqui...</p> :
                    <p>Arraste e solte o arquivo PDF aqui, ou clique para selecionar</p>
                }
                {file && <p className="mt-2 text-green-600">{file.name}</p>}
            </div>

            {code && (
                <p className="mt-2 text-green-600">Arquivo(PDF): {formData.fileName}</p>
            )}
           

            <Button
            text="Salvar"
            bgColor="bg-[#0c0c0c]"
            textColor="text-white"
            type="submit"
            />
        </form>
      </div>
    </div>
  );
};
