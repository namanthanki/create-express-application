#!/usr/bin/env node
import { program } from "commander";
import { prompt } from "./lib/prompts.js";
import { generateProject } from "./lib/projectGenerator.js";

program
	.version("1.0.0")
	.description("Express.js project scaffolding tool")
	.option("-n, --name <name>", "Project name")
	.option("-d, --directory <directory>", "Project directory")
	.action(async (options) => {
		const answers = await prompt(options);
		await generateProject(answers);
	});

program.parse(process.argv);
