import { useState, useRef, useLayoutEffect, forwardRef, useImperativeHandle, useCallback, useEffect } from "react";
import type { ChatMessage, ChatConfig, ChatHandlers } from "../lib/types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./InputBox";
import Hero from "./Hero";
import UILogs from "./UILogs";
import { SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar";
import { AppSidebar } from "./LeftSidebar";
import { ProjectSidebar } from "./RightSidebar";
import datas from "@/Registery/dsl.json"
import { useParams } from "react-router-dom";

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
  const { placeholder = "Say something..." } = config;

  const [inputValue, setInputValue] = useState("");
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputHeight, setInputHeight] = useState(0);
  const [isLoadingUI, setIsLoadingUI] = useState(false);



  // for sidebar
  const savedRightSidebarState = localStorage.getItem("sidebar-rightSidebar");
  const [rightSidebarOpen, setRightSidebarOpen] = useState(savedRightSidebarState !== "collapsed");
  // const [leftSidebarOpen, setLeftSidebarOpen] = useState(savedRightSidebarState !== "collapsed");

  // Save to localStorage whenever state changes
  useEffect(() => {
      localStorage.setItem("sidebar-rightSidebar", rightSidebarOpen ? "expanded" : "collapsed");
  }, [rightSidebarOpen]);


  const HeroComponent = CustomHero || Hero;



  const params = useParams<{ projectId?: string; uiid?: string }>();

  const projectId = params.projectId || import.meta.env.VITE_projectID;
  const uiid = params.uiid || import.meta.env.VITE_UIID;
  const reqid = import.meta.env.VITE_reqID;
  const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;



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

  const handleOptionClick = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  // Memoize the UI logs completion handler to prevent unnecessary re-renders
  const handleUILogsComplete = useCallback((uiData: any, logMessageId: string) => {
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
      console.log(uiData);
      onMessageReceived?.(aiMessage);
    } else {
      const errorMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: "⚠️ Failed to fetch UI. Please try again." }]
      };
      setAllMessages(prev => [...prev, errorMessage]);
    }
  }, [onMessageReceived]);


  // control the input

  const handleSendMessage = useCallback(async (messageText?: string) => {
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

    if (inputValue.trim().startsWith("{") || inputValue.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(text)
        if (parsed.ui && parsed.data) {
          const logMessageId = `uilog-${Date.now()}`;
          const logMessage: ChatMessage & {} = {
            id: logMessageId,
            role: "assistant",
            schema: {
              ui: parsed.ui,
              data: parsed.data
            }
          };
          setAllMessages(prev => [...prev, logMessage]);
          return;
        }
      }
      catch (e) {
        console.log(e)
      }
    }
    else {
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


      if (text.toLowerCase().includes("dash")) {
        const logMessageId = `uilog-${Date.now()}`;
        const logMessage: ChatMessage & {} = {
          id: logMessageId,
          role: "assistant",
          schema: {
            ui: datas.ui,
            data: datas.data
          }

        }
        console.log(logMessage.schema.ui)
        console.log(logMessage.schema.data)
        setAllMessages(prev => [...prev, logMessage]);
      }

      // Default AI response
      else {
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          parts: [{ type: "text", text: "I am here to help you." }]
        };
        setAllMessages(prev => [...prev, aiMessage]);
        onMessageReceived?.(aiMessage);
      }
    }
  }, [inputValue, onMessageSent, onMessageReceived]);

  // Create a memoized handler for each UILogs component
  const getUILogsCompleteHandler = useCallback(
    (msgId: string) => (uiData: any) => handleUILogsComplete(uiData, msgId),
    [handleUILogsComplete]
  );

  return (
    <SidebarProvider id="leftSidebar" defaultOpen={rightSidebarOpen}>
      <AppSidebar onToggle={() => setRightSidebarOpen(prev => !prev)} />
      <span className="sm:block md:hidden"><SidebarTrigger onToggle={() => setRightSidebarOpen(prev => !prev)} /></span>

      <div className={`flex flex-col w-full h-screen bg-white  ${className}`}>
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
                      wsUrl={wsUrl}
                      onComplete={getUILogsCompleteHandler(msg.id)}
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
          // maxLength={maxLength}
          disabled={isLoadingUI}
          enableVoice={true}
          enableAttachments={true}
          enablePrompts={true}
          modelName="Local AI"
        />
      </div>

      <ProjectSidebar id="rightSidebar" defaultOpen={rightSidebarOpen} onToggle={() => setRightSidebarOpen(prev => !prev)} />
    </SidebarProvider>
  );
});

ChatRuntime.displayName = "ChatRuntime";

export default ChatRuntime;