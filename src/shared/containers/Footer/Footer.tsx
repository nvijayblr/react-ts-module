import classNames from 'classnames';
import { Link } from 'react-router-dom';

import styles from './Footer.module.scss';
import LogoIcon from './footer-logo.svg';

interface Props {
  className?: string;
}

const Footer: React.FC<Props> = ({ className }) => {
  const currentDate = new Date();
  return (
    <footer className={classNames(styles['footer'], className)}>
      <img src={LogoIcon} alt='Orion Logo' className={styles['footer-logo']} />
      <fieldset className={classNames('body-small', 'color-tertiary')}>
        <div>{`© ${currentDate.getFullYear()} TBL Technologies, Inc`}</div>
        <div className={classNames('d-flex flex-wrap gap-8', styles['links'])}>
          <span className={styles['rights']}>All rights reserved</span>
          <span className={styles['separator']}>|</span>
          <Link to='/terms-of-use' className={styles['text']}>
            Terms
          </Link>
          <span className={styles['separator']}>|</span>
          <Link to='/privacy-policy' className={styles['text']}>
            Privacy
          </Link>
        </div>
      </fieldset>
    </footer>
  );
};
export default Footer;
