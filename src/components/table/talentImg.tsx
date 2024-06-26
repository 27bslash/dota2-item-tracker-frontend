const TalentImg = (props: any) => {
    const talents = props.talents.filter(
        (arr: any) => +arr[arr.length - 1]['id'] === +props.ability['id']
    )[0]
    return (
        <div
            className="small-talents talents"
            style={{ width: props.width, height: props.width }}
        >
            {[...talents].map((x: any, i: number) => {
                const side = x['slot'] % 2 !== 0 ? 'r-talent' : 'l-talent'
                if (x['slot'] < 2) {
                    x.lvl = 10
                } else if (x['slot'] < 4) {
                    x.lvl = 15
                } else if (x['slot'] < 6) {
                    x.lvl = 20
                } else {
                    x.lvl = 25
                }
                return (
                    <div key={i} className={'lvl' + x.lvl + ' ' + side}></div>
                )
            })}
        </div>
    )
}

// if talent['slot'] < 2:
// level = 10
// elif talent['slot'] < 4:
// level = 15
// elif talent['slot'] < 6:
// level = 20
// else:
// level = 25
export default TalentImg
