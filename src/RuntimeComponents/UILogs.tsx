// import React, { useEffect, useState, useRef } from "react";
// import { Icon } from "@iconify/react";
// import MotionWrapper from "./MotionWrapper";
// import { getUI } from "../Route/Route";


// interface UILogsProps {
//   isActive: boolean;
//   onComplete?: (uiData: any) => void;
//   projectId: string;
//   uiId: string;
// }

// const UILogs: React.FC<UILogsProps> = ({ isActive, onComplete, projectId, uiId }) => {
//   const [logs, setLogs] = useState<string[]>([]);
//   const [isComplete, setIsComplete] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);

//   const hasRun = useRef(false);

//   const timestamp = (msg: string) => `[${new Date().toLocaleTimeString()}] ${msg}`;

//   useEffect(() => {
//     if (!isActive || hasRun.current) return;
//     hasRun.current = true;

//     const run = async () => {
//       const log = (msg: string) => setLogs(prev => [...prev, timestamp(msg)]);

//       try {
//         log(`🚀 Initializing API request for Project=${projectId}, UI=${uiId}...`);
//         await new Promise(r => setTimeout(r, 800));

//         log(`🔍 Fetching UI configuration [projectId=${projectId}]...`);
//         await new Promise(r => setTimeout(r, 800));

//         log(`⚙️ Processing UI schema for UI=${uiId}...`);
//         await new Promise(r => setTimeout(r, 800));

//         const response = await getUI(projectId, uiId);
//         log(`📡 API Response received`);

//         if (!response.success) {
//           log(`❌ API request failed: ${response.error}`);
//           setIsComplete(true);
//           onComplete?.(null);
//           return;
//         }

//         const ui = response.data?.data?.ui;
//         const dataKeys = Object.keys(response.data?.data?.data || {});

//         if (!ui) {
//           log("⚠️ No UI returned from API.");
//           setIsComplete(true);
//           onComplete?.(null);
//           return;
//         }

//         log(dataKeys.length ? `📝 Data Keys: ${dataKeys.join(", ")}` : "⚠️ No data returned");

//         log("✅ UI generation complete!");
//         setIsComplete(true);

//         setTimeout(() => {
//           const queryId = dataKeys[0];
//           onComplete?.({ ui, data: queryId ? response.data.data.data[queryId] : null });
//         }, 300);

//       } catch (e: any) {
//         log(`❌ Unexpected error: ${e?.message || e}`);
//         setIsComplete(true);
//         onComplete?.(null);
//       }
//     };

//     run();
//   }, [isActive, projectId, uiId, onComplete]);

//   return (
//     <MotionWrapper from="left" className="flex flex-col w-full text-sm text-gray-700 p-4 bg-gray-50 rounded-lg border mb-4">
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center gap-2">
//           <Icon icon={isComplete ? "ion:checkmark-done-circle" : "eos-icons:loading"} className={`${isComplete ? "text-green-500" : "text-indigo-500 animate-spin"}`} height={16} width={16} />
//           <span className="font-medium text-gray-800">{isComplete ? "UI Process Finished" : "Generating UI..."}</span>
//         </div>
//         <button onClick={() => setCollapsed(p => !p)} className="text-gray-600 hover:text-gray-900">
//           <Icon icon={collapsed ? "mdi:chevron-down" : "mdi:chevron-up"} height={20} width={20} />
//         </button>
//       </div>

//       {!collapsed && (
//         <div className="flex flex-col gap-2">
//           {logs.length === 0 && isActive && <div className="text-gray-500 italic">Waiting for logs</div>}
//           {logs.map((step, i) => (
//             <MotionWrapper key={i} from="bottom" delay={i * 0.1} className="flex items-center gap-3">
//               <Icon
//                 icon={step.includes("❌") || step.includes("⚠️") ? "mdi:alert-circle" : "ion:checkmark-circle"}
//                 className={step.includes("❌") || step.includes("⚠️") ? "text-red-500" : "text-green-500"}
//                 height={18}
//                 width={18}
//               />
//               <span className="text-gray-500">{step}</span>
//             </MotionWrapper>
//           ))}
//         </div>
//       )}
//     </MotionWrapper>
//   );
// };

// export default UILogs;
// UILogs.tsx



//  version 2

// import React, { useState, useRef, useEffect } from "react";
// import WebSocketClient from "./webSocket";
// import MotionWrapper from "./MotionWrapper";
// import { Icon } from "@iconify/react";

// interface UILogsProps {
//   isActive: boolean;
//   onComplete?: (uiData: any) => void;
//   projectId: string;
//   uiId: string;
//   ws: string;
// }

// const UILogs: React.FC<UILogsProps> = ({ isActive, onComplete, projectId, uiId, ws }) => {
//   const [logs, setLogs] = useState<string[]>([]);
//   const completedRef = useRef(false);
//   const timestamp = (m: string) => `[${new Date().toLocaleTimeString()}] ${m}`;

//   return (
//     <WebSocketClient url={ws}>
//       {({ messages, isConnected, sendMessage }) => (
//         <EffectBridge
//           isConnected={isConnected}
//           isActive={isActive}
//           messages={messages}
//           onSend={() => sendMessage(JSON.stringify({ projectId, uiId }))}
//           onLog={(s) => setLogs(p => [...p, timestamp(s)])}
//           onComplete={(ui, data) => {
//             if (!completedRef.current) {
//               completedRef.current = true;
//               setLogs(p => [...p, timestamp("✅ UI generation complete!")]);
//               onComplete?.({ ui, data });
//             }
//           }}
//         >
//           <UILogsDisplay logs={logs} />
//         </EffectBridge>
//       )}
//     </WebSocketClient>
//   );
// };

// // Handles effects like sending messages and processing logs
// function EffectBridge(props: {
//   isConnected: boolean;
//   isActive: boolean;
//   messages: string[];
//   onSend: () => void;
//   onLog: (msg: string) => void;
//   onComplete: (ui: any, data: any) => void;
//   children?: React.ReactNode;
// }) {
//   const sentRef = useRef(false);

//   useEffect(() => {
//     if (props.isConnected && props.isActive && !sentRef.current) {
//       sentRef.current = true;
//       props.onSend();
//     }
//   }, [props.isConnected, props.isActive, props.onSend]);

//   useEffect(() => {
//     for (const msgStr of props.messages) {
//       try {
//         const msg = JSON.parse(msgStr);
//         if (msg.type === "log") props.onLog(msg.message);
//         else if (msg.type === "error") props.onLog(`❌ ${msg.message}`);
//         else if (msg.type === "complete") props.onComplete(msg.ui, msg.data);
//       } catch {
//         // ignore non-JSON messages
//       }
//     }
//   }, [props.messages, props.onLog, props.onComplete]);

//   return <>{props.children}</>;
// }

// // UI Component to display logs
// function UILogsDisplay({ logs }: { logs: string[] }) {
//   return (
//     <MotionWrapper className="flex flex-col w-full text-sm text-gray-700 p-4 bg-gray-50 rounded-lg border mb-4">
//       <div className="flex flex-col gap-2">
//         {logs.length === 0 && <div className="text-gray-500 italic">Waiting for logs...</div>}
//         {logs.map((log, i) => (
//           <MotionWrapper key={i} from="bottom" delay={i * 0.05} className="flex items-center gap-2">
//             <Icon
//               icon={log.includes("❌") || log.includes("⚠️") ? "mdi:alert-circle" : "ion:checkmark-circle"}
//               className={log.includes("❌") || log.includes("⚠️") ? "text-red-500" : "text-green-500"}
//               height={18}
//               width={18}
//             />
//             <span className="text-gray-500">{log}</span>
//           </MotionWrapper>
//         ))}
//       </div>
//     </MotionWrapper>
//   );
// }

// export default UILogs;



//  version 3


import React, { useState, useEffect, useRef } from "react";
import { ProdWebSocketClient } from "./webSocket";
import type { ProdUIResponse } from "./webSocket";
import MotionWrapper from "./MotionWrapper";
import { Icon } from "@iconify/react";

interface UILogsProps {
  isActive?: boolean;
  onComplete?: (uiData: any) => void;
  projectId: string;
  uiId: string;
  wsUrl: string;
  requestId: string;
}

interface LogItem {
  message: string;
  time: string; // elapsed time in seconds
  realTime: any;
}

const UILogs: React.FC<UILogsProps> = ({
  isActive,
  onComplete,
  projectId,
  uiId,
  wsUrl,
  requestId,
}) => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const completedRef = useRef(false);
  const wsClientRef = useRef<ProdWebSocketClient | null>(null);

  useEffect(() => {
    if (!isActive) return;

    setLogs([]);
    completedRef.current = false;

    const startTime = Date.now();


    const log = (msg: string) => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      setLogs((prev) => [...prev, { message: msg, time: elapsed, realTime: startTime }]);
    };

    // Initialize WebSocket client
    const client = new ProdWebSocketClient(wsUrl, projectId);
    wsClientRef.current = client;

    // Listen for UI responses
    client.onProdUIResponse((res: ProdUIResponse) => {

      if (!res.data || res.data.length === 0 || res.data[0] === undefined) {
        log(`Unable to get Data for ${res.uiId} and ${projectId}`);
        console.log("cliks")
      } else {
        log(`UI received for ${res.uiId} and ${projectId}`);
      }
      
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.({ ui: res.data?.ui, data: res.data?.data });
      }
    });

    log(" Connecting to WebSocket...");
    log(` Looking for UI and Data in ${projectId} and ${uiId}`);

    client.connect(uiId, requestId);

    return () => {
      client.disconnect();
    };
  }, []);


  // Component to display logs with elapsed time on the right
  function UILogsDisplay({ logs }: { logs: LogItem[] }) {
    return (
      <div className="flex flex-col gap-2">
        {logs.length === 0 && <div className="text-gray-500 italic">Waiting for logs...</div>}
        {logs.map((log, i) => (
          <MotionWrapper
            key={i}
            from="bottom"
            delay={i * 0.05}
            className="flex justify-between items-center gap-2 overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <span >{new Date(log.realTime).toLocaleTimeString()}</span>
              <Icon
                icon={log.message.includes("❌") || log.message.includes("⚠️") ? "mdi:alert-circle" : "ion:checkmark-circle"}
                className={ log.message.includes("Unable") ? "text-red-500" : "text-green-500"}
                height={18}
                width={18}
              />

              <span className="text-gray-500">{log.message}</span>
            </div>
            <span className="text-gray-700 text-sm font-semibold">{log.time}s</span>
          </MotionWrapper>
        ))}
      </div>
    );
  }

  return (
    <MotionWrapper className="flex flex-col w-full text-sm text-gray-700 p-4 bg-gray-50 rounded-lg border mb-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon
            icon={collapsed ? "mdi:chevron-down" : "mdi:chevron-up"}
            className="text-gray-600 cursor-pointer"
            height={20}
            width={20}
            onClick={() => setCollapsed((p) => !p)}
          />
          <span className="font-medium text-gray-800 cursor-pointer" onClick={() => setCollapsed((p) => !p)}>
            {collapsed ? "Show Logs" : "Hide Logs"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Icon
            icon={completedRef.current ? "ion:checkmark-done-circle" : "eos-icons:loading"}
            className={`${completedRef.current ? "text-green-500" : "text-indigo-500 animate-spin"}`}
            height={16}
            width={16}
          />
          <span className="font-medium text-gray-800">
            {completedRef.current ? "UI Process Finished" : "Generating UI..."}
          </span>
        </div>
      </div>

      {!collapsed && <UILogsDisplay logs={logs} />}
    </MotionWrapper>
  );
};
export default React.memo(UILogs);
