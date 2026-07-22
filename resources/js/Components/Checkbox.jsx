export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-maroon-500 shadow-sm focus:ring-maroon-500 ' +
                className
            }
        />
    );
}

