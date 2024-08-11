import fsExtra from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import ora from "ora";
import { setupTemplateEngine } from "./templateEngine.js";
import { setupDatabase } from "./database.js";
import { setupDesignPattern } from "./designPattern.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateProject = async (config) => {
	const spinner = ora("Generating project...").start();

	try {
		const projectDir = path.join(config.projectDir, config.projectName);
		await fsExtra.ensureDir(projectDir);

		// Copy base template
		await fsExtra.copy(
			path.join(__dirname, "../templates/base"),
			projectDir
		);

		// Setup package.json
		const packageJson = JSON.parse(
			await fsExtra.readFile(
				path.join(__dirname, "../templates/base/package.json"),
				"utf8"
			)
		);
		packageJson.name = config.projectName;

		// Set module system
		if (config.moduleSystem === "ESM") {
			packageJson.type = "module";
		}

		await fsExtra.writeJson(
			path.join(projectDir, "package.json"),
			packageJson,
			{
				spaces: 2,
			}
		);

		// Setup app.js
		await setupAppJs(projectDir, config.moduleSystem);

		// Setup template engine
		await setupTemplateEngine(
			projectDir,
			config.templateEngine,
			config.moduleSystem
		);

		// Setup database
		await setupDatabase(projectDir, config.database, config.moduleSystem);

		// Setup design pattern
		await setupDesignPattern(
			projectDir,
			config.designPattern,
			config.moduleSystem
		);

		spinner.succeed(
			chalk.green(`Project ${config.projectName} created successfully!`)
		);
		console.log(
			chalk.blue(`\nTo get started, run the following commands:\n`)
		);
		console.log(chalk.yellow(`  cd ${config.projectName}`));
		console.log(chalk.yellow(`  npm install`));
		console.log(chalk.yellow(`  npm start`));
	} catch (error) {
		spinner.fail(chalk.red("Error generating project"));
		console.error(error);
	}
};

async function setupAppJs(projectDir, moduleSystem) {
	const appJsContent = `
${
	moduleSystem === "ESM"
		? "import express from 'express';"
		: "const express = require('express');"
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`;

	await fsExtra.writeFile(path.join(projectDir, "app.js"), appJsContent);
}
