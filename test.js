const axios = require("axios");
const cron = require("node-cron");
const lineNotify = require("line-notify-nodejs");
const { RestClientV5 } = require("bybit-api");

const API_KEY = "Bearer DKRI6xIZJxzauB4j1wRBJHCoZHOuvWdh";
const LINE_TOKEN = "ROI0WoUkEW2E67Ak8JpEUDcu4WfbPuiZDu4o6chGJLQ";

const invalid_tokens = ["AI", "ACE"];

// BybIt
async function fetchBybitData() {
  console.log("Bybit");
  const client = new RestClientV5({
    testnet: true,
  });

  try {
    const response = await client.getTickers({
      category: "linear",
    });

    const tokens = response.result.list
      .filter(function (data) {
        return data.symbol.endsWith("USDT") && data.symbol.toLowerCase().includes("xrp");
      });

    console.log("Success to fetch data from Bybit", tokens);
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Bybit");
    return [];
  }
}

// KuCoin
async function fetchKuCoinData() {
  console.log("KuCoin");
  try {
    const response = await axios.get(
      "https://api.kucoin.com/api/v1/market/allTickers"
    );
    const tokens = response.data.data.ticker
      .filter(function (data) {
        return data.symbol.endsWith("-USDT") && data.symbol.toLowerCase().includes("xrp");
      });

    console.log("Success to fetch data from KuCoin", tokens);
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from KuCoin");
    return [];
  }
}

// Gate io
async function fetchGateioData() {
  console.log("Gate");
  try {
    const response = await axios.get(
      "https://api.gateio.ws/api/v4/spot/tickers"
    );
    const tokens = response.data
      .filter(function (data) {
        return data.currency_pair.endsWith("_USDT") && data.currency_pair.toLowerCase().includes("xrp");
      });

    console.log("Success to fetch data from Gateio", tokens);
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Gateio");
    return [];
  }
}

// XT
async function fetchXTData() {
  console.log("XT");
  try {
    const response1 = await axios.get(
      "https://sapi.xt.com/v4/public/ticker/price"
    );
    const a = response1.data.result.filter(function (data) {
      return data.s.endsWith("_usdt") && data.s.toLowerCase().includes("xrp");
    });

    const response2 = await axios.get(
      "https://sapi.xt.com/v4/public/ticker/24h"
    );
    const b = response2.data.result.filter(function (data) {
      return data.s.endsWith("_usdt") && data.v != 0;
    });

    console.log("Success to fetch data from XT", a);
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from XT");
    return [];
  }
}

// Hitbtc
async function fetchHitbtcData() {
  console.log("Hitbtc");
  try {
    const response = await axios.get(
      "https://api.hitbtc.com/api/3/public/ticker"
    );

    const result = response.data;
    const tokens = [];
    for (const [token, data] of Object.entries(result)) {
      if (token.endsWith("USDT") && token.toLowerCase().includes("xrp")) {
        const symbol = token.replace(/USDT$/, "");
        const lastPrice = Number(data.last);
        const volume24 = Number(data.volume_quote);
        tokens.push({
          symbol: token,
          lastPrice,
          volume24,
          exchange: "Hitbtc",
        });
      }
    }

    console.log("Success to fetch data from Hitbtc", tokens);
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Hitbtc");
    return [];
  }
}

// Bitget
async function fetchBitgetData() {
  console.log("Bitget");
  try {
    const response = await axios.get(
      "https://api.bitget.com/api/mix/v1/market/tickers?productType=umcbl"
    );

    const tokens = response.data.data
      .filter(function (data) {
        return data.symbol.endsWith("USDT_UMCBL") && data.symbol.toLowerCase().includes("xrp");
      });

    console.log("Success to fetch data from Bitget", tokens);
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Bitget");
    return [];
  }
}

// Ascendex
async function fetchAscendexData() {
  console.log("Ascendex");
  try {
    const response = await axios.get(
      "https://ascendex.com/api/pro/v1/spot/ticker"
    );

    const tokens = response.data.data
      .filter(function (data) {
        return data.symbol.endsWith("/USDT") && data.symbol.toLowerCase().includes("xrp");
      });

    console.log("Success to fetch data from Ascendex", tokens);
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Ascendex");
    return [];
  }
}

// MEXC
async function fetchMEXCData() {
  console.log("MEXC");
  try {
    const response = await axios.get("https://api.mexc.com/api/v3/ticker/24hr");
    const tokens = response.data
      .filter(function (data) {
        return data.symbol.endsWith("USDT") && data.symbol.toLowerCase().includes("xrp");
      });

    console.log("Success to fetch data from MEXC", tokens);
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from MEXC");
    return [];
  }
}

// Bitrue
async function fetchBitrueData() {
  console.log("Bitrue");
  try {
    const response = await axios.get(
      "https://openapi.bitrue.com/api/v1/ticker/24hr"
    );

    const tokens = response.data
      .filter(function (data) {
        return data.symbol.endsWith("USDT") && data.symbol.toLowerCase().includes("xrp");
      });

    console.log("Success to fetch data from Bitrue", tokens);
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Bitrue");
    return [];
  }
}

// Poloniex
async function fetchPoloniexData() {
  console.log("Poloniex");
  try {
    const response = await axios.get(
      "https://futures-api.poloniex.com/api/v2/tickers"
    );
    const tokens = response.data.data
      .filter(function (data) {
        return data.symbol.endsWith("USDTPERP") && data.symbol.toLowerCase().includes("xrp");
      });

    console.log("Success to fetch data from Poloniex", tokens);
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Poloniex");
    return [];
  }
}

async function comparePrices() {
  let allData = [];

  allData.push(await fetchBybitData());
  allData.push(await fetchKuCoinData());
  allData.push(await fetchGateioData());
  allData.push(await fetchXTData());
  allData.push(await fetchHitbtcData());
  allData.push(await fetchBitgetData());
  allData.push(await fetchAscendexData());
  allData.push(await fetchMEXCData());
  allData.push(await fetchBitrueData());
  allData.push(await fetchPoloniexData());

  allData = allData.flat();

  const groupedByToken = allData.reduce((acc, curr) => {
    (acc[curr.symbol] = acc[curr.symbol] || []).push(curr);
    return acc;
  }, {});

  const token_name_list = [];
  for (const [token, data] of Object.entries(groupedByToken)) {
    token_name_list.push(token);
  }

  // fetch token data from 1inch(DEX)
  const DEX_tokens = [];
  const token_url = "https://api.1inch.dev/token/v1.2/1";
  const token_config = {
    headers: {
      Authorization: API_KEY,
    },
    params: {},
  };

  try {
    const response = await axios.get(token_url, token_config);
    token_list = response.data;
    for (const [token_address, data] of Object.entries(token_list)) {
      if (token_name_list.includes(data.symbol)) {
        const swap_url = "https://api.1inch.dev/swap/v6.0/1/quote";
        const dicimals = 10 ** data.decimals;
        const swap_config = {
          headers: {
            Authorization: API_KEY,
          },
          params: {
            src: token_address,
            dst: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            amount: dicimals,
          },
        };
        try {
          const swap_response = await axios.get(swap_url, swap_config);
          DEX_tokens.push({
            symbol: data.symbol,
            lastPrice: Number(swap_response.data.dstAmount) / 1000000,
            volume24: "-",
            exchange: "1inch(DEX)",
          });
        } catch (error) {}
      }
    }
    console.log("Success to fetch data from 1inch(DEX)");
  } catch (error) {
    console.error("error to fetch data from 1inch");
  }

  allData.push(DEX_tokens);
  allData = allData.flat();
  const final_token_list = allData.reduce((acc, curr) => {
    (acc[curr.symbol] = acc[curr.symbol] || []).push(curr);
    return acc;
  }, {});
}

comparePrices();
