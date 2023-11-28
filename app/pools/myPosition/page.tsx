"use client";
import {
  Card,
  CardBody,
  CardFooter,
  Spinner,
  Typography,
} from "@components/MaterialTailwind";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BigNumber from "bignumber.js";
import LPcomponent from "@/src/components/LP/LPcomponent";

import { LuArrowLeft } from "react-icons/lu";
import { LP } from "@/src/types/liquidityPosition";
import { getUserLP, updatePair } from "@/src/api/nulsConnector";
import { useAppSelector } from "@/src/redux/hooks";
import { getWalletAddress } from "@/src/redux/swap/walletConnect";
import {
  getIsRemovedLiquidity,
  getRemovedPairAddress,
  getTransactionUrl,
} from "@/src/redux/swap/Token";

export default function Page() {
  const [lpList, setLpList] = useState<LP[]>([]);

  const accountAddress = useAppSelector(getWalletAddress);

  const isRemovedLiquidity = useAppSelector(getIsRemovedLiquidity);

  const [reload, setRelod] = useState<boolean>(false);

  const transaction = useAppSelector(getTransactionUrl);

  const [submitting, setSubmitting] = useState<boolean>(false);

  const pairAddress = useAppSelector(getRemovedPairAddress);

  const isMounted = useRef(false);

  const refresh = () => {
    document.location.reload();
  };

  useEffect(() => {
    document.title = "Nulswap - The First DEX on NULS";
  }, []);

  useEffect(() => {
    getUserLP(accountAddress)
      .then((res: any) => {
        console.log(res);

        let list: LP[] = [];
        for (let index = 0; index < res.LPList.length; index++) {
          const lp: LP = {
            LPamount: res.LPList[index].lpAmount,
            addressTokenA: res.LPList[index].tknA,
            addressTokenB: res.LPList[index].tknB,
            pooledTokenAname: res.LPList[index].nameTknA,
            pooledTokenBname: res.LPList[index].nameTknB,
            tokenADecimal: res.LPList[index].decimalTknA,
            tokenBDecimal: res.LPList[index].decimalTknB,
            tokenAreserve: res.LPList[index].tReserveA,
            tokenBreserve: res.LPList[index].tReserveB,
            pair: res.LPList[index].pair,
            totalAmount: res.LPList[index].amount,
          };
          list = [...list, lp];
        }
        setLpList(list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accountAddress, isRemovedLiquidity, reload]);

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
      updatePair(pairAddress, accountAddress)
        .then((res: any) => {
          console.log(res);
          getUserLP(accountAddress)
            .then((res: any) => {
              console.log(res);

              let list: LP[] = [];
              for (let index = 0; index < res.LPList.length; index++) {
                const lp: LP = {
                  LPamount: res.LPList[index].lpAmount,
                  addressTokenA: res.LPList[index].tknA,
                  addressTokenB: res.LPList[index].tknB,
                  pooledTokenAname: res.LPList[index].nameTknA,
                  pooledTokenBname: res.LPList[index].nameTknB,
                  tokenADecimal: res.LPList[index].decimalTknA,
                  tokenBDecimal: res.LPList[index].decimalTknB,
                  tokenAreserve: res.LPList[index].tReserveA,
                  tokenBreserve: res.LPList[index].tReserveB,
                  pair: res.LPList[index].pair,
                  totalAmount: res.LPList[index].amount,
                };
                list = [...list, lp];
              }
              setLpList(list);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [submitting]);

  return (
    <div className="flex justify-center md:mt-6">
      <Card className="shadow-[0_0_15px_white] bg-tertiary !min-w-[300px] md:my-10 md:!w-[420px] my-5 mx-2">
        <CardBody className="mb-0 py-4">
          <div className="flex justify-start gap-2 items-center">
            <div className="text-white hover:scale-150">
              <Link href="/pools">
                <LuArrowLeft />
              </Link>
            </div>
            <Typography variant="h5" color="blue-gray" className="text-white">
              Remove Liquidity
            </Typography>
          </div>
          <div className="flex justify-center my-[15px]">
            <Typography className="text-[#32E08D] text-[20px] font-bold">
              Your Positions
            </Typography>
          </div>
          {lpList.map((LP, index) => {
            if (BigNumber(LP.LPamount).isGreaterThan(10000))
              return <LPcomponent key={index} LPaccount={LP} />;
          })}
        </CardBody>
        <CardFooter className="pt-0 mt-0 mb-6">
          <div className="flex justify-center mt-2 gap-1">
            <Typography className="text-white">Not showing a pair?</Typography>
            <Typography
              className="text-[#32E08D] hover:cursor-pointer"
              onClick={() => {
                refresh();
              }}
            >
              Refresh
            </Typography>
          </div>
        </CardFooter>
        {submitting && (
          <div className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center">
            <Spinner className="text-primary h-16 w-16" />
          </div>
        )}
      </Card>
    </div>
  );
}
