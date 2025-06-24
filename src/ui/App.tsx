import { useEffect } from 'react'
import { useGame } from '../hooks/useGame';
import { game } from '../core/engine';

function browserLoop(tick: (dt: number) => void) {
  let last = performance.now();
  const loop = () => {
    const now = performance.now();
    const delta = (now - last) / 1000;
    if (delta >= 1) { // 1 time a second
      last = now;
      tick(delta);
    }
    
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
  

export default function App() {
  useEffect(() => {
    game.start(browserLoop);
  }, []);
  
  const state = useGame();

  return (
    
    <div className="bg-zinc-900 text-gray-200 font-sans min-h-screen flex flex-col">
      {state.resources.gold.toFixed(0)}

      
    </div>
  )

}
