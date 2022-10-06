## using tasks :

in the hardhat directory, structure must be :

/addresses <- WILL contains MyContract_MyNetwork_ADDRESS.txt after deploy
/args <- MUST contains MyContract.js, module containing arguments
/artifacts <- as usual, MUST preserve structure to access the abi
/contracts <- MUST contains MyContract.sol
/tasks <- MUST contains tasks
|_hardhat.config.js

Example of MyContract.js content :
module.exports = ["My first argument", "another-one"]




- ## deploy, deploy contract on selected network
deploy MyContract --network MyNetwork

- ## checkk, verify source of deployed contract on selected network
checkk MyContract --network MyNetwork

- ## destroy, destroy contract on selected network
destroy MyContract --network MyNetwork
