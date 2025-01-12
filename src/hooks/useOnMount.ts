import { useEffect, useRef } from 'react';

export const useOnMount = (callBack: () => void) => {
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      callBack();
    }
  }, [callBack]);
};
