import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import './App.css';

// Redux RootState definition mock interface for hook selectors
interface RootState {
  theme: {
    mode: 'light' | 'dark';
  };
}

function App(): React.JSX.Element {
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  // Sync state theme variable with document body CSS classes
  useEffect(() => {
    if (themeMode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [themeMode]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
