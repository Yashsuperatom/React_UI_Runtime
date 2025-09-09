import type { ChatMessage, ChatHandlers } from "../lib/types";
import Markdown from "./Markdown";
import UIRenderer from "./UIRenderer";
import { Icon } from "@iconify/react";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming: boolean;
  currentSchema?: any;
  handlers: ChatHandlers;
  schemaData?: any;
}

export default function MessageBubble({
  message,
  isStreaming,
  handlers,
}: MessageBubbleProps) {


  
  // Fullscreen toggle handler
  const handleFullscreen = (id: string) => {
    const elem = document.getElementById(id);
    if (!elem) return;

     if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  };

  return (
    <div
      className={`w-full flex gap-2 sm:gap-3 py-6 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI badge */}
      {message.role !== "user" && (
        <div className="flex flex-col items-center justify-start flex-shrink-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs sm:text-sm">
            A
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`w-fit py-1 rounded-xl ${
          message.role === "user"
            ? "bg-indigo-100 text-gray-900 rounded-tr-lg ml-auto"
            : "bg-gray-100 text-gray-900 rounded-tl-lg"
        }`}
      >
        <div className="w-fit">
          {message.schema ? (
            <div className="py-4 overflow-auto max-w-[40vw] mx-4 w-fit group relative ">
              {/* Fullscreen Icon */}
          
               <Icon
                icon="mingcute:fullscreen-2-line"
                height={30}
                width={30}
                className="text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer absolute top-2 right-0 z-10"
                onClick={() => handleFullscreen(`box-${message.id}`)}
              />
              <span className="bg-white overflow-auto" id={`box-${message.id}`}>
              <UIRenderer
                schema={message.schema.ui}
                data={message.schema.data}
                handlers={handlers}
                isStreaming={isStreaming}
              />
              </span>
            </div>
          ) : (
            message.parts?.map((part, index) => (
              <div className="px-4" key={index}>
                <Markdown content={part.text} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* User badge */}
      {message.role === "user" && (
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-400 text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
}
