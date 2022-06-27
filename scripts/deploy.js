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

// 	ERC20 Token deployed to: 0x5d9Ab62c24b1DCd50e59CC5713b0Da9f798a9420
// Timelock deployed to: 0x5835D7A2B7F172bF63D1d025F676AaEEe7De8Db5
// Goverance token deployed to: 0xe18C679f5C859B2C855FdB4a0cD13149aB63bCa2
