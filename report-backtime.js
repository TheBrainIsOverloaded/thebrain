let availableUnits = {};
let unitSpeedSettings;

$.when($.get('/interface.php?func=get_unit_info')).done(function(xml) {
    $(xml).find('config').children().each((index, unit) => {
        availableUnits[$(unit).prop('nodeName')] = parseFloat($(unit).find('speed').text());
    });
    unitSpeedSettings = availableUnits;
}).then(() => {
    console.log("Data o jednotkách přijata");
    getReportInformation(unitSpeedSettings);
});

function getReportInformation(unitSpeedSettings) {
    try {
        const attackAnchor = $("#attack_info_att .village_anchor a");
        const defenseAnchor = $("#attack_info_def .village_anchor a");

        var attackVillage = {
            "coordinates": attackAnchor.text().match(/\d+\|\d+/)[0],
        };

        var defenseVillage = {
            "coordinates": defenseAnchor.text().match(/\d+\|\d+/)[0],
        };

        var distance = calculateDistance(attackVillage.coordinates, defenseVillage.coordinates);
        let battleTime = findBattleTime();

        // Rozšířený seznam jednotek o luky
        let units = {
            "spear": parseInt($(".unit-item-spear").text()) || 0,
            "sword": parseInt($(".unit-item-sword").text()) || 0,
            "axe": parseInt($(".unit-item-axe").text()) || 0,
            "archer": parseInt($(".unit-item-archer").text()) || 0,
            "spy": parseInt($(".unit-item-spy").text()) || 0,
            "light": parseInt($(".unit-item-light").text()) || 0,
            "marcher": parseInt($(".unit-item-marcher").text()) || 0,
            "heavy": parseInt($(".unit-item-heavy").text()) || 0,
            "ram": parseInt($(".unit-item-ram").text()) || 0,
            "catapult": parseInt($(".unit-item-catapult").text()) || 0,
            "knight": parseInt($(".unit-item-knight").text()) || 0,
            "snob": parseInt($(".unit-item-snob").text()) || 0,
        };

        calculateBacktimeTime(units, unitSpeedSettings, distance, battleTime);
    } catch (e) {
        UI.ErrorMessage("Chyba při analýze reportu. Ujistěte se, že jste v náhledu oznámení.");
        console.error(e);
    }
}

function findBattleTime() {
    // Upraveno pro CZ i EN verzi - hledá buňku obsahující čas
    var battleTimeText = $("#content_value").find("td:contains('Čas bitvy'), td:contains('Battle time')").next().text().trim();
    // Odstranění milisekund pro základní parsování, pokud tam jsou
    return Date.parse(battleTimeText.replace(/:\d{3}$/, ""));
}

function sortObject(obj) {
    var sortable = [];
    for (var key in obj)
        if (obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]);
    sortable.sort(function(a, b) {
        return b[1] - a[1]; // Sestupně podle rychlosti (nejpomalejší první)
    });
    return sortable;
}

function findSlowestUsedUnit(units, unitSpeeds) {
    let unitSpeedDesc = sortObject(unitSpeeds);
    for (let i = 0; i < unitSpeedDesc.length; i++) {
        let unitName = unitSpeedDesc[i][0];
        if (units[unitName] > 0) {
            console.log("NEJPOMALEJŠÍ JEDNOTKA: " + unitName);
            return unitName;
        }
    }
}

function calculateDistance(to, from) {
    var target = to.match(/(\d+)\|(\d+)/);
    var source = from.match(/(\d+)\|(\d+)/);
    return Math.sqrt(Math.pow(source[1] - target[1], 2) + Math.pow(source[2] - target[2], 2));
}

function calculateBacktimeTime(units, unitSpeedSettings, distance, battleTime) {
    let unitType = findSlowestUsedUnit(units, unitSpeedSettings);
    if (!unitType) {
        UI.ErrorMessage("Nebyly nalezeny žádné útočící jednotky.");
        return;
    }

    let runtimeMinutes = unitSpeedSettings[unitType] * distance;
    let unixLandDate = battleTime + (runtimeMinutes * 60 * 1000);
    
    let landDate = new Date(unixLandDate);
    
    Dialog.show("backtime_results", `<div>
        <h3>Výsledek Backtimu (v0.1)</h3>
        <p><strong>Čas bitvy:</strong> ${new Date(battleTime).toLocaleString('cs-CZ')}</p>
        <p><strong>Nejpomalejší jednotka:</strong> ${unitType}<p>
        <p><strong>Vzdálenost:</strong> ${distance.toFixed(2)} polí</p>
        <p><strong>Doba cesty:</strong> ${toHoursAndMinutes(runtimeMinutes)}</p>
        <hr>
        <p style="font-size: 1.2em;"><strong>Čas návratu:</strong> <span style="color:red;">${landDate.toLocaleString('cs-CZ')}</span></p>
    </div>`);
}

function toHoursAndMinutes(totalMinutes) {
    const totalSeconds = Math.round(totalMinutes * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

Powered by TheBrain🧠
