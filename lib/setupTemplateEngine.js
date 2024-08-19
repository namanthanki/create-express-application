import path from "path";
import {
	updatePackageJson,
	appendToFile,
	getImportStatement,
} from "./utils.js";
import config from "./config.js";

export const setupTemplateEngine = async (projectDir, engine, moduleSystem) => {
	if (engine === "None") return;

	const engineConfig = config.dependencies[engine];
	await updatePackageJson(projectDir, { dependencies: engineConfig });

	const engineSetupCode = getTemplateEngineSetupCode(engine, moduleSystem);
	await appendToFile(path.join(projectDir, "src", "app.js"), engineSetupCode);
};

const getTemplateEngineSetupCode = (engine, moduleSystem) => {
	switch (engine) {
		case "EJS":
			return `
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
`;
		case "Pug":
			return `
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
`;
		case "Handlebars":
			return `
${getImportStatement(moduleSystem, 'exphbs from "express-handlebars"')}

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
`;
		default:
			return "";
	}
};
