import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import {version, binance,kucoin,bybit,mexc,huobi} from 'ccxt';

let kucoin_data={}
let bybit_data={}
let mexc_data={}
let htx_data={}
let asd_data={}
let gate_data={}
// const exchange = new binance();
// const exchange1 = new kucoin();
// const ticker = await exchange1.fetchTicker('ROUTE/USDT');
// console.log(ticker);




const app = express();
app.use(cors());
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Define a route to handle proxy requests
app.get('/hello', async (req, res) => {
    res.send('Hare Krishna');
});

app.get('/proxy', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).json({ error: 'Missing URL parameter' });
        }

        // Make a request to the KuCoin API
        const response = await fetch(url);

        // Forward the response back to the client
        res.json(await response.json());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/exchange', async (req, res) => {
    try {
        const exchangeName = req.query.exchangeName;
        let exchange=new bybit()
        if (!exchangeName) {
            return res.status(400).json({ error: 'Missing URL parameter' });
        }
        switch (exchangeName) {
            case 'binance':
                exchange = new binance();
                break;
            case 'kucoin':
                exchange = new kucoin();
                break;
            case 'bybit':
                exchange = new bybit();
                break;
            case 'mexc':
                exchange = new mexc();
                break;
            case 'huobi':
                exchange = new huobi();
                break;
            // Add cases for other exchanges as needed
            default:
                // Handle unsupported exchange
                throw new Error(`Unsupported exchange: ${exchangeName}`);
        }
        const ticker = await exchange.fetchTicker('ROUTE/USDT');
        res.send(ticker)

     
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




const fetchData = () => {

    //kucoin

    fetch(`http://localhost:${PORT}/proxy?url=https://api.kucoin.com/api/v1/market/stats?symbol=ROUTE-USDT`)
        .then(response => response.json())
        .then(data => {
            // Replace the global object with the fetched object
           kucoin_data = data;
            console.log('Global object updated with data from API:', kucoin_data);

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

  



    //mexc

    fetch(`http://localhost:${PORT}/proxy?url=https://api.mexc.com/api/v3/ticker/24hr?symbol=ROUTEUSDT`)
    .then(response => response.json())
    .then(data => {
        // Replace the global object with the fetched object
       mexc_data = data;
        console.log('Global object updated with data from API:',mexc_data);

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    //houbi

    fetch(`http://localhost:${PORT}/proxy?url=https://api.huobi.pro/market/detail?symbol=routeusdt`)
    .then(response => response.json())
    .then(data => {
        // Replace the global object with the fetched object
       htx_data = data;
        console.log('Global object updated with data from API:',htx_data);

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    // ascendx

    fetch(`http://localhost:${PORT}/proxy?url=https://ascendex.com/api/pro/v1/spot/ticker?symbol=ROUTE/USDT`)
    .then(response => response.json())
    .then(data => {
        // Replace the global object with the fetched object
      asd_data = data;
        console.log('Global object updated with data from API:',asd_data);

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    // gate

    fetch(`http://localhost:${PORT}/proxy?url=https://api.gateio.ws/api/v4/spot/tickers?currency_pair=route_usdt`)
    .then(response => response.json())
    .then(data => {
        // Replace the global object with the fetched object
      gate_data = data;
        console.log('Global object updated with data from API:',gate_data);

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });



    }
fetchData();

const interval = setInterval(fetchData, 10 * 1000);

app.get('/kucoindata',(req,res)=>{
    res.send(kucoin_data)
})
app.get('/bybitdata',(req,res)=>{
    res.send(bybit_data)
})

app.get('/mexcdata',(req,res)=>{
    res.send(mexc_data)
})

app.get('/htxdata',(req,res)=>{
    res.send(htx_data)
})

app.get('/asddata',(req,res)=>{
    res.send(asd_data)
})

app.get('/gatedata',(req,res)=>{
    res.send(gate_data)
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

