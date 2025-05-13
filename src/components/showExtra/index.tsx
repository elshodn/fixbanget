import Image from "next/image";

type Clothes = {
  title: string;
  img: string;
};

interface ShowExtraProps {
  clothes: Clothes[];
}
export const ShowExtra: React.FC<ShowExtraProps> = ({ clothes }) => {
  return (
    <div className="flex flex-wrap w-full gap-4 mt-2.5">
      {clothes.map(({ title, img }, inx) => (
        <div
          key={inx}
          className="card flex justify-between bg-[#EEEDEB] h-[112px] w-[46%] grow rounded-[20px] p-2.5"
        >
          <p className="text-[12px] font-bold w-1/2">{title}</p>
          <Image
            src={img}
            alt="odejda"
            width={70}
            height={100}
            style={{ width: "auto" }}
          />
        </div>
      ))}
    </div>
  );
};
