module.exports = {
  apps: [
    {
      name: 'FoodAndMove',
      script: 'dist/main.js',
      watch: true,
      ignore_watch: ['node_modules', 'uploads'],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
