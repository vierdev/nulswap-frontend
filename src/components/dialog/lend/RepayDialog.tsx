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
import { repay } from "@/src/api/nulsConnector";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";
import BigNumber from "bignumber.js";
import {
  getRepayTransaction,
  setIsRepaySuccessed,
  setRepayTransaction,
} from "@/src/redux/lend/operation";

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  healthfactor: string;
  balance: string;
  supplied: string;
  borrowed: string;
}

const liquidation = 0.95;

const WithdrawDialog: React.FC<WithdrawDialogProps> = ({
  open,
  onClose,
  healthfactor,
  balance,
  supplied,
  borrowed,
}) => {
  const [isTransactionSuccessModalOpen, setIsTransactionSuccessModalOpen] =
    useState<boolean>(false);
  const [isTransactionFailModalOpen, setIsTransactionFailModalOpen] =
    useState<boolean>(false);

  const [remainingDebt, setRemainingDebt] = useState<string>("");
  const [repayAmount, setRepayAmount] = useState<string>("");
  const [afterHealthFactor, setAfterHealthFactor] = useState<string>("");

  const address = useAppSelector(getWalletAddress);

  const dispatch = useAppDispatch();

  const transaction = useAppSelector(getRepayTransaction);

  const repayNuls = () => {
    repay(Number(repayAmount), address)
      .then((res: any) => {
        dispatch(setRepayTransaction(res));
        setIsTransactionSuccessModalOpen(true);
      })
      .catch((err: any) => {
        setIsTransactionFailModalOpen(true);
      });
  };

  useEffect(() => {
    setRemainingDebt(
      BigNumber(borrowed)
        .minus(BigNumber(repayAmount == "" ? BigNumber(0) : repayAmount))
        .toString()
    );
    setAfterHealthFactor(
      BigNumber(balance)
        .dividedBy(BigNumber(borrowed).minus(BigNumber(repayAmount)))
        .toString()
    );
  }, [repayAmount]);

  return (
    <Dialog
      open={open}
      handler={onClose}
      className="!bg-tertiary shadow-[0_0_5px_#32E08D] rounded-md py-2 md:!w-[366px] !w-[300px] !min-w-[300px] !h-[340px] mx-2"
    >
      <div className="flex justify-center">
        <DialogHeader className="mb-1 grid h-10 place-items-center !bg-primary mt-[-28px] !w-4/6 !rounded-lg">
          <Typography
            variant="h5"
            color="blue-gray"
            className="text-white mt-[-10px]"
          >
            Repay
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
            Balance: {Number(borrowed).toFixed(2).toString()} NULS
          </Typography>
          <Typography
            variant="paragraph"
            className="underline text-white hover:cursor-pointer"
            onClick={() => setRepayAmount(borrowed)}
          >
            MAX
          </Typography>
        </div>
        <Input
          type="number"
          min={0}
          max={Number(supplied)}
          className="bg-secondary text-white !h-[50px] border-white border-t-white focus:border-white focus:!border-t-white flex-1 mx-4 mt-4"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          containerProps={{
            className: "min-w-0 flex flex-1 items-center",
          }}
          crossOrigin={undefined}
          value={repayAmount}
          onChange={(e) => setRepayAmount(e.target.value)}
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
              Remaining debt
            </Typography>
            <div className="flex items-center gap-1">
              <Typography variant="small" className="text-primary">
                {borrowed} NULS
              </Typography>
              <BiRightArrowAlt className="text-white" />
              <Typography variant="small" className="text-primary">
                {remainingDebt} NULS
              </Typography>
            </div>
          </div>

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
                {afterHealthFactor == "" || "NaN" ? "0" : afterHealthFactor}
              </Typography>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <Typography variant="small" className="text-white">
              Liquidation at &lt; 1.0
            </Typography>
          </div>
        </div>
        <div className="pt-5 flex justify-center">
          <Button className="!w-[160px] bg-primary" onClick={() => repayNuls()}>
            Repay
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
            dispatch(setIsRepaySuccessed(false));
          }}
          transactionUrl={transaction}
        />
      </DialogBody>
    </Dialog>
  );
};

export default WithdrawDialog;
