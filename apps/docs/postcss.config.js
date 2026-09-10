import liquidcss from "@liquidcss/postcss";

export default {
  plugins: [
    liquidcss({
      content: ["./index.html", "./src/**/*.{html,js,ts}"],
    }),
  ],
};
