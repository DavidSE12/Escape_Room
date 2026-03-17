import SimpleVideo from "@/app/components/Video"

export default function Home() {
  return (
    <div className="flex flex-col">
        <div className="flex flex-row justify-evenly items-center p-5 text-2xl ">
            <h1>Huu Tien Dat Huynh</h1>
            <h1>22099453</h1>
        </div>

        <div className="p-6">
            <SimpleVideo src ="/introduction.mp4" />
        </div>
    </div>
  )
}
