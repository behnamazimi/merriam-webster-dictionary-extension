import {FC, useId} from "react";
import cx from "classnames";

type InputProps = {
  value: string
  onChange: (e: any) => void
  className?: string
  label?: string
  error?: string
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: FC<InputProps> = ({value, onChange, className, label, error, ...rest}) => {
  const id = useId()
  return (
    <span className={cx("Input", rest.type, className)}>
      {!!label && <label htmlFor={id}>{label}</label>}
      <span className="input-group">
        <input onChange={onChange}
               value={value}
               id={id}
               {...rest}/>
      </span>
      {!!error && <span className="error">{error}</span>}
    </span>
  )
}

export default Input