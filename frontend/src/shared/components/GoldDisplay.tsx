interface GoldDisplayProps {
  copper: number;
  className?: string;
}

export function GoldDisplay({ copper, className }: GoldDisplayProps) {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const c = copper % 100;

  return (
    <span className={className}>
      {gold > 0 && <span className="text-yellow-400">{gold}金</span>}
      {silver > 0 && <span className="text-gray-300">{silver}银</span>}
      {c > 0 && <span className="text-amber-600">{c}铜</span>}
      {copper === 0 && <span className="text-muted-foreground">0</span>}
    </span>
  );
}
