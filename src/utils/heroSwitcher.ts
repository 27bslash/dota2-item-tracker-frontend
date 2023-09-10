const heroSwitcher = (k: string): string => {
    const heroes: { [key: string]: string } = {
        "nature's_prophet": "furion",
        necrophos: "necrolyte",
        clockwerk: "rattletrap",
        timbersaw: "shredder",
        io: "wisp",
        queen_of_pain: "queenofpain",
        doom: "doom_bringer",
        shadow_fiend: "nevermore",
        wraith_king: "skeleton_king",
        magnus: "magnataur",
        underlord: "abyssal_underlord",
        "anti-mage": "antimage",
        outworld_destroyer: "obsidian_destroyer",
        outworld_devourer: "obsidian_destroyer",
        lifestealer: "life_stealer",
        windranger: "windrunner",
        zeus: "zuus",
        vengeful_spirit: "vengefulspirit",
        treant_protector: "treant",
        centaur_warrunner: "centaur",
    };
    if (k in heroes) {
        return heroes[k];
    } else if (Object.values(heroes).includes(k)) {
        const foundKey = Object.keys(heroes).find((key) => heroes[key] === k);
        return foundKey ? foundKey : k
    }
    return k;
};

export default heroSwitcher;
