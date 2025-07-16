import { Link } from 'react-router-dom';
import { Navbar } from '../components/ui/Navbar';
import { ColdStartLoader } from '../components/ui/ColdStartLoader';
import { LoginForm } from '../components/auth/LoginForm';
import { DemoCredentials } from '../components/auth/DemoCredentials';
import { useLogin } from '../hooks/useLogin';

export const LoginPage = () => {
  const {
    errors,
    isSubmitting,
    connectionState,
    handleLogin,
    handleCancelConnection
  } = useLogin();

  return (
    <>
      <Navbar />
      <ColdStartLoader 
        connectionState={connectionState}
        onCancel={handleCancelConnection}
        showCancel={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <LoginHeader />
          <LoginForm 
            onSubmit={handleLogin}
            isSubmitting={isSubmitting}
            errors={errors}
          />
          <DemoCredentials />
        </div>
      </div>
    </>
  );
};

// Header component for the login page
const LoginHeader = () => (
  <div className="text-center mb-8">
    <Link to="/" className="inline-block mb-6">
      <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Nanwa</h1>
    </Link>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
    <p className="text-gray-600 dark:text-gray-300">Sign in to your account to continue</p>
  </div>
); 