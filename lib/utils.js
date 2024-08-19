import fs from "fs-extra";
import path from "path";

export const getImportStatement = (moduleSystem, importPath) => {
	return moduleSystem === "ESM"
		? `import ${importPath};`
		: `const ${importPath.split(" ")[0]} = require('${
				importPath.split("'")[1]
		  }');`;
};

export const getExportStatement = (moduleSystem, exportContent) => {
	return moduleSystem === "ESM"
		? `export default ${exportContent};`
		: `module.exports = ${exportContent};`;
};

export const updatePackageJson = async (projectDir, updates) => {
	const packageJsonPath = path.join(projectDir, "package.json");
	const packageJson = await fs.readJson(packageJsonPath);
	Object.assign(packageJson, updates);
	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
};

export const appendToFile = async (filePath, content) => {
	await fs.appendFile(filePath, content);
};

export const writeAppJs = async (projectDir, projectConfig) => {
	const { moduleSystem, database, templateEngine } = projectConfig;
	const content = `
${getImportStatement(moduleSystem, 'express from "express"')}
${getImportStatement(moduleSystem, 'path from "path"')}
${moduleSystem === "ESM" ? "import { fileURLToPath } from 'url';" : ""}
${getImportStatement(moduleSystem, 'dotenv from "dotenv"')}
${
	database !== "None"
		? getImportStatement(
				moduleSystem,
				`connectDB from "./config/database.js"`
		  )
		: ""
}

${
	moduleSystem === "ESM"
		? `
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
`
		: ""
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

${
	templateEngine !== "None"
		? `
// Set up template engine
app.set('view engine', '${templateEngine.toLowerCase()}');
app.set('views', path.join(__dirname, 'views'));
`
		: ""
}

${
	database !== "None"
		? `
// Connect to database
connectDB();
`
		: ""
}

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});

${getExportStatement(moduleSystem, "app")}
`;

	await fs.writeFile(path.join(projectDir, "src", "app.js"), content);
};

export const createProjectStructure = async (projectDir) => {
	const dirs = [
		"src",
		"src/config",
		"src/controllers",
		"src/models",
		"src/routes",
		"src/middleware",
		"src/utils",
		"src/views",
		"public",
		"public/css",
		"public/js",
		"public/images",
		"tests",
	];

	for (const dir of dirs) {
		await fs.ensureDir(path.join(projectDir, dir));
	}
};

export const createGitignore = async (projectDir) => {
	const content = `
node_modules/
.env
*.log
.DS_Store
coverage/
`;

	await fs.writeFile(path.join(projectDir, ".gitignore"), content.trim());
};

export const createEnvFile = async (projectDir) => {
	const content = `
PORT=3000
NODE_ENV=development
`;

	await fs.writeFile(path.join(projectDir, ".env"), content.trim());
};

export const updateReadme = async (projectDir, projectName) => {
	const content = `
# ${projectName}

This project was generated with the Express.js Bootstrapper.

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Set up your environment variables by copying the \`.env.example\` file to \`.env\` and updating the values as needed.

3. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

4. Open your browser and navigate to \`http://localhost:3000\`.

## Available Scripts

- \`npm run dev\`: Starts the development server with hot-reloading
- \`npm start\`: Starts the production server
- \`npm test\`: Runs the test suite
- \`npm run lint\`: Lints the code using ESLint

## Project Structure

\`\`\`
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── views/
│   └── app.js
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── tests/
├── .env
├── .gitignore
└── package.json
\`\`\`

## License

This project is licensed under the MIT License.
`;

	await fs.writeFile(path.join(projectDir, "README.md"), content.trim());
};

export const createPackageJson = async (
	projectDir,
	projectName,
	moduleSystem
) => {
	const content = {
		name: projectName,
		version: "1.0.0",
		description: "Express.js project generated with Express Bootstrapper",
		main: "src/app.js",
		type: moduleSystem === "ESM" ? "module" : "commonjs",
		scripts: {
			start: "node src/app.js",
			dev: "nodemon src/app.js",
			test: "jest",
			lint: "eslint .",
		},
		keywords: ["express", "nodejs"],
		author: "",
		license: "MIT",
		dependencies: {
			express: "^4.17.1",
			dotenv: "^10.0.0",
		},
		devDependencies: {
			nodemon: "^2.0.7",
			jest: "^27.0.6",
			eslint: "^7.32.0",
		},
	};

	await fs.writeJson(path.join(projectDir, "package.json"), content, {
		spaces: 2,
	});
};
