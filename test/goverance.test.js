const { BigNumber } = require('@ethersproject/bignumber')
const chai = require('chai')
const { expect, bignumber, assert } = chai
const { ethers, network } = require('hardhat')
const { solidity } = require('ethereum-waffle')
chai.use(solidity)
const web3utils = require('web3-utils')

let Goverance,
	addrs,
	goverance,
	MyToken,
	TimeLock,
	myToken,
	timeLock,
	owner,
	addr1,
	addr2
describe('DAO Testcases', () => {
	beforeEach(async () => {
		;[owner, addr1, addr2, addrs] = await ethers.getSigners()

		MyToken = await ethers.getContractFactory('MyToken')
		myToken = await MyToken.deploy()
		await myToken.deployed()

		TimeLock = await ethers.getContractFactory('TimeLock')
		timeLock = await TimeLock.deploy('86400', [], [])
		await timeLock.deployed()

		Goverance = await ethers.getContractFactory('Goverance')
		goverance = await Goverance.deploy(myToken.address, timeLock.address)
		await goverance.deployed()
	})

	describe('DAO Contract', () => {
		it('Checking votingDelay & votingPeriod', async function () {
			expect(await goverance.votingDelay()).to.equal(1)
			expect(await goverance.votingPeriod()).to.equal(7)
		})

		it('Create a proposal', async function () {
			await myToken.transfer(addr1.address, 10000)
			await myToken.connect(addr1).delegate(addr1.address)

			const proposerRole = await timeLock.PROPOSER_ROLE()
			await timeLock.grantRole(proposerRole, goverance.address)

			const proposalId = await goverance.propose(
				[myToken.address],
				[0],
				[
					await myToken.interface.encodeFunctionData('transfer', [
						addr1.address,
						1000,
					]),
				],
				'Transfer the tokens'
			)

			const val = await proposalId.wait(1)
			const proposalVal = val.events[0].args.proposalId

			const descriptionHash = ethers.utils.id('Transfer the tokens')

			expect(
				await goverance.hashProposal(
					[myToken.address],
					[0],
					[
						await myToken.interface.encodeFunctionData('transfer', [
							addr1.address,
							1000,
						]),
					],
					descriptionHash
				)
			).to.be.equal(proposalVal)
		})

		it('Create a proposal & queue', async function () {
			await myToken.transfer(
				addr1.address,
				BigNumber.from(1000).mul(BigNumber.from(10).pow(18))
			)
			await myToken.connect(addr1).delegate(addr1.address)

			const id = await goverance.propose(
				[myToken.address],
				[1],
				[
					await myToken.interface.encodeFunctionData('transfer', [
						addr1.address,
						1000,
					]),
				],
				'Transfer the tokens'
			)

			const proposeVal = await id.wait(1)
			const proposalId = proposeVal.events[0].args.proposalId

			expect(await goverance.state(proposalId)).to.be.equal(0)

			await hre.network.provider.send('hardhat_mine', ['0x1'])
			await goverance.connect(addr1).castVote(proposalId, 1)
			await hre.network.provider.send('hardhat_mine', ['0x31E5'])
			const descriptionHash = web3utils.keccak256('Transfer the tokens')

			expect(await goverance.state(proposalId)).to.be.equal(4)

			const proposerRole = await timeLock.PROPOSER_ROLE()
			const executorRole = await timeLock.EXECUTOR_ROLE()
			const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()
			await timeLock.grantRole(proposerRole, goverance.address)
			await timeLock.grantRole(
				executorRole,
				'0x0000000000000000000000000000000000000000'
			)

			await goverance.queue(
				[myToken.address],
				[1],
				[
					await myToken.interface.encodeFunctionData('transfer', [
						addr1.address,
						1000,
					]),
				],
				descriptionHash
			)
			await hre.network.provider.send('evm_mine', [24 * 1656326946])

			expect(await goverance.state(proposalId)).to.be.equal(5)
		})
	})
})
