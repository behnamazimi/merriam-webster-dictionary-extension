import cx from "classnames";
import React, { FC } from "react";

import { PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}> & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, onClick, className, ...rest }) => {
  return (
    <button
      className={cx("Button", "button", className)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
