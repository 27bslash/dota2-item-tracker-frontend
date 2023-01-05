import CdMc from "./cdmc";

const TooltipDescription = (props: any) => {


    return (
        <div className="tooltip-description">
            {
                props.itemProperties.description &&
                props.itemProperties.description.map((x: string, i: number) => {
                    const header = x.match(/.*(?=--)/)
                    const text = x.match(/(?=--).*/)
                    let highlightedText = ''
                    let active = x.match('Active:')
                    let passive = x.match('Passive:')
                    let use = x.match('Use:')
                    let toggle = x.match('Toggle:')

                    if (header && text) {
                        const preProcessedText = text[0].replace(/(\.)(?=[A-Z])/, '$1<br></br>')
                        highlightedText = highlight_numbers(preProcessedText.replace('--', '').trim())
                            {active && highlightedText &&
                        <div key={i}>
                            {activeText &&
                                <div className="active">
                                    <div className="active-header">
                                        <h3 className='tooltip-text-highlight'>{header}</h3>
                                        <div className="statWrapper">
                                            <CdMc mana_costs={props.itemProperties['mc']} cooldowns={props.itemProperties['cd']}></CdMc>
                                        </div>
                                    </div>
                                    <p className="description-text" dangerouslySetInnerHTML={{ __html: highlightedText }}></p>
                                </div>
                            }
                            {passive && highlightedText &&
                                <div className="passive">
                                    <div className="passive-description">
                                        <h3 className='tooltip-text-highlight'>{header}</h3>
                                        <p className="description-text" dangerouslySetInnerHTML={{ __html: highlightedText }}></p>
                                    </div>
                                </div>
                            }
                            {use && highlightedText &&
                                <div className="use">
                                    <div className="use-description">
                                        <h3 className='tooltip-text-highlight'>{header}</h3>
                                        <div className="stat-wrapper"></div>
                                        <p className="description-text" dangerouslySetInnerHTML={{ __html: highlightedText }}></p>
                                    </div>
                                </div>
                            }
                            {toggle && highlightedText &&
                                <div className="active">
                                    <div className="active-header">
                                        <h3 className='tooltip-text-highlight'>{header}</h3>
                                        <div className="stat-wrapper">
                                        </div>
                                    </div>
                                    <p className="description-text" dangerouslySetInnerHTML={{ __html: highlightedText }}></p>
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