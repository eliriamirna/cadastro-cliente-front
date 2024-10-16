import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { fetchCepData } from '../../utils/viacep';
import { useParams } from 'react-router-dom'; 
import { customFetch } from '../../utils/api';
import ReactSelect from 'react-select';
import { cidades } from '../../utils/cidades';

interface Option {
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
  const { codigo } = useParams();
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
    const fetchClienteData = async (codigo: string) => {
      try {
        const response = await customFetch(`http://localhost:5000/clientes/${codigo}`);
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
  
    if (codigo) {
      fetchClienteData(codigo); 
    }
  }, [codigo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    console.log('Arquivo anexado:', file);
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
        <h1 className="text-2xl font-bold mb-6 text-center text-[#0c0c0c]">Cadastro de Clientes</h1>
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
            required
            loading={loadingCep}
            error={cepError}
          />
          <Input
            label="Endereço"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Digite seu endereço"
            required
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
            required
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

            {codigo && (
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
