import { execSync, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import { default as fs } from "node:fs";
import os from "node:os";
import { default as path } from "node:path";
import { cancel, intro, outro, select, spinner, text } from "@clack/prompts";
import { default as toml } from "@iarna/toml";

// Function to execute shell commands
function executeCommand(command: string) {
    console.log(`\x1b[33m${command}\x1b[0m`);
    try {
        return execSync(command, { encoding: "utf-8" });
    } catch (error: any) {
        return { error: true, message: error.stdout || error.stderr };
    }
}

// Function to prompt user for input without readline-sync
async function prompt(message: string, defaultValue: string): Promise<string> {
    return (await text({
        message: `${message} (${defaultValue}):`,
        placeholder: defaultValue,
        defaultValue,
    })) as string;
}





let dbName = 'cloudflare-saas-stack-db';


// Function to prompt for Google client credentials
async function promptForGoogleClientCredentials() {
    intro("Now, time for auth!");

    const devVarsPath = path.join(__dirname, "..", ".dev.vars");

    if (!fs.existsSync(devVarsPath)) {
        console.log(
            "\x1b[33mNow, we will set up authentication for your app using Google OAuth2. \nGo to https://console.cloud.google.com/, create a new project and set up OAuth consent screen.\nThen, go to Credentials > OAuth client ID and create a new client ID.\nPaste the client ID and client secret below. \n\nMore info: https://developers.google.com/workspace/guides/configure-oauth-consent#:~:text=Go%20to%20OAuth%20consent%20screen,sensitive%20scopes%2C%20and%20restricted%20scopes.\x1b[0m",
        );
        const clientId = await prompt(
            "Enter your Google Client ID (enter to skip)",
            "",
        );
        const clientSecret = await prompt(
            "Enter your Google Client Secret (enter to skip)",
            "",
        );

        try {
            fs.writeFileSync(
                devVarsPath,
                `AUTH_GOOGLE_ID=${clientId}\nAUTH_GOOGLE_SECRET=${clientSecret}\n`,
            );
            console.log(
                "\x1b[33m.dev.vars file created with Google Client ID and Client Secret.\x1b[0m",
            );
        } catch (error) {
            console.error("\x1b[31mError creating .dev.vars file:", error, "\x1b[0m");
            cancel("Operation cancelled.");
        }
    } else {
        console.log(
            "\x1b[31m.dev.vars file already exists. Skipping creation.\x1b[0m",
        );
    }

    outro(".dev.vars updated with Google Client ID and Client Secret.");
}

// Function to generate secure random 32-character string
function generateSecureRandomString(length: number): string {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
}

// Function to update .dev.vars with secure random string
async function updateDevVarsWithSecret() {
    const secret = generateSecureRandomString(32);
    const devVarsPath = path.join(__dirname, "..", ".dev.vars");

    try {
        if (!fs.readFileSync(devVarsPath, "utf-8").includes("AUTH_SECRET")) {
            fs.appendFileSync(devVarsPath, `\nAUTH_SECRET=${secret}`);
            console.log("\x1b[33mSecret appended to .dev.vars file.\x1b[0m");
        } else {
            console.log("\x1b[31mAUTH_SECRET already exists in .dev.vars\x1b[0m");
        }
    } catch (error) {
        console.error("\x1b[31mError updating .dev.vars file:", error, "\x1b[0m");
        cancel("Operation cancelled.");
    }

    outro(".dev.vars updated with secure secret.");
}

// Function to run database migrations
async function runDatabaseMigrations(dbName: string) {
    // setupMigrationSpinner.start("Generating setup migration...");
    // executeCommand("bunx drizzle-kit generate --name setup");
    // setupMigrationSpinner.stop("Setup migration generated.");

    const localMigrationSpinner = spinner();
    localMigrationSpinner.start("Running local database migrations...");
    // executeCommand(`bunx wrangler d1 migrations apply ${dbName}`);

    executeCommand(`bunx wrangler d1 execute ${dbName} --file=./drizzle/0001_graceful_alice.sql --remote`);
    localMigrationSpinner.stop("Local database migrations completed.");

    // const remoteMigrationSpinner = spinner();
    // remoteMigrationSpinner.start("Running remote database migrations...");
    // executeCommand(`bunx wrangler d1 migrations apply ${dbName} --remote`);
    // remoteMigrationSpinner.stop("Remote database migrations completed.");
}

function setEnvironmentVariable(name: string, value: string) {
    const platform = os.platform();
    let command: string;

    if (platform === "win32") {
        command = `set ${name}=${value}`; // Windows Command Prompt
    } else {
        command = `export ${name}=${value}`; // Unix-like shells
    }

    console.log(
        `\x1b[33mPlease run this command: ${command} and then rerun the setup script.\x1b[0m`,
    );
    process.exit(1);
}

async function main() {
    try {
       

        // try {
        //     await createBucketR2();
        // } catch (error) {
        //     console.error("\x1b[31mError:", error, "\x1b[0m");
        //     cancel("Operation cancelled.");
        //     process.exit(1);
        // }

        // await promptForGoogleClientCredentials();
        // console.log("\x1b[33mReady... Set... Launch\x1b[0m");
        // await updateDevVarsWithSecret();
        await runDatabaseMigrations(dbName);

        console.log("\x1b[33mRunning bun run dev command...\x1b[0m");
        // spawnSync("bun", ["run", "dev"], { stdio: "inherit" });
    } catch (error) {
        console.error("\x1b[31mError:", error, "\x1b[0m");
        cancel("Operation cancelled.");
    }
}

main();
