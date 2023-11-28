"use client";
import TokenInput from "@/src/components/Input/TokenInput";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Spinner,
} from "@components/MaterialTailwind";
import { useState, useEffect, useReducer, useRef } from "react";
import Link from "next/link";

import { LuArrowLeft } from "react-icons/lu";

import { BsPlusLg } from "react-icons/bs";

import ConfirmAddDialog from "@/src/components/dialog/Pools/ConfirmAddModal";

import tokenList from "@/src/tokens/tokenList";
import { Token, TokenBalance } from "@/src/types/token";
import {
  approveSwapToken,
  currentReserve,
  getAllowanceForLiquidity,
  getPair,
  getTokenBalance,
  token0Address,
  updatePair,
} from "@/src/api/nulsConnector";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";
import {
  getFromToken,
  getIsAddLiquiditySuccessed,
  getToToken,
  getTransactionUrl,
  setFromToken,
  setIsAddLiquiditySuccessed,
  setToToken,
  setTokenBalanceList,
} from "@/src/redux/swap/Token";
import BigNumber from "bignumber.js";

export default function Page() {
  const [changeFrom, setChangeFrom] = useState<string>("");
  const [changeTo, setChangeTo] = useState<string>("");
  const tokenA = useAppSelector(getFromToken);
  const tokenB = useAppSelector(getToToken);
  const [balanceTokenA, setBalanceTokenA] = useState<string>("");
  const [balanceTokenB, setBalanceTokenB] = useState<string>("");
  const [mintedLiquidity, setMintedLiquidity] = useState<string>("0");
  const [poolShare, setPoolShare] = useState<string>("0");
  const [tokenACR, setTokenACR] = useState<string>("");
  const [tokenBCR, setTokenBCR] = useState<string>("");
  const [allowancetokenA, setAllowanceTokenA] = useState<string>();
  const [allowancetokenB, setAllowanceTokenB] = useState<string>();
  const [isApprovedTokenA, setIsApprovedTokenA] = useState<boolean>(true);
  const [isApprovedTokenB, setIsApprovedTokenB] = useState<boolean>(true);
  const [insufficient, setInsufficient] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [addressToken0, setAddressToken0] = useState<string>("");

  const [pairAddress, setPairAddress] = useState<string>("")

  const accountAddress = useAppSelector(getWalletAddress);

  const isAddliquidity = useAppSelector(getIsAddLiquiditySuccessed);

  const transaction = useAppSelector(getTransactionUrl);

  const isMounted = useRef(false);

  const onChangeFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeFrom(String(e.currentTarget.value));
  };
  const onChangeTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeTo(String(e.currentTarget.value));
  };

  const dispatch = useAppDispatch();

  async function approveToken(token: Token, type: string) {
    try {
      setIsLoading(true);
      const result: any = await approveSwapToken(token, accountAddress);
      if (type == "A") setIsApprovedTokenA(true);
      else if (type == "B") setIsApprovedTokenB(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function getAllowance(token: Token, type: string) {
    getAllowanceForLiquidity(token, accountAddress)
      .then((res: any) => {
        console.log("api", res.allowance);

        if (type == "A") setAllowanceTokenA(res.allowance);
        else if (type == "B") setAllowanceTokenB(res.allowance);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const price_formula = (
    inputAmount: string,
    reserve0: string,
    reserve1: string,
    tokenADecimal: number,
    tokenBDecimal: number
  ) => {
    let inputAmountValue =
      inputAmount == "" ? BigNumber(0) : new BigNumber(inputAmount);
    let reserve0_value = new BigNumber(reserve0);
    let reserve1_value = new BigNumber(reserve1);
    let amountFirst = inputAmountValue
      .multipliedBy(reserve1_value)
      .dividedBy(reserve0_value)
      .dividedBy(Math.pow(10, tokenBDecimal))
      .multipliedBy(Math.pow(10, tokenADecimal));
    let amount = amountFirst;
    amount = amount.multipliedBy(1003).dividedBy(1000);
    return amount;
  };

  const price_formula2 = (
    inputAmount: string,
    reserve0: string,
    reserve1: string,
    tokenADecimal: number,
    tokenBDecimal: number
  ) => {
    let inputAmountValue =
      inputAmount == "" ? BigNumber(0) : new BigNumber(inputAmount);
    let reserve0_value = new BigNumber(reserve0);
    let reserve1_value = new BigNumber(reserve1);
    let amF = inputAmountValue;
    let amount = amF.multipliedBy(reserve1_value).dividedBy(reserve0_value);
    // amount = amount.plus(1);
    amount = amount
      .dividedBy(Math.pow(10, tokenADecimal))
      .multipliedBy(Math.pow(10, tokenBDecimal));
    amount = amount.multipliedBy(1001).dividedBy(1000);
    return amount;
  };

  const [focus, setFocus] = useState<number>(0);

  const cyrb53 = (str: string, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
      Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
      Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
      Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
      Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };

  async function getTokenBalanceList(address: string) {
    let list: TokenBalance[] = [];
    for (let index = 0; index < tokenList.tokens.length; index++) {
      const token = tokenList.tokens[index];
      let balance: any;
      if (token.symbol == "BULS") balance = { value: "0" };
      else balance = await getTokenBalance(token, address);
      list = [
        ...list,
        {
          name: token.name,
          balance: balance.value == "0" ? "0.00000" : balance.value,
        },
      ];
    }
    return list;
  }

  useEffect(() => {
    document.title = "Nulswap - The First DEX on NULS";
  }, []);

  useEffect(() => {
    if (accountAddress !== "") {
      getTokenBalanceList(accountAddress)
        .then((res: TokenBalance[]) => {
          console.log(res);

          dispatch(setTokenBalanceList(res));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [accountAddress]);

  useEffect(() => {
    dispatch(setFromToken(tokenList.from));
    dispatch(setToToken(tokenList.to));
  }, []);

  useEffect(() => {
    getAllowance(tokenList.from, "A");
    getAllowance(tokenList.to, "B");
  }, [accountAddress]);

  useEffect(() => {
    if (focus == 1) setChangeFrom("");
    else setChangeTo("");
  }, [focus]);

  useEffect(() => {
    getAllowance(tokenA, "A");
  }, [tokenA]);

  useEffect(() => {
    getAllowance(tokenB, "B");
  }, [tokenB]);

  useEffect(() => {

    if (allowancetokenA != "0") {
      console.log(Number(allowancetokenA), Number(changeFrom));

      if (Number(allowancetokenA) > Number(changeFrom))
        setIsApprovedTokenA(true);
      else setIsApprovedTokenA(false);
    } else setIsApprovedTokenA(false);
  }, [allowancetokenA, changeFrom]);

  useEffect(() => {
    if (allowancetokenB != "0") {
      if (Number(allowancetokenB) > Number(changeTo)) setIsApprovedTokenB(true);
      else setIsApprovedTokenB(false);
    } else setIsApprovedTokenB(false);
  }, [allowancetokenB, changeTo]);

  useEffect(() => {
    if (accountAddress != "") {
      getTokenBalance(tokenA, accountAddress)
        .then((res: any) => {
          setBalanceTokenA(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTokenBalance(tokenB, accountAddress)
        .then((res: any) => {
          setBalanceTokenB(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getPair(tokenA.address, tokenB.address).then((pair: string) => {
        setPairAddress(pair)
        token0Address(pair).then((token: any) => {
          setAddressToken0(token.tokenAddress);
          currentReserve(pair).then((res: any) => {
            if (token.tokenAddress == tokenA.address) {
              setTokenACR(res.fromTokenReserve);
              setTokenBCR(res.toTokenReserve);
            } else {
              setTokenBCR(res.fromTokenReserve);
              setTokenACR(res.toTokenReserve);
            }
          });
        });
      });
    } else {
      setBalanceTokenA("0");
      setBalanceTokenB("0");
    }
  }, [tokenA, tokenB, accountAddress]);

  useEffect(() => {
    BigNumber.config({ DECIMAL_PLACES: 10 });
    if (focus == 1) {
      let toTokenAmount;
      toTokenAmount = price_formula(
        changeFrom,
        tokenACR,
        tokenBCR,
        tokenA.decimals,
        tokenB.decimals
      );
      let liquidityMintedValue = BigNumber(changeFrom)
        .multipliedBy(Math.pow(10, tokenA.decimals))
        .multipliedBy(toTokenAmount)
        .multipliedBy(Math.pow(10, tokenB.decimals))
        .dividedBy(BigNumber(tokenBCR).multipliedBy(Math.pow(10, 8)))
        .toString();
      liquidityMintedValue =
        liquidityMintedValue == "NaN" || liquidityMintedValue == "0"
          ? "0"
          : BigNumber(liquidityMintedValue).toFixed(8);
      setMintedLiquidity(liquidityMintedValue);
      let sharedpool = BigNumber(changeFrom)
        .dividedBy(
          BigNumber(tokenACR)
            .dividedBy(Math.pow(10, tokenA.decimals))
            .plus(BigNumber(changeFrom))
        )
        .multipliedBy(100)
        .toString();
      sharedpool =
        sharedpool == "NaN" || sharedpool == "0"
          ? "0"
          : BigNumber(sharedpool).toFixed(2);
      setPoolShare(sharedpool);
      setChangeTo(toTokenAmount.toString());
    }
    if (focus == 2) {
      let fromTokenAmount;
      fromTokenAmount = price_formula2(
        changeTo,
        tokenBCR,
        tokenACR,
        tokenA.decimals,
        tokenB.decimals
      );
      let liquidityMintedValue = BigNumber(changeTo)
        .multipliedBy(Math.pow(10, tokenB.decimals))
        .multipliedBy(fromTokenAmount)
        .multipliedBy(Math.pow(10, tokenA.decimals))
        .dividedBy(BigNumber(tokenBCR).multipliedBy(Math.pow(10, 8)))
        .toString();
      liquidityMintedValue =
        liquidityMintedValue == "NaN" || liquidityMintedValue == "0"
          ? "0"
          : BigNumber(liquidityMintedValue).toFixed(8);
      setMintedLiquidity(liquidityMintedValue);
      let sharedpool = BigNumber(changeFrom)
        .dividedBy(
          BigNumber(tokenACR)
            .dividedBy(Math.pow(10, tokenA.decimals))
            .plus(BigNumber(changeFrom))
        )
        .multipliedBy(100)
        .toString();
      sharedpool =
        sharedpool == "NaN" || sharedpool == "0"
          ? "0"
          : BigNumber(sharedpool).toFixed(2);
      setPoolShare(sharedpool);
      setChangeFrom(fromTokenAmount.toString());
    }
  }, [changeFrom, changeTo, tokenACR, tokenBCR, addressToken0, focus]);

  useEffect(() => {
    if (
      Number(changeFrom) < Number(balanceTokenA) &&
      Number(changeTo) < Number(balanceTokenB)
    )
      setInsufficient(false);
    else setInsufficient(true);
  }, [changeFrom, changeTo, balanceTokenA, balanceTokenB]);

  useEffect(() => {
    if (isMounted.current) {
      if (transaction != "") {
        console.log(transaction);

        setSubmitting(true);
        const timeout = setTimeout(() => {
          setSubmitting(false);
        }, 12000);
        return () => clearTimeout(timeout);
      }
    } else {
      isMounted.current = true;
    }
  }, [transaction]);

  useEffect(() => {
    if (submitting == false) {
      getTokenBalance(tokenA, accountAddress)
        .then((res: any) => {
          setBalanceTokenA(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTokenBalance(tokenB, accountAddress)
        .then((res: any) => {
          setBalanceTokenB(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      
      updatePair(pairAddress, accountAddress)
        .then((res: any) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [submitting]);

  return (
    <div className="flex justify-center md:mt-6">
      <Card className="shadow-[0_0_15px_white] bg-tertiary md:!w-[420px] !min-w-[310px] md:my-10 my-5 mx-2">
        <CardBody>
          <div className="flex justify-start gap-2 items-center">
            <div className="text-white hover:scale-150">
              <Link href="/pools">
                <LuArrowLeft />
              </Link>
            </div>
            <Typography variant="h5" color="blue-gray" className="text-white">
              Add Liquidity
            </Typography>
          </div>
          <div className="mt-2">
            <TokenInput
              title="Token A"
              balance={balanceTokenA}
              value={changeFrom}
              onChange={onChangeFrom}
              token={tokenA}
              onSelectToken={(newToken: Token) => {
                dispatch(setFromToken(newToken));
              }}
              onFocus={() => setFocus(1)}
              onMaxClick={() => {}}
            />
          </div>
          <div className="flex justify-center items-center md:my-5 my-3">
            <div className="text-white md:text-[30px] text-[20px]">
              <BsPlusLg />
            </div>
          </div>
          <div className="mt-2">
            <TokenInput
              title="Token B"
              balance={balanceTokenB}
              value={changeTo}
              onChange={onChangeTo}
              token={tokenB}
              onSelectToken={(newToken: Token) => {
                dispatch(setToToken(newToken));
              }}
              onFocus={() => setFocus(2)}
              onMaxClick={() => {}}
            />
          </div>
          <div className="flex-column mt-2">
            <div className="flex justify-end items-center px-2 py-1">
              <Typography variant="small" className="text-white text-[15px]">
                Liquidity Minted:&nbsp;
              </Typography>
              <Typography variant="small" className="text-white text-[15px]">
                {mintedLiquidity} {tokenA.symbol + "/" + tokenB.symbol}
              </Typography>
            </div>
            <div className="flex justify-end items-center px-2 py-1">
              <Typography variant="small" className="text-white text-[15px]">
                Share of Pool:&nbsp;
              </Typography>
              <Typography variant="small" className="text-white text-[15px]">
                {`${poolShare} %`}
              </Typography>
            </div>
          </div>
          <div className="flex justify-between gap-1 mt-1 mb-3">
            <Button
              className={`w-1/2 disabled:opacity-100 ${
                isApprovedTokenA ? "bg-gray-500" : "bg-primary"
              } py-0`}
              onClick={() => approveToken(tokenA, "A")}
              disabled={isApprovedTokenA}
            >
              {!isApprovedTokenA
                ? `Approve ${tokenA.symbol}`
                : `${tokenA.symbol} Approved`}
            </Button>
            <Button
              className={`w-1/2 disabled:opacity-100 ${
                isApprovedTokenB ? "bg-gray-500" : "bg-primary"
              }`}
              onClick={() => approveToken(tokenB, "B")}
              disabled={isApprovedTokenB}
            >
              {!isApprovedTokenB
                ? `Approve ${tokenB.symbol}`
                : `${tokenB.symbol} Approved`}
            </Button>
          </div>
          <Button
            variant="filled"
            className={
              (insufficient ? "bg-gray-500" : "bg-primary") +
              " w-full disabled:opacity-100"
            }
            onClick={() => dispatch(setIsAddLiquiditySuccessed(true))}
            disabled={insufficient}
          >
            {insufficient ? "Insufficient Balance!" : "Add Liquidity"}
          </Button>
          <ConfirmAddDialog
            open={isAddliquidity}
            onClose={() => dispatch(setIsAddLiquiditySuccessed(false))}
            tokenA={tokenA}
            tokenB={tokenB}
            amountTokenA={changeFrom}
            amountTokenB={changeTo}
            liquidityMinted={mintedLiquidity}
            poolShare={poolShare}
          />
        </CardBody>
        {submitting && (
          <div className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center">
            <Spinner className="text-primary h-16 w-16" />
          </div>
        )}
      </Card>
    </div>
  );
}
