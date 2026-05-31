interface GoldDisplayProps {
  copper: number;
  className?: string;
}

export function GoldDisplay({ copper, className }: GoldDisplayProps) {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const c = copper % 100;

  return (
    <span className={`inline-flex items-center gap-0.5 ${className || ''}`}>
      {gold > 0 && (
        <>
          <span>{gold}</span>
          <img src="/assets/icons/money-gold.gif" width={13} height={13} alt="" className="inline-block" />
        </>
      )}
      {silver > 0 && (
        <>
          <span>{silver}</span>
          <img src="/assets/icons/money-silver.gif" width={13} height={13} alt="" className="inline-block" />
        </>
      )}
      {c > 0 && (
        <>
          <span>{c}</span>
          <img src="/assets/icons/money-copper.gif" width={13} height={13} alt="" className="inline-block" />
        </>
      )}
      {copper === 0 && <span className="text-muted-foreground">0</span>}
    </span>
  );
}
