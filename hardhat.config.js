require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
require('solidity-coverage')
require('dotenv').config()

const MATIC_KEY = process.env.MATIC_PRIVATE_KEY

module.exports = {
	solidity: '0.8.4',
	settings: {
		optimizer: {
			enabled: true,
			runs: 2000000,
		},
	},

	networks: {
		hardhat: {
			accounts: {
				accountsBalance: '1000000000000000000000',
			},
			gas: 50000000,
			blockGasLimit: 0xfffffffffffff,
			allowUnlimitedContractSize: true,
		},
		matic: {
			url: process.env.MUMBAI_RPC_URL,
			accounts: [`0x${MATIC_KEY}`],
			chainId: 80001,
		},
	},
	etherscan: {
		apiKey: process.env.MATIC_API_KEY, //for polygonscan (mumbai)
	},
}
