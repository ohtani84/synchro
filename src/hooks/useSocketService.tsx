import { SOCKET_URL } from 'config/default';
import { PositionModel } from 'models/point';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocketService = () => {
  const [position, setPosition] = useState<PositionModel>({ x: 0, y: 0 });
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('sendDataFromServer', (receivedUserSocket: PositionModel) => {
      setPosition(receivedUserSocket);
    });
  }, []);

  // キーが押下されたときにログインしているユーザーのアバターの位置情報を更新する
  const updatePosition = (newPosition: { x: number; y: number }): void => {
    if (socketRef.current) {
      socketRef.current.emit('sendDataFromClient', {
        x: newPosition.x,
        y: newPosition.y,
      });
    }
  };

  return { position, updatePosition };
};
