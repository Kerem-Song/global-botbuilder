import classNames from 'classnames';
import { FC } from 'react';

interface Props {
  onToggle?: () => void;
  isOpen: boolean;
  fixed?: boolean;
  dark?: boolean;
  left?: boolean;
}

const Hamburger: FC<Props> = ({
  isOpen,
  fixed = false,
  dark = false,
  left = true,
  ...props
}: Props) => {
  const buttonCss = classNames('luna-hamburger', {
    'luna-hamburger-opend': isOpen && !fixed,
  });
  const wrapCss = classNames('luna-hamburger-wrapper', {
    'luna-hamburger-left': left,
    'luna-hamburger-right': !left,
    'luna-hamburger-dark': dark,
  });

  return (
    <>
      <button aria-label="Open Menu" className={buttonCss} onClick={props.onToggle}>
        <div className={wrapCss}>
          <i className="luna-hamburger-line"></i>
          <i className="luna-hamburger-line"></i>
          <i className="luna-hamburger-line"></i>
        </div>
      </button>
    </>
  );
};

export default Hamburger;
