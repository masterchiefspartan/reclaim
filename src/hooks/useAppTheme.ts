import { useContext } from 'react';

import { AppThemeContext } from '@providers/AppProviders';

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within AppProviders');
  }

  return context;
};

