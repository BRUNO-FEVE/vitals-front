"use client";
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useQuiz } from "@/contexts/quiz-context";
import { motion } from "motion/react";

interface HeartbeatOxygenVitalsProps {
  index: number;
  socketUrl?: string; // WebSocket URL, defaults to ws://localhost:8080/heartbeat
}

interface HeartbeatData {
  batimento: string; // e.g., "72 bpm | 97.88 %"
}

export default function HeartbeatOxygenVitals({
  index,
  socketUrl = "ws://localhost:8081/heartbeat",
}: HeartbeatOxygenVitalsProps) {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [warning, setWarning] = useState(false);
  const [heartbeatData, setHeartbeatData] = useState<HeartbeatData | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const { next, currentIndex } = useQuiz();
  const isActive = currentIndex === index;
  const wsRef = useRef<WebSocket | null>(null);
  const hasReceivedData = useRef(false);
  const heartbeatDataRef = useRef<HeartbeatData | null>(null);

  console.log("HeartbeatOxygenVitals rendered with:", { index, isActive });

  useEffect(() => {
    if (!isActive) {
      setProgressPercentage(0);
      setHeartbeatData(null);
      hasReceivedData.current = false;

      // Close WebSocket if it exists
      if (wsRef.current) {
        wsRef.current.close(1000, "Component inactive");
        wsRef.current = null;
      }
      return;
    }

    // Create WebSocket connection
    console.log("Connecting to WebSocket:", socketUrl);
    const ws = new WebSocket(socketUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setWarning(false);
    };

    ws.onmessage = (event) => {
      try {
        const data: HeartbeatData = JSON.parse(event.data);
        console.log("Received heartbeat data:", data);

        setHeartbeatData(data);
        heartbeatDataRef.current = data;
        hasReceivedData.current = true;
        setWarning(false);

        // Close connection gracefully after receiving data
        setTimeout(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            console.log("Closing WebSocket gracefully after receiving data");
            wsRef.current.close(1000, "Data received successfully");
          }
        }, 500);
      } catch (error) {
        console.error("Error parsing heartbeat data:", error);
        setWarning(true);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWarning(true);
      setIsConnected(false);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      setIsConnected(false);

      console.log("hasReceivedData: ", hasReceivedData.current);
      console.log("code: ", event.code);
      console.log("data: ", heartbeatDataRef.current);

      // If we received data, proceed to next step
      if (
        hasReceivedData.current &&
        event.code === 1000 &&
        heartbeatDataRef.current
      ) {
        setTimeout(() => {
          next(heartbeatDataRef.current!.batimento);
        }, 1000);
      }
    };

    // Progress bar animation
    const totalDuration = 15_000; // 10 seconds
    const tickInterval = 100; // update every 100ms for smoother animation
    const totalTicks = totalDuration / tickInterval;
    let tick = 0;

    const progressInterval = setInterval(() => {
      // If we received data, speed up to 100%
      if (hasReceivedData.current) {
        setProgressPercentage(100);
        clearInterval(progressInterval);
        return;
      }

      tick += 1;
      setProgressPercentage((tick / totalTicks) * 100);

      // Timeout after 10 seconds if no data received
      if (tick >= totalTicks) {
        clearInterval(progressInterval);
        setWarning(true);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close(1000, "Timeout");
        }
      }
    }, tickInterval);

    // Cleanup function
    return () => {
      clearInterval(progressInterval);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "Component unmounting");
      }
    };
  }, [next, isActive, socketUrl]);

  return (
    <div className="w-full h-full flex flex-row">
      <div
        className="pl-[100.5px] flex-grow mt-7 bg-contain bg-start bg-no-repeat"
        style={{ backgroundImage: `url(/heart-beat.png)` }}
      >
        {/* <h1
          className={cn(
            warning ? "text-brand-accent" : "text-transparent hidden",
            "font-mono text-sm pl-3 pb-3"
          )}
        >
          SENSOR PERDEU SINAL, POR FAVOR SE AJUSTE NA <br /> CADEIRA OU CHAME A
          INFERMEIRA
        </h1> */}

        <p className="font-mono text-xs pl-5 py-5">
          Por favor, aguarde{" "}
          <span className="font-bold text-brand-accent">parado</span> enquanto
          realizamos a medição...
        </p>

        {/* Connection status indicator */}
        <div className="pl-5 py-2 font-mono text-xs">
          <span
            className={cn(
              isConnected ? "text-green-600" : "text-gray-400",
              "font-bold"
            )}
          >
            {isConnected ? "● CONECTADO" : "○ AGUARDANDO CONEXÃO"}
          </span>
          {heartbeatData && (
            <span className="ml-4 text-brand-accent font-bold">
              {heartbeatData.batimento}
            </span>
          )}
        </div>

        <div
          className={cn(
            warning ? "border-brand-accent" : "border-black",
            "h-[90px] w-full bg-white border border-l-0"
          )}
        >
          <motion.div
            className={cn(
              warning ? "bg-brand-accent" : "bg-black",
              "h-full border-l-0"
            )}
            initial={{ width: "0", opacity: 0 }}
            animate={{ width: `${progressPercentage}%`, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>
        <h1 className="font-bold text-3xl pl-5 pt-3">
          Monitorando Batimentos e Oxigenação
        </h1>
      </div>
      {/* <EmergencyButton /> */}
    </div>
  );
}
