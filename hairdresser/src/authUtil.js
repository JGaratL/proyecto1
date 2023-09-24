
const handleLogout = (setClienteId, navigate) => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('clienteId');
  setClienteId(null);
  navigate('/');
};

export default handleLogout;
