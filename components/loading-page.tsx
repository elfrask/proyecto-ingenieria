import { Spinner } from "./ui/spinner";


export default function Loading() {

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-6">
      <img src={"/logo.png"} width={200} height={150} />

      <Spinner className="size-20 text-primary" />
    </div>
  )
};