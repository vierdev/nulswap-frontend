"use client";
import TokenInput from "@/src/components/Input/TokenInput";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Spinner,
} from "@components/MaterialTailwind";
import { useState, useEffect, useRef } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { FaArrowDown, FaBook, FaMedium } from "react-icons/fa";

import { MdSettings } from "react-icons/md";

import SettingDialog from "@components/dialog/Swap/SettingDialog";
import ConfirmSwapDialog from "@/src/components/dialog/Swap/ConfirmSwapModal";
import { BiLogoDiscord, BiLogoTelegram } from "react-icons/bi";
import { SiTwitter } from "react-icons/si";
import tokenList from "@/src/tokens/tokenList";
import { Token, TokenBalance } from "@/src/types/token";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  getIsSwapSuccessed,
  getTransactionUrl,
  setFromToken,
  setIsSwapSuccessed,
  setToToken,
  setTokenBalanceList,
} from "@/src/redux/swap/Token";

import {
  approveSwapToken,
  currentReserve,
  getAllowanceForLiquidity,
  getPair,
  getTokenBalance,
  swapTradeInfo,
  token0Address,
} from "@/src/api/nulsConnector";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";
import BigNumber from "bignumber.js";
import { getTolerance } from "@/src/redux/swap/tolerance";

export default function Page() {
  const [changeFrom, setChangeFrom] = useState<string>("");
  const [changeTo, setChangeTo] = useState<string>("");
  const [fromBalance, setFromBalance] = useState<string>("0");
  const [toBalance, setToBalance] = useState<string>("0");
  const [fromTokenCR, setFromTokenCR] = useState<string>("");
  const [toTokenCR, setToTokenCR] = useState<string>("");
  const [swapType, setSwapType] = useState<string>("T1");
  const [middleToken, setMiddleToken] = useState<Token>(tokenList.from);
  const [middleFromTokenCR, setMiddleFromTokenCR] = useState<string>("");
  const [middleToTokenCR, setMiddleToTokenCR] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<string>("");
  const [priceImpact, setPriceImpact] = useState<string>("0.00");
  const [minimumReceived, setMinimumReceived] = useState<string>("");
  const [approveTransaction, setApproveTransaction] = useState<string>("");
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allowance, setAllowance] = useState<number>(0);
  const [swap, setSwap] = useState<{
    class: string;
    content: string;
    disable: boolean;
  }>({ class: "bg-primary", content: "Swap", disable: false });

  const [submitting, setSubmitting] = useState<boolean>(false);

  const isMounted = useRef(false);

  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);

  const slippage = useAppSelector(getTolerance);

  const isSwapDialogOpen = useAppSelector(getIsSwapSuccessed);

  const [tokens, setTokens] = useState<Token[]>([tokenList.from, tokenList.to]);
  const [isSettingDialogOpen, setIsSettingDialogOpen] =
    useState<boolean>(false);

  const SwitchToken = () => {
    setTokens((prev) => [prev[1], prev[0]]);
  };

  const dispatch = useAppDispatch();

  const accountAddress = useAppSelector(getWalletAddress);

  const transaction = useAppSelector(getTransactionUrl);

  const [focus, setFocus] = useState<number>(1);
  useEffect(() => {
    if (accountAddress != "") {
      getTokenBalance(tokens[0], accountAddress)
        .then((res: any) => {
          setFromBalance(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTokenBalance(tokens[1], accountAddress)
        .then((res: any) => {
          setToBalance(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      swapTradeInfo(
        tokens[0],
        tokens[1],
        new BigNumber(100000000000).multipliedBy(Math.pow(10, 8))
      )
        .then((res: any) => {
          if (res.swapType == undefined) setSwapType("T1");
          setSwapType(res.swapType);
          if (res.swapType == "T1" || res.swapType == undefined) {
            getPair(tokens[0].address, tokens[1].address).then(
              (pair: string) => {
                console.log(pair);

                token0Address(pair).then((token: any) => {
                  currentReserve(pair).then((res: any) => {
                    if (token.tokenAddress == tokens[0].address) {
                      setFromTokenCR(res.fromTokenReserve);
                      setToTokenCR(res.toTokenReserve);
                    } else {
                      setToTokenCR(res.fromTokenReserve);
                      setFromTokenCR(res.toTokenReserve);
                    }
                  });
                });
              }
            );
          } else {
            setMiddleToken(res.middleToken);
            let resMiddleToken: any = res.middleToken;
            if (resMiddleToken == undefined) {
              setMiddleToken(tokenList.from);
            } else {
              tokenList.tokens.map((token) => {
                if (token.address == resMiddleToken) setMiddleToken(token);
              });

              getPair(tokens[0].address, res.middleToken).then(
                (pair: string) => {
                  token0Address(pair).then((token: any) => {
                    currentReserve(pair).then((res: any) => {
                      if (token.tokenAddress == tokens[0].address) {
                        setFromTokenCR(res.fromTokenReserve);
                        setMiddleFromTokenCR(res.toTokenReserve);
                      } else {
                        setMiddleFromTokenCR(res.fromTokenReserve);
                        setFromTokenCR(res.toTokenReserve);
                      }
                    });
                  });
                }
              );
              getPair(res.middleToken, tokens[1].address).then(
                (pair: string) => {
                  token0Address(pair).then((token: any) => {
                    currentReserve(pair).then((res: any) => {
                      if (token.tokenAddress == resMiddleToken) {
                        setMiddleToTokenCR(res.fromTokenReserve);
                        setToTokenCR(res.toTokenReserve);
                      } else {
                        setToTokenCR(res.fromTokenReserve);
                        setMiddleToTokenCR(res.toTokenReserve);
                      }
                    });
                  });
                }
              );
            }
          }
        })
        .catch((err) => console.log(err));
    } else {
      setFromBalance("0");
      setToBalance("0");
    }
  }, [tokens, accountAddress]);

  const onChangeFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeFrom(String(e.currentTarget.value));
  };

  const onChangeTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeTo(String(e.currentTarget.value));
  };

  const getToTokenAmount = (
    fromTokenAmount: BigNumber,
    formTokenReverse: string,
    toTokenReverse: string,
    fromToken: Token,
    toToken: Token
  ) => {
    BigNumber.config({ DECIMAL_PLACES: 5 });
    const fromReserve = new BigNumber(formTokenReverse).dividedBy(
      Math.pow(10, fromToken.decimals)
    );
    const toReserve = new BigNumber(toTokenReverse).dividedBy(
      Math.pow(10, toToken.decimals)
    );
    let fromValue = new BigNumber(fromTokenAmount);
    const inputAmountFee = fromValue.multipliedBy(996);
    const numerator = inputAmountFee.multipliedBy(toReserve);
    const denominator = fromReserve.multipliedBy(1000).plus(inputAmountFee);
    const toValue = new BigNumber(numerator.dividedBy(denominator));
    return toValue;
  };

  const getFromTokenAmount = (
    toTokenAmount: BigNumber,
    fromTokenReserve: string,
    toTokenReserve: string,
    fromToken: Token,
    toToken: Token
  ) => {
    BigNumber.config({ DECIMAL_PLACES: 5 });
    const fromReserve = new BigNumber(fromTokenReserve).dividedBy(
      Math.pow(10, fromToken.decimals)
    );
    const toReserve = new BigNumber(toTokenReserve).dividedBy(
      Math.pow(10, toToken.decimals)
    );
    let toValue = new BigNumber(toTokenAmount);
    let numerator = fromReserve.multipliedBy(toValue).multipliedBy(1000);
    let denominator = toReserve.minus(toValue).multipliedBy(996);
    let modifiedDenominator = denominator.isNegative()
      ? BigNumber(1)
      : denominator;
    let fromValue = new BigNumber(numerator.dividedBy(modifiedDenominator));
    return fromValue;
  };

  async function approveToken() {
    try {
      setIsLoading(true);
      const result: any = await approveSwapToken(tokens[0], accountAddress);
      setIsApproved(true);
      setIsLoading(false);
      setApproveTransaction(result.approveTransaction);
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function getAllowance() {
    return new Promise<any>((resolve, reject) => {
      getAllowanceForLiquidity(tokens[0], accountAddress)
        .then((res: any) => {
          resolve(res.allowance);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

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
    if (accountAddress !== "") {
      getTokenBalanceList(accountAddress)
        .then((res: TokenBalance[]) => {
          dispatch(setTokenBalanceList(res));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [accountAddress]);

  useEffect(() => {
    dispatch(setFromToken(tokens[0]));
    dispatch(setToToken(tokens[1]));
    if (accountAddress != "") {
      getAllowance()
        .then((res) => {
          if (allowance !== res) setAllowance(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [tokens, accountAddress]);

  useEffect(() => {
    if (fromTokenCR === "" || changeFrom === "NaN") return;
    if (
      Number(allowance) > Number(changeFrom) &&
      Number(fromTokenCR) > Number(changeFrom)
    ) {
      setIsApproved(true);
    } else setIsApproved(false);
  }, [allowance, fromTokenCR, changeFrom]);

  useEffect(() => {
    BigNumber.config({ DECIMAL_PLACES: 10 });
    if (focus == 1) {
      let fromValue = new BigNumber(changeFrom);
      let toTokenAmount;
      if (swapType == "T1") {
        toTokenAmount = getToTokenAmount(
          fromValue,
          fromTokenCR,
          toTokenCR,
          tokens[0],
          tokens[1]
        );
        setChangeTo(String(toTokenAmount));
      } else {
        let middleTokenAmount = getToTokenAmount(
          fromValue,
          fromTokenCR,
          middleFromTokenCR,
          tokens[0],
          middleToken
        );
        toTokenAmount = getToTokenAmount(
          middleTokenAmount,
          middleToTokenCR,
          toTokenCR,
          middleToken,
          tokens[1]
        );
        setChangeTo(String(toTokenAmount));
      }
      setExchangeRate(toTokenAmount.dividedBy(fromValue).toString());
    }
    if (focus == 2) {
      let toValue = new BigNumber(changeTo);
      let fromTokenAmount;
      if (swapType == "T1") {
        fromTokenAmount = getFromTokenAmount(
          toValue,
          fromTokenCR,
          toTokenCR,
          tokens[0],
          tokens[1]
        );
        setChangeFrom(String(fromTokenAmount));
      } else {
        let middleTokenAmount = getFromTokenAmount(
          toValue,
          fromTokenCR,
          middleFromTokenCR,
          tokens[0],
          middleToken
        );
        fromTokenAmount = getFromTokenAmount(
          middleTokenAmount,
          middleToTokenCR,
          toTokenCR,
          middleToken,
          tokens[1]
        );
        setChangeFrom(String(fromTokenAmount));
      }
      setExchangeRate(toValue.dividedBy(fromTokenAmount).toString());
    }
  }, [
    changeFrom,
    changeTo,
    fromTokenCR,
    toTokenCR,
    swapType,
    middleFromTokenCR,
    middleToTokenCR,
    transaction,
    middleToken,
  ]);

  useEffect(() => {
    let toTokenCRNum = BigNumber(toTokenCR).dividedBy(
      Math.pow(10, tokens[1].decimals)
    );

    if (Number(changeTo) > Number(toTokenCRNum)) {
      setSwap({
        class: "bg-gray-400",
        content: "Insufficient Liquidity",
        disable: true,
      });
    } else if (Number(changeFrom) > Number(fromBalance)) {
      setSwap({
        class: "bg-gray-400",
        content: "Insufficient balance",
        disable: true,
      });
    } else if (isApproved) {
      setSwap({ class: "bg-primary", content: "Swap", disable: false });
    } else {
      setSwap({ class: "bg-gray-400", content: "Swap", disable: true });
    }
  }, [changeFrom, fromBalance, isApproved, changeTo, toTokenCR, tokens]);

  useEffect(() => {
    BigNumber.config({ DECIMAL_PLACES: 7 });
    let changeToNum = new BigNumber(changeTo);
    let toTokenCRNum = new BigNumber(toTokenCR).dividedBy(
      Math.pow(10, tokens[1].decimals)
    );
    let priceImpactNum = new BigNumber(
      changeToNum.dividedBy(toTokenCRNum).multipliedBy(100)
    );
    setPriceImpact(priceImpactNum.toString());
  }, [changeTo, toTokenCR]);

  useEffect(() => {
    let changeToNum = new BigNumber(changeTo);
    setMinimumReceived(
      changeToNum
        .multipliedBy(100 - slippage)
        .dividedBy(100)
        .toString()
    );
  }, [changeTo, slippage]);

  useEffect(() => {
    if (focus == 1) setChangeFrom("");
    else setChangeTo("");
  }, [focus]);

  useEffect(() => {
    setChangeFrom("");
    setChangeTo("");
  }, [tokens]);

  useEffect(() => {
    document.title = "Nulswap - The First DEX on NULS";
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      if (transaction !== "") {
        setSubmitting(true);
        const timeout = setTimeout(() => {
          setSubmitting(false);
        }, 10000);
        return () => clearTimeout(timeout);
      }
    } else {
      isMounted.current = true;
    }
  }, [transaction]);

  useEffect(() => {
    if (submitting == false) {
      getTokenBalance(tokens[0], accountAddress)
        .then((res: any) => {
          setFromBalance(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTokenBalance(tokens[1], accountAddress)
        .then((res: any) => {
          setToBalance(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [submitting]);

  return (
    <>
      <div className="flex justify-center mt-6">
        <Card className="shadow-[0_0_15px_white] bg-tertiary md:!w-[420px] min-w-[310px] md:mt-10 mx-2">
          <CardBody>
            <div className="flex justify-between items-center">
              <Typography variant="h5" color="blue-gray" className="text-white">
                Swap
              </Typography>

              <div className="flex items-center gap-1">
                <div className="text-white hover:text-gray-500 cursor-pointer text-[20px]">
                  <LuRefreshCw
                    onClick={() => setTokens([tokenList.from, tokenList.to])}
                  />
                </div>
                <div className="relative text-white hover:text-gray-500 cursor-pointer text-[24px]">
                  <MdSettings onClick={() => setIsSettingDialogOpen(true)} />
                  <SettingDialog
                    open={isSettingDialogOpen}
                    onClose={() => {
                      setIsSettingDialogOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-2">
              <TokenInput
                title="From"
                balance={fromBalance}
                value={changeFrom == "NaN" ? "0" : changeFrom}
                onChange={onChangeFrom}
                token={tokens[0]}
                onSelectToken={(newToken: Token) => {
                  setTokens((prev) => [newToken, prev[1]]);
                  dispatch(setFromToken(newToken));
                }}
                onFocus={() => setFocus(1)}
                ref={inputRef1}
                onMaxClick={() => setChangeFrom(fromBalance)}
              />
            </div>
            <div className="flex justify-center items-center my-5">
              <div className="text-white hover:text-gray-500 cursor-pointer">
                <FaArrowDown onClick={() => SwitchToken()} />
              </div>
            </div>
            <div className="mt-2">
              <TokenInput
                title="To"
                balance={toBalance}
                value={changeTo === "NaN" ? "0" : changeTo}
                onChange={onChangeTo}
                token={tokens[1]}
                onSelectToken={(newToken: Token) => {
                  setTokens((prev) => [prev[0], newToken]);
                  dispatch(setToToken(newToken));
                }}
                onFocus={() => setFocus(2)}
                ref={inputRef2}
                onMaxClick={() => {}}
              />
            </div>
            <div className="flex-column mt-2">
              <div className="flex justify-between items-center px-2 py-1">
                <Typography variant="small" className="text-white">
                  Exchange Rate:
                </Typography>
                <Typography variant="small" className="text-white">
                  {exchangeRate === "NaN" ? "0.00" : exchangeRate}{" "}
                  {tokens[1].symbol}/{tokens[0].symbol}
                </Typography>
              </div>
              <div className="flex justify-between items-center px-2 py-1">
                <Typography variant="small" className="text-white">
                  Price Impact:
                </Typography>
                <Typography variant="small" className="text-white">
                  {priceImpact === "NaN"
                    ? "0.00"
                    : Number(priceImpact) > 100
                    ? "-"
                    : priceImpact}{" "}
                  %
                </Typography>
              </div>
              <div className="flex justify-between items-center px-2 py-1">
                <Typography variant="small" className="text-white">
                  Minimum Received:
                </Typography>
                <Typography variant="small" className="text-white">
                  {minimumReceived === "NaN" ? "0.00" : minimumReceived}
                </Typography>
              </div>
            </div>
          </CardBody>
          {submitting && (
            <div className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center">
              <Spinner className="text-primary h-16 w-16" />
            </div>
          )}
          <CardFooter className="pt-0">
            <div className="flex flex-col">
              <Button
                className={"bg-primary w-full text-[18px] py-2 mb-2"}
                onClick={() => approveToken()}
                hidden={isApproved}
              >
                <Typography className="text-white font-bold">{`Approve ${tokens[0].symbol}`}</Typography>
              </Button>
              <Button
                className={
                  (Number(changeFrom) > Number(fromBalance) ||
                  (Number(changeFrom) <= Number(fromBalance) &&
                    isApproved == false)
                    ? "bg-gray-500"
                    : "bg-primary") +
                  " w-full text-[18px] py-2 disabled:opacity-100"
                }
                onClick={() => dispatch(setIsSwapSuccessed(true))}
                disabled={
                  Number(changeFrom) > Number(fromBalance) ||
                  (Number(changeFrom) <= Number(fromBalance) &&
                    isApproved == false)
                }
              >
                <Typography className="text-white font-bold">{`${swap.content}`}</Typography>
              </Button>
            </div>

            <ConfirmSwapDialog
              open={isSwapDialogOpen}
              onClose={() => dispatch(setIsSwapSuccessed(false))}
              fromToken={changeFrom}
              toToken={changeTo}
              exchangeRate={exchangeRate}
              priceImpact={priceImpact}
              minimumReceived={minimumReceived}
              fromTokenIcon={tokens[0]}
              toTokenIcon={tokens[1]}
              swapType={swapType}
              middleTokenAddress={middleToken.address}
            />
          </CardFooter>
        </Card>
      </div>
      <div className="flex justify-center my-5 md:my-10 gap-6 items-center">
        <a
          target="_blank"
          href={"https://t.me/nulswap"}
          className="text-[25px] hover:scale-125"
        >
          <BiLogoTelegram />
        </a>
        <a
          target="_blank"
          href={"https://twitter.com/nulswap"}
          className="text-[25px] hover:scale-125"
        >
          <SiTwitter />
        </a>
        <a
          target="_blank"
          href={"https://discord.com/invite/3HZCbypWHF"}
          className="text-[25px] hover:scale-125"
        >
          <BiLogoDiscord />
        </a>
        <a
          target="_blank"
          href={"https://nulswap.medium.com/"}
          className="text-[25px] hover:scale-125"
        >
          <FaMedium />
        </a>
        <a
          target="_blank"
          href={"https://docs.nulswap.com"}
          className="text-[25px] hover:scale-125"
        >
          <FaBook />
        </a>
      </div>
    </>
  );
}
