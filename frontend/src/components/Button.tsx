import type { ButtonHTMLAttributes } from "react";

type Variants = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: Variants;
    disabled?: boolean;
}

export const Button = ({ children, onClick, type, variant="primary", disabled, ...props }: ButtonProps) => {
    const variantsClasses = {
        primary: "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors",
        secondary: "flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors"
    }

    // const renderLoading = () => (
    //     <div className="flex items-center justify-center">
    //       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
    //         <title>Loading spinner</title>
    //         <circle
    //           className="opacity-25"
    //           cx="12"
    //           cy="12"
    //           r="10"
    //           stroke="currentColor"
    //           strokeWidth="4"
    //         />
    //         <path
    //           className="opacity-75"
    //           fill="currentColor"
    //           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    //         />
    //       </svg>
    //       {children}
    //     </div>
    // );

    return (
        <button type={type} disabled={disabled} {...props} onClick={onClick} className={`${variantsClasses[variant]}`}>{children}</button>
    )
}