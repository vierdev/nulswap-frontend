import BigNumber from "bignumber.js";
import { Token } from "../types/token";
import axios from "axios";
import NaboxWindow from "../types/NaboxWindow";
const ROUTER_CONTRACT = "NULSd6HgyBv1A2NdqizZnkXcTkq9rrFoWS4ZE";
const STAKE_CONTRACT = "NULSd6HgsMXkLFoHfp6dbpSTBsJpc5yd47vyL";
const STAKE_NULS_CONTRACT = "NULSd6HgkqJyP7QsjCDzm3ozmXmnF2Q6jQRJ6";
const ALLOWCICLENULS = "NULSd6HgkkupSic2s9bYWtU7wEJrN7vJFq7io";
const NULSWAP_TOKEN = "NULSd6HgrzcXdTuGvRF9DmkxoXM8XNmXZs95d";
const CTR = "NULSd6HgvSGgwRFtHJB7paZgj8yjwjnXrsdMz";

const ip1 = "https://api.nuls.io/";
const apiIp = "https://api.bestdevteam.xyz";

export async function getTokenSymbol(tokenAddress: string) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        ip1 + "api/contract/view",
        {
          contractAddress: tokenAddress,
          methodName: "symbol",
          methodDesc: "() return String",
          args: [],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        resolve({ tokenSymbol: response.data.data.result });
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

export async function getTokenName(tokenAddress: string) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        ip1 + "api/contract/view",
        {
          contractAddress: tokenAddress,
          methodName: "name",
          methodDesc: "() return String",
          args: [],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        resolve({ tokenName: response.data.data.result });
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

export async function getTokenDecimals(tokenAddress: string) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        ip1 + "api/contract/view",
        {
          contractAddress: tokenAddress,
          methodName: "decimals",
          methodDesc: "() return int",
          args: [],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        resolve({ tokenDecimal: response.data.data.result });
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

export async function getTokenBalance(token: Token, address: string) {
  return new Promise((resolve, reject) => {
    BigNumber.config({ DECIMAL_PLACES: 5 });
    if (token.type === "Token") {
      axios
        .post(ip1 + "api/contract/view", {
          contractAddress: token.address,
          methodName: "balanceOf",
          methodDesc: "(Address owner) return BigInteger",
          args: [address],
        })
        .then((response) => {
          var data = response.data;
          var amountBal = data.data.result;
          if (data.success.toString() === "true") {
            var displayBal = new BigNumber(amountBal)
              .dividedBy(Math.pow(10, token.decimals))
              .toString();
            resolve({
              value: displayBal,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .post(
          ip1 + "api/accountledger/balance/" + address,
          {
            assetChainId: token.chainId,
            assetId: token.asset,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          var data = response.data;
          let amountBal = data.data.available;
          var displayBal = new BigNumber(amountBal)
            .dividedBy(Math.pow(10, token.decimals))
            .toString();
          resolve({
            value: displayBal,
          });
        })
        .catch(function (error) {});
    }
  });
}

export async function getPair(tokenA_address: string, tokenB_address: string) {
  const data = {
    contractAddress: ROUTER_CONTRACT,
    methodName: "pairToken",
    methodDesc: "(Address tokenA, Address tokenB) return Address",
    args: [tokenA_address, tokenB_address],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return res.result;
}

export async function swapTradeInfo(
  tokenA: Token,
  tokenB: Token,
  am: BigNumber
) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        apiIp +
          "/api/v1/pairs/getInfo/" +
          tokenA.address +
          "/" +
          tokenB.address +
          "/" +
          am
      )
      .then((response) => {
        var data = response.data;
        resolve({ swapType: data[1], middleToken: data[2] });
      })
      .catch((error) => {
        reject({ err: error });
      });
  });
}

export async function currentReserve(tokenPair: string) {
  return new Promise((resolve, reject) => {
    if (tokenPair != null) {
      axios
        .post(
          ip1 + "api/contract/view",
          {
            contractAddress: tokenPair,
            methodName: "bothTokensReserve",
            methodDesc: "() return String",
            args: [],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          var data = response.data;
          if (data.success.toString() === "true") {
            let i = data.data.result.split(",");

            resolve({ fromTokenReserve: i[0], toTokenReserve: i[1] });
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  });
}

export async function token0Address(tokenPair: string) {
  return new Promise((resolve, reject) => {
    if (tokenPair != null) {
      axios
        .post(
          ip1 + "api/contract/view",
          {
            contractAddress: tokenPair,
            methodName: "token0",
            methodDesc: "() return Address",
            args: [],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          var data = response.data;
          resolve({ tokenAddress: data.data.result });
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  });
}

export async function swapTokenToToken(
  tokenA: Token,
  tokenB: Token,
  am: string,
  minB: string,
  deadline: Number,
  account: string
) {
  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "tokenToTokenSwapInput",
    methodDesc:
      "(Address token0, Address token1, BigInteger tokens_sold, BigInteger min_tokens_bought, BigInteger deadline) return BigInteger",
    args: [tokenA.address, tokenB.address, parseInt(am), minB, deadline],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapNulsToToken(
  tokenA: Token,
  amount: string,
  minBought: string,
  deadline: Number,
  account: string
) {
  let iAs = new BigNumber(amount).dividedBy(Math.pow(10, 8));
  console.log(iAs);

  const data = {
    from: account,
    value: parseFloat(iAs.toString()),
    contractAddress: ROUTER_CONTRACT,
    methodName: "nulsToTokenSwapInput",
    methodDesc:
      "(Address token, BigInteger nuls_to_sell, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [tokenA.address, amount, minBought, deadline],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapTokenToNuls(
  tokenA: Token,
  amount: string,
  minBought: string,
  deadline: Number,
  account: string
) {
  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "tokenToNulsSwapInput",
    methodDesc:
      "(Address token, BigInteger tokens_sold, BigInteger min_nuls, BigInteger deadline) return BigInteger",
    args: [tokenA.address, amount, minBought, deadline],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapMultiToToken(
  toTokenAddress: string,
  fromTokenChain: number,
  fromTokenAsset: number,
  amount: string,
  minBought: string,
  decimals: number,
  account: string
) {
  BigNumber.config({ EXPONENTIAL_AT: 1e9 });

  let mV = new BigNumber(amount).dividedBy(Math.pow(10, decimals));

  let mW = minBought.toString();

  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "MultiToTokenSwapInput",
    methodDesc:
      "(BigInteger wasset_amount_used, int chaining, int asseting, Address token_swap, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [
      amount,
      fromTokenChain,
      fromTokenAsset,
      toTokenAddress,
      mW,
      2000000000000000,
    ],
    multyAssetValues: [[mV.toString(), fromTokenChain, fromTokenAsset]],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapTokenToMulti(
  fromTokenAddress: string,
  toTokenChain: number,
  toTokenAsset: number,
  amount: string,
  minBought: string,
  deadline: Number,
  account: string
) {
  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "tokenToMultiSwapInput",
    methodDesc:
      "(Address token, int chain, int id, BigInteger tokens_sold, BigInteger min_nuls, BigInteger deadline) return BigInteger",
    args: [
      fromTokenAddress,
      toTokenChain,
      toTokenAsset,
      amount,
      minBought,
      deadline,
    ],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapMultiToMulti(
  fromTokenChain: number,
  fromTokenAsset: number,
  toTokenChain: number,
  toTokenAsset: number,
  amount: string,
  minBought: string,
  dc: number,
  account: string
) {
  BigNumber.config({ EXPONENTIAL_AT: 1e9 });

  let m = new BigNumber(amount).dividedBy(Math.pow(10, dc));

  //alert(m)

  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "MultiToMultiSwapInput",
    methodDesc:
      "(BigInteger amount1, int chaind0, int multyId0, int chaind1, int multyId1, BigInteger tokens_sold, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [
      amount,
      fromTokenChain,
      fromTokenAsset,
      toTokenChain,
      toTokenAsset,
      amount,
      minBought,
      2000000000000000,
    ],
    multyAssetValues: [[m.toString(), fromTokenChain, fromTokenAsset]],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapNulsToMulti(
  toTokenChain: number,
  toTokenAsset: number,
  amount: string,
  minBought: string,
  account: string
) {
  let toFloat = new BigNumber(amount).dividedBy(Math.pow(10, 8));
  const data = {
    from: account,
    value: parseFloat(toFloat.toString()),
    contractAddress: ROUTER_CONTRACT,
    methodName: "nulsToMultiSwapInput",
    methodDesc:
      "(int chain, int multyId, BigInteger nuls_to_sell, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [toTokenChain, toTokenAsset, amount, minBought, 20000000000000],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapMultiToNuls(
  fromTokenChain: number,
  fromTokenAsset: number,
  amount: string,
  minBought: string,
  fromTokendecimal: number,
  account: string
) {
  BigNumber.config({ EXPONENTIAL_AT: 1e9 });

  let jNB: BigNumber = BigNumber(amount).dividedBy(
    Math.pow(10, fromTokendecimal)
  );
  // alert(jNB)
  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "MultiToNulsSwapInput",
    methodDesc:
      "(BigInteger wasset_amount_used, int chain, int multyId, BigInteger tokens_sold, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [
      amount.toString(),
      fromTokenChain,
      fromTokenAsset,
      minBought,
      20000000000,
    ],
    multyAssetValues: [[jNB, fromTokenChain, fromTokenAsset]],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapMultiCycleFromTokenToToken(
  fromTokenAddress: string,
  router: string,
  toTokenAddress: string,
  amount: string,
  min_tokens: string,
  deadline: Number,
  account: string
) {
  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "TokenToCicleToTokenSwapInput",
    methodDesc:
      "(String[] token, BigInteger nuls_to_sell, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [
      [fromTokenAddress, router, toTokenAddress],
      amount,
      min_tokens,
      deadline,
    ],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapMultiCycleFromNulsToToken(
  fromTokenAddress: string,
  router: string,
  toTokenAddress: string,
  nuls_t_sell: string,
  min_tokens: string,
  deadline: Number,
  account: string
) {
  let iAs = new BigNumber(nuls_t_sell).dividedBy(Math.pow(10, 8));

  const data = {
    from: account,
    value: parseFloat(iAs.toString()),
    contractAddress: ALLOWCICLENULS,
    methodName: "nulsToTokenSwapInputTriple",
    methodDesc:
      "(Address token0, Address token1, Address token2, BigInteger nuls_to_sell, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [
      fromTokenAddress,
      router,
      toTokenAddress,
      nuls_t_sell,
      min_tokens,
      deadline,
    ],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapMultiCycleFromTokenToNuls(
  fromTokenAddress: string,
  router: string,
  toTokenAddress: string,
  nuls_t_sell: string,
  min_tokens: string,
  deadline: Number,
  account: string
) {
  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "TokemToCicleToNulsSwapInput",
    methodDesc:
      "(String[] token, BigInteger tokens_sold, BigInteger min_nuls, BigInteger deadline) return BigInteger",
    args: [
      [fromTokenAddress, router, toTokenAddress],
      nuls_t_sell,
      min_tokens,
      deadline,
    ],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapMultiCycleFromMultiToToken(
  fromTokenAddress: string,
  router: string,
  toTokenAddress: string,
  fromTokenChain: number,
  fromTokenAsset: number,
  nuls_t_sell: string,
  min_tokens: string,
  fromTokenDecimals: number,
  account: string
) {
  let mValue = BigNumber(nuls_t_sell)
    .dividedBy(Math.pow(10, fromTokenDecimals))
    .toString();
  //alert(mValue);
  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "MultiToCicleToTokenSwapInput",
    methodDesc:
      "(String[] token, int chaining, int asseting, BigInteger nuls_to_sell, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [
      [fromTokenAddress, router, toTokenAddress],
      fromTokenChain,
      fromTokenAsset,
      nuls_t_sell,
      min_tokens,
      2000000000000,
    ],
    multyAssetValues: [[mValue, fromTokenChain, fromTokenAsset]],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapMultiCycleFromTokenToMulti(
  fromTokenAddress: string,
  router: string,
  toTokenAddress: string,
  toTokenChain: number,
  toTokenAsset: number,
  nuls_t_sell: string,
  min_tokens: string,
  account: string
) {
  let r = new BigNumber(nuls_t_sell).toFixed(0);

  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "TokenToCicleToMultiSwapInput",
    methodDesc:
      "(String[] token, int chaining, int asseting, BigInteger nuls_to_sell, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [
      [fromTokenAddress, router, toTokenAddress],
      toTokenChain,
      toTokenAsset,
      r,
      min_tokens,
      2000000000000,
    ],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapMultiCycleFromMultiToMulti(
  fromTokenAddress: string,
  router: string,
  toTokenAddress: string,
  fromTokenChain: number,
  fromTokenAsset: number,
  toTokenChain: number,
  toTokenAsset: number,
  nuls_t_sell: string,
  min_tokens: string,
  decimals: number,
  account: string
) {
  let mValue = BigNumber(nuls_t_sell)
    .dividedBy(Math.pow(10, decimals))
    .toString();
  console.log("mValue:", mValue, "nuls_t_sell:", nuls_t_sell);

  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "MultiToCicleToMultiSwapInput",
    methodDesc:
      "(String[] token, int chaining, int asseting, int chaining2, int asseting2, BigInteger nuls_to_sell, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [
      [fromTokenAddress, router, toTokenAddress],
      fromTokenChain,
      fromTokenAsset,
      toTokenChain,
      toTokenAsset,
      nuls_t_sell,
      min_tokens,
      "299898888888888",
    ],
    multyAssetValues: [[mValue, fromTokenChain, fromTokenAsset]],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapMultiCycleFromNulsToMulti(
  fromTokenAddrss: string,
  router: string,
  toTokenAddress: string,
  toTokenChain: number,
  toTokenAsset: number,
  nuls_t_sell: string,
  min_tokens: string,
  deadline: Number,
  account: string
) {
  let mValue = BigNumber(nuls_t_sell).dividedBy(Math.pow(10, 8)).toString();

  const data = {
    from: account,
    value: mValue,
    contractAddress: ROUTER_CONTRACT,
    methodName: "NulsToCicleToMultiSwapInput",
    methodDesc:
      "(String[] token, int chaining, int asseting, BigInteger nuls_to_sell, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [
      [fromTokenAddrss, router, toTokenAddress],
      toTokenChain,
      toTokenAsset,
      nuls_t_sell,
      min_tokens,
      deadline,
    ],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function swapMultiCycleFromMultiToNuls(
  fromTokenAddress: string,
  router: string,
  toTokenAddress: string,
  fromTokenChain: number,
  fromTokenAsset: number,
  nuls_t_sell: string,
  min_tokens: string,
  fromTokenDecimals: number,
  account: string
) {
  let mValue = BigNumber(nuls_t_sell)
    .dividedBy(Math.pow(10, fromTokenDecimals))
    .toString();

  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "MultiToCicleToNulsSwapInput",
    methodDesc:
      "(String[] token, int chaining, int asseting, BigInteger nuls_to_sell, BigInteger min_tokens, BigInteger deadline) return BigInteger",
    args: [
      [fromTokenAddress, router, toTokenAddress],
      fromTokenChain,
      fromTokenAsset,
      nuls_t_sell,
      min_tokens,
      2000000000000,
    ],
    multyAssetValues: [[mValue, fromTokenChain, fromTokenAsset]],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function getTotalLiquidity(pair: string) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        ip1 + "api/contract/view",
        {
          contractAddress: pair.toString(),
          methodName: "totalSupply",
          methodDesc: "() return BigInteger",
          args: [],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(function (response: any) {
        var data = response.data;
        console.log(response);

        // resolve({value: })
      })
      .catch(function (error: any) {
        console.error(error);
      });
  });
}

export async function approveSwapToken(token: Token, account: string) {
  return new Promise((resolve, reject) => {
    BigNumber.config({ EXPONENTIAL_AT: 1e9 });
    let allowance = new BigNumber(
      "99999999999999999999999999999999999999999999999999999999999999999999999"
    );
    const data = {
      from: account,
      value: 0,
      contractAddress: token.address,
      methodName: "approve",
      methodDesc: "(Address spender, BigInteger value) return boolean",
      args: [ROUTER_CONTRACT, allowance.toString()],
    };
    (window as unknown as NaboxWindow).nabox
      .contractCall(data)
      .then((res: any) => {
        resolve({ approveTransaction: res });
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

export async function approveForLend(token: Token, account: string) {
  return new Promise((resolve, reject) => {
    BigNumber.config({ EXPONENTIAL_AT: 1e9 });
    let allowance = new BigNumber(
      "99999999999999999999999999999999999999999999999999999999999999999999999"
    );
    const data = {
      from: account,
      value: 0,
      contractAddress: token.address,
      methodName: "approve",
      methodDesc: "(Address spender, BigInteger value) return boolean",
      args: [CTR, allowance.toString()],
    };
    (window as unknown as NaboxWindow).nabox
      .contractCall(data)
      .then((res: any) => {
        resolve({ approveTransaction: res });
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

export async function getAllowanceForLiquidity(token: Token, account: string) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        ip1 + "api/contract/view",
        {
          contractAddress: token.address,
          methodName: "allowance",
          methodDesc: "(Address owner, Address spender) return BigInteger",
          args: [account, ROUTER_CONTRACT],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response: any) => {
        if (response.status === 200 && response.data.success === true) {
          var data = response.data.data.result;
          resolve({ allowance: data });
        }
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export async function getAllowanceForLend(token: Token, account: string) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        ip1 + "api/contract/view",
        {
          contractAddress: token.address,
          methodName: "allowance",
          methodDesc: "(Address owner, Address spender) return BigInteger",
          args: [account, CTR],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response: any) => {
        if (response.status === 200 && response.data.success === true) {
          var data = response.data.data.result;
          resolve({ allowance: data });
        }
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export async function getUserLP(account: string) {
  return new Promise((resolve, reject) => {
    axios
      .get(apiIp + "/api/v1/userLiq/user/" + account)
      .then((response: any) => {
        let data = response.data;
        console.log(data);
        resolve({ LPList: data });
      })
      .catch((error: any) => {
        console.error(error);
      });
  });
}

export async function addLiquidityNulsToToken(
  tokenAddress: string,
  min: number,
  nulsAmount: string,
  tokenAmount: string,
  nulsDecimal: number,
  tokenDecimal: number,
  account: string
) {
  const nulsAmountValue = BigNumber(nulsAmount)
    .multipliedBy(Math.pow(10, nulsDecimal))
    .toString();
  const tokenAmountValue = BigNumber(tokenAmount)
    .multipliedBy(Math.pow(10, tokenDecimal))
    .toString();
  const data = {
    from: account,
    value: Number(nulsAmount),
    contractAddress: ROUTER_CONTRACT,
    methodName: "addLiquidityNulsToken",
    methodDesc:
      "(Address token, BigInteger min_liquidity, BigInteger nuls_amount, BigInteger token_amount, BigInteger deadline) return BigInteger",
    args: [
      tokenAddress,
      min,
      nulsAmountValue,
      tokenAmountValue,
      200000000000000,
    ],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function addLiquidityTokentoToken(
  addressTokenA: string,
  addressTokenB: string,
  min: string,
  amountTokenA: string,
  amountTokenB: string,
  tokenADecimal: number,
  tokenBDecimal: number,
  account: string
) {
  const amountTokenAvalue = BigNumber(amountTokenA).multipliedBy(
    Math.pow(10, tokenADecimal)
  );
  const amountTokenBvalue = BigNumber(amountTokenB).multipliedBy(
    Math.pow(10, tokenBDecimal)
  );
  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "addLiquidityTokenToken",
    methodDesc:
      "(Address tokenA, Address tokenB, BigInteger min_liquidity, BigInteger exact_token0, BigInteger max_tokens1, BigInteger deadline) return BigInteger",
    args: [
      addressTokenA,
      addressTokenB,
      min,
      amountTokenAvalue,
      amountTokenBvalue,
      200000000000000,
    ],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function addLiquidityTokentoMulti(
  tokenAddress: string,
  multichain: number,
  multiAsset: number,
  min: string,
  tokenAmount: string,
  multiAmount: string,
  tokenDecimal: number,
  multiDecimal: number,
  account: string
) {
  const tokenAmountValue = BigNumber(tokenAmount).multipliedBy(
    Math.pow(10, tokenDecimal)
  );
  const multiAmountValue = BigNumber(multiAmount).multipliedBy(
    Math.pow(10, multiDecimal)
  );
  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "addLiquidityTokentoMulti",
    methodDesc:
      "(Address token, int chain, int multyId, BigInteger min_liquidity, BigInteger token_amount, BigInteger multy_amount, BigInteger deadline) return BigInteger",
    args: [
      tokenAddress,
      multichain,
      multiAsset,
      min,
      tokenAmountValue,
      multiAmountValue,
      200000000000000,
    ],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function addLiquidityNulstoMulti(
  multichain: number,
  multiAsset: number,
  min: string,
  nulsAmount: string,
  multiAmount: string,
  nulsDecimal: number,
  multiDecimal: number,
  account: string
) {
  let nulsAmountValue = BigNumber(nulsAmount)
    .multipliedBy(Math.pow(10, nulsDecimal))
    .toString();
  let multiAmountValue = BigNumber(multiAmount)
    .multipliedBy(Math.pow(10, multiDecimal))
    .toString();
  const data = {
    from: account,
    value: nulsAmount,
    contractAddress: ROUTER_CONTRACT,
    methodName: "addLiquidityNulsMulti",
    methodDesc:
      "(int chain, int multyId, BigInteger min_liquidity, BigInteger nuls_amount, BigInteger multy_amount, BigInteger deadline) return BigInteger",
    args: [
      multichain,
      multiAsset,
      min,
      nulsAmountValue,
      multiAmountValue,
      20000000000000,
    ],
    multyAssetValues: [[multiAmount, multichain, multiAsset]],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function addLiquidityMultitoMulti(
  fromMultichain: number,
  toMultichain: number,
  fromMultiAsset: number,
  toMultiAsset: number,
  min: string,
  fromMultiAmount: string,
  toMultiAmount: string,
  fromMultiDecimal: number,
  toMultiDecimal: number,
  account: string
) {
  let fromMultiAmountValue = BigNumber(fromMultiAmount)
    .multipliedBy(Math.pow(10, fromMultiDecimal))
    .toString();
  let toMultiAmountValue = BigNumber(toMultiAmount)
    .multipliedBy(Math.pow(10, toMultiDecimal))
    .toString();
  const data = {
    from: account,
    value: 0,
    contractAddress: "addLiquidityMultiMulti",
    methodDesc:
      "(int chain10, int chain20, int asset10, int asset20, BigInteger min_liquidity, BigInteger multy1_amount, BigInteger multy2_amount, BigInteger deadline) return BigInteger",
    args: [
      fromMultichain,
      toMultichain,
      fromMultiAsset,
      toMultiAsset,
      min,
      fromMultiAmountValue,
      toMultiAmountValue,
      20000000000000,
    ],
    multyAssetValues: [
      [fromMultiAmount, fromMultichain, fromMultiAsset],
      [toMultiAmount, toMultichain, toMultiAsset],
    ],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res.toString();
}

export async function removeLiquidity(
  tokenA: Token,
  tokenB: Token,
  amount: string,
  min_tokenA: Number,
  min_tokenB: Number,
  account: string
) {
  const data = {
    from: account,
    value: 0,
    contractAddress: ROUTER_CONTRACT,
    methodName: "removeLiquidity",
    methodDesc:
      "(Address tokenA, Address tokenB, BigInteger amount, BigInteger min_nuls, BigInteger min_tokens, BigInteger deadline, int chain, int asset, int chain1, int asset1) return void",
    args: [
      tokenA.address,
      tokenB.address,
      amount,
      min_tokenA,
      min_tokenB,
      1635713150000,
      tokenA.chain,
      tokenA.asset,
      tokenB.chain,
      tokenB.asset,
    ],
  };

  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  console.log(res);

  return res;
}

export async function updatePair(pair: string, account: string) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        apiIp + "/api/v1/userLiq",
        {
          user: account,
          pair: pair,
          lp: "",
          lpAmount: "100",
          amountTknA: "100",
          amountTknB: "100",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        resolve({ value: response.data });
      })
      .catch((error) => {
        console.error(error);
        reject({ err: error });
      });
  });
}

export async function getAllowance(account: string) {
  const data = {
    contractAddress: NULSWAP_TOKEN,
    methodName: "allowance",
    methodDesc: "(Address owner, Address spender) return BigInteger",
    args: [account, STAKE_CONTRACT],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return res.result;
}

export async function approveForStake(account: string) {
  BigNumber.config({ EXPONENTIAL_AT: 1e9 });
  let allowance =
    "99999999999999999999999999999999999999999999999999999999999999999999999";

  const data = {
    from: account,
    value: 0,
    contractAddress: NULSWAP_TOKEN,
    methodName: "approve",
    methodDesc: "(Address spender, BigInteger value) return boolean",
    args: [STAKE_CONTRACT, allowance],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  console.log(res);
  return res;
}

export async function getLockedNswap() {
  const data = {
    contractAddress: STAKE_CONTRACT,
    methodName: "totalSupply",
    methodDesc: "() return BigInteger",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return res.result;
}

export async function stakeNswap(account: string, amount: string) {
  let amountValue = BigNumber(amount).multipliedBy(Math.pow(10, 8));
  const data = {
    from: account,
    value: 0,
    contractAddress: STAKE_CONTRACT,
    methodName: "stake",
    methodDesc: "(BigInteger amount) return void",
    args: [amountValue.toString()],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  console.log(res);
  return res;
}

export async function compoundNswap(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: STAKE_CONTRACT,
    methodName: "compound",
    methodDesc: "() return void",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  console.log(res);
  return res;
}

export async function unstakeNswap(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: STAKE_CONTRACT,
    methodName: "withdraw",
    methodDesc: "() return BigInteger",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  return res;
}

export async function getLockedNuls() {
  const data = {
    contractAddress: STAKE_NULS_CONTRACT,
    methodName: "totalSupply",
    methodDesc: "() return BigInteger",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return res.result;
}

export async function stakeNuls(account: string, amount: string) {
  let amountValue = BigNumber(amount).multipliedBy(Math.pow(10, 8));
  const data = {
    from: account,
    value: Number(amount),
    contractAddress: STAKE_NULS_CONTRACT,
    methodName: "stake",
    methodDesc: "(BigInteger value) return void",
    args: [amountValue.toString()],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  console.log(res);
  return res;
}

export async function compoundNuls(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: STAKE_NULS_CONTRACT,
    methodName: "compound",
    methodDesc: "() return BigInteger",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  console.log(res);
  return res;
}

export async function unstakeNuls(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: STAKE_NULS_CONTRACT,
    methodName: "withdraw",
    methodDesc: "() return void",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);
  console.log(res);
  return res;
}

export async function getConsensusApy() {
  try {
    const response = await axios.post(
      "https://public1.nuls.io/",
      {
        jsonrpc: "2.0",
        method: "getAnnulizedRewardStatistical",
        params: [1, 3],
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    const iLength = data.result.length;
    return data.result[iLength - 1].value;
  } catch (error) {
    console.error(error);
  }
}

export async function getStakedNuls(account: string) {
  const data = {
    contractAddress: STAKE_NULS_CONTRACT,
    methodName: "_balanceOf",
    methodDesc: "(Address account) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  let totalStaked = res.result;

  totalStaked = BigNumber(totalStaked).dividedBy(Math.pow(10, 8)).toFixed(2);
  return totalStaked;
}

export async function getStakedNswap(account: string) {
  const data = {
    contractAddress: STAKE_CONTRACT,
    methodName: "_balanceOf",
    methodDesc: "(Address account) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  let totalStaked = res.result;

  totalStaked = BigNumber(totalStaked).dividedBy(Math.pow(10, 8)).toFixed(2);
  return totalStaked;
}

export async function getEarnedNuls(account: string) {
  const data = {
    contractAddress: STAKE_NULS_CONTRACT,
    methodName: "earnedNuls",
    methodDesc: "(Address account) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  let totalStaked = res.result;
  totalStaked = BigNumber(totalStaked).dividedBy(Math.pow(10, 8)).toFixed(2);
  return totalStaked;
}

export async function getEarnedNswap(account: string) {
  const data = {
    contractAddress: STAKE_NULS_CONTRACT,
    methodName: "earned",
    methodDesc: "(Address account) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  let totalStaked = res.result;
  totalStaked = BigNumber(totalStaked).dividedBy(Math.pow(10, 8)).toFixed(2);
  return totalStaked;
}

export async function getEarnedNswap1(account: string) {
  const data = {
    contractAddress: STAKE_CONTRACT,
    methodName: "earned",
    methodDesc: "(Address account) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  let totalStaked = res.result;
  totalStaked = BigNumber(totalStaked).dividedBy(Math.pow(10, 8)).toFixed(2);
  return totalStaked;
}

export async function getLockedTime(account: string) {
  const data = {
    contractAddress: STAKE_CONTRACT,
    methodName: "lockedTime",
    methodDesc: "(Address account) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return Number(res.result);
}

/*----- Lend Page Api ----- */

export async function getTotalSupplied(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getTotalCollateral",
    methodDesc: "() return BigInteger",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  console.log(res);

  return BigNumber(res.result).dividedBy(Math.pow(10, 8)).toString();
}

export async function getTotalBorrowed(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getTotalBorrowed",
    methodDesc: "() return BigInteger",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return BigNumber(res.result).dividedBy(Math.pow(10, 8)).toString();
}

export async function getHealthFactor(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getUserHealth",
    methodDesc: "(Address user) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  return res.result;
}

export async function getUserBorrowLimit(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getUserBorrowLimit",
    methodDesc: "(Address user) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return BigNumber(res.result).dividedBy(Math.pow(10, 8)).toString();
}

export async function getUserBorrowed(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getUserDebt",
    methodDesc: "(Address user) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return BigNumber(res.result).dividedBy(Math.pow(10, 8)).toString();
}

export async function getUserSupplied(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getUserTotalCollateral",
    methodDesc: "(Address user) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return BigNumber(res.result).dividedBy(Math.pow(10, 8)).toString();
}

export async function getUserNulsSupplied(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getUserNulsSupplied",
    methodDesc: "(Address user) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return BigNumber(res.result).dividedBy(Math.pow(10, 8)).toString();
}

export async function getUserAiNulsSupplied(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getUserAINulsSupplied",
    methodDesc: "(Address user) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return BigNumber(res.result).dividedBy(Math.pow(10, 8)).toString();
}

export async function getUserSupplyReward(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getUserSupplyReward",
    methodDesc: "(Address user) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  return res.result;
}

export async function getUserReward(account: string) {
  const data = {
    from: account,
    value: 0.0,
    contractAddress: CTR,
    methodName: "getUserReward",
    methodDesc: "(Address user) return BigInteger",
    args: [account],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  return res.result;
}

export async function getAinulsReward(account: string) {
  const data = {
    from: account,
    value: 0.01,
    contractAddress: CTR,
    methodName: "getRewardsinAINULS",
    methodDesc: "() return void",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);

  return res.toString();
}

export async function getTotalNulsSupplied(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getTotalNulsSupplied",
    methodDesc: "() return BigInteger",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
  return BigNumber(res.result).dividedBy(Math.pow(10, 8)).toString();
}

export async function getTotalAINulsSupplied(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getTotalAINulsSupplied",
    methodDesc: "() return BigInteger",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  return BigNumber(res.result).dividedBy(Math.pow(10, 8)).toString();
}

export async function getTotalNulsBorrowed(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getTotalNulsBorrowed",
    methodDesc: "() return BigInteger",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  return res.result;
}

export async function supplyNuls(val: number, account: string) {
  let amount = BigNumber(val.toString())
    .multipliedBy(Math.pow(10, 8))
    .toString();
  const data = {
    from: account,
    value: val + 0.01,
    contractAddress: CTR,
    methodName: "supplyNuls",
    methodDesc: "(BigInteger amount) return void",
    args: [amount],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);

  return res.toString();
}

export async function supplyAiNuls(val: number, account: string) {
  let amount = BigNumber(val.toString())
    .multipliedBy(Math.pow(10, 8))
    .toString();
  const data = {
    from: account,
    value: val + 0.01,
    contractAddress: CTR,
    methodName: "supplyAINuls",
    methodDesc: "(BigInteger amount) return void",
    args: [amount],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);

  return res.toString();
}

export async function borrow(val: Number, account: string) {
  let amount = BigNumber(val.toString())
    .multipliedBy(Math.pow(10, 8))
    .toString();
  const data = {
    from: account,
    value: 0.01,
    contractAddress: CTR,
    methodName: "borrow",
    methodDesc: "(BigInteger amount) return void",
    args: [amount],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);

  return res.toString();
}

export async function repay(val: number, account: string) {
  let amount = BigNumber(val.toString())
    .multipliedBy(Math.pow(10, 8))
    .toString();
  let modifiedVal = val + 0.01;
  const data = {
    from: account,
    value: modifiedVal,
    contractAddress: CTR,
    methodName: "repayWithNULS",
    methodDesc: "(BigInteger amount) return void",
    args: [amount],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);

  return res.toString();
}

export async function withdrawNuls(val: number, account: string) {
  let amount = BigNumber(val.toString())
    .multipliedBy(Math.pow(10, 8))
    .toString();
  const data = {
    from: account,
    value: 0.01,
    contractAddress: CTR,
    methodName: "withdrawNULS",
    methodDesc: "(BigInteger amount) return void",
    args: [amount],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);

  return res.toString();
}

export async function withdrawAinuls(amount: string, account: string) {
  const data = {
    from: account,
    value: 0.01,
    contractAddress: CTR,
    methodName: "withdrawAINULS",
    methodDesc: "(Address token, BigInteger amount) return void",
    args: [amount],
  };
  const res = await (window as unknown as NaboxWindow).nabox.contractCall(data);

  return res.toString();
}

export async function getNulsBorrowApy(account: string) {
  const data = {
    from: account,
    value: 0,
    contractAddress: CTR,
    methodName: "getBorrowRate",
    methodDesc: "() return BigInteger",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  let apy = BigNumber(res.result).dividedBy(100000).toString();
  return apy;
}

export async function getNulsSupplyApy(account: string) {
  const data = {
    from: account.toString(),
    value: 0,
    contractAddress: CTR,
    methodName: "getlendingRate",
    methodDesc: "() return BigInteger",
    args: [],
  };
  const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);

  let apy = BigNumber(res.result).dividedBy(100000).toString();
  return apy;
}
