const RACE_ICON_MAP: Record<number, { male: string; female: string }> = {
  1: { male: 'Ui-charactercreate-races_human-male.png', female: 'Ui-charactercreate-races_human-female.png' },
  2: { male: 'Ui-charactercreate-races_orc-male.png', female: 'Ui-charactercreate-races_orc-female.png' },
  3: { male: 'Ui-charactercreate-races_dwarf-male.png', female: 'Ui-charactercreate-races_dwarf-female.png' },
  4: { male: 'Ui-charactercreate-races_nightelf-male.png', female: 'Ui-charactercreate-races_nightelf-female.png' },
  5: { male: 'Ui-charactercreate-races_undead-male.png', female: 'Ui-charactercreate-races_undead-female.png' },
  6: { male: 'Ui-charactercreate-races_tauren-male.png', female: 'Ui-charactercreate-races_tauren-female.png' },
  7: { male: 'Ui-charactercreate-races_gnome-male.png', female: 'Ui-charactercreate-races_gnome-female.png' },
  8: { male: 'Ui-charactercreate-races_troll-male.png', female: 'Ui-charactercreate-races_troll-female.png' },
  9: { male: 'Ui-charactercreate-races_goblin-male.png', female: 'Ui-charactercreate-races_goblin-female.png' },
  10: { male: 'Ui-charactercreate-races_bloodelf-male.png', female: 'Ui-charactercreate-races_bloodelf-female.png' },
  11: { male: 'Ui-charactercreate-races_draenei-male.png', female: 'Ui-charactercreate-races_draenei-female.png' },
  22: { male: 'Ui-charactercreate-races_worgen-male.png', female: 'Ui-charactercreate-races_worgen-female.png' },
  24: { male: 'Ui-charactercreate-races_pandaren-male.png', female: 'Ui-charactercreate-races_pandaren-female.png' },
};

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
  const raceData = RACE_ICON_MAP[race];
  if (!raceData) return null;

  const iconName = gender === 1 ? raceData.female : raceData.male;
  const iconPath = `/assets/icons/race/${iconName}`;

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
