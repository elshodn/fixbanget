import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <>
   
      <div className="h-40">
        <div className="h-full">
          <Link
            href="/search"
            className={`w-fullrounded-2xl bg-[#B4AEAE] relative flex justify-between rounded-[20px] overflow-hidden`}
          >
            <div className=" p-3">

            <h1 className="font-bold text-white text-sm md:text-3xl mb-2 whitespace-nowrap relative z-10">
              МОДНЫЕ ЛИНЕЙКИ
            </h1>

            <p className="md:text-xl  text-gray-200 text-[10px] relative z-10">БРЕНДОВОЙ ОДЕЖДЫ 2025 ГОДА</p>
            <p className="md:text-xl  text-gray-200 text-[10px] relative z-10 mt-2.5">Охота за модными тенденциями</p>
            </div>
            <div>

            <Image
              src={"/imageHero.svg"}
              width={170}
              height={170}
              alt=""
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              </div>
          </Link>
        </div>
    
      </div>
    </>
  );
};
