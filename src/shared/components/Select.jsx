import {useId} from "react";
import cx from "classnames";

const Select = ({children, value, onChange, className, label, error, ...rest}) => {
  const id = useId()
  return (
    <div className={cx("Select", className)}>
      {!!label && <label htmlFor={id}>{label}</label>}
      <select value={value} onChange={onChange} {...rest}>
        {children}
      </select>
      {!!error && <span className="error">{error}</span>}
    </div>
  )
}

export default Select