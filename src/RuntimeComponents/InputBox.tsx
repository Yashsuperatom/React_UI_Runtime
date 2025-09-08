import {  useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import MotionWrapper from "./MotionWrapper";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onHeightChange: (height: number) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  enableVoice?: boolean;
  enableAttachments?: boolean;
  enablePrompts?: boolean;
  modelName?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  onHeightChange,
  placeholder = "Say something...",
  maxLength = 3000,
  disabled = false,
  enableVoice = true,
  enableAttachments = true,
  enablePrompts = true,
  modelName = "Script AI v1.3"
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  // Track input height for parent component
  useEffect(() => {
    if (inputContainerRef.current) {
      onHeightChange(inputContainerRef.current.offsetHeight);
    }
  }, [value, onHeightChange]);

  return (
    <div className="w-full flex justify-center">

    <div 
      ref={inputContainerRef}
      className=" absolute bottom-0 w-full  bg-white max-w-[81vw]  lg:max-w-[51vw] rounded-t-2xl md:-translate-x-2 "
    >
      <MotionWrapper>
        <div className="group rounded-2xl mx-auto">
          <div className="flex flex-col gap-2 rounded-2xl bg-gradient-to-r from-transparent to-transparent group-focus-within:from-[#68a4c2] group-focus-within:to-[#927db8] transition-colors duration-200 p-[1.5px] bg-gray-100 shadow-md">
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden relative">
              <div className="flex items-center gap-2 sm:gap-3 px-2">
                <textarea
                  ref={textareaRef}
                  value={value}
                  placeholder={placeholder}
                  onChange={(e) => onChange(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSend();
                    }
                  }}
                  rows={1}
                  className="flex-grow w-full max-h-32 sm:max-h-24 resize-none overflow-y-auto focus:outline-none text-sm sm:text-base"
                  maxLength={maxLength}
                  disabled={disabled}
                />
                <button
                  onClick={onSend}
                  disabled={!value.trim() || disabled}
                  className="text-gray-400 hover:text-indigo-500 transition-colors duration-200 rounded-full hover:bg-gray-100 p-1 sm:p-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Icon
                    icon="ph:paper-plane-right-fill"
                    width={20}
                    height={20}
                    className="sm:w-6 sm:h-6"
                  />
                </button>
              </div>

              <hr className="border-t border-gray-200" />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-gray-500 text-xs sm:text-sm bg-gray-50 p-2">
                <div className="flex flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
                  {enableAttachments && (
                    <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors duration-200 cursor-pointer">
                      <Icon icon="ph:paperclip-fill" width="16" height="16" className="sm:w-[18px] sm:h-[18px]" />
                      <span className="font-medium">Attach</span>
                    </button>
                  )}
                  {enableVoice && (
                    <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors duration-200 cursor-pointer">
                      <Icon icon="ph:microphone-fill" width="16" height="16" className="sm:w-[18px] sm:h-[18px]" />
                      <span className="font-medium hidden xs:inline">Voice</span>
                      <span className="font-medium xs:hidden">Mic</span>
                    </button>
                  )}
                  {enablePrompts && (
                    <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors duration-200 cursor-pointer">
                      <Icon icon="ph:text-t-fill" width="16" height="16" className="sm:w-[18px] sm:h-[18px]" />
                      <span className="font-medium hidden sm:inline">Browse Prompts</span>
                      <span className="font-medium sm:hidden">Prompts</span>
                    </button>
                  )}
                </div>
                <div className="text-gray-400 font-medium text-xs sm:text-sm whitespace-nowrap">
                  {value.length} / {maxLength}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center my-4 text-gray-500 text-xs sm:text-sm px-4">
          Script may generate inaccurate information about people, places, or facts. Model: {modelName}
        </p>
      </MotionWrapper>
    </div>
    </div>
  );
};

ChatInput.displayName = "ChatInput";