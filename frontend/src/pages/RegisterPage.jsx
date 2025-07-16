import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  width: 100%;
  max-width: 450px;
`;

export const RegisterPage = () => {

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader />
        <RegisterForm />
      </RegisterCard>
    </RegisterContainer>
  );
};

const RegisterHeader = () => (
  <div className="text-center mb-8">
    <Link to="/" className="inline-block mb-6">
      <h1 className="text-3xl font-bold text-green-600">Nanwa</h1>
    </Link>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
    <p className="text-gray-600">Join Nanwa to start monitoring your trees</p>
  </div>
); 