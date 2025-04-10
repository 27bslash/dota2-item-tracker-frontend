import { HeroStats } from "../../types/heroData";

type HeroAttributesProps = {
  heroData: HeroStats;
  stat: string;
  stats: string[];
};

const HeroAttributes = ({ stats, stat, heroData }: HeroAttributesProps) => {
  let baseLink = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero`;
  if (stat === "stat") {
    baseLink = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react//heroes/stats/icon`;
  }
  type Attribute = "str" | "agi" | "int";
  type AttrKey = Extract<keyof HeroStats, `${Attribute}_${"base" | "gain"}`>;

  return (
    <div className={`hero-${stat}`}>
      {stats.map((attr: string, i: number) => {
        const link = `${baseLink}_${attr}.png`;

        if (stat === "attr") {
          const attribute = attr.substring(0, 3) as Attribute;
          const base = heroData[`${attribute}_base` as AttrKey];
          const gain = heroData[`${attribute}_gain` as AttrKey];

          return (
            <div className="attribute-wrapper" key={i}>
              <img src={link} className="attr-img" />
              <p className="base-attr">{base}</p>
              <p className="attr-gain">+{gain}</p>
            </div>
          );
        }

        return (
          <div className="stat-wrapper" key={i}>
            <img src={link} className="stat-img" />
            <HeroStat heroData={heroData} stat={attr} />
          </div>
        );
      })}
    </div>
  );
};
type HeroStatProps = {
  stat: string;
  heroData: HeroStats;
};
const HeroStat = ({ stat, heroData }: HeroStatProps) => {
  const stati =
    stat === "damage"
      ? `${heroData[`${stat}_min`]}-${heroData[`${stat}_max`]}`
      : parseInt(heroData[stat as keyof HeroStats] as string);
  return <p>{stati}</p>;
};
export default HeroAttributes;
