import { write } from "bun";

const TASKS = [
  { path: "packages/db/.env", name: "Database Package" },
  { path: "apps/web/.env", name: "Web App" },
];

console.log("\nEnvironment Setup\n");
console.log("This script will set up the DATABASE_URL for your applications.");
console.log("It will create .env files in packages/db and apps/web.\n");

// biome-ignore lint/suspicious/noAlert: CLI script
const dbUrl = prompt("Enter your DATABASE_URL:");

if (!dbUrl?.trim()) {
  console.error("Error: DATABASE_URL cannot be empty.");
  process.exit(1);
}

const content = `DATABASE_URL="${dbUrl.trim()}"\n`;
console.log("\n");

for (const task of TASKS) {
  try {
    // Bun.write (imported as 'write') resolves relative paths from the project root automatically!
    // No need for 'path.join' or 'process.cwd()'
    await write(task.path, content);
    console.log(`Wrote to ${task.name} (${task.path})`);
  } catch (error) {
    console.error(`Failed to write to ${task.name}:`, error);
  }
}
console.log("\n✨ Setup complete! You can now run 'bun dev'.\n");
