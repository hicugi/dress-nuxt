module.exports = {
  apps: [
    {
      name: "dress.rent",
      script: "./.output/server/index.mjs",
      autorestart: true,
      max_memory_restart: "1G",
      NODE_ENV: "production",
      port: "3000",
      host: "127.0.0.1",
      //exec_mode: 'cluster',
      //instances: 'max',
    },
  ],
};
