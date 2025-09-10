import { Icon } from "@iconify/react";
import MotionWrapper from "./MotionWrapper";
import { useEffect, useRef, useState } from "react";
import { ProdWebSocketClient } from "./webSocket";
import type { ProdUIResponse } from "./webSocket";

interface HeroProps {
  onOptionClick: (value: string) => void;
}

type CardProps = {
  title: string;
  icon: string;
  color: string;
  onClick: () => void;
};



const Card = ({ title, icon, color, onClick }: CardProps) => (
  <div
    onClick={onClick}
    className="flex items-start lg:items-center justify-between rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-200  p-3 sm:p-4 bg-white"
  >
    <div className="flex items-center space-x-3 ">
      <div
        className="flex items-center justify-center w-9 h-9  sm:h-10 rounded-md shrink-0"
        style={{ backgroundColor: color }}
      >
        <Icon icon={icon} className="text-white text-lg sm:text-xl" />
      </div>
      <div className="text-sm sm:text-base font-medium text-gray-900">
        {title}
      </div>
    </div>
    <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors shrink-0">
      <Icon icon="mdi:plus" className="w-4 h-4 sm:w-5 sm:h-5" />
    </div>
  </div>
);

const Hero = ({ onOptionClick }: HeroProps) => {


  const [data, setData] = useState<any>([])


  const url = import.meta.env.VITE_WEBSOCKET_URL;
  const projectId = import.meta.env.VITE_projectID;

  const wsClientRef = useRef<ProdWebSocketClient | null>(null);

  useEffect(() => {
    const client = new ProdWebSocketClient(url, projectId);
    wsClientRef.current = client;

    // Listen for server messages
    client.onProdUIResponse((res: ProdUIResponse) => {
      console.log("📩 UI Response:", res);

      // Example: update state based on WS data
      if (res.data?.cards) {
        setData(res.data.cards);
      }
    });

    return () => {
      client.disconnect; // cleanup if your client supports it
    };
  }, [url, projectId]);


  const cardsData = [
    { title: "Write copy", icon: "material-symbols:note-alt", color: "#ffd282" },
    { title: "Image generation", icon: "mdi:image-outline", color: "#cce6fd" },
    { title: "Create avatar", icon: "mdi:account-circle", color: "#cae591" },
    { title: "Write code", icon: "mdi:code-braces", color: "#fecbe9" },
  ];

  return (
    <div className="flex flex-col min-h-screen px-4  lg:px-8 pt-25   font-[Inter] bg-white">
      <div className="w-full mx-auto text-center space-y-4 lg:space-y-10 max-w-screen-sm  lg:max-w-4xl">
        {/* Animated Title */}
        <MotionWrapper className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
          Welcome to Superatom
        </MotionWrapper>

        {/* Subtitle */}
        <MotionWrapper className="text-sm sm:text-base lg:text-xl text-gray-600">
          Get started by script a task and chat will do the rest. Not sure where to begin?
        </MotionWrapper>

        {/* Cards with fade + stagger */}
        <div className="w-full flex justify-center items-center">
          <div className=" w-full  max-w-xl ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {(data && data.length === "0" ? data : cardsData).map((card: any, i: number) => (
                <MotionWrapper key={i} from="right" className="group hover:scale-[1.02]">
                  <Card
                    title={card.title}
                    icon={card.icon}
                    color={card.color}
                    onClick={() => onOptionClick(card.title)}
                  />
                </MotionWrapper>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;