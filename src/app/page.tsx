import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Button variant={"destructive"}>Click me</Button>
      <p className="text-red-100">
        Nikhil
      </p>
    </div>
  )
}
