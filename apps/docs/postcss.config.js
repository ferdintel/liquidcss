import liquidcss from "@ferdintel/liquidcss-postcss";

export default {
  plugins: [
    liquidcss({
      content: ["./index.html", "./src/**/*.{html,js,ts}"],
    }),
  ],
};
