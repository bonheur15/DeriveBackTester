import WebSocket from 'ws';
const DerivAPI = require('@deriv/deriv-api/dist/DerivAPI');
const connection = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=65687');
const api        = new DerivAPI({ connection });




async function fetchFullDayTicks(symbol: string, date: string) {
  
    const startTime = new Date(`${date}T00:00:00Z`).getTime() / 1000; 
    const endTime = new Date(`${date}T23:59:59Z`).getTime() / 1000;
    const ticksPerRequest = 5000;
    let from = startTime;
    const allTicks = [];
    
    try {
        while (from < endTime) {
            const to = Math.min(from + ticksPerRequest - 1, endTime); //  API limits
            const response = await api.send({
                ticks_history: symbol,
                start: from,
                end: to,
                style: 'ticks',
                count: ticksPerRequest
            });
            
            if (response?.history?.times && response.history.prices) {
                const { times, prices } = response.history;
                allTicks.push(...times.map((time: string, i: string | number) => ({ time, price: prices[i] })));
            }
            
            from = to + 1;
        }
        return allTicks;
    } catch (error) {
        console.error("Error fetching ticks:", error);
        return [];
    }
}

// Usage
fetchFullDayTicks('R_10', '2024-12-12').then((ticks) => {
    console.log(`Fetched ${ticks.length} ticks for the day`);
    console.log(ticks);
});



const getSecondDecimalDigit = (num: { toString: () => string; }) => (num.toString().split('.')[1] || "0").padEnd(2, "0")[1];
