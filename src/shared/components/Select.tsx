import React, { FC, PropsWithChildren, useId } from "react";
import cx from "classnames";

type SelectProps = PropsWithChildren<{
  value: string;
  onChange: (e: any) => void;
  className?: string;
  label?: string;
  error?: string;
}> & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

const Select: FC<SelectProps> = ({ children, value, onChange, className, label, error, ...rest }) => {
  const id = useId();
  return (
    <div className={cx("Select", className)}>
      {!!label && <label htmlFor={id}>{label}</label>}
      <select value={value} onChange={onChange} {...rest}>
        {children}
      </select>
      {!!error && <span className="error">{error}</span>}
    </div>
  );
};

export default Select;
