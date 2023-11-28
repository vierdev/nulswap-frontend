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
import { BiRightArrowAlt } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import { Token } from "@/src/types/token";
import BigNumber from "bignumber.js";
import {
  approveForLend,
  approveSwapToken,
  getAllowanceForLend,
  getAllowanceForLiquidity,
  supplyAiNuls,
  supplyNuls,
} from "@/src/api/nulsConnector";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";
import {
  getSupplyNulsTransaction,
  getSupplyAinulsTransaction,
  setSupplyNulsTransaction,
  setSupplyAinulsTransaction,
} from "@src/redux/lend/operation";
import tokenList from "@/src/tokens/tokenList";
import {
  setIsAinulsSupplySuccessed,
  setIsNulsSupplySuccessed,
} from "@/src/redux/lend/operation";
import { getTransactionUrl, setTransactionUrl } from "@/src/redux/swap/Token";

interface SupplyDialogProps {
  open: boolean;
  onClose: () => void;
  token: Token;
  apy: string;
  healthfactor: string;
  balance: string;
  supplied: string;
  borrowed: string;
  allowance: string;
}

const liquidation = 0.95;

const SupplyDialog: React.FC<SupplyDialogProps> = ({
  open,
  onClose,
  token,
  apy,
  healthfactor,
  balance,
  supplied,
  borrowed,
  allowance
}) => {
  const [isTransactionSuccessModalOpen, setIsTransactionSuccessModalOpen] =
    useState<boolean>(false);
  const [isTransactionFailModalOpen, setIsTransactionFailModalOpen] =
    useState<boolean>(false);

  const [isApproveSuccessModalopen, setIsApproveSucessModalOpen] =
    useState<boolean>(false);

  const [supplyAmount, setSupplyAmount] = useState<string>("");

  const [afterHealthFactor, setAfterHealthFactor] = useState<string>("");

  const nulsSupplytransactionUrl = useAppSelector(getSupplyNulsTransaction);

  const ainulsSupplyTransactionUrl = useAppSelector(getSupplyAinulsTransaction);

  const address = useAppSelector(getWalletAddress);

  const transaction = useAppSelector(getTransactionUrl);

  const [isApproved, setIsApproved] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const supplyToken = () => {
    if (token.symbol == "NULS") {
      supplyNuls(Number(supplyAmount), address)
        .then((res: any) => {
          dispatch(setSupplyNulsTransaction(res));
          setIsTransactionSuccessModalOpen(true);
        })
        .catch((err) => {
          console.log(err);
          setIsTransactionFailModalOpen(true);
        });
    } else {
      supplyAiNuls(Number(supplyAmount), address)
        .then((res: any) => {
          dispatch(setSupplyAinulsTransaction(res));
          setIsTransactionSuccessModalOpen(true);
        })
        .catch((err) => {
          console.log(err);
          setIsTransactionFailModalOpen(true);
        });
    }
  };

  const approveAinuls = () => {
    approveForLend(tokenList.tokens[2], address)
      .then((res: any) => {
        setIsApproveSucessModalOpen(true);
        dispatch(setTransactionUrl(res));
        setIsApproved(true);
      })
      .catch((err) => {
        setIsTransactionFailModalOpen(true);
        console.log(err);
      });
  };

  useEffect(() => {
    if (Number(allowance) > Number(supplyAmount)) setIsApproved(true);
    else setIsApproved(false);
  }, [allowance, supplyAmount]);

  useEffect(() => {
    if (borrowed != "0") {
      setAfterHealthFactor(
        BigNumber(supplied)
          .plus(BigNumber(supplyAmount))
          .multipliedBy(liquidation)
          .dividedBy(BigNumber(borrowed))
          .toString()
      );
    }
  }, [borrowed, supplied, supplyAmount]);

  return (
    <Dialog
      open={open}
      handler={onClose}
      className="!bg-tertiary shadow-[0_0_5px_#32E08D] rounded-md py-2 md:!w-[366px] !w-[300px] !min-w-[300px] !h-[380px] mx-2"
    >
      <div className="flex justify-center">
        <DialogHeader className="mb-1 grid h-10 place-items-center !bg-primary mt-[-28px] !w-4/6 !rounded-lg">
          <Typography
            variant="h5"
            color="blue-gray"
            className="text-white mt-[-10px]"
          >
            Supply {token.symbol}
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
            Balance: {balance} {token.symbol}
          </Typography>
          <Typography
            variant="paragraph"
            className="underline text-white hover:cursor-pointer"
            onClick={() => setSupplyAmount(balance)}
          >
            Max
          </Typography>
        </div>
        <Input
          type="number"
          min={0}
          value={supplyAmount}
          className="bg-secondary text-white !h-[40px] md:!h-[50px] !border-t-white !border-white focus:!border-white focus:!border-t-white flex-1 mx-4 mt-4"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          containerProps={{
            className: "min-w-0 flex flex-1 items-center",
          }}
          crossOrigin={undefined}
          onChange={(e) => setSupplyAmount(e.target.value)}
          pattern="[0-9]*"
          inputMode="numeric"
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
              Supply APY
            </Typography>
            <Typography variant="small" className="text-[#32E08D]">
              {apy == "" ? "0" : apy}%
            </Typography>
          </div>
          <div className="flex justify-between items-center px-2 py-1">
            <Typography variant="small" className="text-white">
              Loan to value
            </Typography>
            <Typography variant="small" className="text-[#32E08D]">
              90%
            </Typography>
          </div>
          <div className="flex justify-between items-center px-2 py-1">
            <Typography variant="small" className="text-white">
              Health factor
            </Typography>
            <div className="flex gap-1 items-center">
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
          {token == tokenList.tokens[2] && (
            <Button
              className={`!w-[160px] ${
                !isApproved ? "bg-primary" : "bg-gray-500"
              } text-[11px] disabled:opacity-100`}
              onClick={() => approveAinuls()}
              disabled={isApproved}
            >
              Approve {token.symbol}
            </Button>
          )}
          <Button
            className="!w-[160px] bg-primary text-[11px]"
            onClick={() => supplyToken()}
          >
            Supply {token.symbol}
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
            if (token == tokenList.tokens[0])
              dispatch(setIsNulsSupplySuccessed(false));
            else dispatch(setIsAinulsSupplySuccessed(false));
          }}
          transactionUrl={
            token == tokenList.tokens[0]
              ? nulsSupplytransactionUrl
              : ainulsSupplyTransactionUrl
          }
        />
        <TransactionSuccessDialog
          open={isApproveSuccessModalopen}
          onClose={() => setIsApproveSucessModalOpen(false)}
          transactionUrl={transaction}
        />
      </DialogBody>
    </Dialog>
  );
};

export default SupplyDialog;
