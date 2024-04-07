import useWebSocket from "react-use-websocket";
import { throttle } from "lodash";
import { useEffect, useRef } from "react";
import { Cursor } from "./Cursor";

const WS_URL = "ws://127.0.0.1:3001";
const THROTTLE = 50;

const renderCursors = (users: any) => {
  return Object.keys(users).map((userId) => {
    const user = users[userId];
    return <Cursor key={userId} point={[user.state.x, user.state.y]} />;
  });
};

const renderUsersList = (users: any) => {
  return (
    <ul>
      {Object.keys(users).map((uuid) => {
        return <li key={uuid}>{JSON.stringify(users[uuid])}</li>;
      })}
    </ul>
  );
};

export function Home({ username }: { username: string }) {
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });

  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

  useEffect(() => {
    sendJsonMessage({ x: 0, y: 0 });
    window.addEventListener("mousemove", (e) => {
      sendJsonMessageThrottled.current({ x: e.clientX, y: e.clientY });
    });
  }, []);

  if (lastJsonMessage) {
    return (
      <>
        {renderUsersList(lastJsonMessage)}
        {renderCursors(lastJsonMessage)}
      </>
    );
  }
  return null;
}
