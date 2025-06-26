import { useGameState } from "../hooks/useGame";

type SidebarProps = {
  onSelect: (section:  string ) => void;
};

export default function Sidebar({ onSelect }: SidebarProps) {
    const gameState = useGameState();

    // let buildings;
    const buildings = Object.keys(gameState.buildings).map(objectKey => {
        const buildingData = gameState.buildings[objectKey];
        return (

        <button
        onClick={() => onSelect(buildingData.id)}
        className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 transition"
      >
        {buildingData.name}
      </button>
        )
    })
  return (
    <nav className="flex flex-col gap-4">
   
      <button
        onClick={() => onSelect('warmstone')}
        className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 transition"
      >
        Warmstone
      </button>
      {buildings}
    </nav>
  );
}