import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export const NeutralTooltipPalette = () => {
  const tierBackgroundColours = [
    "hsl(200,3%,41%)",
    "#517A50",
    "#485688",
    "#714B88",
    "#F5DFA6",
  ];
  //   tier 4 C783E8;
  const tierTextColours = [
    "hsl(0,0%,75%)",
    "hsl(108, 65%, 70%)",
    "hsl(230, 95%, 75%)",
    "hsl(281, 100%, 74%)",
    "hsl(43,100%,79%)",
  ];
  {
    const itemProperties = {
      attrib: [],
      cd: [15],
      cost: 0,
      dname: "Tumbler's Toy",
      hint: [
        "<h1>Active: Vault</h1>-- Propels your hero forward 300 units. Tumbler's Toy gets disabled for 3 seconds if its owner receives damage from a player source.",
      ],
      id: 840,
      lore: "An antique plaything found in the ruins of an Ozenja circus bazaar.",
      mc: false,
      notes: "",
      tier: 2,
    };
    const img =
      "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/pogo_stick.png";
    return (
      <>
        {[1, 2, 3, 4, 5].map((tier) => {
          console.log(tier);
          return (
            <div className="tooltip" style={{ left: `${tier * 300}px` }}>
              <div
                className="tooltip-line-one item-tooltip-line-one"
                style={{
                  background: `linear-gradient(to right, ${
                    tierBackgroundColours[tier - 1]
                  }, #11171c)`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    backgroundImage:
                      'url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/facets/ripple_texture.png")',
                    backgroundSize: "cover",
                    height: "100%",
                    width: "97%",
                    position: "absolute",
                    opacity: 0.1,
                  }}
                ></div>
                <img
                  className="tooltip-img"
                  alt={img}
                  src={img}
                  width="75px"
                  style={{ marginRight: "10px" }}
                ></img>
                <div className="item-tooltip-title">
                  <h3>{itemProperties.dname}</h3>
                  {!!itemProperties.cost && itemProperties.cost > 0 && (
                    <div className="cost-wrapper">
                      <img
                        alt="gold"
                        className="gold-img"
                        src="https://steamcdn-a.akamaihd.net/apps/dota2/images/tooltips/gold.png"
                        style={{ marginRight: "5px" }}
                      ></img>
                      <h4>{itemProperties.cost}</h4>
                    </div>
                  )}
                  {!!itemProperties["tier"] && (
                    <Typography
                      fontWeight={600}
                      color={tierTextColours[tier - 1]}
                      sx={{ textShadow: "1px 1px black" }}
                    >
                      Tier {tier}
                      <span
                        style={{
                          color: grey[500],
                          fontWeight: "600",
                          marginLeft: "5px",
                        }}
                      >
                        Artifact
                      </span>
                    </Typography>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }
};
