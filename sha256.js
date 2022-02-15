//Helper Functions

function rotr(x, n) {
    x = "0b"+x;
    var add = (((x >>> n) | (x << (32 - n))) >>> 0).toString(2);
    var result = "00000000000000000000000000000000".slice(0,add.length*-1)+add;
    return result;
};

function u_sigma0(str){
    var add = ((("0b"+rotr(str,2)) ^ ("0b"+rotr(str,13)) ^ ("0b"+rotr(str,22)))>>>0).toString(2);
  
    var result = "00000000000000000000000000000000".slice(0,add.length*-1)+add
    return result;
}

function u_sigma1(str){
    var add = ((("0b"+rotr(str,6)) ^ ("0b"+rotr(str,11)) ^ ("0b"+rotr(str,25)))>>>0).toString(2);
    var result = "00000000000000000000000000000000".slice(0,add.length*-1)+add;
    return result;
}

function l_sigma0(str){
    var add = ((("0b"+rotr(str,7)) ^ ("0b"+rotr(str,18)) ^ (
        "0b"+"00000000000000000000000000000000".slice(0,(("0b"+str) >>> 3).toString(2).length*-1)+(("0b"+str) >>> 3).toString(2)
    ))>>>0).toString(2);
    var result = "00000000000000000000000000000000".slice(0,add.length*-1)+add;
    return result;
}

function l_sigma1(str){
    var add = ((("0b"+rotr(str,17)) ^ ("0b"+rotr(str,19)) ^ (
        "0b"+"00000000000000000000000000000000".slice(0,(("0b"+str) >>> 10).toString(2).length*-1)+(("0b"+str) >>> 10).toString(2)
    ))>>>0).toString(2);
    var result = "00000000000000000000000000000000".slice(0,add.length*-1)+add;
    return result;
}

function addi(str1, str2){
    var add = (parseInt(str1,2)+parseInt(str2,2)).toString(2);
    var result = "00000000000000000000000000000000".slice(0,add.length*-1)+add;
    if(result.length>32){ result = result.slice(-32); }
    return result;
}

function Maj(x, y, z) {
    x="0b"+x;
    y="0b"+y;
    z="0b"+z;
    var add = ((((x & y)) ^ ((x & z)) ^ ((y & z)))>>>0).toString(2);
    var result = "00000000000000000000000000000000".slice(0,add.length*-1)+add;
    return result;
}

function Ch(x, y, z) {
    x="0b"+x;
    y="0b"+y;
    z="0b"+z;
    var add = ((((x & y)) ^ ((((~x)) & z)))>>>0).toString(2);
    
    var result = "00000000000000000000000000000000".slice(0,add.length*-1)+add;
    return result;
}

function round(x) {
    return Math.ceil(x / 512) * 512;
}

// Convert Input to Binary of length multiple of 512
function convertToBinary(str){
    var bin='';
    for(let i=0; i<str.length; i++){
        var num=str.charCodeAt(i);
        bin+=("00000000"+num.toString(2)).substr(-8);
    }
    var len = (bin.length).toString(2);
    bin+='1';
    var temp = bin;
    if(round(bin.length) - bin.length < 64){
        for(let i=0; i<round(temp.length)-temp.length+512; i++){
            bin+='0';
        }
    }
    else{
        for(let i=0; i<round(temp.length)-temp.length; i++){
            bin+='0';
        }
    }
    bin = bin.slice(0,len.length*-1) + len;
    return bin;
}

// Convert Binary to Hex
function convertToHex(hashes){
    var hex = "";
    for(var x of hashes){
        hex+="00000000".slice(0,parseInt(x,2).toString(16).length*-1)+parseInt(x,2).toString(16);
    }
    return hex;
}

// Preparing Message Blocks of 512 bits
function getMessageBlocks(str){
    var block = '';
    var messageBlocks = [];
    let i = 0;
    while(i<str.length){
        block = str.slice(i,i+512);
        messageBlocks.push(block);
        i+=512;
    }
    return messageBlocks;
}

function hash(msgblock){
    //Initialize hash values
    const H = [
        "01101010000010011110011001100111", "10111011011001111010111010000101",
        "00111100011011101111001101110010", "10100101010011111111010100111010",
        "01010001000011100101001001111111", "10011011000001010110100010001100",
        "00011111100000111101100110101011", "01011011111000001100110100011001",
    ];
    
    //initialize Constants
    const K = [ 
        "01000010100010100010111110011000", "01110001001101110100010010010001",
        "10110101110000001111101111001111", "11101001101101011101101110100101",
        "00111001010101101100001001011011", "01011001111100010001000111110001",
        "10010010001111111000001010100100", "10101011000111000101111011010101",
        "11011000000001111010101010011000", "00010010100000110101101100000001",
        "00100100001100011000010110111110", "01010101000011000111110111000011",
        "01110010101111100101110101110100", "10000000110111101011000111111110",
        "10011011110111000000011010100111", "11000001100110111111000101110100",
        "11100100100110110110100111000001", "11101111101111100100011110000110",
        "00001111110000011001110111000110", "00100100000011001010000111001100",
        "00101101111010010010110001101111", "01001010011101001000010010101010",
        "01011100101100001010100111011100", "01110110111110011000100011011010",
        "10011000001111100101000101010010", "10101000001100011100011001101101",
        "10110000000000110010011111001000", "10111111010110010111111111000111",
        "11000110111000000000101111110011", "11010101101001111001000101000111",
        "00000110110010100110001101010001", "00010100001010010010100101100111",
        "00100111101101110000101010000101", "00101110000110110010000100111000",
        "01001101001011000110110111111100", "01010011001110000000110100010011",
        "01100101000010100111001101010100", "01110110011010100000101010111011",
        "10000001110000101100100100101110", "10010010011100100010110010000101",
        "10100010101111111110100010100001", "10101000000110100110011001001011",
        "11000010010010111000101101110000", "11000111011011000101000110100011",
        "11010001100100101110100000011001", "11010110100110010000011000100100",
        "11110100000011100011010110000101", "00010000011010101010000001110000",
        "00011001101001001100000100010110", "00011110001101110110110000001000",
        "00100111010010000111011101001100", "00110100101100001011110010110101",
        '00111001000111000000110010110011', "01001110110110001010101001001010",
        "01011011100111001100101001001111", "01101000001011100110111111110011",
        "01110100100011111000001011101110", "01111000101001010110001101101111",
        "10000100110010000111100000010100", "10001100110001110000001000001000",
        "10010000101111101111111111111010", "10100100010100000110110011101011",
        "10111110111110011010001111110111", "11000110011100010111100011110010"
        ]
    var W = new Array(64);
    //Iterating over each message block
    for(var msg of msgblock){
        //message schedule
        var a = H[0];
        var b = H[1];
        var c = H[2];
        var d = H[3];
        var e = H[4];
        var f = H[5];
        var g = H[6];
        var h = H[7];

        var T1, T2;
        let ind = 0

        for(var i=0; i<64; i++){
            if(i < 16){
                W[i] = msg.substring(ind,ind+32);
                ind+=32;
            }
            else{
                W[i] = addi(addi(addi(l_sigma1(W[i - 2]), W[i - 7]), l_sigma0(W[i - 15])), W[i - 16]);
            }
            T1 = addi(addi(addi(addi(h, u_sigma1(e)), Ch(e, f, g)), K[i]), W[i]);
            T2 = addi(u_sigma0(a), Maj(a, b, c));

            //Compression
            h = g;
            g = f;
            f = e;
            e = addi(d, T1);
            d = c;
            c = b;
            b = a;
            a = addi(T1, T2);
        }
        //Modifying Hash Values
        H[0] = addi(a,H[0]);
        H[1] = addi(b,H[1]);
        H[2] = addi(c,H[2]);
        H[3] = addi(d,H[3]);
        H[4] = addi(e,H[4]);
        H[5] = addi(f,H[5]);
        H[6] = addi(g,H[6]);
        H[7] = addi(h,H[7]);
    }
    //Concatenate Final Hash
    
    return convertToHex(H);
}

//onclick function
function Convert(data){
    var f_hash = hash(getMessageBlocks(convertToBinary(data)));
    return f_hash;
}

export {Convert};