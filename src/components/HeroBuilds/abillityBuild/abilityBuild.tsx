import { Box, Button, Typography } from "@mui/material";
import { MatchDataAdj } from "../../stat_page/page";
import { TalentBuild } from "./talentBuild";
import { useState } from "react";
import { AbilityImg } from "../../table/tableAbilities/abilityImg";
import { AbilityBuildEntry, Talent } from "../builds/buildCell";
import { usePageContext } from "../../stat_page/pageContext";
import DotaMatch from "../../types/matchData";
import {  PageHeroData } from "../../types/heroData";

interface AbilityBuildProps extends MatchDataAdj {
  abilityBuilds: {
    ability_builds: AbilityBuildEntry[];
    talents: [string, Talent][];
    length?: number;
  };
  data?: DotaMatch[];
}
const AbilityBuilds = ({ abilityBuilds, data }: AbilityBuildProps) => {
  const imageHost = "https://ailhumfakp.cloudimg.io/v7/";
  // const secAbilities = abilityFilter(data, fistAB)
  // console.log(abilities)
  const [debug, setShowDebug] = useState(false);
  const { heroData, nameParam } = usePageContext();
  const DEBUG = process.env.NODE_ENV !== "production";

  return (
    <Box
      justifyContent="space-between"
      padding={4}
      className="ability-builds flex"
    >
      {/* <div className='ability-build flex'>
                {abilities[1].map((ability: {}, i: number) => {
                    const key = Object.keys(ability)[0]
                    const link = `${imageHost}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${key}.png`
                    return (
                        <AbilityImg link={link} imgWidth={55} ability={ability} heroData={heroData} heroName={nameParam} key={i} />)
                })}
                <BigTalent matchData={data} heroName={nameParam} heroData={heroData} width='65px' margin='-5px 0px 0px 0px' />
            </div> */}
      <div className="ability-build">
        <Typography
          color="white"
          align="center"
          alignItems={"center"}
          variant="h4"
        >
          Abilities
        </Typography>
        {abilityBuilds["ability_builds"].map((abilityArr, i) => {
          const debugMargin = i === 0 ? "20px" : "0px";
          return (
            <div
              style={{
                alignItems: "center",
                paddingBottom: "5px",
              }}
              key={i}
            >
              <div
                className="ability-build flex"
                style={{ alignItems: "center" }}
              >
                <AbilityBuild
                  abilityArr={abilityArr[0]}
                  imageHost={imageHost}
                  heroData={heroData}
                  heroName={nameParam}
                  i={i}
                ></AbilityBuild>
                {/* <BigTalent matchData={data} heroName={nameParam} heroData={heroData} width='65px' margin='-5px 0px 0px 0px' updateMatchData={updateMatchData} />  */}
                <Typography
                  style={{
                    marginTop: debugMargin,
                    color: "white",
                    marginLeft: "6px",
                  }}
                >
                  {DEBUG ? abilityArr[1] : ""}{" "}
                  {(
                    (abilityArr[1] /
                      (data ? data.length : abilityBuilds["length"]!)) *
                    100
                  ).toFixed(2)}
                  %
                </Typography>
                {DEBUG && (
                  <Button
                    sx={{ marginTop: debugMargin }}
                    onClick={() => setShowDebug((prev) => !prev)}
                  >
                    debug
                  </Button>
                )}
              </div>
              {DEBUG && debug && abilityArr[2] && (
                <div className="debug-builds">
                  {abilityArr[2].map((debugAbArr, k: number) => {
                    return (
                      <div key={k} className="flex">
                        <AbilityBuild
                          abilityArr={debugAbArr[0]}
                          imageHost={imageHost}
                          heroData={heroData}
                          heroName={nameParam}
                          i={1}
                        ></AbilityBuild>
                        <Typography
                          style={{
                            color: "white",
                            marginLeft: "6px",
                          }}
                        >
                          {debugAbArr[1]}{" "}
                          {((debugAbArr[1] / abilityArr[1]) * 100).toFixed(2)}%
                        </Typography>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="talent-build">
        <Typography variant="h4" color="white" align="center">
          Talents
        </Typography>
        <TalentBuild
          data={abilityBuilds["talents"]}
          heroData={heroData}
          numbered={true}
        ></TalentBuild>
      </div>
    </Box>
  );
};
type AbilitBuildProps = {
  abilityArr: string;
  imageHost: string;
  heroData: PageHeroData;
  heroName: string;
  i: number;
};
const AbilityBuild = ({ abilityArr, imageHost, i }: AbilitBuildProps) => {
    const { heroData, nameParam } = usePageContext();
  return (
    <>
      {abilityArr.split("__").map((ability: string, idx: number) => {
        const link = `${imageHost}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`;
        let simpleAbility;
        for (const key of Object.keys(heroData[nameParam].abilities)) {
          if (ability === heroData[nameParam].abilities[key]["name"]) {
            const heroAbility = heroData[nameParam].abilities[key];
            simpleAbility = {
              id: key,
              img: link,
              key: heroAbility.name_loc,
              level: 1,
              type: "ability",
            };
          }
        }
        return (
          <div key={idx}>
            {i === 0 && (
              <Typography align="center" color={"white"}>
                {idx + 1}
              </Typography>
            )}
            <AbilityImg link={link} imgWidth={55} ability={simpleAbility!} key={idx} />
          </div>
        );
      })}
    </>
  );
};
export default AbilityBuilds;
