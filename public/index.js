
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

// Toggle Commands
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
                <button id ="next">Next</button>
                <p id = "pageCount">0</p>
                <button id ="prev">Previous</button> 
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
            //go to next page
            playerTable.innerHTML =
                `<tr>
                    <th>Name</th>
                    <th>Health</th>
                    <th>Mana</th>
                    <th>Class</th>
                </tr>`;;
            getPlayers(parseInt(page.textContent) + 1);
            page.textContent = page.textContent = '' + (parseInt(page.textContent) + 1);
        });
        prev.addEventListener('click', function () {
            //go to prev page if not 0
            if (parseInt(page.textContent) > 0) {
                playerTable.innerHTML =
                    `<tr>
                    <th>Name</th>
                    <th>Health</th>
                    <th>Mana</th>
                    <th>Class</th>
                </tr>`;
                getPlayers(parseInt(page.textContent) - 1);
                page.textContent = page.textContent = '' + (parseInt(page.textContent) - 1);
            }
        });

        //add player
        async function addPlayer() {
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
                    <option value ="Range">Range</option>
                    <option value ="Melee">Melee</option>
                    <option value ="Mage">Mage</option>
                    <option value ="Summoner">Summoner</option>
                </select>

                <br>

                <button id="submitButton" onclick="submitPlayer()">Submit</button>
                <button id="cancelButton" onclick="playerToggle(); playerToggle();">Cancel</button>
                <p id="formMsg"></p>
            `;

            async function submitPlayer() {

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
            }

            // expose submitPlayer to global scope so onclick can find it
            window.submitPlayer = submitPlayer;
        }

        // expose addPlayer to global scope so onclick can find it
        window.addPlayer = addPlayer;

        //get players
        async function getPlayers(page) {
            //make call to backend for player w/ pagination
            try {
                const params = { page: page, sort: sortBy.value, orderBy: orderBy.value };
                const url = new URL(`http://${window.location.hostname}:7000/find/player`);
                url.search = new URLSearchParams(params).toString();

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error("Request failed with status: 400");
                }

                let output = await response.json();
                console.log(output);
                //for each player in output
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
    } else {
        playerDiv.innerHTML = ``;
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
                <button id ="next">Next</button>
                <p id = "pageCount">0</p>
                <button id ="prev">Previous</button> 
            `

        let sortBy = document.getElementById('sortBy');
        let orderBy = document.getElementById('orderBy');
        let enemyTable = document.getElementById('enemyTable');
        let page = document.getElementById('pageCount');

        getEnemies(parseInt(page.textContent));

        sortBy.addEventListener('change', function () {
            enemyTable.innerHTML = `<th>Enemy Name</th>
                        <th>Health</th>
                        <th>Damage</th>
                        <th>Loot</th>
                        <th>Spawn Biome</th>`;
            page.textContent = '0';
            getEnemies(0);
        });

        orderBy.addEventListener('change', function () {
            enemyTable.innerHTML = `<th>Enemy Name</th>
                        <th>Health</th>
                        <th>Damage</th>
                        <th>Loot</th>
                        <th>Spawn Biome</th>`;
            page.textContent = '0';
            getEnemies(0);
        });

        //pagination buttons
        let next = document.getElementById('next');
        let prev = document.getElementById('prev');

        next.addEventListener('click', function () {
            //go to next page
            enemyTable.innerHTML =
                `<tr>
                    <th>Enemy Name</th>
                        <th>Health</th>
                        <th>Damage</th>
                        <th>Loot</th>
                        <th>Spawn Biome</th>
                </tr>`;
            getEnemies(parseInt(page.textContent) + 1);
            page.textContent = page.textContent = '' + (parseInt(page.textContent) + 1);
        });
        prev.addEventListener('click', function () {
            //go to prev page if not 0
            if (parseInt(page.textContent) > 0) {
                enemyTable.innerHTML =
                    `<tr>
                    <th>Enemy Name</th>
                        <th>Health</th>
                        <th>Damage</th>
                        <th>Loot</th>
                        <th>Spawn Biome</th>
                </tr>`;
                getEnemies(parseInt(page.textContent) - 1);
                page.textContent = page.textContent = '' + (parseInt(page.textContent) - 1);
            }
        });

        //get Enemies
        async function getEnemies(page) {
            //make call to backend for enemies w/ pagination
            try {
                const params = { page: page, sort: sortBy.value, orderBy: orderBy.value };
                const url = new URL(`http://${window.location.hostname}:7000/find/enemy`);
                url.search = new URLSearchParams(params).toString();

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error("Request failed with status: 400");
                }

                let output = await response.json();
                console.log(output);
                //for each enemy in output
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
    } else {
        enemyDiv.innerHTML = ``;
        ES = false;
    }

}

async function classesToggle() {

    if (!CS) {
        classesDiv.innerHTML =
            `
                <h2>Classes</h2>
                <select id ="sortBy">
                    <option value ="ClassName">Class Name</option>
                    <option value ="Armour">Armour</option>
                    <option value ="WeaponName">Weapon Name</option>
                </select>
                <select id ="orderBy">
                    <option value ="ASC">Ascending</option>
                    <option value ="DESC">Descending</option>
                </select>

                <table id ="classTable">
                    <tr>
                        <th>Class Name</th>
                        <th>Armour</th>
                        <th>Weapon Name</th>
                        <th>Weapon Damage</th>
                        <th>Weapon Range</th>
                    </tr>
                </table>
                <button id ="next">Next</button>
                <p id = "pageCount">0</p>
                <button id ="prev">Previous</button> 
            `

        let sortBy = document.getElementById('sortBy');
        let orderBy = document.getElementById('orderBy');
        let classTable = document.getElementById('classTable');
        let page = document.getElementById('pageCount');

        getClasses(parseInt(page.textContent));

        sortBy.addEventListener('change', function () {
            classTable.innerHTML = `<tr>
                   <th>Class Name</th>
                        <th>Armour</th>
                        <th>Weapon Name</th>
                        <th>Weapon Damage</th>
                        <th>Weapon Range</th>
                </tr>`;
            page.textContent = '0';
            getClasses(0);
        });

        orderBy.addEventListener('change', function () {
            classTable.innerHTML = `<tr>
                   <th>Class Name</th>
                        <th>Armour</th>
                        <th>Weapon Name</th>
                        <th>Weapon Damage</th>
                        <th>Weapon Range</th>
                </tr>`;
            page.textContent = '0';
            getClasses(0);
        });


        //pagination buttons
        let next = document.getElementById('next');
        let prev = document.getElementById('prev');

        next.addEventListener('click', function () {
            //go to next page
            classTable.innerHTML =
                `<tr>
                   <th>Class Name</th>
                        <th>Armour</th>
                        <th>Weapon Name</th>
                        <th>Weapon Damage</th>
                        <th>Weapon Range</th>
                </tr>`;
            getClasses(parseInt(page.textContent) + 1);
            page.textContent = page.textContent = '' + (parseInt(page.textContent) + 1);
        });
        prev.addEventListener('click', function () {
            //go to prev page if not 0
            if (parseInt(page.textContent) > 0) {
                classTable.innerHTML =
                    `<tr>
                    <th>Class Name</th>
                        <th>Armour</th>
                        <th>Weapon Name</th>
                        <th>Weapon Damage</th>
                        <th>Weapon Range</th>
                </tr>`;
                getClasses(parseInt(page.textContent) - 1);
                page.textContent = page.textContent = '' + (parseInt(page.textContent) - 1);
            }
        });

        //get Classes
        async function getClasses(page) {
            //make call to backend for classes w/ pagination
            try {
                const params = { page: page, sort: sortBy.value, orderBy: orderBy.value };
                const url = new URL(`http://${window.location.hostname}:7000/find/class`);
                url.search = new URLSearchParams(params).toString();

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error("Request failed with status: 400");
                }

                let output = await response.json();
                console.log(output);
                //for each class in output
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
    } else {
        classesDiv.innerHTML = ``;
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
                <button id ="next">Next</button>
                <p id = "pageCount">0</p>
                <button id ="prev">Previous</button> 
            `

        let orderBy = document.getElementById('orderBy');
        let locationTable = document.getElementById('locationTable');
        let page = document.getElementById('pageCount');

        getLocation(parseInt(page.textContent));

        orderBy.addEventListener('change', function () {
            locationTable.innerHTML = `<tr>
                    <th>Name</th>
                </tr>
                    `;
            page.textContent = '0';
            getLocation(0);
        });

        //pagination buttons
        let next = document.getElementById('next');
        let prev = document.getElementById('prev');

        next.addEventListener('click', function () {
            //go to next page
            locationTable.innerHTML =
                `<tr>
                    <th>Name</th>
                </tr>
                    `;
            getLocation(parseInt(page.textContent) + 1);
            page.textContent = page.textContent = '' + (parseInt(page.textContent) + 1);
        });
        prev.addEventListener('click', function () {
            //go to prev page if not 0
            if (parseInt(page.textContent) > 0) {
                locationTable.innerHTML =
                    `<tr>
                        <th>Name</th>
                    </tr>
                    `;
                getLocation(parseInt(page.textContent) - 1);
                page.textContent = page.textContent = '' + (parseInt(page.textContent) - 1);
            }
        });

        //get location
        async function getLocation(page) {
            //make call to backend for location w/ pagination
            try {
                const params = { page: page, orderBy: orderBy.value };
                const url = new URL(`http://${window.location.hostname}:7000/find/location`);
                url.search = new URLSearchParams(params).toString();

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error("Request failed with status: 400");
                }

                let output = await response.json();
                console.log(output);
                //for each location in output
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
    } else {
        locationDiv.innerHTML = ``;
        LS = false;
    }

}

async function queriesToggle() {

    if (!QS) {
        queryDiv.innerHTML = //add queries
            `
                <h2>Queries</h2>
                <select id ="queries">
                    <option value ="ASC">Ascending</option>
                    <option value ="DESC">Descending</option>
                </select>

            `
        let query = document.getElementById('queries');

        runQuery(query.value);

        //get location
        async function runQuery(query) {
            //make call to backend for location w/ pagination
            try {
                const params = { query: query, page: page, orderBy: orderBy.value };
                const url = new URL(`http://${window.location.hostname}:7000/query`);
                url.search = new URLSearchParams(params).toString();

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error("Request failed with status: 400");
                }

                let output = await response.json();
                console.log(output);
                //for each query response in output
                output.forEach(q => {
                    let row = document.createElement('tr');

                });

            } catch (err) {
                console.log("bad request:", err);
            }
        }
        QS = true;
    } else {
        queryDiv.innerHTML = ``;
        QS = false;
    }

}