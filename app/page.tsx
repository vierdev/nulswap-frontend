"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Home() {
  const { push } = useRouter();

  useEffect(() => {
    push("/swap");
  }, []);
  return <></>;
}

export default Home;
