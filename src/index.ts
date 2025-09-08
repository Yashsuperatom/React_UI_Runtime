export { default as ChatRuntime } from "./RuntimeComponents/ChatRuntime";
export { default as MessageBubble } from "./RuntimeComponents/MessageBubble";
export { default as ChatInput } from "./RuntimeComponents/InputBox";
export { default as Hero } from "./RuntimeComponents/Hero";
export { default as UILogs } from "./RuntimeComponents/UILogs";
export { AppSidebar } from "./RuntimeComponents/LeftSidebar";
export { ProjectSidebar } from "./RuntimeComponents/RightSidebar";

// Re-export types (make sure to use type-only)
export type { ChatMessage, ChatConfig, ChatHandlers } from "./lib/types";