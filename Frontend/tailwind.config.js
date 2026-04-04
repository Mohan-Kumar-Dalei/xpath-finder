import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
    theme: {
        extend: {
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                }
            }

        }
    },
    plugins: [
        scrollbarHide
    ]
}
