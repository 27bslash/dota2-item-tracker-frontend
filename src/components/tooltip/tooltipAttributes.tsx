import { Box, Typography } from "@mui/material";
import { damageType } from "./abilityAttributes";

const TooltipAttributes = (props: any) => {
  return (
    <div className="attributes">
      {props.itemProperties.attrib &&
        props.itemProperties.attrib.map(
          (
            x: {
              key: string;
              value: string;
              footer: string;
              header: string;
            },
            i: number
          ) => {
            const attribName = x.footer
              ? x.footer
              : x.header.replace(/[+-]/g, (m) => (m === "_" ? " " : ""));
            const headerSymbol = x.header.replace(/[^+-]/g, "").trim();
            const value =
              x.value.split(" ").join(" / ") +
              (attribName.match("%") ? "%" : "");
            return (
              <Box display={"flex"} key={i}>
                <Typography className="attribute">
                  {headerSymbol}
                  <strong>
                    <span className="tooltip-text-highlight">{value}</span>
                  </strong>
                </Typography>
                <Typography marginLeft={"4px"}>
                  {attribName.replace("%", "")}
                </Typography>
              </Box>
            );
          }
        )}
      {props.itemProperties.special_values && (
        <>
          {props.itemProperties.special_values.map((x: any, i: number) => {
            const ob = props.type === "facet" ? x["facet_bonus"] : x;
            const heading = x.heading_loc;
            const percentage = x.is_percentage;
            const values = props.type === "facet" ? ob.values : ob.values_float;
            let value;
            const zeroCheck = values.some((x: any) => x != 0);
            if (percentage) {
              value = values.join("% / ") + "%";
            } else {
              value = values.join(" / ");
            }
            if (
              heading &&
              heading.toLowerCase().includes("damage") &&
              zeroCheck
            ) {
              const dmgtype = damageType(props.itemProperties.damage);
              if (dmgtype) {
                return (
                  <AbilityAttribute
                    heading={heading}
                    color={dmgtype[1]}
                    value={value}
                    key={i}
                  />
                );
              } else {
                return (
                  <AbilityAttribute
                    heading={heading}
                    color="#b1bbc9"
                    value={value}
                    key={i}
                  />
                );
              }
            } else if (heading && zeroCheck) {
              return (
                <AbilityAttribute
                  heading={heading}
                  color="#b1bbc9"
                  value={value}
                  key={i}
                />
              );
            }
          })}
        </>
      )}
    </div>
  );
};
export const AbilityAttribute = (props: {
  heading: string;
  color: string;
  value: string;
}) => {
  const { heading, color, value } = props;
  return (
    <p className="attribute">
      {heading}
      <strong>
        <span
          className="tooltip-text-highlight"
          style={{
            color: color,
            textTransform: "capitalize",
            marginLeft: "5px",
          }}
        >
          {value}
        </span>
      </strong>
    </p>
  );
};
export default TooltipAttributes;
