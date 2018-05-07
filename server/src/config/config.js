module.exports = {
  port: process.env.port || 8081,
  db: {
    database: process.env.DB_NAME || 'videosystemdb',
    user: process.env.DB_USER ||'postgres',
    password: process.env.DB_PASS ||'123',
    options: {
      dialect: process.env.DIALECT || 'postgres',
      host: process.env.HOST || 'localhost',
      port: 5432
    }
  }
}
