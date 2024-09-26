import classNames from 'classnames';

import Logger from 'src/core/service/logger';

import { Icon, SupportedIconColors, SupportedIconSizes } from '../Icon/Icon';
import { SupportedIcon } from '../Icon/gen/suported-icons';

import styles from './Button.module.scss';

/**
 * You should pass `label` or `icon`, or both.
 */
export interface ButtonProps {
  /**
   * Variant will affect how button is visualized
   * @default 'secondary'
   */
  variant?: 'secondary' | 'primary' | 'flat' | 'warning' | 'danger' | 'warning-inverted';
  /**
   * Big size works only with label property
   * @default 'regular'
   */
  size?: 'regular' | 'big' | 'small';
  /**
   * Size of the icon, applied only if icon was passed, by default equal to size `s`
   */
  iconSize?: SupportedIconSizes;
  /**
   * @default 'rect'
   */
  shape?: 'rect' | 'rounded';
  /**
   * Use `submit` for submit actions and forms
   * @default 'button'
   */
  type?: 'button' | 'submit';
  /**
   * Can be passed from top to override pressed status
   */
  isPressed?: boolean;
  title?: string;
  label?: string;
  labelPosition?: 'bottom';
  showIndicator?: boolean;
  isSmallIndicator?: boolean;
  indicatorColor?: 'red' | 'green';
  icon?: SupportedIcon;
  iconColor?: SupportedIconColors;
  /**
   * If the icon goes after the label
   */
  iconPosition?: 'end';
  /**
   * If onClick callback is not passed to button - it will be disabled
   */
  disabled?: boolean;
  onClick?: () => void;
  id?: string;
  className?: string;
  tabIndex?: number;
}

export const Button: React.FC<ButtonProps> = ({
  size = 'regular',
  shape = 'rect',
  variant = 'secondary',
  disabled = false,
  type = 'button',
  iconSize = 's',
  isPressed,
  title,
  label,
  labelPosition,
  showIndicator,
  indicatorColor = 'red',
  isSmallIndicator,
  icon,
  iconColor = 'primary',
  onClick,
  id,
  className,
  tabIndex,
  iconPosition,
}) => {
  Logger.assert(!!(label || icon), 'Icon or Label is required');

  disabled = disabled;

  return (
    <button
      id={id}
      tabIndex={tabIndex}
      type={type}
      title={title}
      disabled={disabled}
      className={classNames('card hov-el-20 body-semi-bold', className, styles['button'], {
        [styles['rounded']]: shape === 'rounded',
        [styles['pressed']]: isPressed,
        [styles['with-label']]: label && !icon,
        [styles[`label-position-${labelPosition}`]]: label && labelPosition,
        [styles['with-icon']]: icon,
        [styles['big-size']]: size === 'big',
        [styles['small-size']]: size === 'small',
        'el-12': variant === 'secondary',
        [styles['primary']]: variant === 'primary',
        [styles['warning']]: variant === 'warning',
        [styles['danger']]: variant === 'danger',
        [styles['warning-inverted']]: variant === 'warning-inverted',
        flat:
          variant === 'flat' ||
          variant === 'secondary' ||
          variant === 'warning' ||
          variant === 'danger' ||
          variant === 'warning-inverted',
      })}
      onClick={
        disabled
          ? undefined
          : (e) => {
              if (onClick) {
                e.preventDefault();
                e.stopPropagation();
                onClick();
              }
            }
      }
    >
      {icon && !iconPosition && <Icon icon={icon} size={iconSize} color={iconColor} />}
      {label && <span> {label}</span>}
      {icon && iconPosition && <Icon icon={icon} size={iconSize} color={iconColor} />}
      {showIndicator && (
        <span
          className={classNames(styles['indicator'], styles[`indicator-${indicatorColor}`], {
            [styles[`indicator-small`]]: isSmallIndicator,
          })}
        />
      )}
    </button>
  );
};
