import { Convert } from "./sha256.js";
var hashes = [];

//get hash of all transactions
function toHash(transactionsList){
    
    for(let i=0; i<transactionsList.length; i++){
        hashes.push(Convert(JSON.stringify(transactionsList[i])))
    }

}

//implementing merkle tree and getting merkle root
function merkleTree(transactionsList){
    toHash(transactionsList);
    
    while(hashes.length!=1){
        if(hashes.length %2 !=0){
            hashes.push(hashes[hashes.length-1])
        }
        
        var tempArr = new Array();
        for(let i=0; i<hashes.length; i=i+2){
            tempArr.push(Convert(hashes[i]+hashes[i+1]));
        }
        hashes = tempArr;
    }
    var merkleRoot = hashes[0];
    hashes=[];
    return merkleRoot;
}

export {merkleTree};
