import fsExtra from "fs-extra";
import path from "path";

export const setupDatabase = async (projectDir, database, moduleSystem) => {
	const packageJson = await fsExtra.readJson(
		path.join(projectDir, "package.json")
	);

	switch (database) {
		case "MongoDB":
			packageJson.dependencies.mongoose = "^5.12.3";
			await fsExtra.appendFile(
				path.join(projectDir, "app.js"),
				`
${
	moduleSystem === "ESM"
		? "import mongoose from 'mongoose';"
		: "const mongoose = require('mongoose');"
}
mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));
`
			);
			break;
		case "PostgreSQL":
			packageJson.dependencies.pg = "^8.6.0";
			await fsExtra.appendFile(
				path.join(projectDir, "app.js"),
				`
${
	moduleSystem === "ESM"
		? "import pg from 'pg';"
		: "const { Pool } = require('pg');"
}
const pool = new ${moduleSystem === "ESM" ? "pg.Pool" : "Pool"}({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Could not connect to PostgreSQL', err));
`
			);
			break;
		case "MySQL":
			packageJson.dependencies.mysql2 = "^2.2.5";
			await fsExtra.appendFile(
				path.join(projectDir, "app.js"),
				`
${
	moduleSystem === "ESM"
		? "import mysql from 'mysql2';"
		: "const mysql = require('mysql2');"
}
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});
connection.connect(err => {
  if (err) {
    console.error('Could not connect to MySQL', err);
  } else {
    console.log('Connected to MySQL');
  }
});
`
			);
			break;
	}

	await fsExtra.writeJson(
		path.join(projectDir, "package.json"),
		packageJson,
		{
			spaces: 2,
		}
	);
};
