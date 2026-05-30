interface RaceIconProps {
  race: number;
  gender: number;
  size?: number;
}

interface ClassIconProps {
  class: number;
  size?: number;
}

export function RaceIcon({ race, gender, size = 24 }: RaceIconProps) {
  const iconPath = `/assets/icons/race/${race}-${gender}.png`;
  return (
    <img
      src={iconPath}
      width={size}
      height={size}
      alt=""
      className="inline-block"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}

export function ClassIcon({ class: classId, size = 24 }: ClassIconProps) {
  const iconPath = `/assets/icons/class/hd${classId}.png`;
  return (
    <img
      src={iconPath}
      width={size}
      height={size}
      alt=""
      className="inline-block"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}
