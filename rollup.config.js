import babel from 'rollup-plugin-babel';

export default {
  external: [
    `postcss`,
  ],
  plugins: [
    babel(),
  ],
};
