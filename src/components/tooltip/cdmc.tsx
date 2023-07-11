const CdMc = (props: any) => {

    return (
        <>
            {props.mana_costs &&
                <div className="mana-costs flex" style={{ alignItems: 'center' }}>
                    <img alt='mana' className="tooltip-footer-img" src='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/tooltips/mana.png'></img>
                    <p className="footer-text">{typeof (props.mana_costs) === 'number' ? props.mana_costs : props.mana_costs.join('/')}</p>
                </div>
            }
            {props.cooldowns &&
                <div className="cooldowns flex" style={{ alignItems: 'center' }}>
                    <img className="tooltip-footer-img" alt='cd' src='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/tooltips/cooldown.png'></img>
                    <p className="footer-text">{typeof (props.cooldowns) === 'number' ? props.cooldowns : props.cooldowns.join('/')}</p>
                </div>
            }
        </>
    )
}
export default CdMc