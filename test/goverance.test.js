const { BigNumber } = require('@ethersproject/bignumber')
const chai = require('chai')
const { expect } = chai
const { ethers } = require('hardhat')
const { solidity } = require('ethereum-waffle')
chai.use(solidity)

let Goverance,
	Box,
	box,
	timeLock,
	myToken,
	owner,
	goverance,
	addr1,
	addr2,
	accounts

const amount = BigNumber.from(1).mul(BigNumber.from(10).pow(16))

describe('Goverance', () => {
	beforeEach(async () => {
		accounts = await ethers.getSigners()
		;[owner, addr1, addr2] = accounts

		//Deployed MY Token contract
		const MYToken = await ethers.getContractFactory('MyToken')
		myToken = await MYToken.deploy()
		await myToken.deployed()

		const TimeLock = await ethers.getContractFactory('TimeLock')
		timeLock = await TimeLock.deploy(1, [], [])
		await timeLock.deployed()

		Goverance = await ethers.getContractFactory('Goverance')
		goverance = await Goverance.deploy(myToken.address, timeLock.address)
		await goverance.deployed()

		Box = await ethers.getContractFactory('Box')
		box = await Box.deploy()
		await box.deployed()
	})

	describe('DAO contract', () => {
		it('Create a proposals', async function () {
			await myToken.mint(addr1.address, 10 * (10 ^ 18))
			await myToken.connect(addr1).delegate(addr1.address)

			await myToken.mint(addr2.address, 50 * (10 ^ 18))
			await myToken.connect(addr2).delegate(addr2.address)

			const proposerRole = await timeLock.PROPOSER_ROLE()
			await timeLock.grantRole(proposerRole, goverance.address)

			// console.log(goverance)
			const proposalId = await goverance.propose(
				[box.address],
				[0],
				[await box.interface.encodeFunctionData('store', [150])],
				'Set value'
			)
			console.log(proposalId)

			// console.log(await goverance.votingDelay())
			// console.log(await goverance.votingPeriod())

			const descriptionHash = ethers.utils.id('Set value')
		})

		it.skip('Create a proposals & execute it', async function () {
			await myToken.mint(addr1.address, 10 * (10 ^ 18))
			await myToken.connect(addr1).delegate(addr1.address)
			// console.log(await myToken.getVotes(addr1.address))

			const proposerRole = await timeLock.PROPOSER_ROLE()
			await timeLock.grantRole(proposerRole, goverance.address)

			const proposalId = await goverance.propose(
				[box.address],
				[0],
				[await box.interface.encodeFunctionData('store', [150])],
				'Set value'
			)

			console.log(proposalId)
			const openTimes = 8 * 24 * 60 * 60
			await network.provider.send('evm_increaseTime', [openTimes])
			await network.provider.send('evm_mine')

			const descriptionHash = ethers.utils.id('Set value')
			await goverance.queue(
				[box.address],
				[0],
				[await box.interface.encodeFunctionData('store', [150])],
				descriptionHash
			)
		})
	})
})
