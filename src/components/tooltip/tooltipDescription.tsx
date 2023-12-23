import React from "react";
import CdMc from "./cdmc";

const TooltipDescription = (props: any) => {
    const replacer = (str: string) => {
        return str === '.' ? `${str}<br></br>` : `${str}<br>`
    }
    const tooltipDecsription = props.itemProperties.hint
    const itemPropertiesArr = tooltipDecsription ? tooltipDecsription[0].split('<h1>') : undefined
    return (
        <div className="tooltip-description">
            {
                props.itemProperties.hint &&
                itemPropertiesArr.map((x: string, i: number) => {
                    // const header = x.match(/.*(?=--)/)
                    const headers = x.match(/(.*?)<\/h1>/gm)
                    let header = ''
                    if (headers) {
                        header = headers.map(match => match.replace(/<\/?h1>/g, ''))[0];
                    }

                    const text = header ? x.match(/<\/h1>.*/) : x.match(/.*/)
                    let highlightedText = ''
                    const active = x.match('Active:')
                    const passive = x.match('Passive:')
                    const use = x.match('Use:')
                    const toggle = x.match('Toggle:')

                    if (text) {
                        // let activeText = highlight_numbers(x.match(/.*<h1>Active:.*/g));
                        // let toggleText = highlight_numbers(x.match(/.*<h1>Toggle:.*/g));
                        // let passiveText = highlight_numbers(x.match(/.*<h1>Passive:.*/g));
                        // let useText = highlight_numbers(x.match(/.*<h1>Use:.*/g));
                        const preProcessedText = text[0].replace(/(\.|\d)(?=[A-Z])/g, replacer).replace(/\n/g,'')
                        highlightedText = highlight_numbers(preProcessedText.replace('--', '').trim())
                        // const activeHeader = x.replace(/<h1>(.*)<\/h1>.*/g, "$1");
                        // const activeTxt = x.replace(/.*<\/h1>(.*)/g, "$1");
                        // const activeDescText = highlight_numbers(activeTxt)
                    }
                    return (
                        <React.Fragment key={i}>
                            {active && highlightedText &&
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
                            {!active && !toggle && !use && !passive &&
                                <div className="passive-description">
                                    <p className="description-text" dangerouslySetInnerHTML={{ __html: highlightedText }}></p>
                                </div>
                            }
                        </React.Fragment>
                    )
                })

            }
        </div >
    )
}
export const highlight_numbers = (text: any) => {
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