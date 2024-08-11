import fsExtra from "fs-extra";
import path from "path";

const getImportStatement = (moduleSystem, importPath) => {
	return moduleSystem === "ESM"
		? `import ${importPath};`
		: `const ${importPath.split(" ")[0]} = require('${
				importPath.split("'")[1]
		  }');`;
};

const getExportStatement = (moduleSystem, exportContent) => {
	return moduleSystem === "ESM"
		? `export ${exportContent};`
		: `module.exports = ${exportContent};`;
};

export const setupDesignPattern = async (projectDir, pattern, moduleSystem) => {
	switch (pattern) {
		case "MVC":
			await fsExtra.ensureDir(path.join(projectDir, "models"));
			await fsExtra.ensureDir(path.join(projectDir, "views"));
			await fsExtra.ensureDir(path.join(projectDir, "controllers"));
			await fsExtra.ensureDir(path.join(projectDir, "routes"));

			await fsExtra.appendFile(
				path.join(projectDir, "app.js"),
				`
// MVC setup
${getImportStatement(
	moduleSystem,
	"userRoutes from './routes/userRoutes'" +
		(moduleSystem === "ESM" ? ".js" : "")
)}
app.use('/users', userRoutes);
`
			);

			await fsExtra.writeFile(
				path.join(projectDir, "routes", "userRoutes.js"),
				`
${getImportStatement(moduleSystem, "express from 'express'")}
${getImportStatement(
	moduleSystem,
	"* as userController from '../controllers/userController'" +
		(moduleSystem === "ESM" ? ".js" : "")
)}

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

${getExportStatement(moduleSystem, "router")}
`
			);

			await fsExtra.writeFile(
				path.join(projectDir, "controllers", "userController.js"),
				`
${getImportStatement(
	moduleSystem,
	"User from '../models/user'" + (moduleSystem === "ESM" ? ".js" : "")
)}

${getExportStatement(
	moduleSystem,
	`{
  getAllUsers: (req, res) => {
    // Implementation
  },

  createUser: (req, res) => {
    // Implementation
  }
}`
)}
`
			);

			await fsExtra.writeFile(
				path.join(projectDir, "models", "user.js"),
				`
// User model implementation
`
			);
			break;

		case "Repository":
			await fsExtra.ensureDir(path.join(projectDir, "repositories"));
			await fsExtra.ensureDir(path.join(projectDir, "services"));

			await fsExtra.appendFile(
				path.join(projectDir, "app.js"),
				`
// Repository pattern setup
${getImportStatement(
	moduleSystem,
	"UserService from './services/userService'" +
		(moduleSystem === "ESM" ? ".js" : "")
)}
const userService = new UserService();

app.get('/users', (req, res) => userService.getAllUsers(req, res));
app.post('/users', (req, res) => userService.createUser(req, res));
`
			);

			await fsExtra.writeFile(
				path.join(projectDir, "services", "userService.js"),
				`
${getImportStatement(
	moduleSystem,
	"UserRepository from '../repositories/userRepository'" +
		(moduleSystem === "ESM" ? ".js" : "")
)}

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(req, res) {
    // Implementation
  }

  async createUser(req, res) {
    // Implementation
  }
}

${getExportStatement(moduleSystem, "UserService")}
`
			);

			await fsExtra.writeFile(
				path.join(projectDir, "repositories", "userRepository.js"),
				`
class UserRepository {
  constructor() {
    // Initialize database connection
  }

  async findAll() {
    // Implementation
  }

  async create(userData) {
    // Implementation
  }
}

${getExportStatement(moduleSystem, "UserRepository")}
`
			);
			break;
	}
};
