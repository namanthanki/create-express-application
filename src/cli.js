import { program } from "commander";
import { prompt } from "./prompts.js";
import { generateProject } from "./projectGenerator.js";

program
	.version("1.0.0")
	.description("Express.js project bootstrapper")
	.option("-n, --name <name>", "Project name")
	.option("-d, --directory <directory>", "Project directory")
	.action(async (options) => {
		const answers = await prompt(options);
		await generateProject(answers);
	});

export default program;
