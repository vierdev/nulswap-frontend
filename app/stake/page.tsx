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
  approveForStake,
  compoundNswap,
  getAllowance,
  getEarnedNswap,
  getEarnedNswap1,
  getLockedNswap,
  getLockedTime,
  getStakedNswap,
  getTokenBalance,
  stakeNswap,
} from "@/src/api/nulsConnector";
import tokenList from "@/src/tokens/tokenList";
import BigNumber from "bignumber.js";
import { NSWAP_STAKE_REWARD } from "@/src/constant/stakeConstant";
import {
  getIsUnstakeSuccessed,
  getTransactionUrl,
  setIsUnstakeSuccessed,
  setTransactionUrl,
} from "@/src/redux/swap/Token";

export default function Page() {
  var isTransactionFailed: boolean = true;
  const [isTransactionSuccessModalOpen, setIsTransactionSuccessModalOpen] =
    useState<boolean>(false);
  const [isTransactionFailModalOpen, setIsTransactionFailModalOpen] =
    useState<boolean>(false);

  const [stakeAmount, setStakeAmount] = useState<string>("");

  const isUnstakeDialogopen = useAppSelector(getIsUnstakeSuccessed);

  const [balance, setBalance] = useState<string>("");

  const [allowance, setAllowance] = useState<string>("");

  const [totalLockedAmount, setTotalLockedAmount] = useState<string>("");

  const [stakedNswap, setStakedNswap] = useState<string>();

  const [earnedNswap, setEarnedNswap] = useState<string>();

  const [APR, setAPR] = useState<string>();

  const [isApprovedForStake, setIsApprovedForStake] = useState<boolean>(true);

  const transactionUrl = useAppSelector(getTransactionUrl);

  const [submitting, setSubmitting] = useState<boolean>(false);

  const [unlockTime, setUnlockTime] = useState<number>();

  const isMounted = useRef(false);

  const dispatch = useAppDispatch();

  const handleKeyPress = (event: any) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);

    // Regular expression to match numbers and decimal point
    const regex = /^\d+\.?\d*$/;
    if (!regex.test(event.currentTarget.value + keyValue)) {
      event.preventDefault();
    }
  };

  const address = useAppSelector(getWalletAddress);

  useEffect(() => {
    if (address != "") {
      getTokenBalance(tokenList.tokens[1], address).then((res: any) => {
        setBalance(res.value);
      });
      getAllowance(address).then((res: string) => {
        setAllowance(res);
      });
      getLockedNswap().then((res) => {
        console.log(res);
        setTotalLockedAmount(
          parseFloat(
            BigNumber(res).dividedBy(Math.pow(10, 8)).toString()
          ).toFixed(2)
        );
        setAPR(
          parseFloat(
            BigNumber(NSWAP_STAKE_REWARD)
              .dividedBy(BigNumber(res).dividedBy(100))
              .toString()
          ).toFixed(2)
        );
      });
      getStakedNswap(address).then((res: any) => {
        setStakedNswap(res);
      });
      getEarnedNswap1(address).then((res: any) => {
        setEarnedNswap(res);
      });
      getLockedTime(address).then((res: number) => {
        setUnlockTime(res);
      });
    }
  }, [address]);

  useEffect(() => {
    if (Number(allowance) >= Number(stakeAmount)) setIsApprovedForStake(true);
    else setIsApprovedForStake(false);
  }, [allowance, stakeAmount]);

  useEffect(() => {
    document.title = "Nulswap - The First DEX on NULS";
  }, []);

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
      isMounted.current = true;
    }
  }, [transactionUrl]);

  useEffect(() => {
    if (submitting == false) {
      getTokenBalance(tokenList.tokens[1], address)
        .then((res: any) => {
          setBalance(res.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
      getStakedNswap(address).then((res: any) => {
        setStakedNswap(res);
      });
    }
  }, [submitting]);

  return (
    <div className="flex justify-center mt-6">
      <Card className="shadow-[0_0_15px_white] bg-tertiary md:!w-[470px] !min-w-[310px] mt-10 mx-2 mb-10">
        <div className="flex justify-center">
          <CardHeader
            variant="gradient"
            className="mb-1 grid h-8 place-items-center !bg-primary mt-[-16px] !w-5/6 !rounded-lg"
          >
            <Typography variant="h6" color="white">
              Total Locked: {totalLockedAmount} NSWAP
            </Typography>
          </CardHeader>
        </div>
        <CardBody>
          <div className="flex justify-center items-center gap-2 pb-3">
            <Typography variant="h5" color="blue-gray" className="text-white">
              Stake
            </Typography>
            <Typography variant="h5" color="blue-gray" className="text-white">
              NSWAP
            </Typography>
          </div>
          <div className="flex justify-start">
            <Typography className="text-[15px] font-bold text-white pr-1">
              Balance: {balance}
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
              type="text"
              min={0}
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
              crossOrigin={undefined}
              placeholder="0.00"
              onKeyPress={handleKeyPress}
              pattern="[0-9]*"
              inputMode="numeric"
            />
            <Button
              className="bg-primary w-[100px]"
              onClick={() => {
                if (!isApprovedForStake) {
                  console.log("approve");

                  approveForStake(address)
                    .then((res: any) => {
                      console.log(res);

                      dispatch(setTransactionUrl(res.toString()));
                      setIsTransactionSuccessModalOpen(true);
                      setIsApprovedForStake(true);
                    })
                    .catch((err) => {
                      setIsTransactionFailModalOpen(true);
                    });
                } else {
                  console.log("stake");

                  stakeNswap(address, Number(stakeAmount).toString())
                    .then((res: any) => {
                      console.log(res);
                      dispatch(setTransactionUrl(res.toString()));
                      setIsTransactionSuccessModalOpen(true);
                    })
                    .catch((err) => {
                      setIsTransactionFailModalOpen(true);
                    });
                }
              }}
            >
              {isApprovedForStake ? "Stake" : "Approve"}
            </Button>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              className="!border border-[#32E08D] h-[30px] py-0"
              onClick={() => {
                compoundNswap(address)
                  .then((res: string) => {
                    dispatch(setTransactionUrl(res));
                    setIsTransactionSuccessModalOpen(true);
                  })
                  .catch((err) => {
                    setIsTransactionFailModalOpen(true);
                  });
              }}
            >
              Compound
            </Button>
            <Button
              className="!border border-[#32E08D] h-[30px] py-0"
              onClick={() => {
                dispatch(setIsUnstakeSuccessed(true));
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
                {APR ? APR : "-"} %
              </Typography>
            </div>
            <div className="flex justify-between items-center px-2 py-1">
              <Typography variant="small" className="text-white">
                $NSWAP Staked:
              </Typography>
              <Typography variant="small" className="text-[#32E08D]">
                {stakedNswap ? stakedNswap : "-"}
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
            <div className="flex justify-between items-center px-2 py-1">
              <Typography variant="small" className="text-white">
                Timelock Unlock Date:
              </Typography>
              <Typography variant="small" className="text-[#32E08D]">
                {unlockTime != null && unlockTime != 0
                  ? new Date(unlockTime * 1000).toLocaleString()
                  : "-"}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
      {submitting && (
        <div className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center">
          <Spinner className="text-primary h-16 w-16" />
        </div>
      )}
      <UnstakeDialog
        open={isUnstakeDialogopen}
        onClose={() => dispatch(setIsUnstakeSuccessed(false))}
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
  );
}
