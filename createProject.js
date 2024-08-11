import fs from "fs";
import path from "path";

const createProject = async (options) => {
	const projectName = options.name;
	const projectPath = path.join(process.cwd(), projectName);

	if (fs.existsSync(projectPath)) {
		console.log(`Project ${projectName} already exists`);
		process.exit(1);
	}

	fs.mkdirSync(projectPath);

	fs.mkdirSync(path.join(projectPath, "src"));
	fs.mkdirSync(path.join(projectPath, "src", "controllers"));
	fs.mkdirSync(path.join(projectPath, "src", "models"));
	fs.mkdirSync(path.join(projectPath, "src", "routes"));
	fs.mkdirSync(path.join(projectPath, "src", "views"));
};

export { createProject };
