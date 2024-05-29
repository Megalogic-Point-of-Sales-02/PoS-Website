import mysql from "mysql2/promise";

const createConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  if (connection) console.log(`Connected to the MySQL database: ${process.env.DB_NAME}`);
  return connection;
};

export default createConnection;
