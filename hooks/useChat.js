import { useCallback, useEffect, useRef, useState } from "react";
import { startConnection, stopConnection } from "@/utils/chat/signalr";

export function useChat({
  token,
  onReceiveMessage,
  onMessageSeen,
}) {
  const connectionRef = useRef(null);
  const optionsRef = useRef({ onReceiveMessage, onMessageSeen });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  optionsRef.current = { onReceiveMessage, onMessageSeen };

  useEffect(() => {
    if (!token) {
      setIsConnected(false);
      setError(null);
      return undefined;
    }

    let cancelled = false;

    (async () => {
      try {
        const conn = await startConnection(token);
        if (cancelled) return;

        connectionRef.current = conn;

        conn.off("ReceiveMessage");
        conn.off("MessageSeen");

        conn.on("ReceiveMessage", (message) => {
          optionsRef.current.onReceiveMessage?.(message);
        });

        conn.on("MessageSeen", (messageId) => {
          optionsRef.current.onMessageSeen?.(messageId);
        });

        conn.onreconnected(() => {
          if (!cancelled) {
            setIsConnected(true);
            setError(null);
          }
        });

        conn.onclose(() => {
          if (!cancelled) setIsConnected(false);
        });

        setIsConnected(true);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setIsConnected(false);
          setError(err instanceof Error ? err.message : "اتصال به چت برقرار نشد");
        }
      }
    })();

    return () => {
      cancelled = true;
      connectionRef.current = null;
      void stopConnection();
      setIsConnected(false);
    };
  }, [token]);

  const sendMessage = useCallback(async (receiverId, content) => {
    const conn = connectionRef.current;
    if (!conn) throw new Error("SignalR not connected");

    await conn.invoke("SendMessage", receiverId, content);
  }, []);

  const markAsSeen = useCallback(async (messageId) => {
    const conn = connectionRef.current;
    if (!conn) throw new Error("SignalR not connected");

    await conn.invoke("MarkAsSeen", messageId);
  }, []);

  return { isConnected, error, sendMessage, markAsSeen };
}
