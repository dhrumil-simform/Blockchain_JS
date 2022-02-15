import { Convert } from "./sha256.js";
import { merkleTree } from "./merkleTree.js";

class Block{
    constructor(block_no, data, previousHash=''){
        this.block_no = block_no;
        this.timestamp = this.getTime();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
        if(typeof(this.data)!="string"){
            this.data=merkleTree(this.data);
        }
    }

    calculateHash(){
        if(typeof(this.data) != "string"){  //if the data is an array of transactions
            return Convert(this.block_no +' '+ this.timestamp +' '+ merkleTree(this.data) +' '+ this.previousHash+' '+this.nonce);
        }
        //if data is a simple string
        return Convert(this.block_no +' '+ this.timestamp +' '+ this.data +' '+ this.previousHash+' '+this.nonce);
    }

    getTime(){
        var temp = new Date()
        var date = temp.getFullYear()+"/"+(temp.getMonth()+1)+"/"+temp.getDate();
        var time = temp.getHours() + ":" + temp.getMinutes() + ":" + temp.getSeconds();
        return (date+' '+time);
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash()
        }

        console.log("Block Mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.bchain = [this.createGenesis()];
        this.difficulty=2;
    }

    createGenesis(){
        return new Block(0,"Genesis Block", "0");
    }

    latestBlock(){
        return this.bchain[this.bchain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.latestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.bchain.push(newBlock);
    }

    checkValidity(){
        //Starting from index 1 as Genesis block is at index 0
        for(let i=1; i<this.bchain.length; i++){
            const curr_block = this.bchain[i];
            const prev_block = this.bchain[i-1];
            //Checking if current block data has not changed
            if(curr_block.hash !== curr_block.calculateHash()){ return false; }
            //Checking if hash of the previous block is same
            if(curr_block.previousHash !== prev_block.hash){ return false; }
        }
        return true;
    }
}

//Creating a sample Blockchain
let samp = new Blockchain();

//Mining Block 1
console.log("Mining Block 1 ......")
samp.addBlock(new Block(1,"hello"));

//Mining Block 2
console.log("Mining Block 2 ......")
samp.addBlock(new Block(2,[{from:'dhrumil',to:'karan',amount:250}, {from:'rohit',to:'rahul',amount:1000}]));

//Printing the Blockchain in the console
console.log(JSON.stringify(samp, null, 2));

//Checking the validity of the blockchain
console.log(samp.checkValidity())