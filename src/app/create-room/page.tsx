"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Monitor, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Peer from "peerjs";
import { useEffect, useState } from "react";
import { ShareComponent } from "@/app/create-room/_components/ShareComponent";

/**
 * CreateRoom component handles the screen-sharing functionality for the host.
 * It manages peer connections, room ID, and the active media stream.
 */
export default function CreateRoom() {
  const [roomId, setRoomId] = useState<string>(""); // The unique room ID for the host's session
  const [peer, setPeer] = useState<Peer | null>(null); // Peer instance for establishing connections
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null); // Active media stream for screen sharing
  const [connections, setConnections] = useState<string[]>([]); // List of connected peers (viewers)
  const { toast } = useToast(); // Toast notification handler
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    // Initializes a new Peer object for the host when the component is mounted
    try {
      const newPeer = new Peer({ debug: 2 });
      setPeer(newPeer);

      // When the peer is successfully opened, set the room ID
      newPeer.on("open", (id) => {
        setRoomId(id);
      });

      // Listen for incoming peer connections and manage connections
      newPeer.on("connection", (connection) => {
        setConnections((prev) => [...prev, connection.peer]);

        connection.on("close", () => {
          setConnections((prev) => prev.filter((peerId) => peerId !== connection.peer));
        });
      });

      // Clean up the peer instance when the component is unmounted
      return () => {
        newPeer.destroy();
      };
    } catch (error) {
      console.error("Error initializing peer:", error);
    }
  }, []);

  useEffect(() => {
    // Only proceed if the peer instance is available
    if (!peer) return;

    // If there is no active stream yet and viewers are connected, offer screen sharing
    if (!activeStream) {
      if (connections.length > 0) {
        toast({
          title: "New viewer connected",
          description: "Click to start sharing your screen.",
          duration: Infinity,
          action: (
              <ToastAction
                  altText="Start sharing"
                  onClick={async () => {
                    try {
                      // Request screen sharing access
                      const stream = await navigator.mediaDevices.getDisplayMedia({
                        video: true,
                        audio: true
                      });
                      setActiveStream(stream); // Set the active stream for screen sharing
                    } catch (err) {
                      console.error("Screen sharing error:", err);
                      toast({
                        title: "Screen sharing error",
                        description: "Failed to start screen sharing. Please try again.",
                        variant: "destructive"
                      });
                    }
                  }}
              >
                Start Sharing
              </ToastAction>
          ),
        });
      }
    } else {
      // Once an active stream is available, call each connected peer with the stream
      connections.forEach((connection) => {
        const call = peer.call(connection, activeStream);

        // Handle ending the stream if the screen sharing ends
        activeStream.getTracks()[0].onended = () => {
          call.close();
          activeStream.getTracks().forEach((track) => track.stop());
        };
      });
    }
  }, [peer, toast, activeStream, connections]);

  /**
   * Ends the screen sharing session and cleans up the peer connection.
   */
  function endSession() {
    // Stop the active stream tracks when ending the session
    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
      setActiveStream(null);
    }

    // Destroy the peer instance and reset state
    if (peer) {
      peer.destroy();
      setPeer(null);
    }

    setConnections([]);
    setRoomId("");

    // Display a toast notification indicating session termination
    toast({
      title: "Session ended",
      description: "Your screen sharing session has been terminated.",
    });

    // Navigate back to the home page
    router.push("/");
  }

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6 py-12">
        <div className="max-w-3xl w-full space-y-8 text-center">
          <div className={'flex items-center justify-start'}>
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>

          <Card className="bg-gray-900 shadow-lg hover:shadow-2xl transition duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-400">
                <Monitor className="h-6 w-6" />
                Your Screen Broadcast Room
              </CardTitle>
              <CardDescription className="text-gray-400">
                Provide the room code or link to others so they can view your screen. If you want to share audio as well, ensure you’re using Chrome or Edge and select the tab-sharing option.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ShareComponent roomId={roomId} />
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-400">Current Viewers</span>
                </div>
                <span className="text-lg font-semibold">{connections.length}</span>
              </div>

              {activeStream && (
                  <div className="flex justify-end pt-4">
                    <Button variant="destructive" onClick={endSession} className="flex items-center gap-2">
                      Stop sharing
                    </Button>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
