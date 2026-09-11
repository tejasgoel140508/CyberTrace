/** @type {import('tailwindcss').Config} */
export default {
  // Resolve paths from this config file rather than from the command's working
  // directory (the npm scripts are run at the repository root).
  content: {
    relative: true,
    files: ["./index.html", "./src/**/*.{ts,tsx}"],
  },
  theme: { extend: {} },
  plugins: [],
};
