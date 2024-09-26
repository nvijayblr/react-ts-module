import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { hasNoSelectedSites } from 'src/modules/sites/sitesSlice';
import { Routes } from 'src/routes';

import Footer from '../Footer/Footer';

import styles from './LayoutWithHeaderAndFooter.module.scss';

interface IProps {
  allowAccessWithoutSites?: boolean;
}

const LayoutForSites: React.FC<IProps> = (props) => {
  const hasNoSites = useSelector(hasNoSelectedSites);
  const location = useLocation();
  const currentlyNotOnSiteSelectionPage = location.pathname !== Routes.Map;

  if (!props.allowAccessWithoutSites && hasNoSites && currentlyNotOnSiteSelectionPage) {
    return <Navigate to={Routes.Map} replace />;
  }

  return (
    <div className={styles['layout']}>
      <div className='pl-24 pr-24 pt-24 pb-40'>
        <Outlet />
      </div>
      <Footer className='px-48' />
    </div>
  );
};

export default LayoutForSites;
