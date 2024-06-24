import { damageType } from './abilityAttributes'

const TooltipAttributes = (props: any) => {
    return (
        <div className="attributes">
            {props.itemProperties.attrib &&
                props.itemProperties.attrib.map(
                    (
                        x: {
                            key: string
                            value: string | string[]
                            footer: string
                            header: string
                        },
                        i: number
                    ) => {
                        const attribName = x.footer
                            ? x.footer
                            : x.header.replace(/[+-]/g, (m) =>
                                  m === '_' ? ' ' : ''
                              )
                        const headerSymbol = x.header
                            .replace(/[^+-]/g, '')
                            .trim()
                        const value =
                            typeof x.value === 'string'
                                ? x.value
                                : x.value.join('/')
                        return (
                            <p key={i} className="attribute">
                                {headerSymbol}{' '}
                                <strong>
                                    <span className="tooltip-text-highlight">
                                        {value}
                                    </span>
                                </strong>{' '}
                                {attribName}
                            </p>
                        )
                    }
                )}
            {props.itemProperties.special_values && (
                <>
                    {props.itemProperties.special_values.map(
                        (x: any, i: number) => {
                            const ob =
                                props.type === 'facet' ? x['facet_bonus'] : x
                            const heading = x.heading_loc
                            const percentage = x.is_percentage
                            const values =
                                props.type === 'facet'
                                    ? ob.values
                                    : ob.values_float
                            let value
                            const zeroCheck = values.some((x: any) => x != 0)
                            if (percentage) {
                                value = values.join('% / ') + '%'
                            } else {
                                value = values.join(' / ')
                            }
                            if (
                                heading.toLowerCase().includes('damage') &&
                                zeroCheck &&
                                heading
                            ) {
                                const dmgtype = damageType(
                                    props.itemProperties.damage
                                )
                                if (dmgtype)
                                    return (
                                        <AbilityAttribute
                                            heading={heading}
                                            color={dmgtype[1]}
                                            value={value}
                                            key={i}
                                        />
                                    )
                            } else if (heading && zeroCheck) {
                                return (
                                    <AbilityAttribute
                                        heading={heading}
                                        color="#b1bbc9"
                                        value={value}
                                        key={i}
                                    />
                                )
                            }
                        }
                    )}
                </>
            )}
        </div>
    )
}
export const AbilityAttribute = (props: {
    heading: string
    color: string
    value: string
}) => {
    const { heading, color, value } = props
    return (
        <p className="attribute">
            {heading}{' '}
            <strong>
                <span
                    className="tooltip-text-highlight"
                    style={{ color: color, textTransform: 'capitalize' }}
                >
                    {value}
                </span>
            </strong>
        </p>
    )
}
export default TooltipAttributes
