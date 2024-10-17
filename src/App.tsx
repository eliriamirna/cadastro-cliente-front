import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ClienteForm } from './pages/ClienteForms';
import { ClientesTable } from './pages/ClientesTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cliente-form" element={<ClienteForm />} />
        <Route path="/cliente-form/:code" element={<ClienteForm />} />
        <Route path="/" element={<ClientesTable />} />
      </Routes>
    </Router>
  );
}

export default App;
