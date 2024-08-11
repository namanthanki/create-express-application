import fsExtra from "fs-extra";
import path from "path";

export const setupTemplateEngine = async (projectDir, engine, moduleSystem) => {
	const packageJson = await fsExtra.readJson(
		path.join(projectDir, "package.json")
	);

	switch (engine) {
		case "EJS":
			packageJson.dependencies.ejs = "^3.1.6";
			await fsExtra.appendFile(
				path.join(projectDir, "app.js"),
				`
app.set('view engine', 'ejs');
`
			);
			break;
		case "Pug":
			packageJson.dependencies.pug = "^3.0.2";
			await fsExtra.appendFile(
				path.join(projectDir, "app.js"),
				`
app.set('view engine', 'pug');
`
			);
			break;
		case "Handlebars":
			packageJson.dependencies["express-handlebars"] = "^5.3.0";
			await fsExtra.appendFile(
				path.join(projectDir, "app.js"),
				`
${
	moduleSystem === "ESM"
		? "import exphbs from 'express-handlebars';"
		: "const exphbs = require('express-handlebars');"
}
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
`
			);
			break;
	}

	await fsExtra.writeJson(
		path.join(projectDir, "package.json"),
		packageJson,
		{
			spaces: 2,
		}
	);
};
