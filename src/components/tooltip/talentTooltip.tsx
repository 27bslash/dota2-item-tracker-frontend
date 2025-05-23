import empty_talent from "../../images/empty_talent.png";

const TalentTooltip = (props: { talent: { key: string } }) => {
  // console.log(empty_talent)
  return (
    <div {...props} className="tooltip" id="talent-tooltip">
      <div className="tooltip-line-one">
        <div className="tooltip-title">
          <img
            alt="talent-img"
            className="tooltip-img"
            src={empty_talent}
            width="55px"
          ></img>
          <h3>{props.talent.key}</h3>
        </div>
      </div>
    </div>
  );
};

export default TalentTooltip;
