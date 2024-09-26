import classNames from 'classnames';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { selectNavFixedAndExpanded, setNavFixedAndExpanded } from 'src/core/store/global/globalSlice';
import { useAppDispatch } from 'src/core/store/hooks';

import Navigation from '../Navigation/Navigation';

import styles from './LayoutWithNavigation.module.scss';

const LayoutWithNavigation: React.FC = () => {
  const dispatch = useAppDispatch();
  const navFixedAndExpanded = useSelector(selectNavFixedAndExpanded);

  return (
    <div className={classNames(styles['layout'], { [styles['fixed-and-expanded']]: navFixedAndExpanded })}>
      <Navigation
        fixedAndExpanded={navFixedAndExpanded}
        onFixExpanded={(value) => {
          dispatch(setNavFixedAndExpanded(value));
        }}
      />
      <section className={styles['content']}>
        <Outlet />
      </section>
    </div>
  );
};

export default memo(LayoutWithNavigation);
