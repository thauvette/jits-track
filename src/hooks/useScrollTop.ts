import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useScrollTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);
};
