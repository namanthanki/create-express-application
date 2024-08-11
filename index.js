import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
import { exec } from "child_process";

program.version("1.0.0").description("Express.js bootstrapper CLI tool");

program
	.option("-n, --name <name>", "Project name")
	.option("-d, --db <db>", "Database (e.g., MongoDB, PostgreSQL)")
	.option("-t, --template <template>", "Template engine (e.g., EJS, Pug)")
	.option("-p, --pattern <pattern>", "Design pattern (e.g., MVC, MVP)");

program.parse(process.argv);
const options = program.opts();

const questions = [
	{
		type: "input",
		name: "name",
		message: "Enter project name:",
		when: !options.name,
	},
	{
		type: "list",
		name: "db",
		message: "Choose database:",
		choices: ["MongoDB", "PostgreSQL"],
		when: !options.db,
	},
	{
		type: "list",
		name: "template",
		message: "Choose template engine:",
		choices: ["EJS", "Pug"],
		when: !options.template,
	},
	{
		type: "list",
		name: "pattern",
		message: "Choose design pattern:",
		choices: ["MVC", "MVP"],
		when: !options.pattern,
	},
];

inquirer.prompt(questions).then((answers) => {
	const projectName = options.name || answers.name;
	const db = options.db || answers.db;
	const template = options.template || answers.template;
	const pattern = options.pattern || answers.pattern;
	const projectPath = `./${projectName}`;

	// Create project directory
	fs.mkdirSync(projectPath, { recursive: true });

	const packageJson = {
		name: projectName,
		version: "1.0.0",
		dependencies: {
			express: "^4.17.1",
		},
	};

	if (db === "MongoDB") {
		packageJson.dependencies.mongoose = "^6.0.0";
	} else if (db === "PostgreSQL") {
		packageJson.dependencies.pg = "^8.5.0";
	}

	if (template === "EJS") {
		packageJson.dependencies.ejs = "^3.1.0";
	} else if (template === "Pug") {
		packageJson.dependencies.pug = "^3.0.0";
	}

	fs.writeFileSync(
		`${projectPath}/package.json`,
		JSON.stringify(packageJson, null, 2)
	);

	const expressApp = `
const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', '${template.toLowerCase()}');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

app.listen(port, () => {
  console.log(\`Server listening at http://localhost:\${port}\`);
});
`;

	fs.writeFileSync(`${projectPath}/app.js`, expressApp);

	// Create config directory
	fs.mkdirSync(`${projectPath}/config`, { recursive: true });

	const dbConfig = `
module.exports = {
  ${db}: {
    // Add database configuration here
    host: 'localhost',
    port: ${db === "MongoDB" ? 27017 : 5432},
    database: '${projectName}_db',
    user: 'your_username',
    password: 'your_password'
  },
};
`;

	fs.writeFileSync(`${projectPath}/config/database.js`, dbConfig);

	const templateConfig = `
module.exports = {
  ${template}: {
    // Add template engine configuration here
    pretty: true,
    cache: process.env.NODE_ENV === 'production'
  },
};
`;

	fs.writeFileSync(`${projectPath}/config/template.js`, templateConfig);

	console.log(chalk.green(`Project structure created successfully!`));

	// Create directories
	["controllers", "models", "views"].forEach((dir) => {
		fs.mkdirSync(`${projectPath}/${dir}`, { recursive: true });
	});

	// Create a sample view file
	const viewContent =
		template === "EJS"
			? "<h1><%= title %></h1><p>Welcome to <%= title %></p>"
			: "h1= title\np Welcome to #{title}";

	fs.writeFileSync(
		`${projectPath}/views/index.${template.toLowerCase()}`,
		viewContent
	);

	// Function to create a file with content
	const createFile = (path, content) => {
		fs.writeFileSync(path, content);
		console.log(chalk.green(`Created ${path}`));
	};

	// Create a sample controller
	const controllerContent = `
exports.index = (req, res) => {
  res.render('index', { title: 'Express' });
};
`;
	createFile(
		`${projectPath}/controllers/indexController.js`,
		controllerContent
	);

	// Create a sample model
	const modelContent = `
class SampleModel {
  constructor() {
    this.id = null;
    this.name = '';
    this.createdAt = new Date();
  }

  save() {
    // Implement save logic here
    console.log('Saving model...');
  }

  static findById(id) {
    // Implement find by id logic here
    console.log('Finding model by id:', id);
  }
}

module.exports = SampleModel;
`;
	createFile(`${projectPath}/models/sampleModel.js`, modelContent);

	console.log(chalk.yellow("Installing dependencies..."));
	exec(`npm install`, { cwd: projectPath }, (error) => {
		if (error) {
			console.error(
				chalk.red(`Error installing dependencies: ${error.message}`)
			);
		} else {
			console.log(chalk.green("Dependencies installed successfully!"));

			console.log(
				chalk.yellow("Project setup complete. To run the application:")
			);
			console.log(chalk.cyan(`cd ${projectName}`));
			console.log(chalk.cyan("node app.js"));
		}
	});
});
