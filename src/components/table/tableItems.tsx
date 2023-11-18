/* eslint-disable no-unused-vars */
import { TableCell } from "@mui/material"
import AbilityTooltip from "../tooltip/abilityTooltip";
import TalentTooltip from "../tooltip/talentTooltip";
import TableItem from './tableItem';
import TalentImg from "./talentImg";
import ArrowButton from '../ui_elements/arrowButton';
import Tip from "../tooltip/tooltip";
import Draft from "./draft";
import Match from "../types/matchData";
import { exists } from "../../utils/exists";
import React from 'react'
import Items from "../types/Item";
interface TitemProps {
    row: {
        id: number
        final_items: any[],
        backpack: any[],
        starting_items: any[],
        item_neutral: string,
        aghanims_shard: { time: string, key: string, id: number }[],
        items: any[],
        abilities: any[],
        hero: string,
        radiant_draft: string[]
        dire_draft: string[],
        additional_units: any[] | undefined
    },
    showStarter: boolean,
    items: Items,
    heroData: any[],
    heroList: any[],
    totalMatchData: any[],
    filteredData: any[],
    updateMatchData: (data: Match[]) => void,
    children: React.ReactNode;
    role: string


}

const humanReadableTime = (time: number | string) => {
    if (typeof (time) === 'number' && time < 0) {
        time = 0
    }
    let minutes, secs
    if (typeof (time) === 'string') {
        const spit = time.split(':')
        const hours = +spit[0].replace(/^0/, '')
        minutes = +spit[1].replace(/^0/, '') + (hours * 60)
        secs = spit[2].replace(/^0/, '')
        secs = +secs >= 10 ? secs : `0${secs}`
    } else {
        minutes = Math.floor(time / 60)
        secs = (time % 60) >= 10 ? (time % 60) : `0${(time % 60)}`
    }
    const timeString = `${minutes}:${secs}`
    return minutes > 0 ? timeString : '0'
}
const FinalItems = (props: {
    row: TitemProps['row'], bear?: boolean; role: string; heroName: string; itemList: any[];
    updateMatchData: ((data: any, searchResults?: any) => void);
    filteredData: Match[]; totalMatchData: Match[]; items: any; heroData: any[]
}) => {
    return (
        <div className="flex">
            {props.bear &&
                <img src='https://ailhumfakp.cloudimg.io/v7/https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/lone_druid_spirit_bear.png'
                    height='55'
                    alt='lone druid bear'
                ></img>
            }
            {props.itemList.map((item: any, i: number) => {
                const time = humanReadableTime(item['time'])
                if (item.key === 'ultimate_scepter') {
                    return <TableItem matchId={props.row.id} role={props.role} overlay={true} updateMatchData={props.updateMatchData}
                        totalMatchData={props.totalMatchData} key={i} itemKey='ultimate_scepter' type='scepter'
                        items={props.items} heroName={props.heroName}
                        heroData={props.heroData} item={item} time={time}>
                    </TableItem>
                } else {
                    return <TableItem matchId={props.row.id} time={time} role={props.role} overlay={true} updateMatchData={props.updateMatchData}
                        totalMatchData={props.totalMatchData} key={i} item={item}
                        itemId={item.id} items={props.items} itemKey={item.key} type='item'></TableItem>
                }
            }
            )}
        </div>
    )
}
const TableItems = (props: TitemProps) => {
    const image_host = "https://ailhumfakp.cloudimg.io/v7/"
    const consumables = ['tango', 'flask', 'ward_observer',
        'ward_sentry', 'smoke_of_deceit', 'enchanted_mango', 'clarity', 'tpscroll', 'dust', 'tome_of_knowledge']
    const visitedTalents: any = []
    const talents: any = props.row.abilities.filter((ability: any) => ability['type'] === 'talent')
    const s = new Set()
    for (const talent of talents) {
        const t = []
        if (!s.has(talent['id'])) {
            s.add(talent['id'])
            const newA = Array.from(s)
            for (const _id of newA) {
                const f = talents.filter((x: any) => _id === x['id'])
                t.push(f[0])
            }
        }
        visitedTalents.push(t)
    }
    const width = '900'
    const heroName = props.row['hero']
    const finalItemsProps = {
        row: props.row,
        heroName: heroName,
        heroData: props.heroData,
        role: props.role,
        updateMatchData: props.updateMatchData,
        filteredData: props.filteredData,
        totalMatchData: props.totalMatchData,
        items: props.items,
    };
    const tableItemProps = {
        matchId: props.row.id, overlay: true,
        role: props.role, updateMatchData: props.updateMatchData,
        filteredData: props.filteredData, totalMatchData: props.totalMatchData, items: props.items,
    }
    return (
        <TableCell sx={{ padding: '6px 0px 6px 10px', maxWidth: `${width}px`, minWidth: `${width}px`, width: width + 'px', height: '200px', maxHeight: '200px' }}>
            <div className="items flex">
                <div className="purchases">
                    {!props.showStarter ? (
                        <>
                            <FinalItems {...finalItemsProps}
                                itemList={props.row.final_items}
                            ></FinalItems>
                            <FinalItems
                                {...finalItemsProps}
                                bear={!!exists(props.row.additional_units)}
                                itemList={props.row.additional_units || []}
                            ></FinalItems>
                        </>
                    ) : (
                        props.row.starting_items &&
                        <div className="flex">
                            {props.row.starting_items.map((item: any, i: number) => {
                                const time = humanReadableTime(item['time'])
                                return <TableItem
                                    {...tableItemProps}
                                    time={time} key={i} item={item} itemKey={item.key} type='item' starter={true}>
                                </TableItem>
                            })}
                        </div>
                    )}
                </div>
                {props.row.item_neutral && !props.showStarter &&
                    <TableItem {...tableItemProps} updateMatchData={props.updateMatchData} itemKey={props.row.item_neutral} type='neutral'></TableItem>
                }
                {props.row.aghanims_shard && !props.showStarter &&
                    <TableItem {...tableItemProps}
                        time={humanReadableTime(props.row.aghanims_shard[0]['time'])} itemKey='aghanims_shard' type='shard' heroName={heroName}
                        heroData={props.heroData} item={props.row.aghanims_shard}>
                    </TableItem>
                    // time={humanReadableTime(props.row.aghanims_shard['time'])}
                }
            </div>
            {props.showStarter && props.row.starting_items &&
                <div className="flex intermediate-items">
                    {props.row.items.map((item: any, i) => {
                        if (item['time'] < 600 && item['time'] > 0 && !consumables.includes(item['key'])) {
                            const time = humanReadableTime(item['time'])
                            return (
                                <TableItem
                                    {...tableItemProps}
                                    key={i} item={item} time={time} itemKey={item.key} type='item'>
                                </TableItem>
                            )
                        }
                    })}
                </div>
            }
            {props.row.items &&
                <ArrowButton transition="collapse">
                    <div className="purchase-log">
                        {props.row.items.map((item: any, i: number) => {
                            const time = humanReadableTime(item['time'])
                            if (!consumables.includes(item['key'])) {
                                return (
                                    <TableItem
                                        {...tableItemProps}
                                        key={i} item={item} time={time} itemKey={item.key} type='item'>
                                    </TableItem>)
                            }
                        }
                        )
                        }
                    </div>
                </ArrowButton>
            }

            <Abilities abilities={props.row.abilities} heroName={heroName} visitedTalents={visitedTalents} heroData={props.heroData} imageHost={image_host} width={width} />
            {props.row.radiant_draft &&
                <div className="draft">
                    <div className="radiant-draft">
                        <Draft hero={props.row.hero} heroList={props.heroList} totalMatchData={props.totalMatchData} updateMatchData={props.updateMatchData} draft={props.row.radiant_draft}></Draft>
                    </div>
                    <div className="dire-draft">
                        <Draft hero={props.row.hero} heroList={props.heroList} totalMatchData={props.totalMatchData} updateMatchData={props.updateMatchData} draft={props.row.dire_draft}></Draft>
                    </div>
                </div>
            }
        </TableCell >)
}
// const ConditionalLink = (props: { condition: any; to: string; children: any }) => {
//     return (
//         (props.condition && props.to)
//             ? <a href={props.to} target='_blank' rel='noreferrer'>{props.children}</a>
//             : <>{props.children}
//             </>
//     )
// }
const Abilities = (props: { abilities: any; heroData: any; imageHost: string; width: string, heroName: string, visitedTalents: any[] }) => {
    const { abilities, heroData, imageHost, width, heroName, visitedTalents } = props
    return (
        <div className="abilities">
            {abilities.map((ability: any, i: number) => {
                let len = abilities.length;
                let imgWidth = Math.floor((+width - 50) / len)
                let link = `${imageHost}https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability.img}.png`

                return (
                    <div className="ability-image-wrapper" key={i}>
                        <strong><p style={{ color: 'white', textAlign: 'center' }}>{ability['level']}</p></strong>
                        {
                            ability['type'] === 'ability' &&
                            <AbilityImg link={link} heroData={heroData} heroName={heroName} ability={ability} key={i} imgWidth={imgWidth} />
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
    )
}
export default TableItems

export const AbilityImg = (props: { link: string, heroData: any, heroName: string, ability: any, imgWidth: number }) => {
    const { link, heroData, heroName, ability, imgWidth } = props
    return <Tip component={<AbilityTooltip img={link} heroData={heroData} heroName={heroName} ability={ability} />}>
        <div className="ability">
            <img width={imgWidth} height={imgWidth} className='table-img' alt={ability.key} data-id={ability.id} src={link}></img>
        </div>
    </Tip>;
}
