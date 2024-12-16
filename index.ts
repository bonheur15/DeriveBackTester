
import fs from 'node:fs';


const data = JSON.parse(fs.readFileSync("data.json", "utf8")) as unknown as {
    _data: {
        list: {
            quote: {
                _data: {
                    value: number;
                }
            }
        }[]
    }
};


const getSecondDecimalDigit = (num: { toString: () => string; }) => (num.toString().split('.')[1] || "0").padEnd(2, "0")[1];


const nums = JSON.parse(fs.readFileSync("numbers.json", "utf8")) as unknown as number[];

function simulateMartingale({ numbers, initialStake, winMultiplier, martingaleMultiplier, totalInvestment, showAllBets = false, maxToStake, num }: {
    numbers: number[],

    initialStake: number,
    winMultiplier: number,
    martingaleMultiplier: number,
    totalInvestment: number,
    showAllBets: boolean,
    maxToStake: number,
    num: number
}) {
    let balance = totalInvestment;
    let stake = initialStake;
    let totalWinnings = 0;
    let maxStake = 0;
    let round = 0;
    let totalBet = 0;

    // Array to store bet details for logging
    const betDetails = [];

    //    let lostLast = false;

    for (let i = 0; i < numbers.length; i++) {
        // Check if the account balance is insufficient
        if (balance < stake) {
            console.log(`Account balance insufficient for round ${round + 1}. Ending simulation.`);
            break;
        }

        round++;
        const currentNumber = numbers[i];
        // const isWin = (betOnOver) ? currentNumber >= 5 : currentNumber < 5;
        let isevenss = false;
        if (i < 5) continue;
        if (numbers[i-1] % 2 === 0 && numbers[i-2] % 2 === 0 && numbers[i-3] % 2 === 0 && numbers[i-4] % 2 === 0 && numbers[i-5] % 2 === 0) {
            isevenss = true;
        }
        if(!isevenss) continue;
        const isWin = numbers[i] % 2 !== 0;


        // const isWin = currentNumber[0] > currentNumber[1];
        // let isWin = false;
        // if(lostLast){
        //     isWin = 5 > currentNumber
        // }
        if (isWin) {
            // Win: calculate winnings and reset stake
            const winnings = stake * winMultiplier - stake;
            balance += winnings;
            totalWinnings += winnings;
            betDetails.push({
                round,
                number: currentNumber,
                stake,
                result: "Win",
                winnings,
                balance
            });
            stake = initialStake; // Reset stake to initial
        } else {
            // Loss: subtract stake and increase it with Martingale
            balance -= stake;
            betDetails.push({
                round,
                number: currentNumber,
                stake,
                result: "Loss",
                winnings: -stake,
                balance
            });

            stake = stake * martingaleMultiplier;
            if (stake > maxToStake) stake = initialStake;
        }

        // Track max stake used
        maxStake = Math.max(maxStake, stake);
        totalBet += stake;
    }



    // Return the results
    return {
        totalWinnings,
        maxStake,
        totalStake: totalBet,
        num,
        finalBalance: balance,
        accountBlown: balance <= 0,
        StakeDetails: showAllBets ? betDetails : undefined // Include detailed log if enabled
    };
}

// Example usage:
const numbers = nums;
// .slice(0, 100);;
// .filter((_,i)=>i%3 === 0);;
// console.log(numbers.length);
// .reduce((acc, _, i, arr) => i % 2 === 0 ? [...acc, arr.slice(i, i + 2)] : acc, []); // Example series of numbers to bet on (range 0-9)


















const initialStake = 0.35;  // Initial stake





const totalInvestment = 50;

const maxToStake = 99999999;

const winMultiplier = 2.88;

const martingaleMultiplier = 2.1;
// for (let i = 0; i < 10; i++) {


// }

const num = 5;


const result = simulateMartingale({
    numbers: numbers, initialStake, winMultiplier, martingaleMultiplier, totalInvestment, showAllBets: true, maxToStake, num
});

console.log("Final Results:", result);
if (result.finalBalance - totalInvestment > 0) console.log(`\x1b[32m${Math.round(result.finalBalance - totalInvestment)} \x1b[0m`);
else console.error(String(Math.round(result.finalBalance - totalInvestment)));

// const result = simulateMartingale({
//     numbers: numbers, initialStake, winMultiplier, martingaleMultiplier, totalInvestment, showAllBets: false, maxToStake
// });

// console.log("Final Results:", result);
// if (result.finalBalance - totalInvestment > 0) console.log(`\x1b[32m${Math.round(result.finalBalance - totalInvestment)} \x1b[0m`);
// else console.error(String(Math.round(result.finalBalance - totalInvestment)));

// function BacktestSupplyandDemand(){



// }







// BacktestSupplyandDemand();




// let prevv = 0;
// let prevecount = false;
// let maxtecounter = 0;





/// Second Backtest
console.log("Second test");

for (let k = 0; k < 10; k++) {
    let encounter = 0;



    nums.map((currentNum, i) => {
        let prev = 0;
        if (i === 0) prev = 0;
        else prev = nums[i - 1];




        let predictedNumber = 0;
        if (prev === currentNum && prev === 0) predictedNumber = 0;
        if (prev === 1) predictedNumber = 6;
        if (prev === 2) predictedNumber = 6;
        if (prev === 3) predictedNumber = 4;
        if (prev === 4) predictedNumber = 8;
        if (prev === 5) predictedNumber = 7;
        if (prev === 6) predictedNumber = 9;
        if (prev === 7) predictedNumber = 6;
        if (prev === 8) predictedNumber = 2;
        if (prev === 9) predictedNumber = k; // 1,6

        if (predictedNumber === currentNum) {
            encounter += 1;

        }

    });

    console.log(encounter, k);
}

