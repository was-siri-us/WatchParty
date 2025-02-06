"use client"

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


export default function Home() {

  const { isSignedIn,isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  },[isLoaded, isSignedIn,router]);

  return (
    <div className="text-3xl bg-red-500">
    </div>

  );
}
