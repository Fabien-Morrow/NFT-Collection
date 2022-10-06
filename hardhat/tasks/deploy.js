
const fs = require('fs');

task("deploy", "Deploy a contract on specified network : deploy MyContract --network MyNetwork")
    .addPositionalParam("myContract")
    .setAction(async (taskArgs, hre) => {
        const contractFile = `../contracts/${taskArgs.myContract}.sol`
        const argsFile = `../args/${taskArgs.myContract}.js`
        const CONTRACT_ARGUMENTS = require(argsFile)

        const contract = await hre.ethers.getContractFactory(taskArgs.myContract)
        const deployedContract = await contract.deploy(...CONTRACT_ARGUMENTS)

        console.log(`${taskArgs.myContract} deployed at :`, deployedContract.address)
        console.log("Tx is : ", deployedContract.deployTransaction.hash)

        fs.writeFileSync(`./addresses/${taskArgs.myContract}_${hre.network.name}_ADDRESS.txt`, ethers.utils.getAddress(deployedContract.address), (err) => {
            if (err) throw err;
        })
    })
