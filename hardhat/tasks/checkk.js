
const fs = require('fs');

task("checkk", "check contract's code on etherscan : checkk MyContract --network MyNetwork")
    .addPositionalParam("myContract")
    .setAction(async (taskArgs, hre) => {
        const CONTRACT_ARGUMENTS = require(`../args/${taskArgs.myContract}.js`)
        const address = fs.readFileSync(`./addresses/${taskArgs.myContract}_${hre.network.name}_ADDRESS.txt`, "utf8")

        await hre.run("verify:verify", {
            address: address,
            constructorArguments: CONTRACT_ARGUMENTS,
        });
    })
