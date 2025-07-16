import { useNavigate } from 'react-router-dom';

export const useErrorPageNavigation = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
  };

  const reload = () => {
    window.location.reload();
  };

  return {
    goBack,
    goHome,
    reload
  };
};