
const fs = require('fs');

task("destroy", "Destroy a contract on specified network")
    .addPositionalParam("myContract")
    .setAction(async (taskArgs, hre) => {
        const address = fs.readFileSync(`./addresses/${taskArgs.myContract}_${hre.network.name}_ADDRESS.txt`, "utf8")
        const contractFile = require(`../artifacts/contracts/${taskArgs.myContract}.sol/${taskArgs.myContract}.json`)
        const accounts = await ethers.getSigners();

        const contract = new ethers.Contract(address, contractFile.abi, accounts[0]);
        const transaction = await contract.selfDestruct(accounts[0].address);
        try {
            const txRecept = await transaction.wait();
            console.log(`${taskArgs.myContract} successfully destroyed, check tx ${txRecept.transactionHash}`)
        } catch (error) {
            console.log(error)
        }

    })
