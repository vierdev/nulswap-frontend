"use client";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
} from "@components/MaterialTailwind";
import { useState, useEffect, useRef } from "react";

import UnstakeDialog from "@components/dialog/Stake/UnstakeDialog";
import { CardHeader, Spinner } from "@material-tailwind/react";
import TransactionFailDialog from "@/src/components/dialog/Swap/TransactionFailModal";
import TransactionSuccessDialog from "@/src/components/dialog/Swap/TransactionSuccessModal";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";
import {
  compoundNuls,
  currentReserve,
  getConsensusApy,
  getEarnedNswap,
  getEarnedNuls,
  getLockedNuls,
  getPair,
  getStakedNswap,
  getStakedNuls,
  getTokenBalance,
  stakeNuls,
  unstakeNuls,
} from "@/src/api/nulsConnector";
import tokenList from "@/src/tokens/tokenList";
import BigNumber from "bignumber.js";
import { getTransactionUrl, setTransactionUrl } from "@/src/redux/swap/Token";

export default function Page() {
  const [totalLockedAmount, setTotalLockedAmount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [isTransactionSuccessModalOpen, setIsTransactionSuccessModalOpen] =
    useState<boolean>(false);
  const [isTransactionFailModalOpen, setIsTransactionFailModalOpen] =
    useState<boolean>(false);

  const [stakeAmount, setStakeAmount] = useState<string>("");

  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] =
    useState<boolean>(false);

  const [stakedNuls, setStakedNuls] = useState<string>("");
  const [earnedNuls, setEarnedNuls] = useState<string>("");
  const [earnedNswap, setEarnedNswap] = useState<string>("");

  const [nulsAPR, setNulsAPR] = useState<string>("");

  const [nswapAPR, setNswapAPR] = useState<string>("");

  const transactionUrl = useAppSelector(getTransactionUrl);

  const address = useAppSelector(getWalletAddress);

  const [disableStake, setDisableStake] = useState<boolean>(false);

  const [nulsReserve, setNulsReserve] = useState<string>("");

  const [nswapReserve, setNswapReserve] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);

  const isMounted = useRef(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    getConsensusApy()
      .then((res: any) => {
        setNulsAPR(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
    getLockedNuls().then((res) => {
      console.log(res);
      setTotalLockedAmount(
        parseFloat(
          BigNumber(res).dividedBy(Math.pow(10, 8)).toString()
        ).toFixed(2)
      );
    });
    getPair(tokenList.tokens[0].address, tokenList.tokens[1].address).then(
      (pair: string) =>
        currentReserve(pair).then((res: any) => {
          setNulsReserve(res.fromTokenReserve);
          setNswapReserve(res.toTokenReserve);
        })
    );
  }, []);

  useEffect(() => {
    setNswapAPR(
      BigNumber(Math.pow(10, 8))
        .multipliedBy(BigNumber(nulsReserve))
        .dividedBy(BigNumber(nswapReserve))
        .dividedBy(BigNumber(totalLockedAmount))
        .toFixed(2)
        .toString()
    );
  }, [totalLockedAmount, nulsReserve, nswapReserve]);

  useEffect(() => {
    document.title = "Nulswap - The First DEX on NULS";
  }, []);

  useEffect(() => {
    if (address != "") {
      getTokenBalance(tokenList.tokens[0], address).then((res: any) => {
        setBalance(res.value);
      });
      getStakedNuls(address)
        .then((res: any) => {
          setStakedNuls(res);
        })
        .catch((err) => {});
      getStakedNswap(address)
        .then((res: string) => {
          console.log(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getEarnedNuls(address)
        .then((res: any) => {
          setEarnedNuls(res);
        })
        .catch((err) => {});
      getEarnedNswap(address)
        .then((res: any) => {
          setEarnedNswap(res);
        })
        .catch((err) => {});
    }
  }, [address]);

  useEffect(() => {
    setDisableStake(Number(stakeAmount) < 100 || Number(balance) < 100);
  }, [balance, stakeAmount]);

  useEffect(() => {
    if (isMounted.current) {
      if (transactionUrl !== "") {
        setSubmitting(true);
        const timeout = setTimeout(() => {
          setSubmitting(false);
        }, 10000);
        return () => clearTimeout(timeout);
      }
    } else {
      isMounted.current = false;
    }
  }, [transactionUrl]);

  useEffect(() => {
    if (submitting == false) {
      getTokenBalance(tokenList.tokens[0], address)
        .then((res: any) => {
          setBalance(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getStakedNuls(address)
        .then((res: any) => {
          setStakedNuls(res);
        })
        .catch((err) => {});
    }
  }, [submitting]);

  return (
    <>
      <div className="flex justify-center mt-6">
        <Card className="shadow-[0_0_15px_white] bg-tertiary !min-w-[300px] md:!w-[470px] mt-10 mx-2 mb-10">
          <div className="flex justify-center">
            <CardHeader
              variant="gradient"
              className="mb-1 grid h-8 place-items-center !bg-primary mt-[-16px] !w-5/6 !rounded-lg"
            >
              <Typography variant="h6" color="white">
                Total Locked: {totalLockedAmount} NULS
              </Typography>
            </CardHeader>
          </div>
          <CardBody>
            <div className="flex justify-center items-center gap-2 pb-3">
              <Typography variant="h5" color="blue-gray" className="text-white">
                Stake
              </Typography>
              <Typography variant="h5" color="blue-gray" className="text-white">
                NULS
              </Typography>
            </div>
            <div className="flex justify-start">
              <Typography className="text-[15px] font-bold text-white">
                Balance: {balance} &nbsp;
              </Typography>
              <Typography
                className="underline text-white text-[15px] hover:cursor-pointer"
                onClick={() =>
                  setStakeAmount(
                    Number(balance) - 0.3 > 0
                      ? (Number(balance) - 0.3).toFixed(2).toString()
                      : "0"
                  )
                }
              >
                Max
              </Typography>
            </div>
            <div className="flex justify-between mt-3 gap-3">
              <Input
                type="number"
                className="!bg-tertiary text-white !border-t-gray-500 !border-gray-500 focus:!border-t-gray-700 focus:!border-gray-700 !h-[40px]  flex-1"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "!min-w-0 flex flex-1 items-center",
                }}
                value={stakeAmount}
                onChange={(e) => {
                  setStakeAmount(String(e.target.value));
                }}
                placeholder="Minimum to stake: 100 NULS"
                crossOrigin={undefined}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <Button
                className={`${
                  !disableStake ? "bg-primary" : "bg-gray-500"
                } w-[100px] disabled:opacity-100`}
                onClick={() => {
                  stakeNuls(address, Number(stakeAmount).toString())
                    .then((res: any) => {
                      dispatch(setTransactionUrl(res));
                      setIsTransactionSuccessModalOpen(true);
                    })
                    .catch((err: any) => {
                      setIsTransactionFailModalOpen(true);
                    });
                }}
                disabled={disableStake}
              >
                Stake
              </Button>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                className="!border border-[#32E08D] h-[30px] py-0"
                onClick={() => {
                  compoundNuls(address)
                    .then((res: any) => {
                      dispatch(setTransactionUrl(res));
                      setIsTransactionSuccessModalOpen(true);
                    })
                    .catch((err: any) => {
                      setIsTransactionFailModalOpen(true);
                    });
                }}
              >
                Compound
              </Button>
              <Button
                className="!border border-[#32E08D] h-[30px] py-0"
                onClick={() => {
                  unstakeNuls(address)
                    .then((res: any) => {
                      dispatch(setTransactionUrl(res));
                      setIsTransactionSuccessModalOpen(true);
                    })
                    .catch((err: any) => {
                      setIsTransactionFailModalOpen(true);
                    });
                }}
              >
                Unstake All
              </Button>
            </div>
            <div className="flex justify-center mt-5">
              <Typography
                variant="paragraph"
                className="text-white border-b text-[20px] !pb-[-5px] font-bold"
              >
                Your Stats
              </Typography>
            </div>
            <div className="flex-column mt-2">
              <div className="flex justify-between items-center px-2 py-1">
                <Typography variant="small" className="text-white">
                  Current APR:
                </Typography>
                <Typography variant="small" className="text-[#32E08D]">
                  {nulsAPR ? nulsAPR : "-"}% Nuls + {nswapAPR ? nswapAPR : "-"}%
                  NSWAP
                </Typography>
              </div>
              <div className="flex justify-between items-center px-2 py-1">
                <Typography variant="small" className="text-white">
                  $NULS Staked:
                </Typography>
                <Typography variant="small" className="text-[#32E08D]">
                  {stakedNuls ? stakedNuls : "-"}
                </Typography>
              </div>
              <div className="flex justify-between items-center px-2 py-1">
                <Typography variant="small" className="text-white">
                  $NULS Earned:
                </Typography>
                <Typography variant="small" className="text-[#32E08D]">
                  {earnedNuls ? earnedNuls : "-"}
                </Typography>
              </div>
              <div className="flex justify-between items-center px-2 py-1">
                <Typography variant="small" className="text-white">
                  $NSWAP Earned:
                </Typography>
                <Typography variant="small" className="text-[#32E08D]">
                  {earnedNswap ? earnedNswap : "-"}
                </Typography>
              </div>
            </div>
          </CardBody>
          {submitting && (
            <div className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center">
              <Spinner className="text-primary h-16 w-16" />
            </div>
          )}
        </Card>
        <UnstakeDialog
          open={isUnstakeDialogOpen}
          onClose={() => setIsUnstakeDialogOpen(false)}
        />
        <TransactionFailDialog
          open={isTransactionFailModalOpen}
          onClose={() => {
            setIsTransactionFailModalOpen(false);
          }}
        />
        <TransactionSuccessDialog
          open={isTransactionSuccessModalOpen}
          onClose={() => setIsTransactionSuccessModalOpen(false)}
          transactionUrl={transactionUrl}
        />
      </div>
    </>
  );
}
