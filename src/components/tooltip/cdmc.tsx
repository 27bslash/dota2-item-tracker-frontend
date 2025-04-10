type CdMcProps = {
  mana_costs?: number | number[];
  cooldowns?: number | number[];
};
const CdMc = ({ mana_costs, cooldowns }: CdMcProps) => {
  return (
    <>
      {mana_costs && (
        <div className="mana-costs flex" style={{ alignItems: "center" }}>
          <img
            alt="mana"
            className="tooltip-footer-img"
            src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/tooltips/mana.png"
          ></img>
          <p className="footer-text">
            {typeof mana_costs === "number" ? mana_costs : mana_costs.join("/")}
          </p>
        </div>
      )}
      {cooldowns && (
        <div className="cooldowns flex" style={{ alignItems: "center" }}>
          <img
            className="tooltip-footer-img"
            alt="cd"
            src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/tooltips/cooldown.png"
          ></img>
          <p className="footer-text">
            {typeof cooldowns === "number" ? cooldowns : cooldowns.join("/")}
          </p>
        </div>
      )}
    </>
  );
};
export default CdMc;
