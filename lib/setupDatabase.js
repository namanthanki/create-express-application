import path from "path";
import {
	updatePackageJson,
	appendToFile,
	getImportStatement,
} from "./utils.js";
import config from "./config.js";

export const setupDatabase = async (projectDir, database, moduleSystem) => {
	if (database === "None") return;

	const dbConfig = config.dependencies[database];
	await updatePackageJson(projectDir, { dependencies: dbConfig });

	const dbSetupCode = getDatabaseSetupCode(database, moduleSystem);
	await appendToFile(
		path.join(projectDir, "src", "config", "database.js"),
		dbSetupCode
	);
};

const getDatabaseSetupCode = (database, moduleSystem) => {
	switch (database) {
		case "MongoDB":
			return `
${getImportStatement(moduleSystem, 'mongoose from "mongoose"')}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
`;
		case "PostgreSQL":
			return `
${getImportStatement(moduleSystem, 'pg from "pg"')}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
`;
		case "MySQL":
			return `
${getImportStatement(moduleSystem, 'mysql from "mysql2/promise"')}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
`;
		default:
			return "";
	}
};
