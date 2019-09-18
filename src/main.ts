import * as fs from "fs";
import * as path from 'path';

import * as core from '@actions/core';

function main(): void
{
    try
    {
        const home = getHomeDirectory();
        const dirName = path.resolve(home, ".ssh");
        fs.mkdirSync(dirName, {
            recursive: true,
            mode: 0o700,
        });

        const privateKey = core.getInput('private-key') as string;
        const publicKey = core.getInput('public-key') as string;
        const name = core.getInput('name') as string;

        const fileName = path.resolve(dirName, name);
        fs.writeFileSync(fileName, privateKey, {
            mode: 0o400,
        });
        fs.writeFileSync(`${fileName}.pub`, publicKey, {
            mode: 0o444,
        });

        console.log(`SSH key has been stored to ${fileName} successfully.`);
    }
    catch(err)
    {
        core.setFailed(err.message);
    }
}

/**
 * get home directory
 * @returns home directory
 */
function getHomeDirectory(): string
{
    const home_env = process.platform == "win32" ? "USERPROFILE" : "HOME";
    const home = process.env[home_env];
    if(home === undefined)
    {
        throw new Error(`${home_env} is not defined`);
    }

    return home;
}

main();
