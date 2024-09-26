import classNames from 'classnames';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { logout } from 'src/core/service/appLifecycle';
import { selectUserEmail, selectUserName } from 'src/core/store/global/globalSlice';
import { useAppSelector } from 'src/core/store/hooks';
import { Routes } from 'src/routes';
import { Icon } from 'src/shared/components/Icon/Icon';

import styles from './Navigation.module.scss';
import NavigationItem from './NavigationItem';

export const LogoutItem: React.FC = () => {
  const currentUserName = useAppSelector(selectUserName);
  const currentUserEmail = useAppSelector(selectUserEmail);
  const navigate = useNavigate();

  function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    logout();
  }

  function handleNavigationToUserSettings() {
    navigate(Routes.UserSettings);
  }

  return (
    <NavigationItem
      onClick={handleNavigationToUserSettings}
      iconElement={
        <Icon
          onClick={handleLogout}
          icon='download'
          size='m'
          className={classNames('card flat el-none hov-el-16', styles['nav-icon'])}
        />
      }
      icon='download'
      className={styles['logout-item']}
    >
      <div className='one-line-ellipsis d-flex flex-col align-items-start'>
        <h5 className='one-line-ellipsis color-primary'>{currentUserName}</h5>
        <small className='one-line-ellipsis body-small color-secondary'>{currentUserEmail}</small>
      </div>
    </NavigationItem>
  );
};
