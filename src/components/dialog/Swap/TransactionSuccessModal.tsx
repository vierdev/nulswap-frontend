import {
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
  Button,
} from "@components/MaterialTailwind";
import { LuCheckCircle } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

interface TransactionSuccessDialogProps {
  open: boolean;
  transactionUrl: string;
  onClose: () => void;
}

const TransactionSuccessDialog: React.FC<TransactionSuccessDialogProps> = ({
  open,
  transactionUrl,
  onClose,
}) => {
  return (
    <Dialog
      size="xs"
      open={open}
      handler={onClose}
      className="!bg-tertiary border-4 !border-[#32E08D] rounded-lg py-2 !w-[300px] md:!w-[340px] !min-w-[300px] mx-2"
    >
      <DialogHeader className="justify-end px-8">
        <div className="hover:text-gray-500 cursor-pointer text-white">
          <RxCross2 onClick={onClose} />
        </div>
      </DialogHeader>
      <DialogBody className="overflow-y-auto px-0 pt-0">
        <div className="flex justify-center text-[60px] ">
          <LuCheckCircle className="text-[#32E08D]" />
        </div>
        <div className="flex-col justify-center">
          <div className="flex justify-center">
            <Typography className="text-[20px] my-5 text-white font-bold">
              Transaction submitted
            </Typography>
          </div>
          <div className="flex justify-center">
            <Typography className="text-[12px] text-white">
              it may take a while for your transaction to excute.
            </Typography>
          </div>
          <div className="flex justify-center">
            <Typography className="text-[12px] text-white">
              Check your wallet for the status of this transaction
            </Typography>
          </div>
        </div>
        <div className="flex justify-center">
          <a
            href={`https://nulscan.io/transaction/info?hash=${transactionUrl}`}
            target="_blank"
          >
            <Button className="!bg-primary rounded-2xl mt-[40px] !w-[180px] px-0 !h-[40px]">
              View on Nulscan
            </Button>
          </a>
        </div>
        <div className="flex justify-center">
          <Button
            className="!border border-[#32E08D] rounded-xl mt-[10px] !w-[180px] px-0"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default TransactionSuccessDialog;
