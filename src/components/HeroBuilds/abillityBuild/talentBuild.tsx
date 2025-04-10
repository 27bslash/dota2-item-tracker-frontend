import TalentImg from "../../table/talentImg";
import TalentTooltip from "../../tooltip/talentTooltip";
import Tip from "../../tooltip/tooltip";
import { Box, Typography } from "@mui/material";
import { usePageContext } from "../../stat_page/pageContext";
import { Talent } from "../builds/buildCell";
import { PageHeroData } from "../../types/heroData";
import { HeroAbility } from "../../types/matchData";

export const TalentBuild = (props: {
  data: [string, Talent][];
  heroData: PageHeroData;
  numbered?: boolean;
}) => {
  const { heroData, nameParam } = usePageContext();
  const heroTalents = heroData[nameParam]["talents"];
  const visitedTalents: HeroAbility[][] = [];
  const s = new Set<string>();
  for (const talent of props.data) {
    const t = [];
    const talentKey = talent[0];
    if (!s.has(talentKey)) {
      s.add(talentKey);
      const newA = Array.from(s);
      for (const _id of newA) {
        const f = props.data.filter((x) => _id === x[0]);
        const o = { img: f[0][0], key: f[0][0], type: "talent", ...f[0][1] };
        o.id = String(o.id) as string;
        t.push(o);
      }
    }
    visitedTalents.push(t);
  }
  const height = props.numbered ? "83px" : "54.45px";
  return (
    <div className="flex" style={{ height: height }}>
      {props.data.map((talentObj, i) => {
        const talentId = talentObj[1]["id"];
        const talentDetails = heroTalents[talentId];
        if (talentDetails) {
          const talentName = talentDetails["name_loc"];
          return (
            <Box key={i} padding={0.5}>
              <Typography color="white" align="center">
                {talentObj[1]["level"]}
              </Typography>

              <Tip component={<TalentTooltip talent={{ key: talentName }} />}>
                <TalentImg
                  talents={visitedTalents}
                  width="65px"
                  ability={talentDetails}
                ></TalentImg>
              </Tip>
              <Typography color="white" align="center">
                {talentObj[1]["perc"]}%
              </Typography>
            </Box>
          );
        }
      })}
    </div>
  );
};
