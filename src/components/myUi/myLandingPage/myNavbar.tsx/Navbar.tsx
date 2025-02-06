"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";



const Navbar = () => {

    const { isLoaded } = useAuth();


    return (
        <div className="w-full bg-black p-2 flex justify-between border-b border-gray-800">

            <div className="flex items-center gap-2 px-3">
                <Image src="/openSource.svg" alt="Logo" width={45} height={45} className="md:h-[45px] md:w-[45px] h-[35px] w-[35px]" />
                <h1 className="text-white md:text-[25px] text-[16px] font-bold">WatchParty</h1>
            </div>
            <div className="flex items-center px-3">
                {
                    !isLoaded ?
                        <div>
                            <Skeleton className="w-[35px] h-[35px] rounded-full" />
                        </div>
                        :
                        <div className="flex gap-5 flex-row items-end justify-end">
                            <SignedOut>

                                <SignInButton>
                                    <Button className="font-semibold">Sign In</Button>
                                </SignInButton>
                                <div className="font-semibold hidden md:block">
                                    <SignUpButton>
                                        <Button variant={'secondary'}>Sign Up</Button>
                                    </SignUpButton>
                                </div>
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                }
            </div>


        </div>
    );
}





export default Navbar;