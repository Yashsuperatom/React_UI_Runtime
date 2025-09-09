// import { useState, useRef, useLayoutEffect, forwardRef, useImperativeHandle} from "react";
// import type { ChatMessage, ChatConfig, ChatHandlers } from "../lib/types";
// import MessageBubble from "./MessageBubble";
// import ChatInput from "./InputBox";
// import Hero from "./Hero";
// import UILogs from "./UILogs";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "./LeftSidebar";
// import { ProjectSidebar } from "./RightSidebar";

// export interface ChatRuntimeRef {
//   sendMessage: (message: string) => void;
//   clearMessages: () => void;
//   getMessages: () => ChatMessage[];
// }

// interface ChatRuntimeProps {
//   config?: ChatConfig;
//   handlers?: ChatHandlers;
//   onMessageSent?: (message: string) => void;
//   onMessageReceived?: (message: ChatMessage) => void;
//   className?: string;
//   heroComponent?: React.ComponentType<{ onOptionClick: (value: string) => void }>;
// }

// const ChatRuntime = forwardRef<ChatRuntimeRef, ChatRuntimeProps>(({
//   config = {},
//   handlers = {},
//   onMessageSent,
//   onMessageReceived,
//   className = "",
//   heroComponent: CustomHero
// }, ref) => {
//   const { placeholder = "Say something...", maxLength = 3000 } = config;

//   const [inputValue, setInputValue] = useState("");
//   const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [inputHeight, setInputHeight] = useState(0);
//   const [isLoadingUI, setIsLoadingUI] = useState(false);

//   const HeroComponent = CustomHero || Hero;

//   // projectid and uiid
//   const uiid = "ui_33O2Hf"
//   const projectId = "47"

//   // Expose methods via ref
//   useImperativeHandle(ref, () => ({
//     sendMessage: (message: string) => handleSendMessage(message),
//     clearMessages: () => setAllMessages([]),
//     getMessages: () => allMessages
//   }));

//   // Auto-scroll
//   useLayoutEffect(() => {
//     const container = containerRef.current;
//     if (container) container.scrollTop = container.scrollHeight;
//   }, [allMessages, isLoadingUI]);

//   const handleOptionClick = (value: string) => setInputValue(value);

//   const handleUILogsComplete = (uiData: any) => {
//     setIsLoadingUI(false);
    
//     if (uiData) {
//       // Success - create AI message with UI
//       const aiMessage: ChatMessage = {
//         id: `ai-${Date.now()}`,
//         role: "assistant",
//         parts: [{ type: "text", text: "Here's your UI:" }],
//         schema: {
//           ui: uiData.ui,
//           data: uiData.data
//         }
//       };
//       setAllMessages(prev => [...prev, aiMessage]);
//       onMessageReceived?.(aiMessage);
//     } else {
//       // Error - create error message
//       const errorMessage: ChatMessage = {
//         id: `ai-${Date.now()}`,
//         role: "assistant",
//         parts: [{ type: "text", text: "⚠️ Failed to fetch UI. Please try again." }]
//       };
//       setAllMessages(prev => [...prev, errorMessage]);
//     }
//   };

//   const handleSendMessage = async (messageText?: string) => {
//     const text = messageText || inputValue;
//     if (!text.trim()) return;

//     const userMessage: ChatMessage = {
//       id: `user-${Date.now()}`,
//       role: "user",
//       parts: [{ type: "text", text }]
//     };
//     setAllMessages(prev => [...prev, userMessage]);
//     setInputValue("");
//     onMessageSent?.(text);

//     // If user wants UI
//     if (text.toLowerCase().includes("ui")) {
//       setIsLoadingUI(true);
//       return; // UILogs component will handle the API call and callback
//     }

//     // Default AI response
//     const aiMessage: ChatMessage = {
//       id: `ai-${Date.now()}`,
//       role: "assistant",
//       parts: [{ type: "text", text: "I am here to help you." }]
//     };
//     setAllMessages(prev => [...prev, aiMessage]);
//     onMessageReceived?.(aiMessage);
//   };

//   return (
//     <SidebarProvider id="1">
//       <AppSidebar />
//       <span className="sm:block md:hidden"><SidebarTrigger /></span>

//       <div className={`flex flex-col w-full h-screen bg-white ${className}`}>
//         <div ref={containerRef} className="flex overflow-y-auto h-screen justify-center">
//           <div className="lg:px-[5vw] px-[7vw] w-full lg:max-w-[60vw]" style={{ paddingBottom: inputHeight }}>
//             {allMessages.length === 0 && !isLoadingUI && <HeroComponent onOptionClick={handleOptionClick} />}

//             {allMessages.map((msg) => (
//               <MessageBubble
//                 key={msg.id}
//                 message={msg}
//                 isStreaming={false}
//                 currentSchema={msg.schema}
//                 schemaData={msg.schema}
//                 handlers={handlers}
//               />
//             ))}

//             {/* Show UI Logs when loading */}
//             {isLoadingUI && (
//               <UILogs
//                 isActive={isLoadingUI}
//                 onComplete={handleUILogsComplete}
//                 projectId={projectId}
//                 uiId={uiid}
//               />
//             )}

//             {allMessages.length > 0 && <div className="lg:h-[25vh] sm:h-[70vh]" />}
//           </div>
//         </div>

//         <ChatInput
//           value={inputValue}
//           onChange={setInputValue}
//           onSend={() => handleSendMessage()}
//           onHeightChange={setInputHeight}
//           placeholder={placeholder}
//           maxLength={maxLength}
//           disabled={isLoadingUI}
//           enableVoice={false}
//           enableAttachments={false}
//           enablePrompts={false}
//           modelName="Local AI"
//         />
//       </div>

//       <ProjectSidebar />
//     </SidebarProvider>
//   );
// });

// ChatRuntime.displayName = "ChatRuntime";

// export default ChatRuntime;





import { useState, useRef, useLayoutEffect, forwardRef, useImperativeHandle ,useCallback }from "react";
import type { ChatMessage, ChatConfig, ChatHandlers } from "../lib/types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./InputBox";
import Hero from "./Hero";
import UILogs from "./UILogs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./LeftSidebar";
import { ProjectSidebar } from "./RightSidebar";

export interface ChatRuntimeRef {
  sendMessage: (message: string) => void;
  clearMessages: () => void;
  getMessages: () => ChatMessage[];
}

interface ChatRuntimeProps {
  config?: ChatConfig;
  handlers?: ChatHandlers;
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (message: ChatMessage) => void;
  className?: string;
  heroComponent?: React.ComponentType<{ onOptionClick: (value: string) => void }>;
}

const ChatRuntime = forwardRef<ChatRuntimeRef, ChatRuntimeProps>(({
  config = {},
  handlers = {},
  onMessageSent,
  onMessageReceived,
  className = "",
  heroComponent: CustomHero
}, ref) => {
  const { placeholder = "Say something...", maxLength = 3000 } = config;

  const [inputValue, setInputValue] = useState("");
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputHeight, setInputHeight] = useState(0);
  const [isLoadingUI, setIsLoadingUI] = useState(false);
  

  const HeroComponent = CustomHero || Hero;

  // projectid and uiid and reqid
  const uiid = "ui_33O2Hf";
  const projectId = "49";
  const reqid = "546"

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    sendMessage: (message: string) => handleSendMessage(message),
    clearMessages: () => setAllMessages([]),
    getMessages: () => allMessages
  }));

  // Auto-scroll
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [allMessages, isLoadingUI]);

  const handleOptionClick = (value: string) => setInputValue(value);



  const handleUILogsComplete = (uiData: any, logMessageId: string) => {
    setIsLoadingUI(false);

    // Update the logs message to mark it as completed
    setAllMessages(prev => 
      prev.map(msg => 
        msg.id === logMessageId 
          ? { ...msg, completed: true } as ChatMessage & { completed?: boolean }
          : msg
      )
    );

    if (uiData) {
      const dataKey = Object.keys(uiData.data)[0]; // dynamically get first key
      const projectData = uiData.data[dataKey];

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: "Here's your UI:" }],
        schema: {
          ui: uiData.ui,
          data: projectData
        }
      };
      setAllMessages(prev => [...prev, aiMessage]);
      console.log(uiData)
      onMessageReceived?.(aiMessage);
    } else {
      const errorMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: "⚠️ Failed to fetch UI. Please try again." }]
      };
      setAllMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      parts: [{ type: "text", text }]
    };
    setAllMessages(prev => [...prev, userMessage]);
    setInputValue("");
    onMessageSent?.(text);

    // If user wants UI
    if (text.toLowerCase().includes("ui")) {
      const logMessageId = `uilog-${Date.now()}`;
      const logMessage: ChatMessage & { active?: boolean; completed?: boolean } = {
        id: logMessageId,
        role: "system",
        parts: [{ type: "text", text: "Generating UI..." }],
        active: true,
        completed: false
      };
      setAllMessages(prev => [...prev, logMessage]);
      setIsLoadingUI(true);
      return;
    }

    // Default AI response
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      parts: [{ type: "text", text: "I am here to help you." }]
    };
    setAllMessages(prev => [...prev, aiMessage]);
    onMessageReceived?.(aiMessage);
  };


  // prevent the renreder of logs
  const getUILogsCompleteHandler = useCallback(
  (msgId: string) => (uiData: any) => handleUILogsComplete(uiData, msgId),
  []
);


  return (
    <SidebarProvider id="1">
      <AppSidebar />
      <span className="sm:block md:hidden"><SidebarTrigger /></span>

      <div className={`flex flex-col w-full h-screen bg-white ${className}`}>
        <div ref={containerRef} className="flex overflow-y-auto h-screen justify-center">
          <div className="lg:px-[5vw] px-[7vw] w-full lg:max-w-[60vw]" style={{ paddingBottom: inputHeight }}>
            {allMessages.length === 0 && !isLoadingUI && (
              <HeroComponent onOptionClick={handleOptionClick} />
            )}

            {allMessages.map((msg) => {
              // Check for UILogs message
              if ((msg as any).active !== undefined) {
                const extendedMsg = msg as ChatMessage & { active?: boolean; completed?: boolean };
                const isActive = extendedMsg.active === true && !extendedMsg.completed;

                
                return (
                  <div key={msg.id} className="mb-4">
                    <UILogs
                      requestId={reqid}
                      isActive={isActive}
                      projectId={projectId}
                      uiId={uiid}
                      wsUrl="wss://user-websocket.ashish-91e.workers.dev/websocket"
                      onComplete={ getUILogsCompleteHandler(msg.id)}
                    />
                  </div>
                );
              }

              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isStreaming={false}
                  currentSchema={msg.schema}
                  schemaData={msg.schema}
                  handlers={handlers}
                />
              );
            })}

            {allMessages.length > 0 && <div className="lg:h-[25vh] sm:h-[70vh]" />}
          </div>
        </div>

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSendMessage()}
          onHeightChange={setInputHeight}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={isLoadingUI}
          enableVoice={true}
          enableAttachments={true}
          enablePrompts={true}
          modelName="Local AI"
        />
      </div>

      <ProjectSidebar />
    </SidebarProvider>
  );
});

ChatRuntime.displayName = "ChatRuntime";

export default ChatRuntime;