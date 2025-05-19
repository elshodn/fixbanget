import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <>
      <div className="h-[9rem]">
        <div className="h-full">
          <Link
            href="/search"
            className={`w-fullrounded-2xl h-full  relative flex justify-between rounded-[20px] overflow-hidden`}
          >
            <div className="inset-0  w-full bg-[#B4AEAE] h-full absolute z-1"></div>
            <div className=" p-3">
              <h1 className="font-bold text-white text-base md:text-3xl mb-1 whitespace-nowrap relative z-10">
                МОДНЫЕ ЛИНЕЙКИ
              </h1>

              <p className="md:text-xl  text-white/50 font-normal text-base relative z-10">
                БРЕНДОВОЙ ОДЕЖДЫ 2025 ГОДА
              </p>
            </div>
            <div className="relative z-10 h-full w-52">
              <Image
                src={"/imageHero.svg"}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
