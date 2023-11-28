"use client";

import { Typography, Input, Button } from "@components/MaterialTailwind";

import Image from "next/image";
import { useState, forwardRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import TokenSelectDialog from "../dialog/Swap/TokenSelectDialog";
import { Token } from "@/src/types/token";

interface TokenInputProps {
  title: string;
  balance: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  token: Token;
  onSelectToken: (newToken: Token) => void;
  onFocus?: () => void;
  onMaxClick: () => void;
}

const TokenInput = forwardRef<HTMLInputElement, TokenInputProps>(
  (props, ref) => {
    const [isTokenSelectOpen, setIsTokenSelectOpen] = useState<boolean>(false);

    const onOpenTokenSelectDialog = () => {
      setIsTokenSelectOpen(true);
    };

    const onCloseTokenSelectDialog = () => {
      setIsTokenSelectOpen(false);
    };

    const handleKeyPress = (event:any) => {
      const keyCode = event.keyCode || event.which;
      const keyValue = String.fromCharCode(keyCode);
  
      // Regular expression to match numbers and decimal point
      const regex = /^\d+\.?\d*$/;
      if (!regex.test(event.currentTarget.value + keyValue)) {
        event.preventDefault();
      }
    };
    return (
      <div className="bg-secondary rounded-md p-2">
        <div className="flex items-center justify-between">
          <Typography className="text-white text-base">
            {props.title}
          </Typography>
          <Typography className="text-white text-base">
            Balance: {props.balance}
          </Typography>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex flex-1">
            <Input
              onFocus={props.onFocus}
              type="text"
              className="!bg-tertiary text-white !border-t-gray-500 !border-gray-500 focus:!border-t-gray-700 focus:!border-gray-700 md:!h-[50px] !h-[35px] flex-1"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              containerProps={{
                className: "!min-w-0 flex flex-1 items-center",
              }}
              value={props.value}
              onChange={props.onChange}
              crossOrigin={undefined}
              placeholder="0.00"
              ref={ref}
              pattern="[0-9]*"
              inputMode="numeric"
              onKeyPress={handleKeyPress}
            />
            {props.title == "From" && (
              <Typography
                className="!absolute right-2 top-2 text-white hover:cursor-pointer"
                onClick={props.onMaxClick}
              >
                MAX
              </Typography>
            )}
          </div>

          <Button
            className="text-white bg-tertiary md:h-[50px] h-[35px] py-0 px-2 min-w-[80px]"
            onClick={onOpenTokenSelectDialog}
          >
            <div className="flex items-center justify-center gap-1 text-[14px] font-bold">
              <Image
                src={props.token.logoURI}
                width={16}
                height={16}
                alt={props.token.symbol}
                className="md: w-6"
              />
              <Typography className="uppercase text-[12px] md:text-[14px]">
                {props.token.symbol}
              </Typography>
              <div className="p-0 text-base max-sm:text-[12px]">
                <FaChevronDown />
              </div>
            </div>
          </Button>

          <TokenSelectDialog
            type={props.title}
            open={isTokenSelectOpen}
            onClose={onCloseTokenSelectDialog}
            onSelectToken={props.onSelectToken}
          />
        </div>
      </div>
    );
  }
);
TokenInput.displayName = "TokenInput";

export default TokenInput;
