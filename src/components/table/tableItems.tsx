import { TableCell } from "@mui/material"
import AbilityTooltip from "../tooltip/abilityTooltip";
import TalentTooltip from "../tooltip/talentTooltip";
import TableItem from './tableItem';
import TalentImg from "./talentImg";
import { useState } from 'react';
import ArrowButton from './../arrowButton';
import Tip from "../tooltip/tooltip";
import Draft from "./draft";

interface TitemProps {
    row: {
        id: number
        final_items: object[],
        backpack: object[],
        starting_items: object[],
        item_neutral: string,
        aghanims_shard: object[],
        items: object[],
        abilities: object[],
        hero: string,
        radiant_draft: string[]
        dire_draft: string[]
    },
    showStarter: boolean,
    abilityColors: object[],
    items: object[],
    heroData: object[],
    heroName: string,
    heroList: object[],
    totalMatchData: object[],
    filteredData: object[],
    updateMatchData: (data: object[]) => void,
    children: React.ReactNode;
    role: string


}
const Test = () => {
    return (
        <div className="testd">test tootlp</div>
    )
}
const TableItems = (props: TitemProps) => {
    const image_host = "https://ailhumfakp.cloudimg.io/v7/"
    const [open, setOpen] = useState(false)
    const consumables = ['tango', 'flask', 'ward_observer',
        'ward_sentry', 'smoke_of_deceit', 'enchanted_mango', 'clarity', 'tpscroll', 'dust', 'tome_of_knowledge']
    const visitedTalents: any = []
    const talents: any = props.row.abilities.filter((ability: any) => ability['type'] === 'talent')
    const s = new Set()
    for (let talent of talents) {
        const t = []
        if (!s.has(talent['id'])) {
            s.add(talent['id'])
            const newA = Array.from(s)
            for (let _id of newA) {
                const f = talents.filter((x: any) => _id === x['id'])
                t.push(f[0])
            }
        }
        visitedTalents.push(t)
    }
    const width = '900'
    return (
        <TableCell sx={{ padding: '6px 0px 6px 10px', maxWidth: `${width}px`, minWidth: `${width}px`, width: width + 'px', height: '200px', maxHeight: '200px' }}>
            <div className="items flex">
                <div className="purchases">
                    {!props.showStarter ? (
                        props.row.final_items.concat(props.row.backpack).map((item: any, i: number) => {
                            if (item.key === 'ultimate_scepter') {
                                return <TableItem matchId={props.row.id} role={props.role} updateMatchData={props.updateMatchData} filteredData={props.filteredData} totalMatchData={props.totalMatchData} key={i} itemKey='ultimate_scepter' type='scepter' items={props.items} heroName={props.heroName}
                                    heroData={props.heroData} item={item} colors={props.abilityColors}>
                                </TableItem>
                            } else {
                                return <TableItem matchId={props.row.id} role={props.role} updateMatchData={props.updateMatchData} filteredData={props.filteredData} totalMatchData={props.totalMatchData} key={i} item={item} itemId={item.id} items={props.items} itemKey={item.key} type='item'></TableItem>
                            }
                        }
                        )
                    ) : (

                        props.row.starting_items.map((item: any, i: number) => (
                            <TableItem matchId={props.row.id} role={props.role} updateMatchData={props.updateMatchData} filteredData={props.filteredData} totalMatchData={props.totalMatchData} key={i} item={item} items={props.items} itemKey={item.key} type='item' starter={true}></TableItem>
                        )

                        )
                    )}
                </div>
                {props.row.item_neutral && !props.showStarter &&
                    <TableItem matchId={props.row.id} role={props.role} updateMatchData={props.updateMatchData} filteredData={props.filteredData} totalMatchData={props.totalMatchData} itemKey={props.row.item_neutral} items={props.items} type='neutral'></TableItem>
                }
                {props.row.aghanims_shard && !props.showStarter &&
                    <TableItem matchId={props.row.id} role={props.role} updateMatchData={props.updateMatchData} filteredData={props.filteredData} totalMatchData={props.totalMatchData} itemKey='aghanims_shard' type='shard' items={props.items} heroName={props.heroName}
                        heroData={props.heroData} item={props.row.aghanims_shard} colors={props.abilityColors}>
                    </TableItem>
                }
            </div>
            <ArrowButton transition="collapse">
                <div className="purchase-log">
                    {props.row.items.map((item: any, i: number) => {
                        let newItem: any = {}
                        if (item['time'] < 0) {
                            item['time'] = 0
                        }
                        newItem['time'] = new Date(item['time'] * 1000).toISOString().substr(11, 8);
                        newItem['key'] = item['key']
                        if (!consumables.includes(newItem['key'])) {
                            return (
                                <TableItem matchId={props.row.id} role={props.role} updateMatchData={props.updateMatchData} filteredData={props.filteredData} totalMatchData={props.totalMatchData} key={i} item={newItem} items={props.items} itemKey={newItem.key} type='item'></TableItem>)
                        }
                    }
                    )
                    }
                </div>
            </ArrowButton>


            <div className="abilities">
                {props.row.abilities.map((ability: any, i: number) => {
                    let len = props.row.abilities.length;
                    let imgWidth = Math.floor((+width - 50) / len)
                    // console.log(imgWidth)
                    let link = `${image_host}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability.img}.png`
                    return (
                        <div className="ability-image-wrapper" key={i}>
                            <strong><p style={{ color: 'white', textAlign: 'center' }}>{i + 1}</p></strong>
                            {
                                ability['type'] === 'ability' &&
                                <Tip component={<AbilityTooltip img={link} heroData={props.heroData} heroName={props.heroName} abilityColors={props.abilityColors} ability={ability} />}>
                                    <div className="ability" key={i}>
                                        <img width={imgWidth} height={imgWidth} className='table-img' alt={ability.key} data-id={ability.id} src={link}></img>
                                    </div>
                                </Tip>
                            }
                            {
                                // talents have to be changed here
                                ability['type'] === 'talent' &&
                                <Tip component={<TalentTooltip talent={ability} />}>
                                    <TalentImg width={imgWidth * 1.2} talents={visitedTalents} ability={ability}></TalentImg>
                                </Tip>
                            }
                        </div>
                    )
                })}
            </div>
            <div className="draft">
                <div className="radiant-draft">
                    <Draft hero={props.row.hero} heroList={props.heroList} totalMatchData={props.totalMatchData} updateMatchData={props.updateMatchData} draft={props.row.radiant_draft}></Draft>
                </div>
                <div className="dire-draft">
                    <Draft hero={props.row.hero} heroList={props.heroList} totalMatchData={props.totalMatchData} updateMatchData={props.updateMatchData} draft={props.row.dire_draft}></Draft>
                </div>
            </div>
        </TableCell >)
}
const ConditionalLink = (props: { condition: any; to: string; children: any }) => {
    return (
        (props.condition && props.to)
            ? <a href={props.to} target='_blank' rel='noreferrer'>{props.children}</a>
            : <>{props.children}
            </>
    )
}

export default TableItems