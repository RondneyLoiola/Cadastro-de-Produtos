interface InputProps {
	label: string;
	type: string;
	placeholder?: string;
	className?: string;
}

export const Input = ({ label, type, placeholder, className, ...props }: InputProps) => {
	return (
		<div className="flex flex-col gap-2">
			<label className="block text-sm font-medium text-gray-900" htmlFor={label}>
				{label}
			</label>
			<input 
				{...props}
				className={`w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`} 
				type={type} 
				placeholder={placeholder}
				id={label}
			/>
		</div>
	);
};