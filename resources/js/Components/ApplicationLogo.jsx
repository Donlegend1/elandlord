export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Roof lines */}
            <path
                d="M6 22L20 8L34 22"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-maroon-600"
            />
            {/* Columns/M */}
            <path
                d="M12 32V20L20 26L28 20V32"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-800"
            />
            {/* Subtle C curve behind/around the M */}
            <path
                d="M30 18C30 18 32 20 32 23C32 27 28 30 20 30C12 30 8 27 8 23"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="text-maroon-500"
            />
        </svg>
    );
}

