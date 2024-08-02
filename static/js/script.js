const BASE_URL = 'https://api.binance.com';
const wsEndpoint = 'wss://stream.binance.com:9443/ws/btcusdt@trade';

// Fetch current price of a specific symbol
const getPrice = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v3/ticker/price`, {
      params: { symbol }
    });
    return response.data.price;
  } catch (error) {
    console.error('Error fetching price:', error);
  }
};

// Fetch historical data (candlestick data) for a specific symbol
const getHistoricalData = async (symbol, interval, limit = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v3/klines`, {
      params: {
        symbol,
        interval,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
  }
};

// Update the current price on the page
const updatePrice = async () => {
  const priceElement = document.getElementById('price');
  const price = await getPrice('BTCUSDT');
  priceElement.textContent = parseFloat(price).toFixed(2);
};

// Update the historical data table
const updateHistoricalData = async () => {
  const tableBody = document.getElementById('historical-data');
  const historicalData = await getHistoricalData('BTCUSDT', '1h', 10);

  tableBody.innerHTML = ''; // Clear previous data

  historicalData.forEach(candle => {
    const row = document.createElement('tr');
    const [time, open, high, low, close, volume] = candle;
    
    row.innerHTML = `
      <td>${new Date(time).toLocaleString()}</td>
      <td>${parseFloat(open).toFixed(2)}</td>
      <td>${parseFloat(high).toFixed(2)}</td>
      <td>${parseFloat(low).toFixed(2)}</td>
      <td>${parseFloat(close).toFixed(2)}</td>
      <td>${parseFloat(volume).toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });
};

// Set up WebSocket for real-time data
const setupWebSocket = () => {
  const ws = new WebSocket(wsEndpoint);
  const priceElement = document.getElementById('price');

  ws.onmessage = (event) => {
    const trade = JSON.parse(event.data);
    priceElement.textContent = parseFloat(trade.p).toFixed(2);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
    // Reconnect after a delay if needed
    setTimeout(setupWebSocket, 1000);
  };
};

// Initialize the page
const init = async () => {
  await updatePrice();
  await updateHistoricalData();
  setupWebSocket();
};

const fetchMarketData = async () => {
    try {
        // Fetch data from Binance API for various markets
        const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
        const marketData = response.data;

        // Specify the cryptocurrencies you're interested in
        const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'USDCUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT'];

        // Filter the data for the specified cryptocurrencies
        const filteredData = marketData.filter(item => symbols.includes(item.symbol));

        // Populate the table with the filtered data
        const tableBody = document.getElementById('market-table').querySelector('tbody');
        tableBody.innerHTML = '';

        filteredData.forEach(data => {
            const row = `
                <tr>
                    <td>${data.symbol.replace('USDT', '')}</td>
                    <td>${getCurrencyName(data.symbol)}</td>
                    <td>${parseFloat(data.lastPrice).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}</td>
                    <td>${parseFloat(data.priceChangePercent).toFixed(2)}%</td>
                    <td>${(parseFloat(data.quoteVolume) * 0.014).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}</td>
                    <td>${parseFloat(data.volume).toLocaleString()}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error fetching market data:', error);
    }
};

const getCurrencyName = (symbol) => {
    const currencyNames = {
        BTCUSDT: 'Bitcoin',
        ETHUSDT: 'Ethereum',
        BNBUSDT: 'Binance Coin',
        SOLUSDT: 'Solana',
        USDCUSDT: 'USD Coin',
        XRPUSDT: 'Ripple',
        DOGEUSDT: 'Dogecoin',
        ADAUSDT: 'Cardano',
    };

    return currencyNames[symbol] || 'Unknown';
};

fetchMarketData();


// Run the initialization function
window.onload = init;
