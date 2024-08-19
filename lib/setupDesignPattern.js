import fs from "fs-extra";
import path from "path";
import { getImportStatement, getExportStatement } from "./utils.js";

export const setupDesignPattern = async (projectDir, pattern, moduleSystem) => {
	switch (pattern) {
		case "MVC":
			await setupMVC(projectDir, moduleSystem);
			break;
		case "Repository":
			await setupRepository(projectDir, moduleSystem);
			break;
		case "None":
			// Do nothing
			break;
	}
};

const setupMVC = async (projectDir, moduleSystem) => {
	const dirs = ["controllers", "models", "views", "routes"];
	for (const dir of dirs) {
		await fs.ensureDir(path.join(projectDir, "src", dir));
	}

	// Create sample files
	await createSampleController(projectDir, moduleSystem);
	await createSampleModel(projectDir, moduleSystem);
	await createSampleRoute(projectDir, moduleSystem);
};

const setupRepository = async (projectDir, moduleSystem) => {
	const dirs = ["repositories", "services", "models"];
	for (const dir of dirs) {
		await fs.ensureDir(path.join(projectDir, "src", dir));
	}

	// Create sample files
	await createSampleRepository(projectDir, moduleSystem);
	await createSampleService(projectDir, moduleSystem);
	await createSampleModel(projectDir, moduleSystem);
};

// Helper functions to create sample files
const createSampleController = async (projectDir, moduleSystem) => {
	const content = `
${getImportStatement(moduleSystem, 'User from "../models/User"')}

${getExportStatement(
	moduleSystem,
	`{
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createUser: async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email
    });

    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}`
)}
`;

	await fs.writeFile(
		path.join(projectDir, "src", "controllers", "userController.js"),
		content
	);
};

const createSampleModel = async (projectDir, moduleSystem) => {
	const content = `
${getImportStatement(moduleSystem, 'mongoose from "mongoose"')}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

${getExportStatement(moduleSystem, 'mongoose.model("User", userSchema)')}
`;

	await fs.writeFile(
		path.join(projectDir, "src", "models", "User.js"),
		content
	);
};

const createSampleRoute = async (projectDir, moduleSystem) => {
	const content = `
${getImportStatement(moduleSystem, 'express from "express"')}
${getImportStatement(
	moduleSystem,
	'{ getAllUsers, createUser } from "../controllers/userController"'
)}

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);

${getExportStatement(moduleSystem, "router")}
`;

	await fs.writeFile(
		path.join(projectDir, "src", "routes", "users.js"),
		content
	);
};

const createSampleRepository = async (projectDir, moduleSystem) => {
	const content = `
${getImportStatement(moduleSystem, 'User from "../models/User"')}

class UserRepository {
  async findAll() {
    return User.find();
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }
}

${getExportStatement(moduleSystem, "UserRepository")}
`;

	await fs.writeFile(
		path.join(projectDir, "src", "repositories", "userRepository.js"),
		content
	);
};

const createSampleService = async (projectDir, moduleSystem) => {
	const content = `
${getImportStatement(
	moduleSystem,
	'UserRepository from "../repositories/userRepository"'
)}

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async createUser(userData) {
    return this.userRepository.create(userData);
  }
}

${getExportStatement(moduleSystem, "UserService")}
`;

	await fs.writeFile(
		path.join(projectDir, "src", "services", "userService.js"),
		content
	);
};
