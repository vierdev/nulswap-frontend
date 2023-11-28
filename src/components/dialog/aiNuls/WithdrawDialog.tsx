import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Typography,
} from "@components/MaterialTailwind";

import TransactionFailDialog from "../Swap/TransactionFailModal";
import TransactionSuccessDialog from "../Swap/TransactionSuccessModal";

import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BiRightArrowAlt } from "react-icons/bi";
import { Token } from "@/src/types/token";
import {
  getAinulsReward,
  withdrawAinuls,
  withdrawNuls,
} from "@/src/api/nulsConnector";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";
import BigNumber from "bignumber.js";
import tokenList from "@/src/tokens/tokenList";
import {
  getGetrewardTransaction,
  getWithdrawAinulsTransaction,
  getWithdrawNulsTransaction,
  setGetrewardTransaction,
  setIsAinulsWithdrawSuccessed,
  setIsNulsWithdrawSuccessed,
  setWithdrawAinulsTransaction,
  setWithdrawNulsTransaction,
} from "@/src/redux/lend/operation";

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  token: Token;
  rewards: string;
  healthfactor: string;
  balance: string;
  supplied: string;
  borrowed: string;
}

const liquidation = 0.95;

const WithdrawDialog: React.FC<WithdrawDialogProps> = ({
  open,
  onClose,
  token,
  rewards,
  healthfactor,
  balance,
  supplied,
  borrowed,
}) => {
  const [isTransactionSuccessModalOpen, setIsTransactionSuccessModalOpen] =
    useState<boolean>(false);
  const [isTransactionFailModalOpen, setIsTransactionFailModalOpen] =
    useState<boolean>(false);

  const [remainingSupply, setRemainingSupply] = useState<string>(balance);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [afterHealthFactor, setAfterHealthFactor] = useState<string>("");

  const nulsWithdrawTransaction = useAppSelector(getWithdrawNulsTransaction);

  const ainulsWithdrawTransaction = useAppSelector(
    getWithdrawAinulsTransaction
  );

  const getRewardTransaction = useAppSelector(getGetrewardTransaction);

  const address = useAppSelector(getWalletAddress);

  const dispatch = useAppDispatch();

  const withdrawToken = () => {
    if (token.symbol == "NULS") {
      withdrawNuls(Number(withdrawAmount), address)
        .then((res: any) => {
          dispatch(setWithdrawNulsTransaction(res));
          setIsTransactionSuccessModalOpen(true);
        })
        .catch((err: any) => {
          setIsTransactionFailModalOpen(true);
        });
    } else {
      withdrawAinuls(withdrawAmount, address)
        .then((res: any) => {
          dispatch(setWithdrawAinulsTransaction(res));
          setIsTransactionSuccessModalOpen(true);
        })
        .catch((err: any) => {
          setIsTransactionFailModalOpen(true);
        });
    }
  };

  const getReward = () => {
    getAinulsReward(address)
      .then((res: any) => {
        dispatch(setGetrewardTransaction(res));
        setIsTransactionSuccessModalOpen(true);
      })
      .catch((err: any) => {
        setIsTransactionFailModalOpen(true);
      });
  };

  useEffect(() => {
    setRemainingSupply(
      BigNumber(supplied)
        .minus(BigNumber(withdrawAmount == "" || withdrawAmount == "NaN"? BigNumber(0) : withdrawAmount))
        .toString()
    );
    setAfterHealthFactor(
      BigNumber(supplied)
        .minus(BigNumber(withdrawAmount))
        .dividedBy(BigNumber(borrowed))
        .toString()
    );
  }, [withdrawAmount]);

  return (
    <Dialog
      open={open}
      handler={onClose}
      className="!bg-tertiary shadow-[0_0_5px_#32E08D] rounded-md py-2 md:!w-[366px] !w-[300px] !min-w-[300px] !min-h-[380px] mx-2"
    >
      <div className="flex justify-center">
        <DialogHeader className="mb-1 grid h-10 place-items-center !bg-primary mt-[-28px] !w-4/6 !rounded-lg">
          <Typography
            variant="h5"
            color="blue-gray"
            className="text-white mt-[-10px]"
          >
            Withdraw {token.symbol}
          </Typography>
        </DialogHeader>
      </div>

      <DialogBody className="px-0 pt-0 pb-5">
        <div className="flex justify-end mt-[-12px] mr-[24px]">
          <RxCross1
            className="hover:cursor-pointer scale-110 text-primary"
            onClick={onClose}
          ></RxCross1>
        </div>
        <div className="flex justify-between px-5 mt-5">
          <Typography variant="paragraph" className="text-white">
            Balance: {supplied} NULS
          </Typography>
          <Typography
            variant="paragraph"
            className="underline text-white hover:cursor-pointer"
            onClick={() => setWithdrawAmount(supplied)}
          >
            MAX
          </Typography>
        </div>
        <Input
          type="number"
          min={0}
          max={Number(supplied)}
          className="bg-secondary text-white md:!h-[50px] h-[40px] !border-t-white !border-white focus:border-white focus:!border-t-white flex-1 mx-4 mt-4"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          containerProps={{
            className: "min-w-0 flex flex-1 items-center",
          }}
          crossOrigin={undefined}
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <div className="flex justify-start mt-6 px-4">
          <Typography
            variant="paragraph"
            className="font-bold text-white text-[16px]"
          >
            Transaction Overview
          </Typography>
        </div>
        <div className="flex-column mt-5 px-3">
          <div className="flex justify-between items-center px-2 py-1">
            <Typography variant="small" className="text-white">
              Remaining supply
            </Typography>
            <Typography variant="small" className="text-[#32E08D]">
              {Number(remainingSupply) < 0 ? "-" : remainingSupply} &nbsp;
              {token.symbol}
            </Typography>
          </div>
          {token.symbol == "aiNULS" ? (
            <div className="flex justify-between items-center px-2 py-1">
              <Typography variant="small" className="text-white">
                Rewards
              </Typography>
              <Typography variant="small" className="text-[#32E08D]">
                {rewards}aiNULS
              </Typography>
            </div>
          ) : (
            <div className="h-4"></div>
          )}

          <div className="flex justify-between items-center px-2 py-1">
            <Typography variant="small" className="text-white">
              Health factor
            </Typography>
            <div className="flex items-center gap-1">
              <Typography variant="small" className="text-[#E0BA32]">
                {healthfactor}
              </Typography>
              <BiRightArrowAlt className="text-white" />
              <Typography variant="small" className="text-primary">
                {afterHealthFactor == "" || afterHealthFactor == "NaN"
                  ? "1"
                  : afterHealthFactor}
              </Typography>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <Typography variant="small" className="text-white">
              Liquidation at &lt; 1.0
            </Typography>
          </div>
        </div>
        <div className="px-4 pt-5 flex justify-center gap-2">
          {token.symbol != "NULS" && (
            <Button
              className="!w-[160px] bg-primary px-0"
              onClick={() => getReward()}
            >
              Get Reward
            </Button>
          )}
          <Button
            className="!w-[160px] bg-primary"
            onClick={() => withdrawToken()}
          >
            Withdraw
          </Button>
        </div>
        <TransactionFailDialog
          open={isTransactionFailModalOpen}
          onClose={() => {
            setIsTransactionFailModalOpen(false);
          }}
        />
        <TransactionSuccessDialog
          open={isTransactionSuccessModalOpen}
          onClose={() => {
            setIsTransactionSuccessModalOpen(false);
            if (token === tokenList.tokens[0])
              dispatch(setIsNulsWithdrawSuccessed(false));
            else dispatch(setIsAinulsWithdrawSuccessed(false));
          }}
          transactionUrl={
            token == tokenList.tokens[0]
              ? nulsWithdrawTransaction
              : ainulsWithdrawTransaction
          }
        />
      </DialogBody>
    </Dialog>
  );
};

export default WithdrawDialog;
