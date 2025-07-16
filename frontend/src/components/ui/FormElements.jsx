import styled from 'styled-components';

// Base form element styles
const baseInputStyles = `
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Container Components
export const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

// Input Components
export const SearchInput = styled.input`
  ${baseInputStyles}
  min-width: 200px;
  flex: 1;
`;

export const TextInput = styled.input`
  ${baseInputStyles}
  width: 100%;
`;

export const FilterSelect = styled.select`
  ${baseInputStyles}
  cursor: pointer;
`;

export const Textarea = styled.textarea`
  ${baseInputStyles}
  width: 100%;
  min-height: 100px;
  resize: vertical;
`;

// Label Components
export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

export const RequiredLabel = styled(Label)`
  &::after {
    content: ' *';
    color: #ef4444;
  }
`;

// Error Components
export const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

// Checkbox and Radio Components
export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 1rem;
  height: 1rem;
  accent-color: #10b981;
  cursor: pointer;
`;

export const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Radio = styled.input.attrs({ type: 'radio' })`
  width: 1rem;
  height: 1rem;
  accent-color: #10b981;
  cursor: pointer;
`;

// Field Sets
export const FieldSet = styled.fieldset`
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0;
  
  legend {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    padding: 0 0.5rem;
  }
`;

// Helper Components
export const HelpText = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

// TODO: Consider moving form validation state to Zustand store
// TODO: Consider adding form validation hooks for consistent error handling