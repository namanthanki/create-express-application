import inquirer from "inquirer";
import config from "./config.js";

export const prompt = async (options) => {
	const questions = [
		{
			type: "input",
			name: "projectName",
			message: "What is your project name?",
			default: options.name || "my-express-app",
			validate: (input) =>
				input.trim() !== "" || "Project name cannot be empty",
		},
		{
			type: "input",
			name: "projectDir",
			message: "Where would you like to create your project?",
			default: options.directory || process.cwd(),
			validate: (input) =>
				input.trim() !== "" || "Project directory cannot be empty",
		},
		{
			type: "list",
			name: "database",
			message: "Which database would you like to use?",
			choices: config.supportedDatabases,
		},
		{
			type: "list",
			name: "templateEngine",
			message: "Which template engine would you like to use?",
			choices: config.supportedTemplateEngines,
		},
		{
			type: "list",
			name: "designPattern",
			message: "Which design pattern would you like to use?",
			choices: config.supportedDesignPatterns,
		},
		{
			type: "list",
			name: "moduleSystem",
			message: "Which module system would you like to use?",
			choices: config.supportedModuleSystems,
		},
	];

	return inquirer.prompt(questions);
};
