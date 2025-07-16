import styled from 'styled-components';

const PasswordStrengthBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const PasswordStrengthFill = styled.div`
  height: 100%;
  background-color: ${props => {
    if (props.strength === 'weak') return '#ef4444';
    if (props.strength === 'medium') return '#f59e0b';
    if (props.strength === 'strong') return '#10b981';
    return '#e5e7eb';
  }};
  width: ${props => {
    if (props.strength === 'weak') return '33%';
    if (props.strength === 'medium') return '66%';
    if (props.strength === 'strong') return '100%';
    return '0%';
  }};
  transition: all 0.3s ease;
`;

const getPasswordStrengthText = (strength) => {
  switch (strength) {
    case 'weak':
      return 'Weak password';
    case 'medium':
      return 'Medium strength password';
    case 'strong':
      return 'Strong password';
    default:
      return '';
  }
};

export const PasswordStrengthIndicator = ({ strength, show }) => {
  if (!show) return null;

  return (
    <div className="mt-2">
      <PasswordStrengthBar>
        <PasswordStrengthFill strength={strength} />
      </PasswordStrengthBar>
      <p className={`text-xs mt-1 ${
        strength === 'weak' ? 'text-red-600' :
        strength === 'medium' ? 'text-yellow-600' :
        strength === 'strong' ? 'text-green-600' : 'text-gray-500'
      }`}>
        {getPasswordStrengthText(strength)}
      </p>
    </div>
  );
};