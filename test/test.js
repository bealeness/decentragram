const { assert } = require('chai')

const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'Decentragram')
    })
  })

  describe('images', async () => {
    let result, imageCount
    const hashcode = 'abc123def'

    before(async () => {
      result = await decentragram.uploadImages(hashcode, 'Image Description', { from: author })
      imageCount = await decentragram.imageCount()
    })

    it('creates images', async () => {
      //success
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hashcode, hashcode, 'Hash is correct')
      assert.equal(event.description, 'Image Description', 'description is correct')
      assert.equal(event.tipAmount, '0', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')

      // FAILURE: Image must have hash
      await decentragram.uploadImages('', 'Image Description', { from: author }).should.be.rejected;

      // FAILURE: Image must have description
      await decentragram.uploadImages('Image hash', '', { from: author }).should.be.rejected;

    })

    //check on struct
    it('lists images', async () => {
      const image = await decentragram.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(image.hashcode, hashcode, 'Hash is correct')
      assert.equal(image.description, 'Image Description', 'description is correct')
      assert.equal(image.tipAmount, '0', 'tip amount is correct')
      assert.equal(image.author, author, 'author is correct')
    })
  })

})