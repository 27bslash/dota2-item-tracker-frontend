import TableItem from "../../../table/tableItems/tableItem";

export const ItemComponents = (props: { components: string[][]; dimmed?: boolean }) => {
    const components = props.components.slice(0, 2)
    const dimmed = props.dimmed ?? false
    return (
        <div className='components' style={{ display: 'flex', alignSelf: 'flex-start', opacity: dimmed ? 0.75 : 1 }}>
            {components.map((componentArr, i) => (
                <div className="pair" style={{ display: 'grid' }} key={i}>
                    {componentArr.map((component, i) => {
                        component = component.replace(/__\d+/g, '')
                        return (
                            <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
                                {i % 2 === 0 &&
                                    <div className="disassemble-overlay"></div>
                                }
                                <TableItem height='20px' type='item' itemKey={component} overlay={false} />
                            </div>
                        )
                    })
                    }
                </div>
            ))
            }
        </div>
    )
}
