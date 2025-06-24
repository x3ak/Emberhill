interface ResourceDisplayProps {
    name: string;
    amount: number;
}

export default function ResourceDisplay ({name, amount}: ResourceDisplayProps) {
    return (
        <div><span className="font-bold text-yellow-400">{name}:</span> {amount.toFixed(0)}</div>
    )
}