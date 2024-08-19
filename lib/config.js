export default {
	supportedDatabases: ["MongoDB", "PostgreSQL", "MySQL", "None"],
	supportedTemplateEngines: ["EJS", "Pug", "Handlebars", "None"],
	supportedDesignPatterns: ["MVC", "Repository", "None"],
	supportedModuleSystems: ["ESM", "CJS"],
	dependencies: {
		MongoDB: { mongoose: "^7.0.3" },
		PostgreSQL: { pg: "^8.10.0" },
		MySQL: { mysql2: "^3.2.0" },
		EJS: { ejs: "^3.1.9" },
		Pug: { pug: "^3.0.2" },
		Handlebars: { "express-handlebars": "^7.0.4" },
	},
	devDependencies: {
		nodemon: "^2.0.22",
		dotenv: "^16.0.3",
	},
};
