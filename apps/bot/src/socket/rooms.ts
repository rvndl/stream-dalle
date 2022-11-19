import { Socket } from "socket.io";

export const joinRooms = (socket: Socket) => {
  const match = socket.request.url?.match(/channel=([^&]*)/);
  if (!match) {
    return;
  }

  const hashedChannel = ("#" + match[1]).toLowerCase();

  socket.join(hashedChannel);
  console.log("sio: Joined room", hashedChannel);
};
