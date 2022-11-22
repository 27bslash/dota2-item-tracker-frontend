import CdMc from "./cdmc";

const TooltipDescription = (props: any) => {


    return (
        <div className="tooltip-description">
            {
                props.itemProperties.language.description &&
                props.itemProperties.language.description.map((x: string, i: number) => {
                    let activeText = highlight_numbers(x.match(/.*<h1>Active:.*/g));
                    let toggleText = highlight_numbers(x.match(/.*<h1>Toggle:.*/g));
                    let passiveText = highlight_numbers(x.match(/.*<h1>Passive:.*/g));
                    let useText = highlight_numbers(x.match(/.*<h1>Use:.*/g));
                    const activeHeader = x.replace(/<h1>(.*)<\/h1>.*/g, "$1");
                    const activeTxt = x.replace(/.*<\/h1>(.*)/g, "$1");
                    const activeDescText = highlight_numbers(activeTxt)
                    return (
                        <div key={i}>
                            {activeText &&
                                <div className="active">
                                    <div className="active-header">
                                        <h3 className='tooltip-text-highlight'>{activeHeader}</h3>
                                        <div className="statWrapper">
                                            <CdMc mana_costs={props.itemProperties.stat['manaCost']} cooldowns={props.itemProperties.stat['cooldown']}></CdMc>
                                        </div>
                                    </div>
                                    <p className="description-text" dangerouslySetInnerHTML={{ __html: activeDescText }}></p>
                                </div>
                            }
                            {passiveText &&
                                <div className="passive">
                                    <div className="passive-description">
                                        <h3 className='tooltip-text-highlight'>{activeHeader}</h3>
                                        <p className="description-text" dangerouslySetInnerHTML={{ __html: activeDescText }}></p>
                                    </div>
                                </div>
                            }
                            {useText &&
                                <div className="use">
                                    <div className="use-description">
                                        <h3 className='tooltip-text-highlight'>{activeHeader}</h3>
                                        <div className="stat-wrapper"></div>
                                        <p className="description-text" dangerouslySetInnerHTML={{ __html: activeDescText }}></p>
                                    </div>
                                </div>
                            }
                            {toggleText &&
                                <div className="toggle">
                                    <div className="toggle-header">
                                        <h3 className='tooltip-text-highlight'>{activeHeader}</h3>
                                        <div className="stat-wrapper">
                                        </div>
                                    </div>
                                    <p className="description-text" dangerouslySetInnerHTML={{ __html: activeDescText }}></p>
                                </div>
                            }
                        </div>
                    )
                })

            }
        </div >
    )
}
const highlight_numbers = (text: any) => {
    if (typeof text == "object" && text != null) text = text.join("");
    return text
        ? text
            .replace(/<font(.*?)>/g, "")
            .replace(/font/g, "")
            .replace(/\.0/gm, "")
            .replace(
                /([^a-z>]\d*\.?\d+%?)(\s\/)?(s?)/gm,
                `<strong><span class='tooltip-text-highlight'>$1$2$3</span></strong>`
            )
            .replace(/<h1>/g, "<h3 class='tooltip-text-highlight'>")
            .replace(/<\/h1>/g, "</h3>")
        : "";
}
export default TooltipDescription