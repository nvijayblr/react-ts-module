import classNames from 'classnames';
import _, { intersection, map, throttle } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { UserRoles } from 'src/core/apollo/__generated__/usersGlobalTypes';
import { selectUserRole } from 'src/core/store/global/globalSlice';
import { useAppSelector } from 'src/core/store/hooks';
import {
  selectAvailableSystemForSites,
  selectUniqFeaturesForSites,
  selectUniqUtilityServiceTypesForSites,
} from 'src/modules/sites/sitesSlice';
import { Routes } from 'src/routes';
import { Button } from 'src/shared/components/Button/Button';

import LogoText from '../../../assets/orion-logo-text.svg';
import LogoIcon from '../../../assets/orion-logo.svg';

import { LogoutItem } from './LogoutItem';
import styles from './Navigation.module.scss';
import NavigationGroup from './NavigationGroup';
import NavigationItem from './NavigationItem';
import { INavigationItem, NavItemType, navigationConfig } from './navigationConfig';

interface Props {
  fixedAndExpanded: boolean;
  onFixExpanded: (value: boolean) => void;
}

let lastExpanded: number[] = [];

const Navigation: React.FC<Props> = ({ fixedAndExpanded: fixExpanded, onFixExpanded }) => {
  const [isExpanded, setNavigationExpanded] = useState(false);
  // Store expanded as array if later we need to support opening of several submenus
  const [expandedGroupsIndexes, setExpandedGroupsIndexes] = useState<number[]>(lastExpanded);
  const location = useLocation();
  const currentUserRole = useAppSelector(selectUserRole);
  const availableSystemForSites = useAppSelector(selectAvailableSystemForSites, _.isEqual);
  const features = useAppSelector(selectUniqFeaturesForSites, _.isEqual);
  const utilityServiceTypes = useAppSelector(selectUniqUtilityServiceTypesForSites, _.isEqual);

  // This is a hack to prevent navigation from flickering when user clicks on a link
  // To be defined why react-router remounts element on every redirect
  // @see src/router.tsx
  // element: (
  //     <ProtectedRoutesWrapper>
  //       <LayoutWithNavigation />
  //     </ProtectedRoutesWrapper>
  // ),
  useEffect(() => {
    lastExpanded = expandedGroupsIndexes;
  }, [expandedGroupsIndexes]);

  const isNavigationExpanded = isExpanded || fixExpanded;

  const availableNavigationConfig = useMemo(
    () =>
      navigationConfig
        .filter((navigationItem) => navigationItem.onlyFor?.includes(currentUserRole) ?? true)
        .filter(
          (navigationItem) =>
            (navigationItem.systemTypes?.length &&
              intersection(navigationItem.systemTypes, availableSystemForSites).length > 0) ??
            true
        )
        .filter((navigationItem) => (navigationItem.feature ? features.includes(navigationItem.feature) : true))
        .filter((navigationItem) =>
          navigationItem.utilityType ? utilityServiceTypes.includes(navigationItem.utilityType) : true
        ),
    [currentUserRole, availableSystemForSites, features, utilityServiceTypes]
  );

  const isNavItemActive = useCallback(
    (item: INavigationItem): boolean => {
      const urls = [];
      // If item is group, check if any of its children is active
      if (item.type === NavItemType.Group && item.children) {
        urls.push(...map(item.children, 'linkTo'));
      }
      // If item is not group, check if it is active
      if (item.linkTo) {
        urls.push(item.linkTo);
      }
      // If item has alias, check if it should be active
      if (item.aliasToHighlight) {
        urls.push(item.aliasToHighlight);
      }
      if (item.type === NavItemType.Group && item.linkTo) {
        urls.push(item.linkTo);
      }
      return urls.some((url) => url && location.pathname.startsWith(url));
    },
    [location.pathname]
  );

  const throttleExpand = useCallback(
    throttle(
      (e: React.MouseEvent<HTMLElement>) => {
        // Do not expand if mouse is moved over button which may fix and expand
        // or if navigation is already expanded
        if (isNavigationExpanded) {
          throttleExpand.cancel();
          return;
        }
        if (_.get(e.target, 'id') === 'fix-button' || _.get(e.target, 'parentElement.id') === 'fix-button') {
          throttleExpand.cancel();
          return;
        }
        setNavigationExpanded(true);
      },
      500,
      { leading: false }
    ),
    []
  );

  useEffect(() => {
    if (isNavigationExpanded) {
      const activeGroupIndex = availableNavigationConfig.findIndex(
        (item) => item.type === NavItemType.Group && isNavItemActive(item)
      );
      if (expandedGroupsIndexes.length === 0 && activeGroupIndex) {
        setExpandedGroupsIndexes([activeGroupIndex]);
      }
    }
  }, [isNavigationExpanded, isNavItemActive]);

  function navItemClick(item: INavigationItem, index: number, clickedOnArrow = false) {
    if (clickedOnArrow || (item.type === NavItemType.Group && !item.linkTo)) {
      setNavigationExpanded(true);
      if (expandedGroupsIndexes.includes(index)) {
        setExpandedGroupsIndexes([]);
      } else {
        setExpandedGroupsIndexes([index]);
      }
    } else if ((item.type === NavItemType.Group && item.linkTo) || item.type === NavItemType.Item) {
      collapseNavigationAndGroups();
    }
    item.onClick && item.onClick();
  }

  function collapseNavigationAndGroups() {
    if (fixExpanded) {
      // Do not collapse navigation if it was fixed
      return;
    }
    throttleExpand.cancel();
    _.range(1, 5).forEach((i) => _.delay(throttleExpand.cancel, 100 * i));
    setNavigationExpanded(false);
    setExpandedGroupsIndexes([]);
  }

  function toggleFixed() {
    if (fixExpanded) {
      onFixExpanded(false);
      setNavigationExpanded(false);
      setExpandedGroupsIndexes([]);
    } else {
      onFixExpanded(true);
    }
  }

  return (
    <nav
      className={classNames(styles['nav'], { [styles['expanded']]: isNavigationExpanded })}
      onMouseEnter={throttleExpand}
      onMouseMove={throttleExpand}
      onMouseLeave={collapseNavigationAndGroups}
    >
      <Link to={Routes.Map} className={styles['link-with-logo']}>
        <img src={LogoIcon} alt='Orion logo' className={styles['orion-icon']} />
        <img src={LogoText} alt='Orion' className={styles['orion-text']} />
      </Link>

      <div className={styles['nav-expand-button']}>
        <Button id='fix-button' onClick={toggleFixed} size='small' icon={fixExpanded ? 'angle-left' : 'angle-right'} />
      </div>
      <div
        className={classNames(
          {
            [styles['nav-items']]: currentUserRole !== UserRoles.SUPER_ADMIN,
            [styles['nav-items-big']]: currentUserRole === UserRoles.SUPER_ADMIN,
          },
          'hidden-scrollbar'
        )}
      >
        {/* TODO: uncomment when notifications will be reworked */}
        {/* <div>
          <NotificationNavigationItem />
        </div> */}
        {availableNavigationConfig
          .filter((i) => !i.sticky)
          .map((navigationItem, i) => (
            <div
              key={navigationItem.label ?? i}
              style={
                navigationItem.sticky
                  ? {
                      position: 'absolute',
                      bottom: navigationItem.linkTo === Routes.Admin ? 0 : '56px',
                      width: '100%',
                      background: 'var(--elevation-04)',
                    }
                  : undefined
              }
            >
              {navigationItem.type === NavItemType.Group && (
                <NavigationGroup
                  group={navigationItem}
                  isActive={isNavItemActive(navigationItem)}
                  isExpanded={isNavigationExpanded && expandedGroupsIndexes.includes(i)}
                  onClick={(item) => navItemClick(item, i)}
                  onArrowClick={(item) => navItemClick(item, i, true)}
                />
              )}

              {navigationItem.type === NavItemType.Item && (
                <NavigationItem
                  linkTo={navigationItem.linkTo}
                  label={navigationItem.label}
                  isActive={isNavItemActive(navigationItem)}
                  onClick={() => navItemClick(navigationItem, i)}
                  icon={navigationItem.icon}
                />
              )}

              {navigationItem.type === NavItemType.Divider && <div className={styles['divider']} />}
            </div>
          ))}
      </div>
      {availableNavigationConfig
        .filter((i) => i.sticky)
        .map((navigationItem, i) => (
          <div
            key={navigationItem.label ?? i}
            style={
              navigationItem.sticky
                ? {
                    position: 'absolute',
                    bottom: `${56 * (i + 1) + 24}px`,
                    width: '100%',
                    background: 'var(--elevation-04)',
                  }
                : undefined
            }
          >
            {navigationItem.type === NavItemType.Item && (
              <NavigationItem
                linkTo={navigationItem.linkTo}
                label={navigationItem.label}
                isActive={isNavItemActive(navigationItem)}
                onClick={() => navItemClick(navigationItem, i)}
                icon={navigationItem.icon}
              />
            )}
          </div>
        ))}
      <LogoutItem />
    </nav>
  );
};

export default Navigation;
