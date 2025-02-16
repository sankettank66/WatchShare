"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Link as LinkIcon } from "lucide-react";

interface ShareProps {
    roomId: string; // Unique identifier for the room to share
}

/**
 * ShareComponent component allows the user to share the room code or a shareable link.
 * It provides options to copy the room code or the generated link to the clipboard.
 *
 * @param {ShareProps} props - The properties for the ShareComponent component
 * @returns {JSX.Element} The ShareComponent component with buttons to copy the room code and shareable link.
 */
export function ShareComponent({ roomId }: ShareProps) {
    const { toast } = useToast();

    /**
     * Copies the room ID to the clipboard and shows a success toast.
     */
    function copyRoomId() {
        navigator.clipboard.writeText(roomId);
        toast({
            title: "Room code copied!",
            description: "Use this code to let others join your room."
        });
    }

    /**
     * Copies the generated shareable link to the clipboard and shows a success toast.
     */
    function copyShareableLink() {
        const shareableUrl = `${window.location.origin}/join-room?room=${roomId}`;
        navigator.clipboard.writeText(shareableUrl);
        toast({
            title: "Shareable link copied!",
            description: "Use this link to allow others to directly join your room."
        });
    }

    return (
        <div className="space-y-6 p-6 bg-gray-900 rounded-lg shadow-lg">
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Room ID</span>
                    <Button variant="ghost" size="sm" className="gap-2 text-indigo-400" onClick={copyRoomId} disabled={!roomId}>
                        <Copy className="h-4 w-4" />
                        Copy ID
                    </Button>
                </div>
                <code className="block w-full p-3 bg-gray-800 rounded-lg text-sm font-mono text-indigo-300">
                    {roomId || "Creating room ID..."}
                </code>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase text-gray-500">
                    <span className="bg-gray-900 px-2">or</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Shareable URL</span>
                    <Button variant="ghost" size="sm" className="gap-2 text-teal-400" onClick={copyShareableLink} disabled={!roomId}>
                        <LinkIcon className="h-4 w-4" />
                        Copy URL
                    </Button>
                </div>
                <code className="block w-full p-3 bg-gray-800 rounded-lg text-sm font-mono text-teal-300 truncate">
                    {roomId ? `${window.location.origin}/join-room?room=${roomId}` : "Generating URL..."}
                </code>
            </div>
        </div>
    );
}
