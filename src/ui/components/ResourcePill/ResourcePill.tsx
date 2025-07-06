import type {ResourceData} from "@/shared/types/resource.types.ts";

export default function ResourcePill({resourceData}: {resourceData: ResourceData}) {
    return (
        <span>{resourceData.name}</span>
    )
}