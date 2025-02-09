"use client";

import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

const WatchPage = () => {
    const { sessionId } = useParams();
    const [magnetURI, setMagnetURI] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/webtorrent.min.js'; // Path to the file in the public folder
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            console.log('WebTorrent loaded successfully');
        };
        setMagnetURI(null);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch(`/api/getSession?sessionId=${sessionId}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                setMagnetURI(data.magnetURI);
                console.log(data.magnetURI);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to load session");
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [sessionId]);

    useEffect(() => {
        if (!magnetURI || !videoRef.current) return;
        const client = new WebTorrent();

        client.add(magnetURI, (torrent: any) => {
            const file = torrent.files.find((file: any) => file.name.endsWith(".mp4"));
            if (!file) {
                toast.error("No playable video found in the torrent.");
                return;
            }

            // Check if the video element is already being used
            if (videoRef.current.srcObject) {
                // Stop the previous stream (if any)
                videoRef.current.srcObject = null;
            }

            // Render to the video element only once
            file.renderTo(videoRef.current!);
        });

        return () => client.destroy();
    }, [magnetURI]);

    if (loading) return <div className="text-center text-white">Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-black">
            <video ref={videoRef} controls className="w-[80%] h-auto rounded-lg shadow-lg" />
        </div>
    );
};

export default WatchPage;
