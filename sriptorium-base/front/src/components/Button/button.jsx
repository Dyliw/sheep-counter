import { Children } from 'react';
import './button.css';

const Button=({Children, variant = 'primary', onClick, ...props})=>{
  return(
    <button className={'btn btn${variant]'} onClick={onclick} {...props}>
      {Children}
    </button>
  );
};

export default Button;
