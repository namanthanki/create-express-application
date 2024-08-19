import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { fileURLToPath } from "url";
import { setupDatabase } from "./setupDatabase.js";
import { setupTemplateEngine } from "./setupTemplateEngine.js";
import { setupDesignPattern } from "./setupDesignPattern.js";
import {
	updatePackageJson,
	writeAppJs,
	createProjectStructure,
	createGitignore,
	createEnvFile,
	updateReadme,
	createPackageJson,
} from "./utils.js";
import config from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateProject = async (projectConfig) => {
	const spinner = ora("Generating project...").start();

	try {
		const projectDir = path.join(
			projectConfig.projectDir,
			projectConfig.projectName
		);
		await fs.ensureDir(projectDir);

		// Create project structure
		await createProjectStructure(projectDir);

		// Copy base template
		await fs.copy(path.join(__dirname, "../templates/base"), projectDir);

		// Create initial package.json
		await createPackageJson(
			projectDir,
			projectConfig.projectName,
			projectConfig.moduleSystem
		);

		// Setup chosen features
		await setupDatabase(
			projectDir,
			projectConfig.database,
			projectConfig.moduleSystem
		);
		await setupTemplateEngine(
			projectDir,
			projectConfig.templateEngine,
			projectConfig.moduleSystem
		);
		await setupDesignPattern(
			projectDir,
			projectConfig.designPattern,
			projectConfig.moduleSystem
		);

		// Update package.json with additional dependencies
		await updatePackageJson(projectDir, {
			dependencies: {
				...config.dependencies[projectConfig.database],
				...config.dependencies[projectConfig.templateEngine],
			},
			devDependencies: config.devDependencies,
		});

		// Setup app.js
		await writeAppJs(projectDir, projectConfig);

		// Create .gitignore
		await createGitignore(projectDir);

		// Create .env file
		await createEnvFile(projectDir);

		// Update README.md
		await updateReadme(projectDir, projectConfig.projectName);

		spinner.succeed(
			chalk.green(
				`Project ${projectConfig.projectName} created successfully!`
			)
		);
		logNextSteps(projectConfig.projectName);
	} catch (error) {
		spinner.fail(chalk.red("Error generating project"));
		console.error(error);
	}
};

const logNextSteps = (projectName) => {
	console.log(
		chalk.blue(
			`\nTo get started with your new project, run the following commands:\n`
		)
	);
	console.log(chalk.yellow(`  cd ${projectName}`));
	console.log(chalk.yellow(`  npm install`));
	console.log(chalk.yellow(`  npm run dev`));
	console.log(chalk.blue(`\nHappy coding!`));
};
