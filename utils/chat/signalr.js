import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ApiBaseURL, ChatHubPath } from "@/utils/URL";

let connection = null;
let activeToken = null;

export function getChatHubUrl() {
  if (typeof window !== "undefined") {
    return ChatHubPath;
  }
  return `${ApiBaseURL}${ChatHubPath}`;
}

export function getConnection(token) {
  if (!token) {
    throw new Error("Chat token is required");
  }

  if (connection && activeToken === token) {
    return connection;
  }

  if (connection) {
    void connection.stop();
    connection = null;
    activeToken = null;
  }

  activeToken = token;
  connection = new HubConnectionBuilder()
    .withUrl(getChatHubUrl(), {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(LogLevel.Information)
    .build();

  return connection;
}

export async function startConnection(token) {
  const conn = getConnection(token);

  if (conn.state === "Disconnecting") {
    try {
      await conn.stop();
    } catch {
      // Ignore teardown races from React Strict Mode remounts.
    }
  }

  if (conn.state === "Disconnected") {
    await conn.start();
  }

  return conn;
}

export async function stopConnection() {
  if (connection) {
    try {
      await connection.stop();
    } catch {
      // Ignore stop errors during component unmount.
    }
    connection = null;
    activeToken = null;
  }
}
