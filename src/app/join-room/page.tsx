"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

export default function JoinRoom() {
    const [roomId, setRoomId] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<Peer | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const roomFromUrl = params.get("room");
        if (roomFromUrl) {
            setRoomId(roomFromUrl);
        }
    }, []);

    useEffect(() => {
        if (videoRef.current && activeStream) {
            videoRef.current.srcObject = activeStream;
        }
    }, [activeStream]);

    function joinRoom() {
        if (!roomId.trim()) {
            toast({
                title: "Room code required",
                description: "Please enter a valid room code.",
                variant: "destructive"
            });
            return;
        }

        setIsConnecting(true);
        const peer = new Peer();
        peerRef.current = peer;

        peer.on("open", () => {
            const connection = peer.connect(roomId);
            connection.on("open", () => {
                toast({
                    title: "Connected!",
                    description: "Waiting for host to share their screen..."
                });
            });

            peer.on("call", (call) => {
                call.answer();
                call.on("stream", (remoteStream) => {
                    setActiveStream(remoteStream);
                });
            });
        });

        peer.on("error", (err) => {
            setIsConnecting(false);
            toast({
                title: "Connection failed",
                description: "Could not connect to the room. Please try again.",
                variant: "destructive"
            });
            console.log(err);
            
        });
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6 py-12">
            <div className="max-w-2xl w-full space-y-8">
                <Button variant="ghost" asChild>
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>

                <Card className="bg-gray-900 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Users className="h-6 w-6 text-teal-400" />
                            Join a Room
                        </CardTitle>
                        <CardDescription className="text-gray-400">Enter the room code to join and view the shared screen</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!activeStream ? (
                            <div className="space-y-4 text-teal-400">
                                <Input placeholder="Enter room code" value={roomId} onChange={(e) => setRoomId(e.target.value)} disabled={isConnecting} className="text-white" />
                                <Button className="w-full bg-teal-500 hover:bg-teal-600" onClick={joinRoom} disabled={isConnecting || !roomId.trim()}>
                                    {isConnecting ? "Connecting..." : "Join Room"}
                                </Button>
                            </div>
                        ) : (
                            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group">
                                <video ref={videoRef} className="w-full h-full object-contain" autoPlay playsInline />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
