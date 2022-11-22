const CdMc = (props: any) => {

    return (
        <>
            {props.mana_costs &&
                <div className="mana-costs flex">
                    <img alt='mana' className="tooltip-footer-img" src='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/tooltips/mana.png'></img>
                    <p className="footer-text">{props.mana_costs.join('/')}</p>
                </div>
            }
            {props.cooldowns &&
                <div className="cooldowns flex">
                    <img className="tooltip-footer-img" alt='cd' src='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/tooltips/cooldown.png'></img>
                    <p className="footer-text">{props.cooldowns.join('/')}</p>

                </div>
            }
        </>
    )
}
export default CdMc