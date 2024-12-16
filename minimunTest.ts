import fs from 'node:fs';
const getSecondDecimalDigit = (num: { toString: () => string; }) => (num.toString().split('.')[1] || "0").padEnd(2, "0")[1];

const data:number[] = (JSON.parse(fs.readFileSync("R_10_10.json", "utf8"))).map((data: { price: { toString: () => string; }; })=>getSecondDecimalDigit(data.price));


let consective_even = 0;
let consective_odd = 0;
let lastIsEven = data[0] % 2 ===0;
console.log(lastIsEven);


const results: string[] = [];
data.map((value)=>{
    if(lastIsEven) {
        consective_even++;
        consective_odd = 0;
    }
    else {
        consective_odd++;
        consective_even = 0;
    }
    lastIsEven = value >= 3;
    // lastIsEven = value % 2 === 0;

    results.push( value >= 3 ? `even${consective_even}` : `odd${consective_odd}`)
    // console.log(`${value % 2 === 0 ? `even${consective_even}` : `odd${consective_odd}`} ` )
})




fs.writeFileSync("results.json", JSON.stringify(results));