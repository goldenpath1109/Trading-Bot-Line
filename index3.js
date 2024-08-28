const axios = require("axios");
const cron = require("node-cron");
const lineNotify = require("line-notify-nodejs");
const { RestClientV5 } = require("bybit-api");

const API_KEY = "Bearer DKRI6xIZJxzauB4j1wRBJHCoZHOuvWdh";
const LINE_TOKEN = "r6RFvLZzd0sivBISND5RPhMXabKKUYnN7uO4M6ylYzQ";

const invalid_tokens = ["AI", "ACE"];

// BybIt
async function fetchBybitData() {
  const client = new RestClientV5({
    testnet: true,
  });

  try {
    const response = await client.getTickers({
      category: "linear",
    });

    const tokens = response.result.list
      .filter(function (data) {
        return data.symbol.endsWith("USDT") && data.volume24h != 0;
      })
      .map((token) => ({
        symbol: token.symbol.replace(/USDT$/, ""),
        lastPrice: Number(token.lastPrice),
        volume24: Number(token.volume24h),
        exchange: "Bybit",
      }));

    console.log("Success to fetch data from Bybit");
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Bybit");
    return [];
  }
}

// KuCoin
async function fetchKuCoinData() {
  try {
    const response = await axios.get(
      "https://api.kucoin.com/api/v1/market/allTickers"
    );
    const tokens = response.data.data.ticker
      .filter(function (data) {
        return data.symbol.endsWith("-USDT") && data.volValue != 0;
      })
      .map((token) => ({
        symbol: token.symbol.replace(/-USDT$/, ""),
        lastPrice: Number(token.last),
        volume24: Number(token.volValue),
        exchange: "KuCoin",
      }));

    console.log("Success to fetch data from KuCoin");
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from KuCoin");
    return [];
  }
}

// Gate io
async function fetchGateioData() {
  try {
    const response = await axios.get(
      "https://api.gateio.ws/api/v4/spot/tickers"
    );
    const tokens = response.data
      .filter(function (data) {
        return data.currency_pair.endsWith("_USDT") && data.quote_volume != 0;
      })
      .map((token) => ({
        symbol: token.currency_pair.replace(/_USDT$/, ""),
        lastPrice: Number(token.last),
        volume24: Number(token.quote_volume),
        exchange: "Gate io",
      }));

    console.log("Success to fetch data from Gateio");
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Gateio");
    return [];
  }
}

// XT
async function fetchXTData() {
  try {
    const response1 = await axios.get(
      "https://sapi.xt.com/v4/public/ticker/price"
    );
    const a = response1.data.result.filter(function (data) {
      return data.s.endsWith("_usdt") && data.p != 0;
    });

    const response2 = await axios.get(
      "https://sapi.xt.com/v4/public/ticker/24h"
    );
    const b = response2.data.result.filter(function (data) {
      return data.s.endsWith("_usdt") && data.v != 0;
    });

    const tokens = [];
    a.forEach((a_item) => {
      const symbol = a_item.s;
      const lastPrice = Number(a_item.p);
      b.forEach((b_item) => {
        if (b_item.s === symbol) {
          tokens.push({
            symbol: symbol.replace(/_usdt$/, ""),
            lastPrice,
            volume24: Number(b_item.v),
            exchange: "XT",
          });
        }
      });
    });

    console.log("Success to fetch data from XT");
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from XT");
    return [];
  }
}

// Hitbtc
async function fetchHitbtcData() {
  try {
    const response = await axios.get(
      "https://api.hitbtc.com/api/3/public/ticker"
    );

    const result = response.data;
    const tokens = [];
    for (const [token, data] of Object.entries(result)) {
      if (token.endsWith("USDT") && data.volume_quote != 0) {
        const symbol = token.replace(/USDT$/, "");
        const lastPrice = Number(data.last);
        const volume24 = Number(data.volume_quote);
        tokens.push({
          symbol,
          lastPrice,
          volume24,
          exchange: "Hitbtc",
        });
      }
    }

    console.log("Success to fetch data from Hitbtc");
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Hitbtc");
    return [];
  }
}

// Bitget
async function fetchBitgetData() {
  try {
    const response = await axios.get(
      "https://api.bitget.com/api/mix/v1/market/tickers?productType=umcbl"
    );

    const tokens = response.data.data
      .filter(function (data) {
        return data.symbol.endsWith("USDT_UMCBL") && data.quoteVolume != 0;
      })
      .map((token) => ({
        symbol: token.symbol.replace(/USDT_UMCBL$/, ""),
        lastPrice: Number(token.last),
        volume24: Number(token.quoteVolume),
        exchange: "Bitget",
      }));

    console.log("Success to fetch data from Bitget");
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Bitget");
    return [];
  }
}

// Ascendex
async function fetchAscendexData() {
  try {
    const response = await axios.get(
      "https://ascendex.com/api/pro/v1/spot/ticker"
    );

    const tokens = response.data.data
      .filter(function (data) {
        return data.symbol.endsWith("/USDT") && data.volume != 0;
      })
      .map((token) => ({
        symbol: token.symbol.slice(0, -5),
        lastPrice: Number(token.bid[0]),
        volume24: Number(token.volume),
        exchange: "Ascendex",
      }));

    console.log("Success to fetch data from Ascendex");
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Ascendex");
    return [];
  }
}

// MEXC
async function fetchMEXCData() {
  try {
    const response = await axios.get("https://api.mexc.com/api/v3/ticker/24hr");
    const tokens = response.data
      .filter(function (data) {
        return data.symbol.endsWith("USDT") && data.quoteVolume != 0;
      })
      .map((token) => ({
        symbol: token.symbol.slice(0, -4),
        lastPrice: Number(token.lastPrice),
        volume24: Number(token.quoteVolume),
        exchange: "MEXC",
      }));

    console.log("Success to fetch data from MEXC");
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from MEXC");
    return [];
  }
}

// Bitrue
async function fetchBitrueData() {
  try {
    const response = await axios.get(
      "https://openapi.bitrue.com/api/v1/ticker/24hr"
    );

    const tokens = response.data
      .filter(function (data) {
        return data.symbol.endsWith("USDT") && data.quoteVolume != 0;
      })
      .map((token) => ({
        symbol: token.symbol.slice(0, -4),
        lastPrice: Number(token.lastPrice),
        volume24: Number(token.quoteVolume),
        exchange: "Bitrue",
      }));

    console.log("Success to fetch data from Bitrue");
    return tokens;
  } catch (error) {
    console.error("Error to fetch data from Bitrue");
    return [];
  }
}

// Poloniex
async function fetchPoloniexData() {
  try {
    const response = await axios.get(
      "https://futures-api.poloniex.com/api/v2/tickers"
    );
    const tokens = response.data.data
      .filter(function (data) {
        return data.symbol.endsWith("USDTPERP") && data.price != 0;
      })
      .map((token) => ({
        symbol: token.symbol.replace(/USDTPERP$/, ""),
        lastPrice: Number(token.price),
        volume24: "-",
        exchange: "Poloniex",
      }));

    console.log("Success to fetch data from Poloniex");
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

  console.log(
    "\nStart calculating token price difference and sending to Line\n"
  );
  for (const [token, data] of Object.entries(final_token_list)) {
    if (invalid_tokens.includes(token)) continue;

    const prices = data.map((d) => d.lastPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const diffPercentage = ((maxPrice - minPrice) / minPrice) * 100;

    if (minPrice * 10 < maxPrice) continue;

    if (
      (token.toLowerCase() == "xrp" &&
        diffPercentage >= 1 &&
        diffPercentage < 20) ||
      (token.toLowerCase() != "xrp" &&
        diffPercentage >= 5 &&
        diffPercentage < 20)
    ) {
      let sending_message = "";
      const percent = Number(diffPercentage.toFixed(2));
      sending_message = `\n${token}/USDT\n\n利幅${percent}%\n\n`;
      let flag = false;
      let countMin = 0,
        countMax = 0;
      let exchanges = [];
      data.forEach((d) => {
        if (d.lastPrice == maxPrice || d.lastPrice == minPrice) {
          if (d.volume24 == "-" || d.volume24 < 100000) flag = true;
          else {
            sending_message += `${d.exchange}\n価格\n${d.lastPrice}ドル\n\n出来高\n${d.volume24}ドル ◎\n\n`;
            countMin += d.lastPrice == maxPrice;
            countMax += d.lastPrice == minPrice;
            exchanges.push(d.exchange);
          }
        }
      });
      if (exchanges.length > 2) console.log("There exists.");
      if (flag || countMax != 1 || countMin != 1) continue;
      if (exchanges[0] == "Gate io" && exchanges[1] == "MEXC") continue;
      if (exchanges[1] == "Gate io" && exchanges[0] == "MEXC") continue;

      try {
        lineNotify(LINE_TOKEN)
          .notify({
            message: sending_message,
          })
          .then(() => {
            console.log("Send completed!");
          })
          .catch((error) => {
            console.log("Line error!");
          });
      } catch (error) {
        console.log("line error in send");
      }
    }
  }
}

cron.schedule(
  "*/10 * * * *",
  () => {
    comparePrices();
  },
  {
    scheduled: true,
    timezone: "Asia/Tokyo",
  }
);
