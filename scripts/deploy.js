const hre = require('hardhat')

async function main() {
	const MYToken = await ethers.getContractFactory('MyToken')
	const myToken = await MYToken.deploy()
	await myToken.deployed()

	console.log('ERC20 Token deployed to:', myToken.address)
	const TimeLock = await ethers.getContractFactory('TimeLock')
	const timeLock = await TimeLock.deploy(1, [], [])
	await timeLock.deployed()

	console.log('Timelock deployed to:', timeLock.address)
	const Goverance = await ethers.getContractFactory('Goverance')
	const goverance = await Goverance.deploy(myToken.address, timeLock.address)
	await goverance.deployed()

	console.log('Goverance token deployed to:', goverance.address)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
