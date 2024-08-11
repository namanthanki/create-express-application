#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname } from "path";
import cli from "./src/cli.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cli.parse(process.argv);
