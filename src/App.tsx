import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { selectIsLoading, setCurrentPage } from 'src/core/store/global/globalSlice';
import { useAppDispatch } from 'src/core/store/hooks';
import ConfirmationModalContainer from 'src/pages/ConfirmationModalContainer';
import ToastCloseButton from 'src/shared/components/Toast/ToastCloseButton';

import './shared/components/charts/MultilineChart/ToolTip.scss';
import styles from './App.module.scss';
import './styles/overwrites/toast.scss';

/**
 * Displays loaded until app is initialized
 */
const App: React.FC = () => {
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setCurrentPage(location.pathname));
  }, [location.pathname]);

  // Hide loader gracefully, when app is loaded
  useEffect(() => {
    if (!isLoading) {
      const now = new Date();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loadingTimeInMs = now.getTime() - (window as any).INITAL_LOADING_TIMESTAMP.getTime();
      const defaultAnimationDuration = 1500;
      const timeToWait = Math.max(0, defaultAnimationDuration - loadingTimeInMs);
      setTimeout(() => {
        const wrapper = document.getElementById('initial-loader-wrapper');
        if (wrapper) {
          wrapper.className = '';
          const opacityTransitionDuration = 300;
          setTimeout(() => {
            wrapper.remove();
            window.document.body.style.position = 'initial';
          }, opacityTransitionDuration);
        }
      }, timeToWait);
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles.app}>
      <Outlet />
      <ToastContainer
        theme='dark'
        hideProgressBar={true}
        position='top-center'
        closeButton={<ToastCloseButton />}
        closeOnClick={false}
      />
      <ConfirmationModalContainer />
    </div>
  );
};

export default App;
