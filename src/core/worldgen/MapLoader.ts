import fs from "fs";
import type {Settlement, TerrainType, Tile, WorldMap} from "@/shared/types/world.types.ts";
import Grid from "@/core/worldgen/Grid.ts";

export default class MapLoader {
    public loadFromFiles(): void {
        const settlementsFileContent = fs.readFileSync("settlements.json");
        const settlementsRaw = JSON.parse(settlementsFileContent, 'utf8');

        const map: WorldMap = {
            width: 10,
            height: 10,
            settlements: [],
            grid: new Grid([])
        }



        settlementsRaw.forEach((settlementRaw) => {
            map.settlements.push({
                id: settlementRaw.id,
                name: settlementRaw.name,

            } as Settlement);
        })
        console.log(settlementsRaw);
        // fs.writeFileSync("map.json", JSON.stringify(worldMap.grid.toStorableForm()));
    }

    private loadGrid() {
        const gridFileContent = fs.readFileSync("map.json");
        const gridRaw = JSON.parse(gridFileContent, 'utf8');

        const tiles: Tile[][] = [];

        gridRaw.forEach((columnData: any) => {
            const column: Tile[] = []
            columnData.forEach((tileRaw: any) => {
                column.push({
                    x: tileRaw.x,
                    y: tileRaw.y,
                    isRoad: tileRaw.isRoad,
                    isRiver: tileRaw.isRiver,
                    riverId: tileRaw.riverId,
                    isLake: tileRaw.isLake,
                    terrain: tileRaw.terrain,
                    elevation: tileRaw.elevation,
                    temperature: tileRaw.temperature,
                    moisture: tileRaw.moisture,
                    settlement: tileRaw.settlement ?;
                    territoryOf: Settlement | null
                } as Tile);
            });

            tiles.push(column);
        })
    }
}