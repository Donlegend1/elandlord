import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                primary: '#FF2D20',
                maroon: {
                    50: '#fcf3f4',
                    100: '#f9e6e8',
                    200: '#f3c1c5',
                    300: '#e58c95',
                    400: '#d05462',
                    500: '#4C111A', // Primary color from user image
                    600: '#5F1923', // Brighter hover/accent maroon
                    700: '#3D0C13', // Darker shade
                    800: '#2D080E',
                    900: '#1E0408',
                    950: '#120204', // Dark grounding tone
                }
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};

