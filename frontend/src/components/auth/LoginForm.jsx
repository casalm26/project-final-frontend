import { Link } from 'react-router-dom';
import { useFormValidation } from '../../hooks/useFormValidation';
import { FormField } from '../ui/FormField';
import { PasswordInput } from '../ui/PasswordInput';

// Login form validation rules
const validateLoginForm = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

export const LoginForm = ({ onSubmit, isSubmitting, errors: externalErrors }) => {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    setErrors
  } = useFormValidation(
    { email: '', password: '' },
    validateLoginForm
  );

  // Merge external errors (like server errors) with form validation errors
  const combinedErrors = { ...errors, ...externalErrors };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {combinedErrors.general && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {combinedErrors.general}
        </div>
      )}

      <FormField
        label="Email address"
        id="email"
        error={combinedErrors.email}
        required
      >
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
            combinedErrors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Enter your email"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField>
        <PasswordInput
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={combinedErrors.password}
          placeholder="Enter your password"
          required
          disabled={isSubmitting}
        />
      </FormField>

      <div className="flex items-center justify-between">
        <RememberMeCheckbox disabled={isSubmitting} />
        <ForgotPasswordLink />
      </div>

      <SubmitButton isSubmitting={isSubmitting} />

      <SignUpPrompt />
    </form>
  );
};

// Sub-components for better organization
const RememberMeCheckbox = ({ disabled }) => (
  <div className="flex items-center">
    <input
      id="remember-me"
      name="remember-me"
      type="checkbox"
      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
      disabled={disabled}
    />
    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-white">
      Remember me
    </label>
  </div>
);

const ForgotPasswordLink = () => (
  <div className="text-sm">
    <a href="#" className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300">
      Forgot your password?
    </a>
  </div>
);

const SubmitButton = ({ isSubmitting }) => (
  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isSubmitting ? (
      <div className="flex items-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Signing in...
      </div>
    ) : (
      'Sign in'
    )}
  </button>
);

const SignUpPrompt = () => (
  <div className="text-center">
    <p className="text-sm text-gray-600 dark:text-gray-300">
      Don't have an account?{' '}
      <Link to="/register" className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300">
        Sign up
      </Link>
    </p>
  </div>
);