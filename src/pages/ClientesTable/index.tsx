import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select'; 
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Option } from '../ClienteForms';
import { cidades } from '../../utils/cidades';
import { fetchCepData } from '../../utils/viacep';
import { customFetch } from '../../utils/api';

interface Cliente {
    code: number;
    name: string;
    cep: string;
    address: string;
    city: Option | null;
}

export const ClientesTable = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editRow, setEditRow] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Cliente>>({});
  const [availableCities, setAvailableCities] = useState<Option[]>(cidades);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await customFetch('/clientes');
        const data = await response.json();
        setClientes(data.map((cliente: any) => {
            return {
                code: cliente.codigo,
                name: cliente.nome,
                cep: cliente.cep,
                address: cliente.endereco,
                city: {
                    value: cliente.cidade,
                    label: cliente.cidade,
                }
            }
        }));
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, cep: value }));

    if (value.length === 8) {
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
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleEdit = (code: number) => {
    navigate(`/cliente-form/${code}`);
  };

  const handleDelete = async (code: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        const response = await customFetch(`/clientes/${code}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Erro ao excluir cliente');
        }

        setClientes(clientes.filter((cliente) => cliente.code !== code));
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const handleDoubleClick = (code: number, cliente: Cliente) => {
    setEditRow(code);
    setFormData(cliente);
  };

  const handleSave = async (code: number) => {
    try {
      const response = await customFetch(`/clientes/${code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: formData.name || '',
            cep: formData.cep || '',
            endereco: formData.address || '',
            cidade: formData.city?.label || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar cliente');
      }

      const updatedCliente = await response.json();
      setClientes((prev) =>
        prev.map((cliente) => (cliente.code === code ? {
            code: updatedCliente.codigo,
            name: updatedCliente.nome,
            cep: updatedCliente.cep,
            address: updatedCliente.endereco,
            city: {
                value: updatedCliente.cidade,
                label: updatedCliente.cidade,
            },
        } : cliente))
      );
      setEditRow(null);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleCancel = () => {
    setEditRow(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#8bcffa] p-4">
      <div className="container mx-auto">
        <div className="flex flex-col justify-center items-center mb-4">
          <h1 className="text-3xl text-[#0c0c0c] font-bold">Lista de Clientes</h1>
          <div className='w-full py-4 flex justify-end'>
          <Button
            text="Adicionar um novo cliente"
            bgColor="bg-[#0000ff]"
            textColor="text-white"
            width='w-64'
            onClick={() => navigate('/cliente-form')}
          />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full min-w-max text-left table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 rounded-tl-lg">Nome</th>
                <th className="p-4">CEP</th>
                <th className="p-4">Endereço</th>
                <th className="p-4">Cidade</th>
                <th className="p-4 rounded-tr-lg">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr
                  key={cliente.code}
                  className="border-t border-gray-300 hover:bg-gray-100"
                  onDoubleClick={() => handleDoubleClick(cliente.code, cliente)}
                >
                  <td className="p-4">
                    {editRow === cliente.code ? (
                      <Input
                        label="Nome"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        placeholder="Digite seu nome"
                      />
                    ) : (
                      cliente.name
                    )}
                  </td>
                  <td className="p-4">
                    {editRow === cliente.code ? (
                      <Input
                        label="CEP"
                        name="cep"
                        value={formData.cep || ''}
                        onChange={handleCepChange}
                        placeholder="Digite o CEP"
                      />
                    ) : (
                      cliente.cep
                    )}
                  </td>
                  <td className="p-4">
                    {editRow === cliente.code ? (
                      <Input
                        label="Endereço"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                        placeholder="Digite o endereço"
                      />
                    ) : (
                      cliente.address
                    )}
                  </td>
                  <td className="p-5 align-bottom">
                    {editRow === cliente.code ? (
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
                    ) : (
                      <span>{cliente.city?.label || ''}</span>
                    )}
                  </td>
                  <td className="px-4 w-48 w">
                    {editRow === cliente.code ? (
                      <div className="pt-3 flex justify-center items-center gap-4">
                        <Button
                          text="Salvar"
                          bgColor="bg-blue-400"
                          textColor="text-white"
                          onClick={() => handleSave(cliente.code)}
                        />
                        <Button
                          text="Cancelar"
                          bgColor="bg-red-500"
                          textColor="text-white"
                          onClick={handleCancel}
                        />
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <Button
                          text="Editar"
                          bgColor="bg-green-500"
                          textColor="text-white"
                          onClick={() => handleEdit(cliente.code)}
                        />
                        <Button
                          text="Excluir"
                          bgColor="bg-red-500"
                          textColor="text-white"
                          onClick={() => handleDelete(cliente.code)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
