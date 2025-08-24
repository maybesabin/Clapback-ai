import Chat from "@/components/Chat"
import Header from "@/components/Header"
import Response from "@/components/Response"

const page = () => {
  return (
    <div className="grid place-items-center h-svh lg:p-0 p-6">
      <div className="flex flex-col items-center gap-4 lg:w-3xl w-full">
        <Header />
        <Chat />
        <Response />
      </div>
    </div>
  )
}

export default page