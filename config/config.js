module.exports = {
  dialect: "postgres",
  host: "ep-still-snowflake-96122871.us-east-1.postgres.vercel-storage.com",
  port: 5432,
  username: "default",
  password: "hqDzl9QSHjR1",
  database: "verceldb",
  define: {
    timestamps: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Este é específico para conexões com o banco de dados na Vercel
    }
  }
};
