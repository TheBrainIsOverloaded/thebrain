javascript:
var regExp = /^0[0-9].*$/;
let disableBuildings = [];
let disableUnits = [];
let config;
let buildings = ["main","barracks","stable","garage","church","church_f","watchtower","snob","smith","place","statue","market","wood","stone","iron","farm","storage","hide","wall"];
let units = ["spear","sword","axe","archer","spy","light","marcher","heavy","ram","catapult","knight","snob","militia"];
let datas = ["max_level","min_level","wood","stone","iron","pop","wood_factor","stone_factor","iron_factor","pop_factor","build_time","build_time_factor"];
let dat = ["build_time","pop","speed","attack","defense","defense_cavalry","defense_archer","carry"];
let firstLevelPoint = [10,16,20,24,10,10,42,512,19,0,24,10,6,6,6,5,6,5,8];
let forumURL = "https://forum.tribalwars.net/index.php?members/oreg.123551";
let gear = "https://raw.githubusercontent.com/oreg-kh/Unit-and-building-simulator/master/gear.png";
let token = atob("ZjRiNDIzZWE4MzgxMDJmZmNkMTdmY2M4MDdmY2Y1MTkxZjlkN2I5Yw==");
const obj = {buildingsObj: {}, unitsObj: {}, world: {}};

// === LANGUAGE SYSTEM ===
let currentLang = "cz";

const lang = {
    cz: {
        // Buildings table headers
        building: "Budova",
        level: "Úroveň",
        wood: "Dřevo",
        clay: "Hlína",
        iron: "Železo",
        population: "Obyvatelé",
        points: "Body",
        // Building names
        headquarters: "Hlavní stan",
        barracks: "Kasárna",
        stable: "Stáj",
        garage: "Dílna",
        church: "Kostel",
        church_f: "První kostel",
        watchtower: "Strážní věž",
        academy: "Akademie",
        smith: "Kovárna",
        place: "Shromaždiště",
        statue: "Socha",
        market: "Tržiště",
        timber_camp: "Dřevorubci",
        clay_pit: "Hliník",
        iron_mine: "Železárna",
        farm: "Farma",
        warehouse: "Sklad",
        hide: "Úkryt",
        wall: "Hradby",
        currentLevelCost: "← Náklady na aktuální úroveň",
        minLevel: "Minimální úroveň:",
        maxLevel: "Maximální úroveň:",
        // Units table headers
        unit: "Jednotka",
        amount: "Počet",
        trainTime: "Čas výcviku",
        perBuilding: "Za budovu",
        haul: "Přepravní kapacita",
        popSlots: "Místa na farmě",
        // Unit names
        spear: "Kopinář",
        sword: "Mečíř",
        axe: "Sekerník",
        archer: "Lučištník",
        spy: "Zvěd",
        light: "Lehký jezdec",
        marcher: "Lučištník na koni",
        heavy: "Těžký jezdec",
        ram: "Beranidlo",
        catapult: "Katapult",
        knight: "Rytíř",
        noble: "Šlechtic",
        militia: "Milice",
        // Bonus labels
        resourceBonus: "Surovinové bonusy",
        popBonus: "Populační bonus",
        haulBonus: "Přepravní bonus",
        recruitBonus: "Výcvikový bonus",
        marketBonus: "Tržní bonus",
        storageBonus: "Skladový bonus",
        // Properties
        buildingProps: "Vlastnosti budov",
        farmSpace: "Kapacita farmy",
        occupiedPop: "Obsazená místa",
        freePop: "Volná místa",
        sumPoints: "Body",
        hiddenRes: "Skryté suroviny",
        merchants: "Počet obchodníků",
        storageCapacity: "Kapacita skladu",
        wallBonus: "Bonus hradeb",
        woodProd: "Výroba dřeva",
        stoneProd: "Výroba hlíny",
        ironProd: "Výroba železa",
        // Costs
        costs: "Náklady",
        units_label: "Jednotky",
        buildings_label: "Budovy",
        total: "Celkem",
        // Profiles
        profiles: "Profily:",
        options: "možnosti",
        save: "Uložit",
        delete: "Smazat",
        export: "Export",
        import: "Import",
        // Messages
        bye: "Nashledanou příště!",
        savePrompt: "Zadej název profilu:",
        importPrompt: "Vlož exportní kód:",
        exportInfo: "Tento kód lze použít při importu.\n\nUloží tvůj profil nebo ho pošli ostatním.\n\nKopíruj: CTRL+C.",
        errorBuilding: "Načtení dat budov ze serveru selhalo! Zkus to znovu.",
        errorUnits: "Načtení dat jednotek ze serveru selhalo! Zkus to znovu.",
        errorUnitsCost: "Načtení nákladů jednotek ze serveru selhalo! Zkus to znovu.",
        errorSpeed: "Načtení rychlosti serveru selhalo! Zkus to znovu.",
        errorBuildingLevel: "Budova nemá tuto úroveň! Min: ",
        errorBuildingLevelMax: ", Max: ",
        errorUnit: "Zadal jsi neplatný počet! Min: ",
        errorBonus: "Zadal jsi neplatnou hodnotu! Min: ",
        // Tooltips
        ttResource: "Surovinový bonus:<br/><br/> :: Zde zadáš, o kolik procent je zvýšena výroba dřeva, hlíny a železa.",
        ttPop: "Populační bonus:<br/><br/> :: Zde zadáš, o kolik procent je zvýšena kapacita farmy.<br/> :: Lze nastavit bonus vesnice, vlajky a inventáře zvlášť.",
        ttHaul: "Přepravní bonus:<br/><br/> :: Zde zadáš, o kolik procent je zvýšena přepravní kapacita jednotek.<br/> :: Lze nastavit vlajku a inventář zvlášť.",
        ttRecruit: "Výcvikový bonus:<br/><br/> :: Zde zadáš, o kolik procent je zvýšena rychlost výcviku v kasárnách, stáji, dílně a akademii.",
        ttMarket: "Tržní bonus:<br/><br/> :: Zde zadáš, o kolik procent je zvýšen počet obchodníků.<br/> :: Lze nastavit bonusovou vesnici a inventář zvlášť.",
        ttStorage: "Skladový bonus:<br/><br/> :: Zde zadáš, o kolik procent je zvýšena kapacita skladu.<br/> :: Lze nastavit bonusovou vesnici a inventář zvlášť.",
        // Issue sidebar
        bugReport: "Popis chyby...",
        send: "Odeslat",
        imgLink: "Odkaz na obrázek",
        addImg: "Přidat",
        sendSuccess: "Tvá zpráva byla úspěšně odeslána!",
        sendError: "Nastala chyba, data se nepodařilo odeslat!",
    },
    eng: {
        building: "Building",
        level: "Level",
        wood: "Wood",
        clay: "Clay",
        iron: "Iron",
        population: "Population",
        points: "Points",
        headquarters: "Headquarters",
        barracks: "Barracks",
        stable: "Stable",
        garage: "Workshop",
        church: "Church",
        church_f: "First Church",
        watchtower: "Watchtower",
        academy: "Academy",
        smith: "Smithy",
        place: "Rally Point",
        statue: "Statue",
        market: "Market",
        timber_camp: "Timber Camp",
        clay_pit: "Clay Pit",
        iron_mine: "Iron Mine",
        farm: "Farm",
        warehouse: "Warehouse",
        hide: "Hiding Place",
        wall: "Wall",
        currentLevelCost: "← Current level costs",
        minLevel: "Minimum level:",
        maxLevel: "Maximum level:",
        unit: "Unit",
        amount: "Amount",
        trainTime: "Training time",
        perBuilding: "Per building",
        haul: "Haul capacity",
        popSlots: "Farm slots",
        spear: "Spearman",
        sword: "Swordsman",
        axe: "Axeman",
        archer: "Archer",
        spy: "Scout",
        light: "Light Cavalry",
        marcher: "Mounted Archer",
        heavy: "Heavy Cavalry",
        ram: "Battering Ram",
        catapult: "Catapult",
        knight: "Paladin",
        noble: "Nobleman",
        militia: "Militia",
        resourceBonus: "Resource bonuses",
        popBonus: "Population bonus",
        haulBonus: "Haul bonus",
        recruitBonus: "Recruitment bonus",
        marketBonus: "Market bonus",
        storageBonus: "Storage bonus",
        buildingProps: "Building properties",
        farmSpace: "Farm capacity",
        occupiedPop: "Occupied slots",
        freePop: "Free slots",
        sumPoints: "Points",
        hiddenRes: "Hidden resources",
        merchants: "Number of merchants",
        storageCapacity: "Storage capacity",
        wallBonus: "Wall defense bonus",
        woodProd: "Wood production",
        stoneProd: "Clay production",
        ironProd: "Iron production",
        costs: "Costs",
        units_label: "Units",
        buildings_label: "Buildings",
        total: "Total",
        profiles: "Profiles:",
        options: "options",
        save: "Save",
        delete: "Delete",
        export: "Export",
        import: "Import",
        bye: "Goodbye, see you next time!",
        savePrompt: "Enter a name for your profile:",
        importPrompt: "Paste the export code:",
        exportInfo: "This code can be used on import.\n\nSave your profile or send it to others.\n\nCopy: CTRL+C.",
        errorBuilding: "Failed to load building data from server! Try again later.",
        errorUnits: "Failed to load unit data from server! Try again later.",
        errorUnitsCost: "Failed to load unit cost data from server! Try again later.",
        errorSpeed: "Failed to load server speed! Try again later.",
        errorBuildingLevel: "Building doesn't have this level! Min: ",
        errorBuildingLevelMax: ", Max: ",
        errorUnit: "Invalid amount entered! Min: ",
        errorBonus: "Invalid value entered! Min: ",
        ttResource: "Resource bonus:<br/><br/> :: Enter by how many percent wood, clay and iron production is increased.",
        ttPop: "Population bonus:<br/><br/> :: Enter by how many percent farm capacity is increased.<br/> :: Bonus village, flag and inventory can be set separately.",
        ttHaul: "Haul bonus:<br/><br/> :: Enter by how many percent unit haul capacity is increased.<br/> :: Flag and inventory can be set separately.",
        ttRecruit: "Recruitment bonus:<br/><br/> :: Enter by how many percent training speed in barracks, stable, workshop and academy is increased.",
        ttMarket: "Market bonus:<br/><br/> :: Enter by how many percent the number of merchants is increased.<br/> :: Bonus village and inventory can be set separately.",
        ttStorage: "Storage bonus:<br/><br/> :: Enter by how many percent storage capacity is increased.<br/> :: Bonus village and inventory can be set separately.",
        bugReport: "Describe the bug...",
        send: "Send",
        imgLink: "Image URL",
        addImg: "Add",
        sendSuccess: "Your message was sent successfully!",
        sendError: "An error occurred, data could not be sent!",
    }
};

function t(key) {
    return lang[currentLang][key] || key;
}

let game = window.image_base;
let imageSrc = {
    main: game + "buildings/mid/main3.png",
    barracks: game + "buildings/mid/barracks3.png",
    stable: game + "buildings/mid/stable3.png",
    garage: game + "buildings/mid/garage3.png",
    church: game + "buildings/mid/church3.png",
    church_f: game + "buildings/mid/church1.png",
    watchtower: game + "buildings/mid/watchtower3.png",
    academy: game + "buildings/mid/snob1.png",
    smith: game + "buildings/mid/smith3.png",
    place: game + "buildings/mid/place1.png",
    statue: game + "buildings/mid/statue1.png",
    market: game + "buildings/mid/market3.png",
    timber_camp: game + "buildings/mid/wood3.png",
    clay_pit: game + "buildings/mid/stone3.png",
    iron_mine: game + "buildings/mid/iron3.png",
    farm: game + "buildings/mid/farm3.png",
    warehouse: game + "buildings/mid/storage3.png",
    hide: game + "buildings/mid/hide1.png",
    wall: game + "buildings/mid/wall3.png",
    spear: game + "unit/unit_spear.png",
    sword: game + "unit/unit_sword.png",
    axe: game + "unit/unit_axe.png",
    archer: game + "unit/unit_archer.png",
    spy: game + "unit/unit_spy.png",
    light: game + "unit/unit_light.png",
    marcher: game + "unit/unit_marcher.png",
    heavy: game + "unit/unit_heavy.png",
    ram: game + "unit/unit_ram.png",
    catapult: game + "unit/unit_catapult.png",
    knight: game + "unit/unit_knight.png",
    snob: game + "unit/unit_snob.png",
    militia: game + "unit/unit_militia.png",
    wood: game + "holz.png",
    stone: game + "lehm.png",
    iron: game + "eisen.png",
    header: game + "face.png",
    gold: game + "gold.png",
    popFlag: game + "flags/medium/6_5.png",
    haulFlag: game + "flags/medium/8_5.png",
    inventory: game + "icons/inventory.png",
    bonusVillage: game + "/map_new/b1.png",
    questionMark: game + "questionmark.png",
    time: game + "time.png"
};

function buildContent() {
    return `
    <div id="twSimLangBar">
        <button id="btnCZ" class="twsim-langbtn ${currentLang==='cz'?'active':''}" onclick="switchLang('cz')">🇨🇿 CZ</button>
        <button id="btnENG" class="twsim-langbtn ${currentLang==='eng'?'active':''}" onclick="switchLang('eng')">🇬🇧 ENG</button>
        <span id="twsim-brand">⚔️ Village Simulator &nbsp;|&nbsp; <span class="brain-badge">Powered by TheBrain 🧠</span></span>
    </div>
    <div id="myTable">
        <div style="float: left;margin-right:10px">
            <table class="inlineTable modes">
                <tbody>
                    <tr>
                        <th>${t('building')}</th>
                        <th>${t('level')}</th>
                        <th>${t('wood')}</th>
                        <th>${t('clay')}</th>
                        <th>${t('iron')}</th>
                        <th>${t('population')}</th>
                        <th>${t('points')}</th>
                    </tr>
                    <tr title="${t('headquarters')}">
                        <td><img src=${imageSrc.main}>${t('headquarters')}</td>
                        <td><input type="number" id="headquarters" class="building" maxlength="2" min="1" max="30" autofocus></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('barracks')}">
                        <td><img src=${imageSrc.barracks}>${t('barracks')}</td>
                        <td><input type="number" id="barracks" class="building" maxlength="2" min="0" max="25"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('stable')}">
                        <td><img src=${imageSrc.stable}>${t('stable')}</td>
                        <td><input type="number" id="stable" class="building" maxlength="2" min="0" max="20"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('garage')}">
                        <td><img src=${imageSrc.garage}>${t('garage')}</td>
                        <td><input type="number" id="garage" class="building" maxlength="2" min="0" max="15"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('church')}">
                        <td><img src=${imageSrc.church}>${t('church')}</td>
                        <td><input type="number" id="church" class="building" maxlength="1" min="0" max="3"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('church_f')}">
                        <td><img src=${imageSrc.church_f}>${t('church_f')}</td>
                        <td><input type="number" id="church_f" class="building" maxlength="1" min="0" max="1"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('watchtower')}">
                        <td><img src=${imageSrc.watchtower}>${t('watchtower')}</td>
                        <td><input type="number" id="watchtower" class="building" maxlength="2" min="0" max="20"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('academy')}">
                        <td><img src=${imageSrc.academy}>${t('academy')}</td>
                        <td><input type="number" id="academy" class="building" maxlength="1" min="0" max="1"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('smith')}">
                        <td><img src=${imageSrc.smith}>${t('smith')}</td>
                        <td><input type="number" id="smith" class="building" maxlength="2" min="0" max="20"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('place')}">
                        <td><img src=${imageSrc.place}>${t('place')}</td>
                        <td><input type="number" id="place" class="building" maxlength="1" min="0" max="1"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('statue')}">
                        <td><img src=${imageSrc.statue}>${t('statue')}</td>
                        <td><input type="number" id="statue" class="building" maxlength="1" min="0" max="1"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('market')}">
                        <td><img src=${imageSrc.market}>${t('market')}</td>
                        <td><input type="number" id="market" class="building" maxlength="2" min="0" max="25"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('timber_camp')}">
                        <td><img src=${imageSrc.timber_camp}>${t('timber_camp')}</td>
                        <td><input type="number" id="timber_camp" class="building" maxlength="2" min="0" max="30"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('clay_pit')}">
                        <td><img src=${imageSrc.clay_pit}>${t('clay_pit')}</td>
                        <td><input type="number" id="clay_pit" class="building" maxlength="2" min="0" max="30"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('iron_mine')}">
                        <td><img src=${imageSrc.iron_mine}>${t('iron_mine')}</td>
                        <td><input type="number" id="iron_mine" class="building" maxlength="2" min="0" max="30"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('farm')}">
                        <td><img src=${imageSrc.farm}>${t('farm')}</td>
                        <td><input type="number" id="farm" class="building" maxlength="2" min="1" max="30"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('warehouse')}">
                        <td><img src=${imageSrc.warehouse}>${t('warehouse')}</td>
                        <td><input type="number" id="warehouse" class="building" maxlength="2" min="1" max="30"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('hide')}">
                        <td><img src=${imageSrc.hide}>${t('hide')}</td>
                        <td><input type="number" id="hide" class="building" maxlength="2" min="0" max="10"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr title="${t('wall')}">
                        <td><img src=${imageSrc.wall}>${t('wall')}</td>
                        <td><input type="number" id="wall" class="building" maxlength="2" min="0" max="20"></td>
                        <td class="woodCost">0</td><td class="stoneCost">0</td><td class="ironCost">0</td><td class="popCost">0</td><td class="points">0</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td style="text-align:center">&#8679</td>
                        <td><img src=${imageSrc.wood}>&nbsp;<span id="currentBuildingsWoodCost">0</span></td>
                        <td><img src=${imageSrc.stone}>&nbsp;<span id="currentBuildingsStoneCost">0</span></td>
                        <td><img src=${imageSrc.iron}>&nbsp;<span id="currentBuildingsIronCost">0</span></td>
                        <td class="crosshatchedright" colspan="2">${t('currentLevelCost')}</td>
                    </tr>
                    <tr>
                        <td class="crosshatchedleft">${t('minLevel')}</td>
                        <td style="text-align:center"><input type="radio" id="minimum" onclick="minimum()" name="name"></td>
                    </tr>
                    <tr>
                        <td class="crosshatchedright">${t('maxLevel')}</td>
                        <td style="text-align:center"><input type="radio" id="maximum" onclick="maximum()" name="name"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="float: left;margin-right:10px">
            <table class="inlineTable">
                <tbody>
                    <tr>
                        <th>${t('unit')}</th>
                        <th>${t('amount')}</th>
                        <th>${t('trainTime')}</th>
                        <th>${t('perBuilding')}</th>
                        <th>${t('haul')}</th>
                        <th>${t('popSlots')}</th>
                    </tr>
                    <tr title="${t('spear')}">
                        <td><img src=${imageSrc.spear}>${t('spear')}</td>
                        <td><input type="number" id="spear" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="sumbuildtime" rowspan="4">00:00:00:00</td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr title="${t('sword')}">
                        <td><img src=${imageSrc.sword}>${t('sword')}</td>
                        <td><input type="number" id="sword" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr title="${t('axe')}">
                        <td><img src=${imageSrc.axe}>${t('axe')}</td>
                        <td><input type="number" id="axe" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr title="${t('archer')}">
                        <td><img src=${imageSrc.archer}>${t('archer')}</td>
                        <td><input type="number" id="archer" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr title="${t('spy')}">
                        <td><img src=${imageSrc.spy}>${t('spy')}</td>
                        <td><input type="number" id="spy" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="sumbuildtime" rowspan="4">00:00:00:00</td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr title="${t('light')}">
                        <td><img src=${imageSrc.light}>${t('light')}</td>
                        <td><input type="number" id="light" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr title="${t('marcher')}">
                        <td><img src=${imageSrc.marcher}>${t('marcher')}</td>
                        <td><input type="number" id="marcher" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr title="${t('heavy')}">
                        <td><img src=${imageSrc.heavy}>${t('heavy')}</td>
                        <td><input type="number" id="heavy" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr title="${t('ram')}">
                        <td><img src=${imageSrc.ram}>${t('ram')}</td>
                        <td><input type="number" id="ram" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="sumbuildtime" rowspan="2">00:00:00:00</td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr title="${t('catapult')}">
                        <td><img src=${imageSrc.catapult}>${t('catapult')}</td>
                        <td><input type="number" id="catapult" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr title="${t('knight')}">
                        <td><img src=${imageSrc.knight}>${t('knight')}</td>
                        <td><input type="number" id="knight" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="crosshatchedright"></td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr title="${t('noble')}">
                        <td><img src=${imageSrc.snob}>${t('noble')}</td>
                        <td><input type="number" id="snob" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="crosshatchedright"></td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr class="spaceUnder" title="${t('militia')}">
                        <td><img src=${imageSrc.militia}>${t('militia')}</td>
                        <td><input type="number" id="militia" class="unit" maxlength="5" min="0" max="32000"></td>
                        <td><span><span class="icon header time"></span><span class="build_time">00:00:00:00</span></span></td>
                        <td class="crosshatchedright"></td>
                        <td class="haul">0</td><td class="pop">0</td>
                    </tr>
                    <tr class="separator"/>
                </tbody>
            </table>
            <table class="inlineTable bonus">
                <tbody>
                    <tr>
                        <th colspan="3">${t('resourceBonus')}<img src=${imageSrc.questionMark} title="${t('ttResource')}" class="tooltip"></th>
                        <th class="space"></th>
                        <th colspan="3">${t('popBonus')}<img src=${imageSrc.questionMark} title="${t('ttPop')}" class="tooltip"></th>
                        <th class="space"></th>
                        <th colspan="2">${t('haulBonus')}<img src=${imageSrc.questionMark} title="${t('ttHaul')}" class="tooltip"></th>
                    </tr>
                    <tr>
                        <td><img src=${imageSrc.timber_camp}><input class="bon" id="woodBonus" type="number" min="0" max="500" value="0"></td>
                        <td><img src=${imageSrc.clay_pit}><input class="bon" id="stoneBonus" type="number" min="0" max="500" value="0"></td>
                        <td><img src=${imageSrc.iron_mine}><input class="bon" id="ironBonus" type="number" min="0" max="500" value="0"></td>
                        <td class="space"></td>
                        <td><img src=${imageSrc.bonusVillage}><input class="bon" id="popBonusVillage" type="number" min="0" max="500" value="0"></td>
                        <td><img src=${imageSrc.popFlag}><input class="bon" id="popFlag" type="number" min="0" max="500" value="0"></td>
                        <td><img src=${imageSrc.inventory}><input class="bon" id="popInventory" type="number" min="0" max="500" value="0"></td>
                        <td class="space"></td>
                        <td><img src=${imageSrc.haulFlag}><input class="bon" id="haulFlag" type="number" min="0" max="300" value="0"></td>
                        <td><img src=${imageSrc.inventory}><input class="bon" id="haulInventory" type="number" min="0" max="500" value="0"></td>
                    </tr>
                    <tr class="separator"/>
                </tbody>
            </table>
            <table class="inlineTable bonus">
                <tbody>
                    <tr>
                        <th colspan="4">${t('recruitBonus')}<img src=${imageSrc.questionMark} title="${t('ttRecruit')}" class="tooltip"></th>
                        <th class="space"></th>
                        <th colspan="2">${t('marketBonus')}<img src=${imageSrc.questionMark} title="${t('ttMarket')}" class="tooltip"></th>
                        <th class="space"></th>
                        <th colspan="2">${t('storageBonus')}<img src=${imageSrc.questionMark} title="${t('ttStorage')}" class="tooltip"></th>
                    </tr>
                    <tr>
                        <td><img src=${imageSrc.barracks}><input class="bon" id="barracksBonus" type="number" min="0" max="500" value="0"></td>
                        <td><img src=${imageSrc.stable}><input class="bon" id="stableBonus" type="number" min="0" max="500" value="0"></td>
                        <td><img src=${imageSrc.garage}><input class="bon" id="garageBonus" type="number" min="0" max="500" value="0"></td>
                        <td><img src=${imageSrc.academy}><input class="bon" id="academyBonus" type="number" min="0" max="500" value="0"></td>
                        <td class="space"></td>
                        <td><img src=${imageSrc.bonusVillage}><input class="bon" id="merchantsBonusVillage" type="number" min="0" max="500" value="0"></td>
                        <td><img src=${imageSrc.inventory}><input class="bon" id="merchantsInventory" type="number" min="0" max="500" value="0"></td>
                        <td class="space"></td>
                        <td><img src=${imageSrc.bonusVillage}><input class="bon" id="storageBonusVillage" type="number" min="0" max="500" value="0"></td>
                        <td><img src=${imageSrc.inventory}><input class="bon" id="storageInventory" type="number" min="0" max="500" value="0"></td>
                    </tr>
                    <tr class="separator"/>
                </tbody>
            </table>
            <table class="inlineTable border">
                <tbody>
                    <tr>
                        <td>
                            <label for="sablon">${t('profiles')} </label>
                            <select id="sablon">
                                <option selected hidden>${t('options')}</option>
                            </select>
                            &nbsp;
                            <input type="button" value="${t('save')}" onclick="store()">
                            &nbsp;
                            <input type="button" value="${t('delete')}" onclick="removeOptions()">
                            &nbsp;
                            <input type="button" value="${t('export')}" onclick="exports()">
                            &nbsp;
                            <input type="button" value="${t('import')}" onclick="imports()">
                            <b><code>Created by <a href="${forumURL}" target="_blank">öreg</a> &nbsp;|&nbsp; <span class="brain-inline">Powered by TheBrain 🧠</span></code></b>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="float: left;margin-right:10px">
            <table class="inlineTable modesb">
                <tbody>
                    <tr><th colspan="2">${t('buildingProps')}</th></tr>
                    <tr title="${t('farmSpace')}"><td style="width:50%"><img src=${imageSrc.header}>${t('farmSpace')}</td><td class="property" id="population" style="width:50%">0</td></tr>
                    <tr title="${t('occupiedPop')}"><td style="width:50%"><img src=${imageSrc.header}>${t('occupiedPop')}</td><td class="property" id="locked" style="width:50%">0</td></tr>
                    <tr title="${t('freePop')}"><td style="width:50%"><img src=${imageSrc.header}>${t('freePop')}</td><td class="property" id="free" style="width:50%">0</td></tr>
                    <tr title="${t('sumPoints')}"><td style="width:50%"><img src=${imageSrc.gold}>${t('sumPoints')}</td><td class="property" id="sumPoints" style="width:50%">0</td></tr>
                    <tr title="${t('hiddenRes')}"><td style="width:50%"><img src=${imageSrc.hide}>${t('hiddenRes')}</td><td class="property" id="hiddenResources" style="width:50%">0</td></tr>
                    <tr title="${t('merchants')}"><td style="width:50%"><img src=${imageSrc.market}>${t('merchants')}</td><td class="property" id="merchants" style="width:50%">0</td></tr>
                    <tr title="${t('storageCapacity')}"><td style="width:50%"><img src=${imageSrc.warehouse}>${t('storageCapacity')}</td><td class="property" id="capacity" style="width:50%">0</td></tr>
                    <tr title="${t('wallBonus')}"><td style="width:50%"><img src=${imageSrc.wall}>${t('wallBonus')}</td><td class="property" id="wallBonus" style="width:50%">0</td></tr>
                    <tr title="${t('woodProd')}"><td style="width:50%"><img src=${imageSrc.timber_camp}>${t('woodProd')}</td><td class="property" id="woodProd" style="width:50%">0</td></tr>
                    <tr title="${t('stoneProd')}"><td style="width:50%"><img src=${imageSrc.clay_pit}>${t('stoneProd')}</td><td class="property" id="stoneProd" style="width:50%">0</td></tr>
                    <tr title="${t('ironProd')}"><td style="width:50%"><img src=${imageSrc.iron_mine}>${t('ironProd')}</td><td class="property" id="ironProd" style="width:50%">0</td></tr>
                    <tr class="separator"/>
                </tbody>
            </table>
            <table class="inlineTable modesc">
                <tbody>
                    <tr><th colspan="6">${t('costs')}</th></tr>
                    <tr>
                        <td>${t('units_label')}</td><td></td>
                        <td>${t('buildings_label')}</td><td></td>
                        <td>${t('total')}</td><td></td>
                    </tr>
                    <tr>
                        <td><img src=${imageSrc.wood}></td><td id="unitsWoodCost">0</td>
                        <td><img src=${imageSrc.wood}></td><td id="buildingsWoodCost">0</td>
                        <td><img src=${imageSrc.wood}></td><td id="sumUnitsAndBuildingsWoodCost">0</td>
                    </tr>
                    <tr>
                        <td><img src=${imageSrc.stone}></td><td id="unitsStoneCost">0</td>
                        <td><img src=${imageSrc.stone}></td><td id="buildingsStoneCost">0</td>
                        <td><img src=${imageSrc.stone}></td><td id="sumUnitsAndBuildingsStoneCost">0</td>
                    </tr>
                    <tr>
                        <td><img src=${imageSrc.iron}></td><td id="unitsIronCost">0</td>
                        <td><img src=${imageSrc.iron}></td><td id="buildingsIronCost">0</td>
                        <td><img src=${imageSrc.iron}></td><td id="sumUnitsAndBuildingsIronCost">0</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `;
}

// === SIDEBAR ===
function buildSidebar() {
    return `
    <div class="gear" onclick="openNav()"><img src=${gear}></div>
    <div id="mySidenav" class="sidenav">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
        <textarea id="issueText" placeholder="${t('bugReport')}" rows="10" cols="50"></textarea>
        <button id="sendIssue" type="button" onclick="sendMessage()">${t('send')}</button>
        <br/>
        <textarea id="imageURL" placeholder="${t('imgLink')}" rows="1" cols="50"></textarea>
        <button id="addURL" type="button" onclick="addURL()">${t('addImg')}</button>
    </div>
    `;
}

// === LANGUAGE SWITCH ===
function switchLang(newLang) {
    currentLang = newLang;
    // Save current input values
    var inputVals = [];
    $("#myTable").find("input").each(function() { inputVals.push($(this).val()); });
    // Rebuild dialog content
    $("#popup_box_calculator .popup_box").html(buildContent());
    // Restore input values
    $("#myTable").find("input").each(function(i) { $(this).val(inputVals[i] || ""); });
    // Reattach events
    attachEvents();
    loadSelectMenu();
    buildingsFunctions();
    unitsFunctions();
    buildingsAndUnitsFunctions();
    // Update lang button state
    $("#btnCZ").toggleClass("active", newLang === "cz");
    $("#btnENG").toggleClass("active", newLang === "eng");
}

let player = game_data.player.name;
let world = game_data.world;
let script = { name: "Unit and building simulator", version: "v1.6" };
let issue = {
    text: ["|Player|World|Script name|Script version|",
           "|---|---|---|---|",
           `|${player}|${world}|${script.name}|${script.version}|`,
           "", "Issue:"].join("\n")
};

function sendMessage() {
    createIssue("Hibabejelentesek","oreg-kh","hiba/eszreves",issue.text,token)
}

function addURL() {
    var issueText = $("#issueText");
    var imageURL = $("#imageURL").val();
    issueText.val(issueText.val() + `![issue-image](${imageURL})`);
    $("#imageURL").val("");
}

function createIssue(repoName, repoOwner, issueTitle, issueBody, accessToken) {
    var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/issues";
    var text = $("#issueText").val();
    $.ajax({
        url: url, type: "POST",
        beforeSend: function(xhr) { xhr.setRequestHeader("Authorization", "token " + accessToken); },
        data: JSON.stringify({ title: issueTitle, body: issueBody + "\n" + text }),
        success: function() { UI.SuccessMessage(t('sendSuccess'), 5000); },
        error: function() { UI.ErrorMessage(t('sendError'), 5000); }
    })
}

function createSideBar() { $("body").append(buildSidebar()); }
function openNav() { document.getElementById("mySidenav").style.width = "390px"; }
function closeNav() { spinMainIcon(500, 180); document.getElementById("mySidenav").style.width = "0px"; }

function createHTML() {
    Dialog.show("calculator", buildContent(), function() { byebye() });
    createSideBar();
    buildingsInformation();
    unitsInformation();
    configInformation();
    loadSelectMenu();
}
createHTML();

function createObject() {
    for (const key of buildings) {
        if (!obj.buildingsObj[key]) obj.buildingsObj[key] = new Object;
    }
    for (const key of units) {
        if (!obj.unitsObj[key]) obj.unitsObj[key] = new Object;
    }
    return true;
}

function safeDefine(obj, prop, val) {
    if (!Object.getOwnPropertyDescriptor(obj, prop)) {
        Object.defineProperty(obj, prop, {value: val, writable: true, configurable: true});
    } else {
        obj[prop] = val;
    }
}

function getStorage(name) { return localStorage[`${name} ${game_data.world}`]; }
function setTimeInStorage(name) { localStorage.setItem(`${name} ${game_data.world}`, Date.now()); }
function setServerDataInStorage(name, value) { localStorage.setItem(`${name} ${game_data.world}`, JSON.stringify(value)); }
function parseData(name) { return new DOMParser().parseFromString(getStorage(name), 'text/html'); }

function getBuildingsInformation() {
    return setServerDataInStorage("buildingsConfig", $.ajax({
        url: `https://${document.domain}/interface.php?func=get_building_info`,
        type: 'GET', async: false,
        error: function(xhr, statusText, error) {
            $(".popup_box_container").remove();
            UI.ErrorMessage(t('errorBuilding') + error, 8000);
        }
    }))
}

async function buildingsInformation() {
    await createObject();
    if (!getStorage("buildingsTimeUpdate") || Date.now() > getStorage("buildingsTimeUpdate") + 3600 * 1000) {
        await getBuildingsInformation();
        setTimeInStorage("buildingsTimeUpdate");
    }
    for (var i = 0; i < buildings.length; i++) {
        for (var k = 0; k < datas.length; k++) {
            data = parseData("buildingsConfig");
            if ($(data).find(`config > ${buildings[i]}`).length > 0) {
                config = Number($(data).find(`config > ${buildings[i]} > ${datas[k]}`)[0].innerHTML);
                safeDefine(obj.buildingsObj[buildings[i]], datas[k], config);
                safeDefine(obj.buildingsObj[buildings[i]], "exist", true);
            } else {
                disableBuilding(buildings[i]);
                safeDefine(obj.buildingsObj[buildings[i]], "exist", false);
                if (buildings[i] == "statue") disableUnit("knight");
            }
        }
    }
}

function getUnitsInformation() {
    return setServerDataInStorage("unitsConfig", $.ajax({
        url: `https://${document.domain}/interface.php?func=get_unit_info`,
        type: 'GET', async: false,
        error: function(xhr, statusText, error) {
            $(".popup_box_container").remove();
            UI.ErrorMessage(t('errorUnits') + error, 8000);
        }
    }))
}

async function unitsInformation() {
    await createObject();
    if (!getStorage("unitsTimeUpdate") || Date.now() > getStorage("unitsTimeUpdate") + 3600 * 1000) {
        await getUnitsInformation();
        setTimeInStorage("unitsTimeUpdate");
    }
    for (var i = 0; i < units.length; i++) {
        for (var k = 0; k < dat.length; k++) {
            data = parseData("unitsConfig");
            if ($(data).find(`config > ${units[i]}`).length > 0) {
                config = Number($(data).find(`config > ${units[i]} > ${dat[k]}`)[0].innerHTML);
                safeDefine(obj.unitsObj[units[i]], dat[k], config);
                safeDefine(obj.unitsObj[units[i]], "exist", true);
            } else {
                if (units[i].includes("archer")) {
                    disableUnit(units[i]);
                    safeDefine(obj.unitsObj[units[i]], "exist", false);
                }
            }
        }
    }
    unitsResources();
    return true;
}

function getConfigInformation() {
    return setServerDataInStorage("configConfig", $.ajax({
        url: `https://${document.domain}/interface.php?func=get_config`,
        type: 'GET', async: false,
        error: function(xhr, statusText, error) {
            $(".popup_box_container").remove();
            UI.ErrorMessage(t('errorSpeed') + error, 8000);
        }
    }))
}

async function configInformation() {
    await createObject();
    if (!getStorage("configTimeUpdate") || Date.now() > getStorage("configTimeUpdate") + 3600 * 1000) {
        await getConfigInformation();
        setTimeInStorage("configTimeUpdate");
    }
    data = parseData("configConfig");
    config = Number($(data).find("config > speed").text());
    safeDefine(obj.world, "worldSpeed", config);
}

function getUnitsResources() {
    return new Promise(function(resolve, reject) {
        TribalWars.get("api", {ajax: "data", screen: "unit_info"}, resolve, reject)
    }).then(
        function(result) {
            setTimeInStorage("resourceTimeUpdate");
            setServerDataInStorage("resourceConfig", result);
        },
        function() {
            $(".popup_box_container").remove();
            UI.ErrorMessage(t('errorUnitsCost'), 8000);
        }
    )
}

async function unitsResources() {
    if (!getStorage("resourceTimeUpdate") || Date.now() > getStorage("resourceTimeUpdate") + 3600 * 1000) {
        await getUnitsResources();
    }
    data = JSON.parse(getStorage("resourceConfig"));
    for (var i = 0; i < units.length; i++) {
        if (obj.unitsObj[units[i]].exist === true) {
            safeDefine(obj.unitsObj[units[i]], "wood", data.unit_data[units[i]].wood);
            safeDefine(obj.unitsObj[units[i]], "stone", data.unit_data[units[i]].stone);
            safeDefine(obj.unitsObj[units[i]], "iron", data.unit_data[units[i]].iron);
        }
    }
}

// === CSS ===
function initCss(css) { $(`<style>${css}</style>`).appendTo("body"); }

initCss(`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

    #popup_box_calculator {
        width: 1500px !important;
    }
    #popup_box_calculator .popup_box_content {
        background: linear-gradient(160deg, #1a0003 0%, #2d0007 40%, #1f0005 100%) !important;
        border: 2px solid #8b0000 !important;
        box-shadow: 0 0 40px rgba(139,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.5) !important;
        font-family: 'Crimson Text', serif !important;
        color: #e8c4a0 !important;
    }
    #popup_box_calculator .popup_box {
        background: transparent !important;
    }

    /* Language bar */
    #twSimLangBar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px 10px 10px;
        border-bottom: 1px solid #5a0000;
        margin-bottom: 8px;
        background: linear-gradient(90deg, #1a0003, #2d0007, #1a0003);
    }
    .twsim-langbtn {
        font-family: 'Cinzel', serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1px;
        background: linear-gradient(135deg, #3d0000, #600000);
        color: #c8a080;
        border: 1px solid #8b0000;
        padding: 3px 10px;
        cursor: pointer;
        border-radius: 2px;
        transition: all 0.2s ease;
    }
    .twsim-langbtn:hover {
        background: linear-gradient(135deg, #600000, #8b0000);
        color: #f0d0a0;
        box-shadow: 0 0 8px rgba(139,0,0,0.7);
    }
    .twsim-langbtn.active {
        background: linear-gradient(135deg, #8b0000, #cc0000);
        color: #ffe0b0;
        border-color: #ff4444;
        box-shadow: 0 0 12px rgba(200,0,0,0.8);
    }
    #twsim-brand {
        margin-left: auto;
        font-family: 'Cinzel', serif;
        font-size: 11px;
        color: #8b4444;
        letter-spacing: 1px;
    }
    .brain-badge, .brain-inline {
        color: #cc5555;
        font-weight: 700;
    }

    div#myTable {
        overflow-x: auto;
        max-width: 100%;
        display: flex;
        white-space: nowrap;
        padding: 4px;
    }
    table.inlineTable {
        width: auto;
        vertical-align: top;
        border-collapse: collapse;
        border-spacing: 0px;
        margin: 0 6px;
        border: 1px solid #5a0000;
    }
    table.inlineTable th {
        border: 1px solid #6b0000;
        padding: 4px 6px;
        text-align: center;
        background: linear-gradient(135deg, #3d0000 0%, #5a0000 50%, #3d0000 100%);
        color: #ffb380;
        font-family: 'Cinzel', serif;
        font-size: 11px;
        letter-spacing: 0.5px;
        text-shadow: 0 1px 3px rgba(0,0,0,0.8);
    }
    table.inlineTable td {
        border: 1px solid #4a0000;
        padding: 2px 4px;
        text-align: left;
        color: #e0b896;
        font-family: 'Crimson Text', serif;
        font-size: 13px;
    }
    table.inlineTable tr:nth-child(even) {
        background-color: rgba(80, 0, 0, 0.25);
    }
    table.inlineTable tr:nth-child(odd) {
        background-color: rgba(40, 0, 0, 0.35);
    }
    table.inlineTable tr:hover td {
        background-color: rgba(139, 0, 0, 0.3) !important;
        color: #ffd0a0;
        transition: all 0.15s ease;
    }
    table.modes img {
        vertical-align: bottom;
        height: 18px;
        width: 22px;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8));
    }
    table.modesb img {
        vertical-align: bottom;
        height: 18px;
        width: 18px;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8));
    }
    table.modesc img { vertical-align: bottom; }
    table.modes tr:nth-child(8) img { width: 18px !important; }
    table.modes tr:nth-child(12) img { width: 18px !important; }
    table.modes tr:nth-child(21) img { vertical-align: bottom; height: 16px !important; width: 18px !important; }
    table.bonus tr:first-child img { vertical-align: bottom; height: 13px; width: 13px; }
    table.bonus tr:nth-child(2) img { vertical-align: bottom; margin-right: 1px; height: 18px; width: 22px; }
    table.bonus tr:nth-child(2) input { width: 35px; }

    /* Inputs */
    input.building {
        width: 30px;
        background: rgba(60, 0, 0, 0.7);
        border: 1px solid #6b0000;
        color: #ffcc99;
        font-family: 'Crimson Text', serif;
        font-size: 13px;
        text-align: center;
        border-radius: 2px;
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    input.unit {
        width: 70px;
        background: rgba(60, 0, 0, 0.7);
        border: 1px solid #6b0000;
        color: #ffcc99;
        font-family: 'Crimson Text', serif;
        font-size: 13px;
        text-align: center;
        border-radius: 2px;
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    input.bon {
        background: rgba(60, 0, 0, 0.7);
        border: 1px solid #6b0000;
        color: #ffcc99;
        font-family: 'Crimson Text', serif;
        font-size: 12px;
        text-align: center;
        border-radius: 2px;
    }
    input.building:focus, input.unit:focus, input.bon:focus {
        outline: none;
        border-color: #cc0000;
        box-shadow: 0 0 6px rgba(200,0,0,0.6);
    }
    input.building:disabled, input.unit:disabled {
        background: rgba(20, 0, 0, 0.5);
        border-color: #3a0000;
        color: #664444;
        cursor: not-allowed;
    }
    input[type="button"] {
        background: linear-gradient(135deg, #5a0000, #8b0000);
        border: 1px solid #aa0000;
        color: #ffcc99;
        font-family: 'Cinzel', serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
        padding: 3px 8px;
        cursor: pointer;
        border-radius: 2px;
        transition: all 0.2s ease;
    }
    input[type="button"]:hover {
        background: linear-gradient(135deg, #8b0000, #cc0000);
        box-shadow: 0 0 8px rgba(200,0,0,0.6);
        color: #fff0d0;
    }
    select#sablon {
        background: rgba(60, 0, 0, 0.8);
        border: 1px solid #6b0000;
        color: #ffcc99;
        font-family: 'Crimson Text', serif;
        font-size: 13px;
        padding: 1px 4px;
        border-radius: 2px;
    }
    select#sablon:focus {
        outline: none;
        border-color: #cc0000;
    }

    /* Striped crosshatch */
    tr.separator { height: 18px; }
    .space { background: none !important; border: none !important; width: 5px; }
    .border td { border: none !important; }
    .crosshatchedright {
        background: repeating-linear-gradient(-45deg, rgba(139,0,0,0.15), rgba(139,0,0,0.15) 5px, rgba(80,0,0,0.25) 5px, rgba(80,0,0,0.25) 8px);
    }
    .crosshatchedleft {
        background: repeating-linear-gradient(45deg, rgba(139,0,0,0.15), rgba(139,0,0,0.15) 5px, rgba(80,0,0,0.25) 5px, rgba(80,0,0,0.25) 8px);
    }

    /* Data cells */
    .sumbuildtime, .haul, .pop, .build_time, .woodCost, .stoneCost, .ironCost, .popCost, .points {
        text-align: center !important;
        font-variant-numeric: tabular-nums;
    }
    .property {
        text-align: right !important;
        font-variant-numeric: tabular-nums;
        color: #ffcc88 !important;
        font-weight: 600;
    }
    .red { color: #ff4444 !important; font-weight: 700; }

    /* Tooltip img */
    img.tooltip {
        cursor: help;
        margin-left: 3px;
        transition: opacity 0.2s;
        filter: drop-shadow(0 0 3px rgba(200,100,0,0.5));
    }
    img.tooltip:hover { opacity: 0.7; }

    /* Links */
    #popup_box_calculator a {
        color: #ff8855;
        text-decoration: none;
        transition: color 0.2s;
    }
    #popup_box_calculator a:hover {
        color: #ffaa77;
        text-shadow: 0 0 6px rgba(255,100,0,0.5);
    }

    /* === SIDEBAR === */
    .sidenav {
        height: 100%;
        width: 0px;
        position: fixed;
        z-index: 19;
        top: 35px;
        left: 0px;
        background: linear-gradient(160deg, #1a0003 0%, #2d0007 100%);
        border-right: 2px solid #8b0000;
        box-shadow: 4px 0 20px rgba(139,0,0,0.5);
        overflow-x: hidden;
        transition: 0.4s cubic-bezier(0.4,0,0.2,1);
        padding-top: 60px;
    }
    .sidenav a {
        padding: 8px 8px 8px 32px;
        text-decoration: none;
        font-size: 25px;
        color: #884444;
        display: block;
        transition: 0.3s;
        font-family: 'Cinzel', serif;
    }
    .sidenav a:hover { color: #ffaa77; }
    .sidenav .closebtn { position: absolute; top: 0; right: 0px; font-size: 36px; margin-left: 50px; }
    .sidenav textarea {
        background: rgba(60,0,0,0.8);
        border: 1px solid #6b0000;
        color: #ffcc99;
        font-family: 'Crimson Text', serif;
        resize: vertical;
        display: block;
        margin: 0 auto 6px auto;
    }
    .sidenav textarea:focus {
        outline: none;
        border-color: #cc0000;
        box-shadow: 0 0 6px rgba(200,0,0,0.4);
    }
    button#sendIssue, button#addURL {
        display: block;
        margin: 0 6.5px 8px auto;
        cursor: pointer;
        background: linear-gradient(135deg, #5a0000, #8b0000);
        border: 1px solid #aa0000;
        color: #ffcc99;
        font-family: 'Cinzel', serif;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 2px;
        transition: all 0.2s;
    }
    button#sendIssue:hover, button#addURL:hover {
        background: linear-gradient(135deg, #8b0000, #cc0000);
        box-shadow: 0 0 8px rgba(200,0,0,0.6);
    }
    .gear img {
        z-index: 12000;
        position: absolute;
        top: 3px;
        cursor: pointer;
        width: 45px;
        height: 45px;
        filter: drop-shadow(0 0 4px rgba(139,0,0,0.8)) sepia(0.3) saturate(1.2);
        transition: filter 0.3s;
    }
    .gear img:hover {
        filter: drop-shadow(0 0 8px rgba(200,0,0,1)) sepia(0.5) saturate(1.5);
    }

    /* Popup title bar */
    #popup_box_calculator .popup_box_title {
        background: linear-gradient(90deg, #3d0000, #700000, #3d0000) !important;
        border-bottom: 2px solid #8b0000 !important;
        color: #ffb380 !important;
        font-family: 'Cinzel', serif !important;
        text-shadow: 0 0 10px rgba(255,100,0,0.5) !important;
    }
    #popup_box_calculator .popup_box_close {
        color: #cc5555 !important;
    }
    #popup_box_calculator .popup_box_close:hover {
        color: #ff4444 !important;
    }

    @media screen and (max-height: 450px) {
        .sidenav { padding-top: 15px; }
        .sidenav a { font-size: 18px; }
    }
`);

// === PROFILE FUNCTIONS ===
function createOption(option_name) {
    $("#sablon").append(`<option>${option_name}</option>`);
}

function getAllInputValue() {
    var array = [];
    for (var i = 0; i < 48; i++) {
        array.push($("#myTable").find("input").eq(i).val());
    }
    var name = prompt(t('savePrompt'));
    return {array, name};
}

function store() {
    var pre = getAllInputValue();
    if (!pre.name) return;
    var name = "oregsaver_" + pre.name;
    localStorage.setItem(name, btoa(JSON.stringify({inputs: pre.array})));
    createOption(pre.name);
}

function loadSelectMenu() {
    for (var key in localStorage) {
        if (key.startsWith("oregsaver_")) {
            createOption(key.split("_")[1]);
        }
        // legacy support for old hungarian key encoding
        if (key.includes("regsaver_") && !key.startsWith("oregsaver_")) {
            var legacyName = key.split("_")[1];
            createOption(legacyName + " (legacy)");
        }
    }
}

function removeOptions() {
    var item = $("#sablon").find(":selected");
    var optionName = item.text();
    item.remove();
    for (var key in localStorage) {
        if (key === `oregsaver_${optionName}`) {
            localStorage.removeItem(key);
        }
    }
}

function exports() {
    var item = $("#sablon").find(":selected");
    var optionName = item.text();
    if (optionName !== t('options')) {
        var val = localStorage.getItem(`oregsaver_${optionName}`);
        prompt(t('exportInfo'), optionName + "," + val);
    }
}

function imports() {
    var importCode = prompt(t('importPrompt'));
    if (!importCode || !importCode.includes(",")) return;
    var key = importCode.split(",")[0];
    var val = importCode.split(",")[1];
    localStorage.setItem(`oregsaver_${key}`, val);
    createOption(key);
}

// Profile select handler
function attachEvents() {
    $("#sablon").off("click").on("click", function() {
        var item = $("#sablon").find(":selected");
        var optionName = item.text();
        if (optionName !== t('options')) {
            var val = localStorage.getItem(`oregsaver_${optionName}`);
            if (!val) return;
            var inputs = JSON.parse(atob(val)).inputs;
            for (var i = 0; i < 48; i++) {
                $("#myTable").find("input").eq(i).val(inputs[i]);
            }
        }
        buildingsFunctions();
        unitsFunctions();
        buildingsAndUnitsFunctions();
    });

    $(".building, .unit, .bon").off("keyup input").on("keyup input", function(event) {
        var classname = event.target.className;
        var value = event.target.valueAsNumber;
        var min = Number(event.target.min);
        var max = Number(event.target.max);
        var val = event.target.value;
        var keyCode = event.keyCode;
        if (regExp.test(val) || value > max || value < min || ((keyCode < 7 || keyCode > 9) && (keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105))) {
            event.target.value = "";
            if (classname == "building") createMessage("ErrorMessage", t('errorBuilding') + min + t('errorBuildingLevelMax') + max, 1500);
            if (classname == "unit") createMessage("ErrorMessage", t('errorUnit') + min + t('errorBuildingLevelMax') + max, 1500);
            if (classname == "bon") createMessage("ErrorMessage", t('errorBonus') + min + t('errorBuildingLevelMax') + max, 1500);
        } else {
            if (classname == "building") { buildingsFunctions(); unitsFunctions(); buildingsAndUnitsFunctions(); }
            if (classname == "unit") { unitsFunctions(); buildingsAndUnitsFunctions(); }
            if (classname == "bon") { buildingsFunctions(); unitsFunctions(); buildingsAndUnitsFunctions(); }
        }
    });
}
attachEvents();

// === CALCULATION FUNCTIONS ===
function createMessage(type, message, time) { UI[type](message, time); }

function buildingsLevel(building, level) { return Number($("#" + building).val()) >= level; }

function enableUnit(unit) {
    if (obj.unitsObj[unit].exist === false) return document.getElementById(unit).disabled = true;
    return document.getElementById(unit).disabled = false;
}
function enableBuilding(building) {
    if (obj.buildingsObj[building].exist === false) return document.getElementById(building).disabled = true;
    if (building == "snob") building = "academy";
    return document.getElementById(building).disabled = false;
}
function disableUnit(unit) { return document.getElementById(unit).disabled = true; }
function disableBuilding(building) {
    if (building == "snob") building = "academy";
    return document.getElementById(building).disabled = true;
}
function resetUnit() { for (var i = 2; i < units.length-1; i++) disableUnit(units[i]); }
resetUnit();
function resetBuilding() {
    var b = ["barracks","stable","garage","church","watchtower","academy","smith","market","wall"];
    for (var i = 0; i < b.length; i++) disableBuilding(b[i]);
}
resetBuilding();

function woodCost() {
    for (var i = 0; i < buildings.length; i++) {
        var lvl = Number($(".building").eq(i).val());
        var w = obj.buildingsObj[buildings[i]].wood;
        var wf = obj.buildingsObj[buildings[i]].wood_factor;
        $(".woodCost").eq(i).text((lvl == 0 || lvl == "") ? 0 : numberWithCommas(Math.round(Math.pow(wf, lvl-1)*w)));
    }
}
function stoneCost() {
    for (var i = 0; i < buildings.length; i++) {
        var lvl = Number($(".building").eq(i).val());
        var s = obj.buildingsObj[buildings[i]].stone;
        var sf = obj.buildingsObj[buildings[i]].stone_factor;
        $(".stoneCost").eq(i).text((lvl == 0 || lvl == "") ? 0 : numberWithCommas(Math.round(Math.pow(sf, lvl-1)*s)));
    }
}
function ironCost() {
    for (var i = 0; i < buildings.length; i++) {
        var lvl = Number($(".building").eq(i).val());
        var ir = obj.buildingsObj[buildings[i]].iron;
        var irf = obj.buildingsObj[buildings[i]].iron_factor;
        $(".ironCost").eq(i).text((lvl == 0 || lvl == "") ? 0 : numberWithCommas(Math.round(Math.pow(irf, lvl-1)*ir)));
    }
}
function popCost() {
    for (var i = 0; i < buildings.length; i++) {
        var lvl = Number($(".building").eq(i).val());
        var p = obj.buildingsObj[buildings[i]].pop;
        var pf = obj.buildingsObj[buildings[i]].pop_factor;
        $(".popCost").eq(i).text((lvl == 0 || lvl == "") ? 0 : numberWithCommas(Math.round(Math.pow(pf, lvl-1)*p)));
    }
    return true;
}
function points() {
    for (var i = 0; i < buildings.length; i++) {
        var lvl = Number($(".building").eq(i).val());
        var btf = obj.buildingsObj[buildings[i]].build_time_factor;
        $(".points").eq(i).text((lvl == 0 || lvl == "") ? 0 : numberWithCommas(Math.round(Math.pow(btf, lvl-1)*firstLevelPoint[i])));
    }
    return true;
}
async function sumPoints() {
    await points();
    var sum = 0;
    for (var i = 0; i < buildings.length; i++) {
        sum += Number($(".points").eq(i).text().replace(/\./g, ""));
    }
    $("#sumPoints").text(numberWithCommas(sum));
}
function hiddenResources() {
    var lvl = Number($("#hide").val());
    if (lvl == 0 || lvl == "") { $("#hiddenResources").text(0); return; }
    var text = Math.pow((4/3), lvl-1) * 150;
    $("#hiddenResources").text(lvl > 7 ? numberWithCommas(roundToNearestFive(text)) : roundToNearestInteger(text));
}
function numberOfMerchants() {
    var lvl = Number($("#market").val());
    var text = (lvl >= 10) ? Math.pow(lvl-10, 2)+10 : (lvl == "" ? 0 : lvl);
    $("#merchants").text(text);
    return text;
}
function capacity() {
    var lvl = Number($("#warehouse").val());
    if (lvl == 0 || lvl == "") { $("#capacity").text(0); return 0; }
    var text = Math.pow(1.2294934, lvl-1) * 1000;
    $("#capacity").text(numberWithCommas(roundToNearestInteger(text)));
    return text;
}
function wallBonus() {
    var lvl = Number($("#wall").val());
    var text = (Math.pow(1.037, lvl)-1)*100;
    $("#wallBonus").text(roundToNearestInteger(text) + "%");
}
function woodProd() {
    var lvl = Number($("#timber_camp").val());
    var wood = (lvl == 0 || lvl == "") ? 0 : Math.pow(1.163118, lvl-1)*30;
    $("#woodProd").text(numberWithCommas(roundToNearestInteger(wood)));
    return {wood};
}
function stoneProd() {
    var lvl = Number($("#clay_pit").val());
    var stone = (lvl == 0 || lvl == "") ? 0 : Math.pow(1.163118, lvl-1)*30;
    $("#stoneProd").text(numberWithCommas(roundToNearestInteger(stone)));
    return {stone};
}
function ironProd() {
    var lvl = Number($("#iron_mine").val());
    var iron = (lvl == 0 || lvl == "") ? 0 : Math.pow(1.163118, lvl-1)*30;
    $("#ironProd").text(numberWithCommas(roundToNearestInteger(iron)));
    return {iron};
}
function population() {
    var lvl = Number($("#farm").val());
    var text = (lvl == 0 || lvl == "") ? 0 : Math.pow(1.172103, lvl-1)*240;
    $("#population").text(numberWithCommas(roundToNearestInteger(text)));
    return text;
}

function buildTimeOfUnit() {
    var bl = Number($("#barracks").val()), sl = Number($("#stable").val());
    var gl = Number($("#garage").val()), stl = Number($("#statue").val());
    var al = Number($("#academy").val());
    for (var i = 0; i < units.length; i++) {
        var bt = obj.unitsObj[units[i]].build_time;
        var piece = Number($(".unit").eq(i).val());
        var rb = recruitBonus();
        if (i < 4) {
            $(".build_time").eq(i).text((!bt || bl==0||bl=="") ? "00:00:00:00" : secondsToDhms(Math.ceil(2/3*bt*Math.pow(1.06,-bl)*piece/rb.barracksBonus)));
        } else if (i < 8) {
            $(".build_time").eq(i).text((!bt || sl==0||sl=="") ? "00:00:00:00" : secondsToDhms(Math.ceil(2/3*bt*Math.pow(1.06,-sl)*piece/rb.stableBonus)));
        } else if (i < 10) {
            $(".build_time").eq(i).text((!bt || gl==0||gl=="") ? "00:00:00:00" : secondsToDhms(Math.ceil(2/3*bt*Math.pow(1.06,-gl)*piece/rb.garageBonus)));
        } else if (i==10) {
            $(".build_time").eq(i).text((!bt || stl==0||stl=="") ? "00:00:00:00" : secondsToDhms(bt*piece));
        } else if (i==11) {
            $(".build_time").eq(i).text((!bt || al==0||al=="") ? "00:00:00:00" : secondsToDhms(Math.ceil(2/3*bt*Math.pow(1.06,-al)*piece/rb.academyBonus)));
        } else {
            $(".build_time").eq(i).text("00:00:00:00");
        }
    }
    return true;
}

function calcHaulAndPop(i, buildingLevel, carry, pop) {
    var piece = Number($(".unit").eq(i).val());
    $(".haul").eq(i).text((!carry || buildingLevel==0||buildingLevel=="") ? 0 : numberWithCommas(carry*piece));
    $(".pop").eq(i).text((!pop || buildingLevel==0||buildingLevel=="") ? 0 : numberWithCommas(pop*piece));
}

function unitsHaul() {
    var bl=Number($("#barracks").val()), sl=Number($("#stable").val());
    var gl=Number($("#garage").val()), stl=Number($("#statue").val()), al=Number($("#academy").val());
    for (var i=0;i<units.length;i++) {
        var carry=Number(obj.unitsObj[units[i]].carry);
        var bLevel = i<4?bl : i<8?sl : i<10?gl : i==10?stl : i==11?al : 0;
        if (i==12) { $(".haul").eq(i).text(0); continue; }
        var piece=Number($(".unit").eq(i).val());
        $(".haul").eq(i).text((!carry||bLevel==0||bLevel=="") ? 0 : numberWithCommas(carry*piece));
    }
}

function unitsPop() {
    var bl=Number($("#barracks").val()), sl=Number($("#stable").val());
    var gl=Number($("#garage").val()), stl=Number($("#statue").val()), al=Number($("#academy").val());
    for (var i=0;i<units.length;i++) {
        var pop=Number(obj.unitsObj[units[i]].pop);
        var bLevel = i<4?bl : i<8?sl : i<10?gl : i==10?stl : i==11?al : 0;
        if (i==12) { $(".pop").eq(i).text(0); continue; }
        var piece=Number($(".unit").eq(i).val());
        $(".pop").eq(i).text((!pop||bLevel==0||bLevel=="") ? 0 : numberWithCommas(pop*piece));
    }
    return true;
}

async function sumBuildTimeOfUnit() {
    await buildTimeOfUnit();
    var s=[0,0,0];
    for (var i=0;i<units.length;i++) {
        var time=$(".build_time").eq(i).text().split(":");
        var secs=Number(time[0])*86400+Number(time[1])*3600+Number(time[2])*60+Number(time[3]);
        if (i<4) { s[0]+=secs; $(".sumbuildtime").eq(0).text(secondsToDhms(s[0])); }
        else if (i<8) { s[1]+=secs; $(".sumbuildtime").eq(1).text(secondsToDhms(s[1])); }
        else if (i<10) { s[2]+=secs; $(".sumbuildtime").eq(2).text(secondsToDhms(s[2])); }
    }
}

async function lockedPop() {
    var sum=0;
    await popCost();
    $(".popCost").each(function() { sum+=Number($(this).text().replace(/\./g,"")); });
    await unitsPop();
    $(".pop").each(function() { sum+=Number($(this).text().replace(/\./g,"")); });
    $("#locked").text(numberWithCommas(sum));
    return sum;
}

async function freePop() {
    var res=await popBonus();
    var result=await lockedPop();
    redClass();
    var pop=Math.floor(res), free=pop-result;
    $("#free").text(numberWithCommas(free));
}

function redClass() {
    var pop=Number($("#population").text().replace(/\./g,"")),
        locked=Number($("#locked").text().replace(/\./g,""));
    if (locked>pop) { $("#locked").addClass("red"); $("#free").addClass("red"); }
    else { $("#locked").removeClass("red"); $("#free").removeClass("red"); }
}

async function marketBonus() {
    var merchants=await numberOfMerchants();
    var mbv=Number($("#merchantsBonusVillage").val()), mi=Number($("#merchantsInventory").val());
    $("#merchants").text(Math.round(merchants*(mbv+mi)/100+merchants));
}

async function storageBonus() {
    var storage=await capacity();
    var sbv=Number($("#storageBonusVillage").val()), si=Number($("#storageInventory").val());
    $("#capacity").text(numberWithCommas(Math.round(storage*(sbv+si)/100+storage)));
}

async function haulBonus() {
    await unitsHaul();
    var haul=$(".haul");
    var hf=Number($("#haulFlag").val()), hi=Number($("#haulInventory").val());
    for (var i=0;i<haul.length;i++) {
        var old=Number(haul.eq(i).text().replace(/\./g,""));
        haul.eq(i).text(numberWithCommas(Math.round(old*(1+hf/100)*(1+hi/100))));
    }
}

async function popBonus() {
    var res=await population();
    var pbv=Number($("#popBonusVillage").val()), pf=Number($("#popFlag").val()), pi=Number($("#popInventory").val());
    var newPop=res*(1+pbv/100)*(1+pf/100)*(1+pi/100);
    $("#population").text(numberWithCommas(Math.floor(newPop)));
    return newPop;
}

function recruitBonus() {
    return {
        barracksBonus: 1+Number($("#barracksBonus").val())/100,
        stableBonus:   1+Number($("#stableBonus").val())/100,
        garageBonus:   1+Number($("#garageBonus").val())/100,
        academyBonus:  1+Number($("#academyBonus").val())/100
    };
}

async function resourceBonus() {
    var wp=await woodProd(), sp=await stoneProd(), ip=await ironProd();
    var ws=obj.world.worldSpeed;
    var wb=Number($("#woodBonus").val()), sb=Number($("#stoneBonus").val()), ib=Number($("#ironBonus").val());
    $("#woodProd").text(numberWithCommas(Math.round(wp.wood*ws*(1+wb/100))));
    $("#stoneProd").text(numberWithCommas(Math.round(sp.stone*ws*(1+sb/100))));
    $("#ironProd").text(numberWithCommas(Math.round(ip.iron*ws*(1+ib/100))));
}

function unitsCost() {
    var wood=0, stone=0, iron=0;
    for (var i=0;i<units.length;i++) {
        if (obj.unitsObj[units[i]].exist===true) {
            var piece=Number($(".unit").eq(i).val());
            wood+=Number(obj.unitsObj[units[i]].wood)*piece;
            stone+=Number(obj.unitsObj[units[i]].stone)*piece;
            iron+=Number(obj.unitsObj[units[i]].iron)*piece;
        }
    }
    $("#unitsWoodCost").text(numberWithCommas(wood));
    $("#unitsStoneCost").text(numberWithCommas(stone));
    $("#unitsIronCost").text(numberWithCommas(iron));
    return {wood,stone,iron};
}

function buildingsCost() {
    var wood=0, stone=0, iron=0;
    for (var i=0;i<buildings.length;i++) {
        var lvl=Number($(".building").eq(i).val());
        if (lvl==0||lvl=="") continue;
        var w=obj.buildingsObj[buildings[i]].wood, wf=obj.buildingsObj[buildings[i]].wood_factor;
        var s=obj.buildingsObj[buildings[i]].stone, sf=obj.buildingsObj[buildings[i]].stone_factor;
        var ir=obj.buildingsObj[buildings[i]].iron, irf=obj.buildingsObj[buildings[i]].iron_factor;
        for (var k=1;k<=lvl;k++) {
            wood+=Math.pow(wf,k-1)*w;
            stone+=Math.pow(sf,k-1)*s;
            iron+=Math.pow(irf,k-1)*ir;
        }
    }
    $("#buildingsWoodCost").text(numberWithCommas(Math.round(wood)));
    $("#buildingsStoneCost").text(numberWithCommas(Math.round(stone)));
    $("#buildingsIronCost").text(numberWithCommas(Math.round(iron)));
    return {wood,stone,iron};
}

async function sumUnitsAndBuildingsCost() {
    var b=await buildingsCost();
    currentBuildingsCost();
    var u=await unitsCost();
    $("#sumUnitsAndBuildingsWoodCost").text(numberWithCommas(Math.round(u.wood+b.wood)));
    $("#sumUnitsAndBuildingsStoneCost").text(numberWithCommas(Math.round(u.stone+b.stone)));
    $("#sumUnitsAndBuildingsIronCost").text(numberWithCommas(Math.round(u.iron+b.iron)));
}

function currentBuildingsCost() {
    var wood=0, stone=0, iron=0;
    $(".woodCost").each(function() { wood+=Number($(this).text().replace(/\./g,"")); });
    $(".stoneCost").each(function() { stone+=Number($(this).text().replace(/\./g,"")); });
    $(".ironCost").each(function() { iron+=Number($(this).text().replace(/\./g,"")); });
    $("#currentBuildingsWoodCost").text(numberWithCommas(wood));
    $("#currentBuildingsStoneCost").text(numberWithCommas(stone));
    $("#currentBuildingsIronCost").text(numberWithCommas(iron));
}

// === UTILITIES ===
function secondsToDhms(seconds) {
    var d=Math.floor(seconds/86400), h=Math.floor(seconds%86400/3600);
    var m=Math.floor(seconds%3600/60), s=Math.floor(seconds%60);
    return (d<10?"0"+d:d)+":"+(h<10?"0"+h:h)+":"+(m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
}
function roundToNearestFive(n) { return Math.ceil(n/5)*5; }
function roundToNearestInteger(n) { return Math.round(n); }
function roundDownToNearestInteger(n) { return Math.floor(n); }
function roundUpToNearestInteger(n) { return Math.ceil(n); }
// FIX: replace ALL dots, not just first
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
}
function byebye() { createMessage("SuccessMessage", t('bye'), 2000); }

function buildingsFunctions() {
    select(); woodCost(); stoneCost(); ironCost(); popCost();
    sumPoints(); hiddenResources(); wallBonus(); marketBonus();
    storageBonus(); resourceBonus();
}
function unitsFunctions() { unitsPop(); sumBuildTimeOfUnit(); haulBonus(); }
function buildingsAndUnitsFunctions() { freePop(); sumUnitsAndBuildingsCost(); }

function spinMainIcon(durationMs, deg) {
    $({deg:0}).animate({deg:deg}, {
        duration: durationMs,
        step: (angle) => { $(".gear img").css({transform:'rotate('+angle+'deg)'}); }
    });
}
$(".gear").find("img").on("click", function() { spinMainIcon(500,-180); });

function minimum() {
    for (var i=0;i<buildings.length;i++) $(".building").eq(i).val(obj.buildingsObj[buildings[i]].min_level);
    buildingsFunctions(); unitsFunctions(); buildingsAndUnitsFunctions();
}
function maximum() {
    for (var i=0;i<buildings.length;i++) $(".building").eq(i).val(obj.buildingsObj[buildings[i]].max_level);
    buildingsFunctions(); unitsFunctions(); buildingsAndUnitsFunctions();
}

function select() {
    // Buildings
    buildingsLevel("headquarters",3) ? enableBuilding("barracks") : disableBuilding("barracks");
    (buildingsLevel("headquarters",10)&&buildingsLevel("barracks",5)&&buildingsLevel("smith",5)) ? enableBuilding("stable") : disableBuilding("stable");
    (buildingsLevel("headquarters",10)&&buildingsLevel("smith",10)) ? enableBuilding("garage") : disableBuilding("garage");
    (buildingsLevel("headquarters",5)&&buildingsLevel("farm",5)) ? enableBuilding("church") : disableBuilding("church");
    (buildingsLevel("headquarters",20)&&buildingsLevel("smith",20)&&buildingsLevel("market",10)) ? enableBuilding("snob") : disableBuilding("snob");
    (buildingsLevel("headquarters",5)&&buildingsLevel("barracks",1)) ? enableBuilding("smith") : disableBuilding("smith");
    (buildingsLevel("headquarters",3)&&buildingsLevel("warehouse",2)) ? enableBuilding("market") : disableBuilding("market");
    buildingsLevel("barracks",1) ? enableBuilding("wall") : disableBuilding("wall");
    (buildingsLevel("headquarters",5)&&buildingsLevel("farm",5)) ? enableBuilding("watchtower") : disableBuilding("watchtower");
    // Units
    buildingsLevel("smith",2) ? enableUnit("axe") : disableUnit("axe");
    (buildingsLevel("barracks",5)&&buildingsLevel("smith",5)) ? enableUnit("archer") : disableUnit("archer");
    buildingsLevel("stable",1) ? enableUnit("spy") : disableUnit("spy");
    buildingsLevel("stable",3) ? enableUnit("light") : disableUnit("light");
    buildingsLevel("stable",5) ? enableUnit("marcher") : disableUnit("marcher");
    (buildingsLevel("stable",10)&&buildingsLevel("smith",15)) ? enableUnit("heavy") : disableUnit("heavy");
    buildingsLevel("garage",1) ? enableUnit("ram") : disableUnit("ram");
    (buildingsLevel("garage",2)&&buildingsLevel("smith",12)) ? enableUnit("catapult") : disableUnit("catapult");
    buildingsLevel("statue",1) ? enableUnit("knight") : disableUnit("knight");
    (buildingsLevel("academy",1)&&buildingsLevel("headquarters",20)&&buildingsLevel("smith",20)&&buildingsLevel("market",10)) ? enableUnit("snob") : disableUnit("snob");
}
void(0);
