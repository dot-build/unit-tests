import readline from "readline";
import { writeFileSync, copyFileSync, readFileSync } from "fs";
import { spawn } from "child_process";
import { join } from "path";

const dryRun = process.argv.indexOf("--dryRun") !== -1;

export function confirm(question) {
  return new Promise((resolve) => {
    const cli = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    cli.question(`${question} (Y,n)`, (answer) => {
      cli.close();
      resolve(answer === "" || answer.toLowerCase() === "y");
    });
  });
}

export async function installDependencies(dependencies) {
  console.log("Will install:");
  Object.entries(dependencies).forEach(([name, version]) => {
    console.log(`  ${name}@${version}`);
  });

  const ok = await confirm("Install dependencies?");

  if (!ok) {
    return;
  }

  const args = Object.entries(dependencies).map(
    ([name, version]) => `${name}@${version}`
  );

  return new Promise((resolve, reject) => {
    if (dryRun) {
      console.log("npm install -D", ...args);
      resolve();
      return;
    }

    const npm = spawn("npm", ["install", "-D", ...args], { stdio: "inherit" });
    npm.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

export async function copyFiles(sourcePath, files) {
  const ok = await confirm("Update configuration files?");

  if (!ok) {
    return;
  }

  const __dirname = decodeURIComponent(new URL(".", import.meta.url).pathname);

  files.forEach((file) => {
    const source = join(__dirname, sourcePath, file);
    const destination = join(process.cwd(), file);

    console.log(`> Write ${destination}`);

    if (!dryRun) {
      copyFileSync(source, destination);
    }
  });
}

export async function updateScripts(scripts) {
  const answer = await confirm(
    "Update your package.json with new test scripts?"
  );

  if (!answer) {
    return;
  }

  const packageJsonPath = join(process.cwd(), "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath));

  packageJson.scripts = packageJson.scripts || {};
  Object.assign(packageJson.scripts, scripts);

  if (!dryRun) {
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  console.log("> Updated package.json scripts", scripts);
}
