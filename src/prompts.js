import inquirer from "inquirer";

export const prompt = async (options) => {
	const questions = [
		{
			type: "input",
			name: "projectName",
			message: "What is your project name?",
			default: options.name || "my-express-app",
		},
		{
			type: "input",
			name: "projectDir",
			message: "Where would you like to create your project?",
			default: options.directory || process.cwd(),
		},
		{
			type: "list",
			name: "database",
			message: "Which database would you like to use?",
			choices: ["MongoDB", "PostgreSQL", "MySQL", "None"],
		},
		{
			type: "list",
			name: "templateEngine",
			message: "Which template engine would you like to use?",
			choices: ["EJS", "Pug", "Handlebars", "None"],
		},
		{
			type: "list",
			name: "designPattern",
			message: "Which design pattern would you like to use?",
			choices: ["MVC", "Repository", "None"],
		},
		{
			type: "list",
			name: "moduleSystem",
			message: "Which module system would you like to use?",
			choices: ["ESM", "CJS"],
		},
	];

	return inquirer.prompt(questions);
};
