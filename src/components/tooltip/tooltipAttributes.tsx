
const TooltipAttributes = (props: any) => {
    return (
        <div className="attributes">
            {props.itemProperties.attributes &&
                props.itemProperties.attrib.map((x: { key: string, value: string, footer: string, header: string }, i: number) => {
                    const attribName = x.footer ? x.footer : x.header.replace(/[+-]/g, m => m === '_' ? ' ' : '')
                    const headerSymbol = x.header.replace(/[^+-]/g, '').trim()
                    return (
                        <p key={i} className="attribute">{headerSymbol}<strong><span className="tooltip-text-highlight">{x.value}</span></strong> {attribName}</p>
                    )
                })
            }
            {props.itemProperties.special_values &&
                props.itemProperties.special_values.map((x: any, i: number) => {
                    const heading = x.heading_loc
                    const percentage = x.is_percentage
                    let value
                    const zeroCheck = x.values_float.join() !== '0'
                    if (percentage) {
                        value = x.values_float.join('%/') + '%'
                    } else {
                        value = x.values_float.join('/')
                    }
                    if (props.aghanimAbility && props.aghanimAbility['modifier'] && !x.name.includes(props.type)) {
                    }
                    else if (heading && zeroCheck) {
                        return (
                            <p className="attribute" key={i}>{heading} <strong><span className="tooltip-text-highlight">{value}</span></strong></p>
                        )
                    }
                })
            }
        </div>
    )
}
export default TooltipAttributes