pragma solidity ^0.4.21;

contract deposit {
    function getDepositList()constant public returns(address[]);
    function getDepositInfo(address addr) constant public returns(uint,bytes,uint);
    function valiDeposit(bytes nodeID) payable public;
    function minerDeposit(bytes nodeID) payable public;
}
contract depositTest {
    address public tokenAddress = 0x000000000000000000000000000000000000000a;
    function () public payable{
//        address(this).transfer(msg.value);
    }
    function depositTest(){

    }
    function ContractDeposit()public{
        deposit(tokenAddress).valiDeposit.value(100000*1e18)("1111111111111111111111111111111111111111111111111111111111111111");
    }
}
