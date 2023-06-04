import useDraggableElements from 'hooks/useDraggableElements';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

const App: React.FC = () => {
  const [pointPorision, handleDown] = useDraggableElements();
  return (
    <div className="w-screen h-screen">
      <BrowserRouter>
        <div>
          <div
            className="w-10 h-10 rounded-full shadow-xl bg-orange-400"
            onMouseDown={handleDown}
            style={{ transform: `matrix(1,0,0,1, ${pointPorision.x}, ${pointPorision.y})` }}
          />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
