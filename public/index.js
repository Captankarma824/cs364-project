// For Toggling
let playerDiv = document.getElementById('playerDiv');
let PS = false;
let enemyDiv = document.getElementById('enemyDiv');
let ES = false;
let locationDiv = document.getElementById('locationDiv');
let LS = false;
let classesDiv = document.getElementById('classesDiv');
let CS = false;
let queryDiv = document.getElementById('queryDiv');
let QS = false;

// ── Global query functions ────────────────────────────────────────────────────

async function submitQuery(data, number) {
    try {
        const params = { data: data, number: number };
        const url = new URL(`http://${window.location.hostname}:7000/query`);
        url.search = new URLSearchParams(params).toString();

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error("Request failed with status: 400");

        let output = await response.json();
        console.log(output);

        runQuery(number, output);

    } catch (err) {
        console.log("bad request:", err);
    }
}

function runQuery(number, output = null) {
    const resultHtml = output !== null ? buildResultHtml(number, output) : '';

    switch (number) {
        case 1:
            queryDiv.innerHTML = `
                <h2>Total sum of health among all enemies that can spawn in a certain location</h2>
                <label for="location">Location Name</label>
                <input type="text" id="location" placeholder="e.g. Underground"><br>
                <button id="submitButton" onclick="submitQuery(document.getElementById('location').value, 1)">Submit</button>/
                <button id="cancelButton" onclick="queriesToggle(); queriesToggle();">Cancel</button>
                ${resultHtml}
            `;
            break;
        case 2:
            queryDiv.innerHTML = `
                <h2>Percentages of class utilization among all players</h2>
                <button id="submitButton" onclick="submitQuery('', 2)">Submit</button>/
                <button id="cancelButton" onclick="queriesToggle(); queriesToggle();">Cancel</button>
                ${resultHtml}
            `;
            break;
        case 3:
            queryDiv.innerHTML = `
                <h2>Find the average amount of damage for all players with a class</h2>
                <label for="className">Class Name</label>
                <select id="className">
                    <option value="Ranged">Ranged</option>
                    <option value="Melee">Melee</option>
                    <option value="Mage">Mage</option>
                    <option value="Summoner">Summoner</option>
                </select><br>
                <button id="submitButton" onclick="submitQuery(document.getElementById('className').value, 3)">Submit</button>/
                <button id="cancelButton" onclick="queriesToggle(); queriesToggle();">Cancel</button>
                ${resultHtml}
            `;
            break;
        case 4:
            queryDiv.innerHTML = `
                <h2>Find the most utilized weapon for each class</h2>
                <button id="submitButton" onclick="submitQuery('', 4)">Submit</button>/
                <button id="cancelButton" onclick="queriesToggle(); queriesToggle();">Cancel</button>
                ${resultHtml}
            `;
            break;
        case 5:
            queryDiv.innerHTML = `
                <h2>Calculate the average amount of enemies needed to kill to get a specific loot drop</h2>
                <label for="loot">Loot</label>
                <input type="text" id="loot" placeholder="e.g. Feather"><br>
                <button id="submitButton" onclick="submitQuery(document.getElementById('loot').value, 5)">Submit</button>/
                <button id="cancelButton" onclick="queriesToggle(); queriesToggle();">Cancel</button>
                ${resultHtml}
            `;
            break;
        case 6:
            queryDiv.innerHTML = `
                <h2>Location that has the most enemies</h2>
                <button id="submitButton" onclick="submitQuery('', 6)">Submit</button>/
                <button id="cancelButton" onclick="queriesToggle(); queriesToggle();">Cancel</button>
                ${resultHtml}
            `;
            break;
    }
}

function buildResultHtml(number, output) {
    // Cases 2 and 4 return arrays of objects then build table
    if (number === 2 || number === 4) {
        if (!Array.isArray(output) || output.length === 0) return '<p>No results.</p>';
        const headers = Object.keys(output[0]);
        const headerRow = headers.map(h => `<th>${h}</th>`).join('');
        const rows = output.map(row =>
            `<tr>${headers.map(h => `<td>${row[h]}</td>`).join('')}</tr>`
        ).join('');
        return `<table border="1"><tr>${headerRow}</tr>${rows}</table>`;
    } else if (number === 5) {
        return `<h3> Average Enemies Needed to Get a ${output[0].Loot} is: ${parseFloat(output[0].AverageEnemiesNeeded)}`
    }
    // All other cases return a single value
    const val = Array.isArray(output) ? output[0] : output;
    if (val === null || val === undefined) return '<p>No results.</p>';
    const display = typeof val === 'object' ? JSON.stringify(val) : val;
    return `<h3>${display}</h3>`;
}

// ── Animation helper ─────────────────────────────────────────────────────────

function showCard(el) {
    el.style.display = 'block';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            el.classList.add('open');
        });
    });
}

function hideCard(el) {
    el.classList.remove('open');
    el.addEventListener('transitionend', () => {
        el.style.display = 'none';
    }, { once: true });
}

// ── Toggle Commands ───────────────────────────────────────────────────────────

async function playerToggle() {

    if (!PS) {
        playerDiv.innerHTML =
            `
                <h2>Players</h2>
                <button id ="addPlayer" onclick="addPlayer()">Add Player</button> 
                <select id ="sortBy">
                    <option value ="PlayerName">Player Name</option>
                    <option value ="Health">Health</option>
                    <option value ="ClassName">Class</option>
                </select>
                <select id ="orderBy">
                    <option value ="ASC">Ascending</option>
                    <option value ="DESC">Descending</option>
                </select>

                <table id ="playerTable">
                    <tr>
                        <th>Name</th>
                        <th>Health</th>
                        <th>Mana</th>
                        <th>Class</th>
                    </tr>
                </table>
                <div id = "paginationDiv">
                <button id ="prev">Previous</button> 
                <p id = "pageCount">0</p>
                <button id ="next">Next</button>
                </div>
            `

        let sortBy = document.getElementById('sortBy');
        let orderBy = document.getElementById('orderBy');
        let playerTable = document.getElementById('playerTable');
        let page = document.getElementById('pageCount');

        getPlayers(parseInt(page.textContent));

        sortBy.addEventListener('change', function () {
            playerTable.innerHTML = `<tr>
        <th>Name</th>
        <th>Health</th>
        <th>Mana</th>
        <th>Class</th>
    </tr>`;
            page.textContent = '0';
            getPlayers(0);
        });

        orderBy.addEventListener('change', function () {
            playerTable.innerHTML = `<tr>
        <th>Name</th>
        <th>Health</th>
        <th>Mana</th>
        <th>Class</th>
    </tr>`;
            page.textContent = '0';
            getPlayers(0);
        });

        //pagination buttons
        let next = document.getElementById('next');
        let prev = document.getElementById('prev');

        next.addEventListener('click', function () {
            playerTable.innerHTML =
                `<tr>
                    <th>Name</th>
                    <th>Health</th>
                    <th>Mana</th>
                    <th>Class</th>
                </tr>`;
            getPlayers(parseInt(page.textContent) + 1);
            page.textContent = '' + (parseInt(page.textContent) + 1);
        });
        prev.addEventListener('click', function () {
            if (parseInt(page.textContent) > 0) {
                playerTable.innerHTML =
                    `<tr>
                    <th>Name</th>
                    <th>Health</th>
                    <th>Mana</th>
                    <th>Class</th>
                </tr>`;
                getPlayers(parseInt(page.textContent) - 1);
                page.textContent = '' + (parseInt(page.textContent) - 1);
            }
        });

        window.addPlayer = async function addPlayer() {
            playerDiv.innerHTML =
                `
                <h2>Add Player</h2>

                <label for="playerName">Player Name</label>
                <input type="text" id="playerName" placeholder="Enter name…"><br>

                <label for="mana">Mana</label>
                <input type="number" id="mana" placeholder="e.g. 69" min="0"><br>

                <label for="health">Health</label>
                <input type="number" id="health" placeholder="e.g. 67" min="0"><br>

                <label for="armour">Armour</label>
                <input type="number" id="armour" placeholder="e.g. 41" min="0"><br>

                <label for="weaponName">Weapon Name</label>
                <input type="text" id="weaponName" placeholder="e.g. chungus"><br>

                <label for="weaponDam">Weapon Damage</label>
                <input type="number" id="weaponDam" placeholder="e.g. 21" min="0"><br>

                <label for="weaponRange">Weapon Range</label>
                <input type="number" id="weaponRange" placeholder="e.g. 1738" min="0"><br>

                <label for="className">Class Name</label>
                <select id ="className">
                    <option value ="0" disabled selected>-- Select a Class --</option>
                    <option value ="Ranged">Ranged</option>
                    <option value ="Melee">Melee</option>
                    <option value ="Mage">Mage</option>
                    <option value ="Summoner">Summoner</option>
                </select>
                <br>

                <button id="submitButton" onclick="submitPlayer()">Submit</button>
                <button id="cancelButton" onclick="playerToggle(); playerToggle();">Cancel</button>
                <p id="formMsg"></p>
            `;

            window.submitPlayer = async function submitPlayer() {
                const body = {
                    Mana: parseInt(document.getElementById('mana').value) || 0,
                    Health: parseInt(document.getElementById('health').value) || 0,
                    PlayerName: document.getElementById('playerName').value.trim() || null,
                    Armour: parseInt(document.getElementById('armour').value) || 0,
                    WeaponDam: parseInt(document.getElementById('weaponDam').value) || 0,
                    WeaponName: document.getElementById('weaponName').value.trim() || null,
                    WeaponRange: parseInt(document.getElementById('weaponRange').value) || 0,
                    ClassName: document.getElementById('className').value.trim() || null,
                };

                try {
                    const url = new URL(`http://${window.location.hostname}:7000/create/player`);
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    });

                    if (!response.ok) throw new Error('Request failed with status: ' + response.status);

                    document.getElementById('formMsg').textContent = 'Player added successfully!';
                } catch (err) {
                    console.log('bad request:', err);
                    document.getElementById('formMsg').textContent = 'Error adding player.';
                }
            };
        };

        async function getPlayers(page) {
            try {
                const params = { page: page, sort: sortBy.value, orderBy: orderBy.value };
                const url = new URL(`http://${window.location.hostname}:7000/find/player`);
                url.search = new URLSearchParams(params).toString();

                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error("Request failed with status: 400");

                let output = await response.json();
                console.log(output);

                output.forEach(p => {
                    let row = document.createElement('tr');
                    let Name = document.createElement('td');
                    let Health = document.createElement('td');
                    let Mana = document.createElement('td');
                    let Class = document.createElement('td');

                    Name.textContent = p.PlayerName;
                    Health.textContent = p.Health;
                    Mana.textContent = p.Mana;
                    Class.textContent = p.ClassName;

                    row.appendChild(Name);
                    row.appendChild(Health);
                    row.appendChild(Mana);
                    row.appendChild(Class);

                    playerTable.appendChild(row);
                });

            } catch (err) {
                console.log("bad request:", err);
            }
        }
        PS = true;
        showCard(playerDiv);
    } else {
        hideCard(playerDiv);
        playerDiv.addEventListener('transitionend', () => {
            playerDiv.innerHTML = '';
        }, { once: true });
        PS = false;
    }

}

async function enemyToggle() {

    if (!ES) {
        enemyDiv.innerHTML =
            `
                <h2>Enemies</h2>
                <select id ="sortBy">
                    <option value ="EnemyName">Enemy Name</option>
                    <option value ="Health">Health</option>
                    <option value ="Damage">Damage</option>
                    <option value ="Loot">Loot</option>
                </select>
                <select id ="orderBy">
                    <option value ="ASC">Ascending</option>
                    <option value ="DESC">Descending</option>
                </select>

                <table id ="enemyTable">
                    <tr>
                        <th>Enemy Name</th>
                        <th>Health</th>
                        <th>Damage</th>
                        <th>Loot</th>
                        <th>Spawn Biome</th>
                    </tr>
                </table>
                <div id = "paginationDiv">
                <button id ="prev">Previous</button> 
                <p id = "pageCount">0</p>
                <button id ="next">Next</button>
                </div>
            `

        let sortBy = document.getElementById('sortBy');
        let orderBy = document.getElementById('orderBy');
        let enemyTable = document.getElementById('enemyTable');
        let page = document.getElementById('pageCount');

        getEnemies(parseInt(page.textContent));

        sortBy.addEventListener('change', function () {
            enemyTable.innerHTML = `<tr><th>Enemy Name</th><th>Health</th><th>Damage</th><th>Loot</th><th>Spawn Biome</th></tr>`;
            page.textContent = '0';
            getEnemies(0);
        });

        orderBy.addEventListener('change', function () {
            enemyTable.innerHTML = `<tr><th>Enemy Name</th><th>Health</th><th>Damage</th><th>Loot</th><th>Spawn Biome</th></tr>`;
            page.textContent = '0';
            getEnemies(0);
        });

        let next = document.getElementById('next');
        let prev = document.getElementById('prev');

        next.addEventListener('click', function () {
            enemyTable.innerHTML = `<tr><th>Enemy Name</th><th>Health</th><th>Damage</th><th>Loot</th><th>Spawn Biome</th></tr>`;
            getEnemies(parseInt(page.textContent) + 1);
            page.textContent = '' + (parseInt(page.textContent) + 1);
        });
        prev.addEventListener('click', function () {
            if (parseInt(page.textContent) > 0) {
                enemyTable.innerHTML = `<tr><th>Enemy Name</th><th>Health</th><th>Damage</th><th>Loot</th><th>Spawn Biome</th></tr>`;
                getEnemies(parseInt(page.textContent) - 1);
                page.textContent = '' + (parseInt(page.textContent) - 1);
            }
        });

        async function getEnemies(page) {
            try {
                const params = { page: page, sort: sortBy.value, orderBy: orderBy.value };
                const url = new URL(`http://${window.location.hostname}:7000/find/enemy`);
                url.search = new URLSearchParams(params).toString();

                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error("Request failed with status: 400");

                let output = await response.json();
                console.log(output);

                output.forEach(e => {
                    let row = document.createElement('tr');
                    let Name = document.createElement('td');
                    let Health = document.createElement('td');
                    let Damage = document.createElement('td');
                    let Loot = document.createElement('td');
                    let Biome = document.createElement('td');

                    Name.textContent = e.EnemyName;
                    Health.textContent = e.Health;
                    Damage.textContent = e.Damage;
                    Loot.textContent = e.Loot;
                    Biome.textContent = e.Background;

                    row.appendChild(Name);
                    row.appendChild(Health);
                    row.appendChild(Damage);
                    row.appendChild(Loot);
                    row.appendChild(Biome);

                    enemyTable.appendChild(row);
                });

            } catch (err) {
                console.log("bad request:", err);
            }
        }
        ES = true;
        showCard(enemyDiv);
    } else {
        hideCard(enemyDiv);
        enemyDiv.addEventListener('transitionend', () => {
            enemyDiv.innerHTML = '';
        }, { once: true });
        ES = false;
    }

}

async function classesToggle() {

    if (!CS) {
        classesDiv.innerHTML =
            `
                <h2>Classes</h2>
                <select id ="sortBy">
                    <option value ="ClassName">Class Type</option>
                    <option value ="Armour">Armour</option>
                    <option value ="WeaponName">Weapon Name</option>
                    <option value ="WeaponDam">Weapon Damage</option>
                    <option value ="WeaponRange">Weapon Range</option>
                </select>
                <select id ="orderBy">
                    <option value ="ASC">Ascending</option>
                    <option value ="DESC">Descending</option>
                </select>

                <table id ="classTable">
                    <tr>
                        <th>Class Type</th>
                        <th>Armour</th>
                        <th>Weapon Name</th>
                        <th>Weapon Damage</th>
                        <th>Weapon Range</th>
                    </tr>
                </table>
                <div id = "paginationDiv">
                <button id ="prev">Previous</button> 
                <p id = "pageCount">0</p>
                <button id ="next">Next</button>
                </div>
            `

        let sortBy = document.getElementById('sortBy');
        let orderBy = document.getElementById('orderBy');
        let classTable = document.getElementById('classTable');
        let page = document.getElementById('pageCount');

        getClasses(parseInt(page.textContent));

        const classHeader = `<tr><th>Class Type</th><th>Armour</th><th>Weapon Name</th><th>Weapon Damage</th><th>Weapon Range</th></tr>`;

        sortBy.addEventListener('change', function () {
            classTable.innerHTML = classHeader;
            page.textContent = '0';
            getClasses(0);
        });

        orderBy.addEventListener('change', function () {
            classTable.innerHTML = classHeader;
            page.textContent = '0';
            getClasses(0);
        });

        let next = document.getElementById('next');
        let prev = document.getElementById('prev');

        next.addEventListener('click', function () {
            classTable.innerHTML = classHeader;
            getClasses(parseInt(page.textContent) + 1);
            page.textContent = '' + (parseInt(page.textContent) + 1);
        });
        prev.addEventListener('click', function () {
            if (parseInt(page.textContent) > 0) {
                classTable.innerHTML = classHeader;
                getClasses(parseInt(page.textContent) - 1);
                page.textContent = '' + (parseInt(page.textContent) - 1);
            }
        });

        async function getClasses(page) {
            try {
                const params = { page: page, sort: sortBy.value, orderBy: orderBy.value };
                const url = new URL(`http://${window.location.hostname}:7000/find/class`);
                url.search = new URLSearchParams(params).toString();

                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error("Request failed with status: 400");

                let output = await response.json();
                console.log(output);

                output.forEach(c => {
                    let row = document.createElement('tr');
                    let CName = document.createElement('td');
                    let WName = document.createElement('td');
                    let Damage = document.createElement('td');
                    let Range = document.createElement('td');
                    let Armour = document.createElement('td');

                    CName.textContent = c.ClassName;
                    WName.textContent = c.WeaponName;
                    Damage.textContent = c.WeaponDam;
                    Range.textContent = c.WeaponRange;
                    Armour.textContent = c.Armour;

                    row.appendChild(CName);
                    row.appendChild(Armour);
                    row.appendChild(WName);
                    row.appendChild(Damage);
                    row.appendChild(Range);

                    classTable.appendChild(row);
                });

            } catch (err) {
                console.log("bad request:", err);
            }
        }
        CS = true;
        showCard(classesDiv);
    } else {
        hideCard(classesDiv);
        classesDiv.addEventListener('transitionend', () => {
            classesDiv.innerHTML = '';
        }, { once: true });
        CS = false;
    }

}

async function locationToggle() {

    if (!LS) {
        locationDiv.innerHTML =
            `
                <h2>Location</h2>
                <select id ="orderBy">
                    <option value ="ASC">Ascending</option>
                    <option value ="DESC">Descending</option>
                </select>

                <table id ="locationTable">
                    <tr>
                        <th>Name</th>
                    </tr>
                </table>
                <div id = "paginationDiv">
                <button id ="prev">Previous</button> 
                <p id = "pageCount">0</p>
                <button id ="next">Next</button>
                </div>
            `

        let orderBy = document.getElementById('orderBy');
        let locationTable = document.getElementById('locationTable');
        let page = document.getElementById('pageCount');

        getLocation(parseInt(page.textContent));

        orderBy.addEventListener('change', function () {
            locationTable.innerHTML = `<tr><th>Name</th></tr>`;
            page.textContent = '0';
            getLocation(0);
        });

        let next = document.getElementById('next');
        let prev = document.getElementById('prev');

        next.addEventListener('click', function () {
            locationTable.innerHTML = `<tr><th>Name</th></tr>`;
            getLocation(parseInt(page.textContent) + 1);
            page.textContent = '' + (parseInt(page.textContent) + 1);
        });
        prev.addEventListener('click', function () {
            if (parseInt(page.textContent) > 0) {
                locationTable.innerHTML = `<tr><th>Name</th></tr>`;
                getLocation(parseInt(page.textContent) - 1);
                page.textContent = '' + (parseInt(page.textContent) - 1);
            }
        });

        async function getLocation(page) {
            try {
                const params = { page: page, orderBy: orderBy.value };
                const url = new URL(`http://${window.location.hostname}:7000/find/location`);
                url.search = new URLSearchParams(params).toString();

                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error("Request failed with status: 400");

                let output = await response.json();
                console.log(output);

                output.forEach(l => {
                    let row = document.createElement('tr');
                    let Name = document.createElement('td');
                    Name.textContent = l.Background;
                    row.appendChild(Name);
                    locationTable.appendChild(row);
                });

            } catch (err) {
                console.log("bad request:", err);
            }
        }
        LS = true;
        showCard(locationDiv);
    } else {
        hideCard(locationDiv);
        locationDiv.addEventListener('transitionend', () => {
            locationDiv.innerHTML = '';
        }, { once: true });
        LS = false;
    }

}

async function queriesToggle() {

    if (!QS) {
        queryDiv.innerHTML =
            `
                <h2>Queries</h2>
                <select id ="queries">
                    <option value ="0" disabled selected>-- Select a query --</option>
                    <option value ="1">Total sum of health among all enemies that can spawn in a certain location</option>
                    <option value ="2">Percentages of class utilization among all players</option>
                    <option value ="3">Find the average amount of damage for all players with a class</option>
                    <option value ="4">Find the most utilized weapon for each class</option>
                    <option value ="5">Calculate the average amount of enemies needed to kill to get a specific loot drop</option>
                    <option value ="6">Location that has the most enemies</option>
                </select>
            `;

        document.getElementById('queries').addEventListener('change', function () {
            runQuery(parseInt(this.value));
        });

        QS = true;
        showCard(queryDiv);
    } else {
        hideCard(queryDiv);
        queryDiv.addEventListener('transitionend', () => {
            queryDiv.innerHTML = '';
        }, { once: true });
        QS = false;
    }

}