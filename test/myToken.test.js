const { BigNumber } = require('@ethersproject/bignumber')
const chai = require('chai')
const { expect } = chai
const { ethers } = require('hardhat')
const { solidity } = require('ethereum-waffle')
chai.use(solidity)

let Goverance, timeLock, myToken, owner, goverance, addr1, addr2, accounts

const amount = BigNumber.from(1).mul(BigNumber.from(10).pow(16))

describe('MY Token', () => {
	beforeEach(async () => {
		accounts = await ethers.getSigners()
		;[owner, addr1, addr2] = accounts

		//Deployed MY Token contract
		const MYToken = await ethers.getContractFactory('MyToken')
		myToken = await MYToken.deploy()
		await myToken.deployed()
	})

	describe('MY Token Contract', () => {
		it('Should have name', async function () {
			expect(await myToken.name()).to.be.equal('MyToken')
		})

		it('Should have symbol', async function () {
			expect(await myToken.symbol()).to.be.equal('MTK')
		})

		it('Should have decimals', async function () {
			expect(await myToken.decimals()).to.be.equal(18)
		})

		it('Should Mint token', async function () {
			await myToken.mint(addr1.address, 1000 * (10 ^ 18))
		})
	})
})
