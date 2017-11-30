const fs = require("fs");
const updateFile = (file, oldDep, newDep) => {
    const line = new Array(60).fill(`-`).join(``);
    console.log(line);
    console.log(`looking for ${file}`);
    console.log(`replacing ${oldDep} to ${newDep}`);

    if (fs.existsSync(file)) {
        console.log(`found file`);
        try {
            const read = fs.readFileSync(file);
            const rawCode = read.toString();
            const mod = rawCode.replace(oldDep, newDep);

            if (mod === rawCode) {
                return console.log(`file is the same - no changes required`);
            }

            fs.writeFileSync(file, mod);
            return console.log(`changed ${oldDep} -> ${newDep}`);
        } catch (error) {
            return console.log(`unable to process file. Error: ${error}`);
        }
    }

    return console.error(`can't find ${file}`);
};

module.exports = updateFile;
