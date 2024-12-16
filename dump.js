const WebSocket = require('ws');
const DERIV_API_URL = "wss://ws.binaryws.com/websockets/v3?app_id=65687";
const ws = new WebSocket(DERIV_API_URL);
const fs = require('node:fs');

const sendMessage = (request) =>
    new Promise((resolve, reject) => {
        ws.send(JSON.stringify(request));
        ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.error) {
                reject(response.error.message);
            } else {
                resolve(response);
            }
        };
        ws.onerror = (error) => reject(error.message);
    });

// Function to fetch full-day ticks
async function fetchFullDayTicks(symbol, date) {
    const startTime = new Date(`${date}T00:00:00Z`).getTime() / 1000; // Convert to epoch
    const endTime = new Date(`${date}T23:59:59Z`).getTime() / 1000;  // Convert to epoch
    const ticksPerRequest = 5000; // API limit 
    let from = startTime;
    const allTicks = [];
    
    try {
        while (from < endTime) {
            const to = Math.min(from + ticksPerRequest - 1, endTime); // Adjust for limits
            const request = {
                ticks_history: symbol,
                start: from,
                end: to,
                style: 'ticks',
                count: ticksPerRequest,
            };

            const response = await sendMessage(request);

            if (response?.history?.times && response.history.prices) {
                const { times, prices } = response.history;
                allTicks.push(...times.map((time, i) => ({ time, price: prices[i] })));
            }

            from = to + 1; 
        }
        return allTicks;
    } catch (error) {
        console.error("Error fetching ticks:", error);
        return [];
    }
}

// Connect and fetch ticks
ws.onopen = async () => {
    const ticks = await fetchFullDayTicks('R_10', '2024-12-12');
    fs.writeFileSync("ticks.json", ticks);
    console.log(`Fetched ${ticks.length} ticks:`);
    console.log(ticks);
    ws.close(); 
};
