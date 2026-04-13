/**
 * Script: Backtime Calculator
 * Version: 0.3.3 (Fix: Výpočet doby cesty a parsování rychlostí)
 * Author: Gemini & TheBrain
 */

(function() {
    let availableUnits = {};
    let unitSpeedSettings;

    const runScript = () => {
        $.when($.get('/interface.php?func=get_unit_info')).done(function(xml) {
            $(xml).find('config').children().each((index, unit) => {
                let unitName = $(unit).prop('nodeName');
                let unitSpeed = $(unit).find('speed').text();
                availableUnits[unitName] = parseFloat(unitSpeed);
            });
            unitSpeedSettings = availableUnits;
        }).then(() => {
            console.log("Backtime Helper: Data o jednotkách načtena.");
            getReportInformation(unitSpeedSettings);
        });
    };

    function getReportInformation(unitSpeedSettings) {
        try {
            const attackAnchor = $("#attack_info_att .village_anchor a");
            const defenseAnchor = $("#attack_info_def .village_anchor a");

            if (!attackAnchor.length || !defenseAnchor.length) {
                throw new Error("Nenalezeny vesnice. Jste v náhledu oznámení?");
            }

            var attackCoords = attackAnchor.text().match(/\d+\|\d+/)[0];
            var defenseCoords = defenseAnchor.text().match(/\d+\|\d+/)[0];

            var distance = calculateDistance(attackCoords, defenseCoords);
            let battleTimeMs = findBattleTime();

            // Sběr počtu jednotek - upravený selektor pro větší stabilitu
            let units = {};
            const unitTypes = ["spear", "sword", "axe", "archer", "spy", "light", "marcher", "heavy", "ram", "catapult", "knight", "snob"];
            
            unitTypes.forEach(type => {
                let count = parseInt($(`.unit-item-${type}`).first().text());
                units[type] = isNaN(count) ? 0 : count;
            });

            calculateBacktimeTime(units, unitSpeedSettings, distance, battleTimeMs);
        } catch (e) {
            UI.ErrorMessage("Chyba: " + e.message);
        }
    }

    function findBattleTime() {
        var battleTimeCell = $("#content_value").find("td:contains('Čas bitvy'), td:contains('Battle time')").next();
        if (!battleTimeCell.length) throw new Error("Nepodařilo se najít buňku s časem.");
        
        var battleTimeText = battleTimeCell[0].textContent.trim().replace(/\u00a0/g, " "); 
        var parts = battleTimeText.match(/\d+/g);

        if (!parts || parts.length < 6) {
            throw new Error("Nepodařilo se přečíst formát času bitvy.");
        }

        let day = parseInt(parts[0]);
        let month = parseInt(parts[1]) - 1;
        let year = parseInt(parts[2]);
        if (year < 100) year += 2000;
        
        let hour = parseInt(parts[3]);
        let min = parseInt(parts[4]);
        let sec = parseInt(parts[5]);

        return new Date(year, month, day, hour, min, sec).getTime();
    }

    function calculateDistance(to, from) {
        var target = to.split('|');
        var source = from.split('|');
        return Math.sqrt(Math.pow(source[0] - target[0], 2) + Math.pow(source[1] - target[1], 2));
    }

    function findSlowestUsedUnit(units, unitSpeeds) {
        let sortable = [];
        for (var key in unitSpeeds) {
            if (unitSpeeds.hasOwnProperty(key)) sortable.push([key, unitSpeeds[key]]);
        }
        // Seřadíme od nejpomalejší (nejvyšší číslo speed) po nejrychlejší
        sortable.sort((a, b) => b[1] - a[1]);

        for (let i = 0; i < sortable.length; i++) {
            let uName = sortable[i][0];
            if (units[uName] > 0) return uName;
        }
        return null;
    }

    function calculateBacktimeTime(units, unitSpeedSettings, distance, battleTimeMs) {
        let unitType = findSlowestUsedUnit(units, unitSpeedSettings);
        
        if (!unitType) {
            UI.ErrorMessage("Nenalezeny žádné útočící jednotky.");
            return;
        }

        // Rychlost jednotky je v minutách na pole
        let speed = unitSpeedSettings[unitType];
        let travelTimeSeconds = Math.round(speed * distance * 60);
        
        let unixReturnDate = battleTimeMs + (travelTimeSeconds * 1000);
        let returnDate = new Date(unixReturnDate);
        
        Dialog.show("backtime_results", `
            <div style="padding: 10px;">
                <h3 style="margin-bottom:10px;">Backtime Helper v0.3.3</h3>
                <table class="vis" style="width:100%">
                    <tr><td>Vzdálenost:</td><td><b>${distance.toFixed(2)} polí</b></td></tr>
                    <tr><td>Nejpomalejší jednotka:</td><td><b>${unitType}</b> (rychlost ${speed})</td></tr>
                    <tr><td>Doba cesty:</td><td><b>${formatTime(travelTimeSeconds)}</b></td></tr>
                    <tr style="background-color: #dfcca6;"><td style="font-size:1.1em;"><b>Čas návratu:</b></td>
                    <td style="font-size:1.1em; color: #800000;"><b>${returnDate.toLocaleString('cs-CZ')}</b></td></tr>
                </table>
                <p style="font-size: 0.8em; margin-top:10px;"><i>Milisekundy jsou automaticky zarovnány na .000</i></p>
            </div>
        `);
    }

    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    runScript();
})();

// Powered by TheBrain🧠
