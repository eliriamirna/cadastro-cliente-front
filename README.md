# Cadastro de Clientes - Frontend

Este projeto é uma aplicação de cadastro básico de clientes, desenvolvida com **React**, **Tailwind CSS**, e **TypeScript**. Ele permite que os usuários adicionem, editem e excluam clientes de uma lista. Além disso, inclui a funcionalidade de preenchimento automático do endereço com base no CEP, utilizando a API **ViaCEP**, e a possibilidade de anexar um arquivo PDF ao cadastro.

## Funcionalidades

- **Adicionar Cliente:** Formulário para adicionar um novo cliente com os seguintes dados:
  - Código (gerado automaticamente)
  - Nome
  - CEP (ao digitar o CEP, o endereço é preenchido automaticamente)
  - Endereço
  - Cidade (selecionável)
  - Upload de um arquivo PDF

- **Editar Cliente:** Possibilidade de editar os dados de um cliente existente com um duplo clique na lista de clientes.

- **Excluir Cliente:** Opção de remover um cliente da lista.

- **Listagem de Clientes:** Exibição dos clientes cadastrados em uma tabela. Os dados podem ser atualizados dinamicamente ao adicionar, editar ou excluir.

## Requisitos do Projeto

### Campos do Cliente
- **Código**: Autoincremento, gerado automaticamente.
- **Nome**: Campo de texto obrigatório.
- **Endereço**: Preenchido automaticamente com base no CEP, mas pode ser editado manualmente.
- **Cidade**: Selecionável após a busca por CEP.
- **CEP**: Ao digitar o CEP, a cidade e o endereço são preenchidos automaticamente usando a API **ViaCEP**.
- **Anexar PDF**: Possibilidade de anexar um arquivo PDF ao cadastro de cada cliente.

## Tecnologias Utilizadas

- **React**: Biblioteca para construir interfaces de usuário.
- **Tailwind CSS**: Framework de CSS utilitário para estilização rápida e eficiente.
- **TypeScript**: Superconjunto do JavaScript que adiciona tipagem estática ao código.
- **ViaCEP**: API para buscar o endereço com base no CEP.
- **react-dropzone**: Biblioteca para facilitar o upload de arquivos (PDF).

## Como Executar o Projeto

1. Clone o repositório:

```bash
    git clone https://github.com/eliriamirna/cadastro-cliente-front
    cd cadastro-cliente-front
```

2. Instale as dependências:

```bash
    npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
    npm start
```

4. Acesse a aplicação no navegador:

- http://localhost:3000

# Estrutura do Projeto

```
├── public
│   └── index.html                  # Página HTML principal
├── src
│   ├── components                  # Componentes reutilizáveis
│   │   ├── Button                  # Componente de botão
│   │   └── Input                   # Componente de input
│   ├── pages
│   │   ├── ClienteForms         # Formulário de cadastro e edição de clientes
│   │   └── ClientesTable        # Tabela que exibe os clientes cadastrados
│   ├── utils                       # Utilitários e serviços
│   │   ├── api.ts                  # Arquivo de configuração da API
│   │   ├── cidade.ts               # Objeto com as cidades
│   │   └── viacep.ts               # Serviço para buscar CEP na API ViaCEP
│   ├── App.tsx                     # Componente principal da aplicação
│   ├── index.tsx                   # Arquivo de entrada
│   └── index.css                   # Arquivo de estilos globais
├── package.json                    # Configurações e dependências do projeto
├── tailwind.config.js              # Configuração do Tailwind CSS
└── tsconfig.json                   # Configuração do TypeScript
```
