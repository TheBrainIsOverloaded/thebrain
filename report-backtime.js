/**
 * Script: Backtime Calculator
 * Version: 0.3.1 (Fix: CZ version not properly running) // > > Český kmeny mají vždycky něco spešl
 * Author: TheBrain
 */

(function() {
    let availableUnits = {};
    let unitSpeedSettings;

    const runScript = () => {
        $.when($.get('/interface.php?func=get_unit_info')).done(function(xml) {
            $(xml).find('config').children().each((index, unit) => {
                availableUnits[$(unit).prop('nodeName')] = parseFloat($(unit).find('speed').text());
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

            let units = {
                "spear": parseInt($(".unit-item-spear").first().text()) || 0,
                "sword": parseInt($(".unit-item-sword").first().text()) || 0,
                "axe": parseInt($(".unit-item-axe").first().text()) || 0,
                "archer": parseInt($(".unit-item-archer").first().text()) || 0,
                "spy": parseInt($(".unit-item-spy").first().text()) || 0,
                "light": parseInt($(".unit-item-light").first().text()) || 0,
                "marcher": parseInt($(".unit-item-marcher").first().text()) || 0,
                "heavy": parseInt($(".unit-item-heavy").first().text()) || 0,
                "ram": parseInt($(".unit-item-ram").first().text()) || 0,
                "catapult": parseInt($(".unit-item-catapult").first().text()) || 0,
                "knight": parseInt($(".unit-item-knight").first().text()) || 0,
                "snob": parseInt($(".unit-item-snob").first().text()) || 0,
            };

            calculateBacktimeTime(units, unitSpeedSettings, distance, battleTimeMs);
        } catch (e) {
            UI.ErrorMessage("Chyba: " + e.message);
        }
    }

    // --- OPRAVENÁ FUNKCE ---
    function findBattleTime() {
        var battleTimeCell = $("#content_value").find("td:contains('Čas bitvy'), td:contains('Battle time')").next();
        var battleTimeText = battleTimeCell.text().trim(); // např. "11.04.26 13:19:01"
        
        // Odstraníme milisekundy, pokud tam jsou (:013)
        battleTimeText = battleTimeText.replace(/:\d{3}$/, "");

        // Použijeme regex k rozdělení na části
        // regex hledá DD.MM.YY HH:MM:SS
        var match = battleTimeText.match(/^(\d{2})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);

        if (!match) {
            throw new Error("Nepodařilo se přečíst formát času bitvy.");
        }

        // Vytvoříme datum ručně: new Date(rok, měsíc-1, den, hod, min, sek)
        // Rok 20xx přičteme ručně
        let year = 2000 + parseInt(match[3]);
        let month = parseInt(match[2]) - 1; // Měsíce jsou 0-11
        let day = parseInt(match[1]);
        let hour = parseInt(match[4]);
        let min = parseInt(match[5]);
        let sec = parseInt(match[6]);

        let dateObj = new Date(year, month, day, hour, min, sec);
        return dateObj.getTime(); // vrací Unix timestamp v ms
    }

    function calculateDistance(to, from) {
        var target = to.split('|');
        var source = from.split('|');
        return Math.sqrt(Math.pow(source[0] - target[0], 2) + Math.pow(source[1] - target[1], 2));
    }

    function findSlowestUsedUnit(units, unitSpeeds) {
        let sortable = [];
        for (var key in unitSpeeds) sortable.push([key, unitSpeeds[key]]);
        sortable.sort((a, b) => b[1] - a[1]);

        for (let i = 0; i < sortable.length; i++) {
            if (units[sortable[i][0]] > 0) return sortable[i][0];
        }
        return null;
    }

    function calculateBacktimeTime(units, unitSpeedSettings, distance, battleTimeMs) {
        let unitType = findSlowestUsedUnit(units, unitSpeedSettings);
        if (!unitType) {
            UI.ErrorMessage("Nenalezeny žádné útočící jednotky.");
            return;
        }

        let travelTimeSeconds = Math.floor(unitSpeedSettings[unitType] * distance * 60);
        let unixReturnDate = battleTimeMs + (travelTimeSeconds * 1000);
        let returnDate = new Date(unixReturnDate);
        
        Dialog.show("backtime_results", `
            <div style="padding: 10px;">
                <h3 style="margin-bottom:10px;">Backtime Helper v0.3.1</h3>
                <table class="vis" style="width:100%">
                    <tr><td>Vzdálenost:</td><td><b>${distance.toFixed(2)} polí</b></td></tr>
                    <tr><td>Nejpomalejší jednotka:</td><td><b>${unitType}</b></td></tr>
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
