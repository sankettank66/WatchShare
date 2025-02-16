import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Users } from "lucide-react";
import Link from "next/link";

/**
 * Home component is the landing page for the WatchShare application. 
 * It allows users to either create a room to start screen sharing or join an existing room.
 * 
 * @returns {JSX.Element} The landing page with options to create or join a room.
 */
export default function Main() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6 py-12">
      <div className="max-w-4xl w-full space-y-6 text-center">
        <h1 className="text-balance text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
          Watch
          <LineShadowText className="italic" shadowColor={"white"}>
            Share
          </LineShadowText>
        </h1>
        <p className="text-lg text-gray-300">Create a room, share the code, and start presenting to your audience in seconds.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card to start sharing a screen */}
          <Card className="bg-gray-900 shadow-lg hover:shadow-2xl transition duration-300">
            <CardHeader className="flex flex-col items-center text-center">
              <Monitor className="h-10 w-10 text-indigo-400" />
              <CardTitle className="mt-4 text-xl">Start Sharing</CardTitle>
              <CardDescription className="text-gray-400">Create a room and share your screen with others</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link href="/create-room">
                <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">Create Room</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card to join a room */}
          <Card className="bg-gray-900 shadow-lg hover:shadow-2xl transition duration-300">
            <CardHeader className="flex flex-col items-center text-center">
              <Users className="h-10 w-10 text-teal-400" />
              <CardTitle className="mt-4 text-xl">Join a Room</CardTitle>
              <CardDescription className="text-gray-400">Enter a room code to view someone{`'`}s screen</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link href="/join-room">
                <Button variant="outline" className="w-full border-teal-400 text-teal-400 hover:bg-teal-600 hover:text-white">Join Room</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
