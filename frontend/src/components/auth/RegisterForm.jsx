import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormField } from '../ui/FormField';
import { PasswordInput } from '../ui/PasswordInput';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { useRegisterForm } from '../../hooks/useRegisterForm';

export const RegisterForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    passwordStrength,
    handleInputChange,
    handleSubmit
  } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      <FormField
        label="Email address"
        id="email"
        error={errors.email}
        required
      >
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter your email"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        label="Password"
        id="password"
        error={errors.password}
        required
      >
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          placeholder="Create a strong password"
          disabled={isSubmitting}
        />
        <PasswordStrengthIndicator 
          strength={passwordStrength.strength}
          show={formData.password.length > 0}
        />
      </FormField>

      <FormField
        label="Confirm password"
        id="confirmPassword"
        error={errors.confirmPassword}
        required
      >
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          disabled={isSubmitting}
        />
      </FormField>

      <TermsCheckbox disabled={isSubmitting} />

      <SubmitButton isSubmitting={isSubmitting} />

      <SignInPrompt />
    </form>
  );
};

// Sub-components for better organization
const TermsCheckbox = ({ disabled }) => (
  <div className="flex items-center">
    <input
      id="terms"
      name="terms"
      type="checkbox"
      required
      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
      disabled={disabled}
    />
    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
      I agree to the{' '}
      <a href="#" className="font-medium text-green-600 hover:text-green-500">
        Terms of Service
      </a>{' '}
      and{' '}
      <a href="#" className="font-medium text-green-600 hover:text-green-500">
        Privacy Policy
      </a>
    </label>
  </div>
);

const SubmitButton = ({ isSubmitting }) => (
  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isSubmitting ? (
      <div className="flex items-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Creating account...
      </div>
    ) : (
      'Create account'
    )}
  </button>
);

const SignInPrompt = () => (
  <div className="text-center">
    <p className="text-sm text-gray-600">
      Already have an account?{' '}
      <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
        Sign in
      </Link>
    </p>
  </div>
);