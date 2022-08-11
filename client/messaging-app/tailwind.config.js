const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: {
                        white: colors.white,
                        lightGray: colors.gray[100],
                        gray: colors.gray[200],
                        deepGray: colors.gray[300],
                    },
                    dark: {
                        lightGray: colors.gray[700],
                        gray: colors.gray[800],
                        deepGray: colors.gray[900],
                    },
                },
                accent: {
                    base: colors.emerald[400],
                    deep: colors.emerald[600],
                },
                warning: {
                    light: colors.red[300],
                    base: colors.red[500],
                },
            },
        },
    },
    plugins: [],
};
