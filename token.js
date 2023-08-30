const { expect } = require("chai");

describe("Token Contract", function () {

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    Token = await ethers.getContractFactory("Token");
    hardhatToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("should assign the total supply to the right owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("transactions", function () {
    it("should transfer tokens", async function () {
      await hardhatToken.transfer(addr1.address, 100);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });

  it("should fail if not enough tokens", async function () {
    const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
    await expect(hardhatToken.connect(addr1).transfer(owner.address, 5)).to.be.revertedWith("Not enough tokens");
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
  });


});
