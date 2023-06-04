import { PositionModel } from 'models/point';
import { useRef, useEffect, useCallback } from 'react';
import { useSocketService } from './useSocketService';

type Handler = (e: React.MouseEvent<EventTarget & HTMLElement>) => void;

const useDraggableElements = (): [PositionModel, Handler] => {
  const { position, updatePosition } = useSocketService();

  // マウスを押し込んだときのカーソルの座標
  const startPositionModel = useRef<PositionModel>({ x: 0, y: 0 });

  // 要素のドラッグ開始時の座標
  const prevTranslate = useRef<PositionModel>({ x: 0, y: 0 });

  // ドラッグしている要素
  const draggingElement = useRef<(EventTarget & HTMLElement) | null>(null);

  // 要素を押し込んだとき（mousedown）に実行する関数
  const handleDown = useCallback((e: React.MouseEvent<EventTarget & HTMLElement>): void => {
    draggingElement.current = e.currentTarget;

    const matrix = new DOMMatrix(getComputedStyle(draggingElement.current).transform);
    // mousedownが発火した時点のポジション
    prevTranslate.current = {
      x: matrix.translateSelf().e,
      y: matrix.translateSelf().f,
    };
    startPositionModel.current = { x: e.pageX, y: e.pageY };
  }, []);

  // 要素を押し込んだままマウスを動かしたとき（mousemove）に実行する関数
  const handleMove = (e: MouseEvent): void => {
    e.preventDefault();
    if (!draggingElement.current) return;

    const differenceX = e.pageX - startPositionModel.current.x;
    const differenceY = e.pageY - startPositionModel.current.y;

    // 要素をsocketを通じて更新する
    updatePosition({ x: prevTranslate.current.x + differenceX, y: prevTranslate.current.y + differenceY });
  };

  // 押し込みを止めたとき（mouseup）に実行する関数
  const handleUp = (): void => {
    if (!draggingElement.current) return;
    draggingElement.current = null;
  };

  // 要素を動かす
  useEffect(() => {
    if (!draggingElement.current) return;
    draggingElement.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
  }, [position]);

  // mousemove, mouseup, mouseleaveイベントが発生したときに実行されるようにする
  useEffect(() => {
    document.body.addEventListener('mousemove', handleMove);
    document.body.addEventListener('mouseup', handleUp);
    document.body.addEventListener('mouseleave', handleUp);

    return () => {
      document.body.removeEventListener('mousemove', handleMove);
      document.body.removeEventListener('mouseup', handleUp);
      document.body.removeEventListener('mouseleave', handleUp);
    };
  }, []);

  return [position, handleDown];
};

export default useDraggableElements;
