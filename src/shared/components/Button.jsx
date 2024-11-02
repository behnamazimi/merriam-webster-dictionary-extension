import cx from "classnames"

const Button = ({children, onClick, className, ...rest}) => {

  return (
    <button className={cx("Button", "button", className)}
            onClick={onClick}
            {...rest}>
      {children}
    </button>
  )
}

export default Button