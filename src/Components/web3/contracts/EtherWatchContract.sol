// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

contract EtherWatch{
    fallback() external payable {}
    receive() external payable {}
    mapping(address => string[]) private fm;
    mapping(address =>uint8) private numberM;
    
    function addMovie(string memory movie) external payable{
      require(msg.value > 0.001 ether, "Low price for the movie.");
      if(numberM[msg.sender]==0){
        numberM[msg.sender] = 1;
      } else{
        numberM[msg.sender]++;
      }
      fm[msg.sender].push(movie);
    }
    function getMovies(address sender) external view returns(string[] memory){
      string[] memory _movies = new string[](numberM[sender]);

      for(uint i =0; i<numberM[sender]; i++){
          _movies[i] = fm[sender][i];
      }
      return _movies;
    }
}
//const inst = await EtherWatch.deployed();
//inst.getMovies('0x99cF41F29C63e3C6760870d67b116A872A1bAf2d', {from: '0x99cF41F29C63e3C6760870d67b116A872A1bAf2d'})
//inst.addMovie('tt5304992', {from: '0x99cF41F29C63e3C6760870d67b116A872A1bAf2d', value: '1000000000000000000000'})
