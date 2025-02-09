"use client"

import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { useState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const Dashboard = () => {
    const { user } = useUser();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [magnetLink, setMagnetLink] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/webtorrent.min.js'; // Path to the file in the public folder
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            console.log('WebTorrent loaded successfully');
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);


    const createSession = async () => {
        try {
            if (!user) {
                toast.error("You must be logged in to create a session");
                return;
            }
            if (!file) {
                toast.warning("You must select a file to create a session");
                return;
            }



            const client = new window.WebTorrent();
            client.seed(file, (torrent: any) => {
                setMagnetLink(torrent.magnetURI);
                console.log(magnetLink);

                fetch('/api/createSession', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId, password, magnetURI: torrent.magnetURI }),
                }).then(res => res.json())
                    .then(data => {
                        if (data.error) throw new Error(data.error);
                        toast.success("Session created successfully");
                        router.push(`/live/${sessionId}`);
                    }).catch(err => toast.error(err.message));
            })


        } catch (err) {
            if (err instanceof Error) {
                toast(err.message);
            }
        }
    };

    const joinSession = async () => {

    };


    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-2 w-[300px]">
                <Input
                    type="text"
                    placeholder="Session ID"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
            </div>
            <div className="flex flex-col gap-2 m-2">
                <Button onClick={createSession} className="w-[300px]">Create</Button>
                <Button onClick={joinSession} className="w-[300px]">Join</Button>
            </div>


        </div>
    );
};

export default Dashboard;