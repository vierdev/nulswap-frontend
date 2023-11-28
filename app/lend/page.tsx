"use client";

import {
  getAllowanceForLend,
  getHealthFactor,
  getNulsBorrowApy,
  getNulsSupplyApy,
  getTokenBalance,
  getTotalAINulsSupplied,
  getTotalBorrowed,
  getTotalNulsBorrowed,
  getTotalNulsSupplied,
  getTotalSupplied,
  getUserAiNulsSupplied,
  getUserBorrowLimit,
  getUserBorrowed,
  getUserNulsSupplied,
  getUserReward,
  getUserSupplied,
} from "@/src/api/nulsConnector";
import SupplyDialog from "@/src/components/dialog/aiNuls/SupplyDialog";
import WithdrawDialog from "@/src/components/dialog/aiNuls/WithdrawDialog";
import BorrowDialog from "@/src/components/dialog/lend/BorrowDialog";
import RepayDialog from "@/src/components/dialog/lend/RepayDialog";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  getBorrowTransaction,
  getIsAinulsSupplySuccessed,
  getIsAinulsWithdrawSuccessed,
  getIsBorrowSuccessed,
  getIsNulsSupplySuccessed,
  getIsNulsWithdrawSuccessed,
  getIsRepaySuccessed,
  getRepayTransaction,
  getSupplyAinulsTransaction,
  getSupplyNulsTransaction,
  getWithdrawAinulsTransaction,
  getWithdrawNulsTransaction,
  setIsAinulsSupplySuccessed,
  setIsAinulsWithdrawSuccessed,
  setIsBorrowSuccessed,
  setIsNulsSupplySuccessed,
  setIsNulsWithdrawSuccessed,
  setIsRepaySuccessed,
} from "@/src/redux/lend/operation";
import { getTransactionUrl } from "@/src/redux/swap/Token";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";
import tokenList from "@/src/tokens/tokenList";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Spinner,
} from "@components/MaterialTailwind";
import BigNumber from "bignumber.js";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [totalSupplied, setTotalSupplied] = useState<string>("");
  const [totalBorrowed, setTotalBorrowed] = useState<string>("");
  const [userSupplied, setUserSupplied] = useState<string>("");
  const [userBorrows, setUserBorrows] = useState<string>("");
  const [borrowLimit, setBorrowLimit] = useState<string>("");
  const [healthFactor, setHealthFactor] = useState<string>("");
  const [suppliedTotalNuls, setSuppliedTotalNuls] = useState<string>("");
  const [suppliedTotalAinuls, setSuppliedTotalAinuls] = useState<string>("");
  const [totalNulsBorrowed, setTotalNulsBorrowed] = useState<string>("");
  const [allowance, setAllowance] = useState<string>("");
  const [suppliedNulsApy, setSuppliedNulsApy] = useState<string>("");
  const [suppliedAinulsApy, setSuppliedAinulsApy] = useState<string>("");
  const [borrowedNulsApy, setBorrowedNulsApy] = useState<string>("");
  const [aiNulsReward, setAiNulsReward] = useState<string>("");
  const [nulsPrice, setNulsPrice] = useState<string>("");

  const [userNulsSupplied, setUserNulsSupplied] = useState<string>("");
  const [userAinulsSupplied, setUserAinulsSupplied] = useState<string>("");

  const isOpenSupplyNulsDialog = useAppSelector(getIsNulsSupplySuccessed);
  const isOpenSupplyaiNulsDialog = useAppSelector(getIsAinulsSupplySuccessed);
  const isOpenWithdrawNulsDialog = useAppSelector(getIsNulsWithdrawSuccessed);
  const isOpenWithdrawaiNulsDialog = useAppSelector(
    getIsAinulsWithdrawSuccessed
  );
  const isOpenBorrowModalDialog = useAppSelector(getIsBorrowSuccessed);
  const isOpenRepayModalDialog = useAppSelector(getIsRepaySuccessed);

  const [nulsBalance, setNulsBalance] = useState<string>("");

  const [aiNulsBalance, setAiNulsBalance] = useState<string>("");

  const address = useAppSelector(getWalletAddress);

  const [nulsSupplySubmitting, setNulsSupplySubmitting] =
    useState<boolean>(false);

  const [ainulsSupplySubmitting, setAinulsSupplySubmitting] =
    useState<boolean>(false);

  const [nulsWithdrawSubmitting, setNulsWithdrawSubmitting] =
    useState<boolean>(false);

  const [ainulsWithdrawSubmitting, setAinulsWithdrawSubmitting] =
    useState<boolean>(false);

  const [repaySubmitting, setRepaySubmitting] = useState<boolean>(false);

  const [borrowSubmitting, setBorrowSubmitting] = useState<boolean>(false);

  const isMounted = useRef(false);

  const dispatch = useAppDispatch();

  const nulsSupplyTransaction = useAppSelector(getSupplyNulsTransaction);

  const ainulsSupplyTransaction = useAppSelector(getSupplyAinulsTransaction);

  const nulsWithdrawTransaction = useAppSelector(getWithdrawNulsTransaction);

  const ainulsWithdrawTransaction = useAppSelector(
    getWithdrawAinulsTransaction
  );

  const repayTransaction = useAppSelector(getRepayTransaction);

  const borrowTransaction = useAppSelector(getBorrowTransaction);

  async function getAllowance() {
    return new Promise<any>((resolve, reject) => {
      getAllowanceForLend(tokenList.tokens[2], address)
        .then((res: any) => {
          resolve(res.allowance);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  useEffect(() => {
    if (address != "") {
      getAllowance()
        .then((res: any) => {
          setAllowance(res);
        })
        .then((err: any) => {
          console.log(err);
        });
      getTokenBalance(tokenList.tokens[0], address)
        .then((res: any) => {
          console.log("nulsbalance:", res.value);

          setNulsBalance(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTokenBalance(tokenList.tokens[2], address)
        .then((res: any) => {
          setAiNulsBalance(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTotalSupplied(address)
        .then((res: any) => {
          setTotalSupplied(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTotalBorrowed(address)
        .then((res: any) => {
          setTotalBorrowed(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getUserSupplied(address)
        .then((res: any) => {
          setUserSupplied(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getUserBorrowed(address)
        .then((res: any) => {
          setUserBorrows(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getUserBorrowLimit(address)
        .then((res: any) => {
          setBorrowLimit(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getHealthFactor(address)
        .then((res: any) => {
          setHealthFactor(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTotalNulsSupplied(address)
        .then((res: any) => {
          setSuppliedTotalNuls(res);
        })
        .then((err: any) => {
          console.log(err);
        });
      getTotalAINulsSupplied(address)
        .then((res: any) => {
          setSuppliedTotalAinuls(res);
        })
        .catch((err: any) => {});
      getTotalNulsBorrowed(address)
        .then((res: any) => {
          setTotalNulsBorrowed(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getNulsSupplyApy(address)
        .then((res: any) => {
          setSuppliedNulsApy(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getNulsBorrowApy(address)
        .then((res: any) => {
          setBorrowedNulsApy(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getUserBorrowed(address)
        .then((res: any) => {})
        .catch((err: any) => {
          console.log(err);
        });
      getUserReward(address)
        .then((res: any) => {
          setAiNulsReward(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getUserNulsSupplied(address)
        .then((res: any) => {
          setUserNulsSupplied(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getUserAiNulsSupplied(address)
        .then((res: any) => {
          setUserAinulsSupplied(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [address]);

  useEffect(() => {
    fetch("https://api.binance.com/api/v3/ticker/price?symbol=NULSUSDT")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setNulsPrice(data.price);
      });
  }, []);

  useEffect(() => {
    document.title = "Nulswap - The First DEX on NULS";
  }, []);

  useEffect(() => {
    console.log("allowance:", allowance);
  }, [allowance]);

  useEffect(() => {
    if (isMounted.current) {
      if (nulsSupplyTransaction !== "") {
        setNulsSupplySubmitting(true);
        const timeout = setTimeout(() => {
          setNulsSupplySubmitting(false);
        }, 10000);
        return () => clearTimeout(timeout);
      }
    } else {
      isMounted.current = true;
    }
  }, [nulsSupplyTransaction]);

  useEffect(() => {
    if (isMounted.current) {
      if (ainulsSupplyTransaction !== "") {
        setAinulsSupplySubmitting(true);
        const timeout = setTimeout(() => {
          setAinulsSupplySubmitting(false);
        }, 10000);
        return () => clearTimeout(timeout);
      }
    } else {
      isMounted.current = true;
    }
  }, [ainulsSupplyTransaction]);

  useEffect(() => {
    if (isMounted.current) {
      if (nulsWithdrawTransaction !== "") {
        setNulsWithdrawSubmitting(true);
        const timeout = setTimeout(() => {
          setNulsWithdrawSubmitting(false);
        }, 10000);
        return () => clearTimeout(timeout);
      }
    } else {
      isMounted.current = true;
    }
  }, [nulsWithdrawTransaction]);

  useEffect(() => {
    if (isMounted.current) {
      if (ainulsWithdrawTransaction !== "") {
        setAinulsWithdrawSubmitting(true);
        const timeout = setTimeout(() => {
          setAinulsWithdrawSubmitting(false);
        }, 10000);
        return () => clearTimeout(timeout);
      }
    } else {
      isMounted.current = true;
    }
  }, [ainulsWithdrawTransaction]);

  useEffect(() => {
    if (isMounted.current) {
      if (repayTransaction !== "") {
        setRepaySubmitting(true);
        const timeout = setTimeout(() => {
          setRepaySubmitting(false);
        }, 10000);
        return () => clearTimeout(timeout);
      }
    } else {
      isMounted.current = true;
    }
  }, [repayTransaction]);

  useEffect(() => {
    if (isMounted.current) {
      if (borrowTransaction !== "") {
        setBorrowSubmitting(true);
        const timeout = setTimeout(() => {
          setBorrowSubmitting(false);
        }, 10000);
        return () => clearTimeout(timeout);
      }
    } else {
      isMounted.current = true;
    }
  }, [borrowTransaction]);

  useEffect(() => {
    if (
      !nulsSupplySubmitting ||
      !nulsWithdrawSubmitting ||
      !repaySubmitting ||
      !borrowSubmitting
    ) {
      console.log(
        "nulssupply: ",
        nulsSupplySubmitting,
        "nulsWithdraw: ",
        nulsWithdrawSubmitting
      );

      getTokenBalance(tokenList.tokens[0], address)
        .then((res: any) => {
          console.log("nulsbalance:", res.value);
          setNulsBalance(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTotalSupplied(address)
        .then((res: any) => {
          setTotalSupplied(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getUserSupplied(address)
        .then((res: any) => {
          setUserSupplied(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTotalNulsSupplied(address)
        .then((res: any) => {
          setSuppliedTotalNuls(res);
        })
        .then((err: any) => {
          console.log(err);
        });
      getHealthFactor(address)
        .then((res: any) => {
          setHealthFactor(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getUserNulsSupplied(address)
        .then((res: any) => {
          setUserNulsSupplied(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [
    nulsSupplySubmitting,
    nulsWithdrawSubmitting,
    repaySubmitting,
    borrowSubmitting,
  ]);

  useEffect(() => {
    if (ainulsSupplySubmitting == false || ainulsWithdrawSubmitting == false) {
      getTokenBalance(tokenList.tokens[2], address)
        .then((res: any) => {
          setNulsBalance(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTotalSupplied(address)
        .then((res: any) => {
          setTotalSupplied(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getUserSupplied(address)
        .then((res: any) => {
          setUserSupplied(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getTotalNulsSupplied(address)
        .then((res: any) => {
          setSuppliedTotalNuls(res);
        })
        .then((err: any) => {
          console.log(err);
        });
      getHealthFactor(address)
        .then((res: any) => {
          setHealthFactor(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getUserAiNulsSupplied(address)
        .then((res: any) => {
          setUserAinulsSupplied(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [ainulsSupplySubmitting, ainulsWithdrawSubmitting]);

  return (
    <div>
      <div className="flex justify-center mt-6 mb-[50px]">
        <Card className="bg-tertiary min-w-[310px] mt-10 mx-2">
          <div className="flex justify-center">
            <CardHeader
              variant="gradient"
              className="mb-1 grid h-10 place-items-center !bg-primary mt-[-16px] !w-5/6 !rounded-lg"
            >
              <Typography
                variant="h5"
                color="white"
                className="text-[16px] md:text-[20px]"
              >
                Liquidity Efficient Market
              </Typography>
            </CardHeader>
          </div>
          <CardBody>
            <div className="flex justify-center items-center md:px-[50px] px-[5px]">
              <div className="grid grid-cols-2 items-center w-full md:gap-[50px] md:pb-[30px] pb-[10px]">
                <div className="flex flex-col">
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[20px] font-semibold"
                  >
                    TOTAL
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[20px] font-semibold"
                  >
                    SUPPLIED
                  </Typography>
                  <Typography className="text-white text-[12px] md:text-[28px] font-extrabold">
                    $
                    {BigNumber(totalSupplied)
                      .multipliedBy(BigNumber(nulsPrice))
                      .toFixed(2)
                      .toString()}
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[20px] font-semibold"
                  >
                    TOTAL
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[20px] font-semibold"
                  >
                    BORROWED
                  </Typography>
                  <Typography className="text-white text-[12px] md:text-[28px] font-extrabold">
                    $
                    {BigNumber(totalBorrowed)
                      .multipliedBy(BigNumber(nulsPrice))
                      .toFixed(2)
                      .toString()}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center md:px-[50px] px-[5px]">
              <div className="flex justify-between w-full ">
                <div className="flex flex-col">
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[16px] font-semibold"
                  >
                    YOUR
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[16px] font-semibold"
                  >
                    SUPPLIED
                  </Typography>
                  <Typography className="text-white text-[12px] md:text-[24px] font-bold">
                    $
                    {BigNumber(userSupplied)
                      .multipliedBy(BigNumber(nulsPrice))
                      .toFixed(2)
                      .toString()}
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[16px] font-semibold"
                  >
                    YOUR
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[16px] font-semibold"
                  >
                    BORROWS
                  </Typography>
                  <Typography className="text-white text-[12px] md:text-[24px] font-bold">
                    $
                    {BigNumber(userBorrows)
                      .multipliedBy(BigNumber(nulsPrice))
                      .toFixed(2)
                      .toString()}
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[16px] font-semibold"
                  >
                    BORROWS
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[16px] font-semibold"
                  >
                    LIMIT
                  </Typography>
                  <Typography className="text-white text-[12px] md:text-[24px] font-bold">
                    90%
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[16px] font-semibold"
                  >
                    HEALTH
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-primary text-[12px] md:text-[16px] font-semibold"
                  >
                    FACTOR
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-white text-[12px] md:text-[24px] font-bold"
                  >
                    {healthFactor ? healthFactor : "-"}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="md:px-[20px]">
              <div className="flex justify-start md:pt-[20px] pt-[10px]">
                <Typography
                  variant="h6"
                  className="text-white text-[14px] md:text-[16px]"
                >
                  Supply Markets
                </Typography>
              </div>
              <div className="flex justify-start md:pt-[15px] pt-1 md:px-[60px] md:!gap-[22px] pl-[35px] gap-3">
                <Typography
                  variant="paragraph"
                  className="text-primary text-[12px] md:text-[16px] font-semibold"
                >
                  Asset
                </Typography>
                <Typography
                  variant="paragraph"
                  className="text-primary text-[12px] md:text-[16px] pl-2 font-semibold"
                >
                  Apy
                </Typography>
                <Typography
                  variant="paragraph"
                  className="text-primary text-[12px] md:text-[16px] pl-3 font-semibold"
                >
                  Rewards
                </Typography>
                <Typography
                  variant="paragraph"
                  className="text-primary text-[12px] md:text-[16px] md:pl-2 font-semibold"
                >
                  T.Supplied
                </Typography>
              </div>
              <div className="flex flex-col md:flex-row border border-primary rounded-xl py-1 px-0">
                <div className="flex justify-start md:gap-1 gap-1 pl-0 !mx-0 pt-1 md:items-center">
                  <Image
                    src={"/tokens/nuls.png"}
                    alt="NULS"
                    width={20}
                    height={20}
                    className="rounded-full bg-secondary ml-2 md:w-10 pl-0"
                  />
                  <Typography
                    variant="paragraph"
                    className="text-white md:pl-2 text-[12px] md:text-[16px] pr-1 md:w-[50px]"
                  >
                    NULS
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-white md:pl-5 text-[12px] md:text-[16px] pr-2 md:!w-[60px] w-[45px] text-center "
                  >
                    {Number(suppliedNulsApy).toFixed(2).toString()}%
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-white md:pl-1 pl-2 text-[12px] md:text-[16px] w-[80px] md:w-[100px] text-center"
                  >
                    -
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-white md:pl-4 pr-2 text-[12px] md:text-[16px] md:w-[90px] text-center"
                  >
                    $
                    {BigNumber(suppliedTotalNuls)
                      .multipliedBy(BigNumber(nulsPrice))
                      .toFixed(2)
                      .toString()}
                  </Typography>
                </div>
                <div className="flex mx-auto md:!pt-2 md:pr-2">
                  <Button
                    className="bg-primary rounded-lg md:h-[25px] py-0 px-3 mr-2 h-[20px]"
                    onClick={() => {
                      dispatch(setIsNulsSupplySuccessed(true));
                    }}
                  >
                    Supply
                  </Button>
                  <Button
                    className="bg-primary rounded-lg md:h-[25px] py-0 px-2 h-[20px]"
                    onClick={() => dispatch(setIsNulsWithdrawSuccessed(true))}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row border border-primary rounded-xl py-1 px-0 mt-2">
                <div className="flex justify-start md:gap-1 gap-1 pl-0 !mx-0 pt-1 md:items-center">
                  <Image
                    src={"/tokens/ainuls.png"}
                    alt="NULS"
                    width={20}
                    height={20}
                    className="rounded-full bg-secondary ml-2 md:w-10 pl-0"
                  />
                  <Typography
                    variant="paragraph"
                    className="text-white md:pl-2 text-[12px] md:text-[16px] pr-1 md:pr-0 md:w-[50px] !min-w-[35px]"
                  >
                    aiNULS
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-white md:pl-5 text-[12px] md:text-[16px] pr-2 md:!w-[60px] w-[45px] text-center "
                  >
                    0%
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-white md:pl-3 text-[12px] md:text-[16px] w-[80px] md:w-[100px] text-center"
                  >
                    {aiNulsReward} NULS
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-white md:pl-4 pr-2 text-[12px] md:text-[16px] md:w-[90px] text-center"
                  >
                    $
                    {BigNumber(suppliedTotalAinuls)
                      .multipliedBy(BigNumber(nulsPrice))
                      .toString()}
                  </Typography>
                </div>
                <div className="flex mx-auto md:!pt-2 md:pr-2">
                  <Button
                    className="bg-primary rounded-lg md:h-[25px] py-0 px-3 mr-2 h-[20px]"
                    onClick={() => {
                      dispatch(setIsAinulsSupplySuccessed(true));
                    }}
                  >
                    Supply
                  </Button>
                  <Button
                    className={`rounded-lg md:h-[25px] py-0 px-2 h-[20px] disabled:opacity-100 ${
                      Number(suppliedTotalAinuls) > 0
                        ? "bg-primary"
                        : "bg-gray-500"
                    }`}
                    onClick={() => dispatch(setIsAinulsWithdrawSuccessed(true))}
                    disabled={!(Number(suppliedTotalAinuls) > 0)}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            </div>
            <div className="md:px-[20px]">
              <div className="flex justify-start pt-[30px]">
                <Typography variant="h6" className="text-white">
                  Borrow Markets
                </Typography>
              </div>
              <div className="flex justify-start md:pt-[15px] pt-1 md:px-[60px] md:!gap-[22px] pl-[35px] gap-3">
                <Typography
                  variant="paragraph"
                  className="text-primary text-[12px] md:text-[16px] font-semibold"
                >
                  Asset
                </Typography>
                <Typography
                  variant="paragraph"
                  className="text-primary text-[12px] md:text-[16px] md:pl-10 pl-6 font-semibold"
                >
                  Apy
                </Typography>
                <Typography
                  variant="paragraph"
                  className="text-primary text-[12px] md:text-[16px] md:pl-10 pl-6 font-semibold"
                >
                  T.Borrowed
                </Typography>
              </div>
              <div className="flex flex-col md:flex-row border border-primary rounded-xl py-1 px-0">
                <div className="flex justify-start md:gap-1 gap-1 pl-0 !mx-0 pt-1 md:items-center">
                  <Image
                    src={"/tokens/nuls.png"}
                    alt="NULS"
                    width={20}
                    height={20}
                    className="rounded-full bg-secondary ml-2 md:w-10 pl-0"
                  />
                  <Typography
                    variant="paragraph"
                    className="text-white md:pl-2 text-[12px] md:text-[16px] pr-1 md:w-[50px]"
                  >
                    NULS
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-white md:pl-[30px] pl-7 text-[12px] md:text-[16px] pr-2 md:!w-[120px] w-[60px] text-center "
                  >
                    {borrowedNulsApy == "" || borrowedNulsApy == "NaN"
                      ? "-"
                      : Number(borrowedNulsApy).toFixed(2).toString()}{" "}
                    %
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-white md:pl-[10px] pl-10 pr-2 text-[12px] md:text-[16px] md:!w-[150px] text-center"
                  >
                    {Number(userBorrows).toFixed(2).toString()} NULS
                  </Typography>
                </div>
                <div className="flex mx-auto md:!pt-2 md:pr-2">
                  <Button
                    className={`bg-primary rounded-lg md:h-[25px] py-0 px-3 mr-2 h-[20px] disabled:opacity-100 ${
                      Number(userBorrows) > 0 ? "bg-primary" : "bg-gray-500"
                    }`}
                    onClick={() => {
                      dispatch(setIsRepaySuccessed(true));
                    }}
                    disabled={Number(userBorrows) == 0}
                  >
                    Repay
                  </Button>
                  <Button
                    className="bg-primary rounded-lg md:h-[25px] py-0 px-2 h-[20px]"
                    onClick={() => dispatch(setIsBorrowSuccessed(true))}
                  >
                    Borrow
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
          {(nulsSupplySubmitting ||
            ainulsSupplySubmitting ||
            nulsWithdrawSubmitting ||
            ainulsWithdrawSubmitting ||
            repaySubmitting ||
            borrowSubmitting) && (
            <div className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center">
              <Spinner className="text-primary h-16 w-16" />
            </div>
          )}
        </Card>
        <SupplyDialog
          open={isOpenSupplyNulsDialog}
          onClose={() => dispatch(setIsNulsSupplySuccessed(false))}
          token={tokenList.tokens[0]}
          apy={suppliedNulsApy}
          healthfactor={healthFactor}
          balance={nulsBalance}
          supplied={userNulsSupplied}
          borrowed={userBorrows}
          allowance=""
        />
        <WithdrawDialog
          open={isOpenWithdrawNulsDialog}
          onClose={() => dispatch(setIsNulsWithdrawSuccessed(false))}
          token={tokenList.tokens[0]}
          healthfactor={healthFactor}
          balance={""}
          rewards={""}
          supplied={userNulsSupplied}
          borrowed={userBorrows}
        />
        <SupplyDialog
          open={isOpenSupplyaiNulsDialog}
          onClose={() => dispatch(setIsAinulsSupplySuccessed(false))}
          token={tokenList.tokens[2]}
          apy={suppliedAinulsApy}
          healthfactor={healthFactor}
          balance={aiNulsBalance}
          supplied={userAinulsSupplied}
          borrowed={userBorrows}
          allowance={allowance}
        />
        <WithdrawDialog
          open={isOpenWithdrawaiNulsDialog}
          onClose={() => dispatch(setIsAinulsWithdrawSuccessed(false))}
          token={tokenList.tokens[2]}
          rewards={""}
          healthfactor={healthFactor}
          balance={""}
          supplied={userAinulsSupplied}
          borrowed={userBorrows}
        />
        <RepayDialog
          open={isOpenRepayModalDialog}
          onClose={() => dispatch(setIsRepaySuccessed(false))}
          healthfactor={healthFactor}
          balance={nulsBalance}
          supplied={userSupplied}
          borrowed={userBorrows}
        />
        <BorrowDialog
          open={isOpenBorrowModalDialog}
          onClose={() => dispatch(setIsBorrowSuccessed(false))}
          healthfactor={healthFactor}
          collatreal={nulsBalance}
          supplied={userSupplied}
          borrowed={userBorrows}
        />
      </div>
    </div>
  );
}
