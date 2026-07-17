import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
   children: ReactNode
}

 export default function Button({ children, className = "", ...props}: ButtonProps) {
   return  (
      <button className={className} {...props}>
         {children}
      </button>
   )
 }