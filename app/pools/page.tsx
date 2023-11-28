"use client";

import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@components/MaterialTailwind";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Page() {
  var exchangeRate: any;

  const [changeFrom, setChangeFrom] = useState<number>(0);
  const [changeTo, setChangeTo] = useState<number>(0);

  const [tokens, setTokens] = useState<string[]>(["ainuls", "usdtn"]);
  const [isSettingDialogOpen, setIsSettingDialogOpen] =
    useState<boolean>(false);
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState<boolean>(false);

  const onChangeFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeFrom(Number(e.currentTarget.value));
  };

  const onChangeTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeTo(Number(e.currentTarget.value) * exchangeRate);
  };

  const SwitchToken = () => {
    setTokens((prev) => [prev[1], prev[0]]);
  };

  useEffect(() => {
    document.title = "Nulswap - The First DEX on NULS";
  }, []);

  return (
    <div className="flex justify-center md:mt-6">
      <Card className="shadow-[0_0_15px_white] bg-tertiary md:!w-[420px] !min-w-[310px] md:mt-10 mt-5 mx-2">
        <CardBody>
          <div className="flex justify-start items-center">
            <Typography variant="h5" color="blue-gray" className="text-white">
              Add Liquidity
            </Typography>
          </div>
          <div className="flex-col mt-6 pl-2">
            <Typography variant="small" className="text-white text-[15px]">
              Tip: By adding liquidity you&apos;ll earn 0.25% of all trades on
              this pair proportional to your share of the pool. Fees are added
              to the pool, accrue in real time and can be claimed by withdrawing
              your liquidity
            </Typography>
          </div>
          <div className="flex-col mt-6">
            <Link href="/pools/addLiquidity">
              <Button className="!bg-primary rounded-lg w-full my-1">
                Add Liquidity
              </Button>
            </Link>
            <Link href="/pools/myPosition">
              <Button className="!bg-primary rounded-lg w-full my-3">
                My Positions
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
  8;
}
