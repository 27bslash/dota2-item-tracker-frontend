import { Box, Typography, useTheme } from "@mui/material";
import { usePageContext } from "../../../stat_page/pageContext";
import { buildSixItemSummary } from "./buildSixItemSummary";
import { groupSixItems } from "./groupSixItems";
import ItemCard from "./ItemCard";
import { HeroBuild } from "../../buildHooks/buildTypes";

type SixItemBuildProps = {
  data: HeroBuild["item_builds"];
};

const SixItemBuild = ({ data }: SixItemBuildProps) => {
  const theme = useTheme();
  const { itemData } = usePageContext();
  const items = buildSixItemSummary(data, itemData);

  if (items.length < 3) return null;

  const groups = groupSixItems(items, itemData!);

  return (
    <div style={{ marginTop: "16px" }}>
      <Typography
        variant="h6"
        className="build-header"
        sx={{ textAlign: "center" }}
      >
        Build Summary
      </Typography>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          alignItems: "flex-start",
        }}
      >
        {groups.map((group, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            {group.type === "always" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  background: "rgba(116, 255, 2, 0.13)",
                  border: "1px solid rgba(116, 255, 2, 0.58)",
                  borderRadius: "6px",
                  backdropFilter: "blur(8px)",
                  filter: "lightness(0.5)",
                  padding: "6px 8px",
                }}
              >
                <Typography
                  color="green.400"
                  style={{
                    lineHeight: 1,
                    fontSize: "0.7rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  CORE
                </Typography>
                <ItemCard item={group.item} />
              </div>
            ) : (
              <Box
                position={"relative"}
                sx={{ borderRadius: "6px", overflow: "hidden" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    padding: "6px 8px",
                    position: "relative",
                    zIndex: 1, // Ensures content stays above the pseudo-element
                    border: "1px solid rgb(0, 0, 0)",
                    borderRadius: "6px",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: theme.palette.primary.main,
                      //   filter: "light(0.7)", // Your saturation modifier
                      filter: "brightness(0.7)", // Your existing brightness filter
                      zIndex: -1, // Places the filtered background behind the content
                    },
                  }}
                >
                  <Typography
                    style={{
                      lineHeight: 1,
                      fontSize: "0.7rem",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {group.items.length === 1
                      ? "optional"
                      : `choose ${group.chooseN} of`}
                  </Typography>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {group.items.map((item) => (
                      <ItemCard key={item.key} item={item} dimmed />
                    ))}
                  </div>
                </Box>
              </Box>
            )}

            {i < groups.length - 1 && (
              <Typography
                color="grey.600"
                style={{
                  fontSize: "1.4rem",
                  lineHeight: 1,
                  alignSelf: "flex-start",
                  marginTop: "18px",
                }}
              >
                →
              </Typography>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SixItemBuild;
