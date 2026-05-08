
//show diff form based on what user wants to do
let submit = document.getElementById('SubmitCommand');
let command = document.getElementById('SelectCommand');
let playerDiv = document.getElementById('playerDiv');
let enemyDiv = document.getElementById('enemyDiv');
let PS = false;
let ES = false;

//toggle commands
async function playerToggle() {

    if (!PS) {
        playerDiv.innerHTML =
            `
                <h2>Players</h2>
                <button id ="addPlayer">Add Player</button> 
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
                    Class.textContent = p.Class;

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
        playerDiv.innerHTML =
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

        //get players
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
                //for each player in output
                output.forEach(e => {
                    let row = document.createElement('tr');
                    let Name = document.createElement('td');
                    let Health = document.createElement('td');
                    let Damage = document.createElement('td');
                    let Loot = document.createElement('td');
                    let Biome = document.createElement('td');

                    Name.textContent = e.EnemyName;
                    Health.textContent = e.Health;
                    Damage.textContent = e.Mana;
                    Loot.textContent = e.Loot;
                    Biome.textContent = e.Biome;

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

async function queriesToggle() { //add more queries + advanced queries to select and if one is selected put inputs for it
    container.innerHTML +=
        `
        <div class="card" id="queriesDiv">
                <h2>Queries</h2>
                <div class="card" id="queriesDiv">
                <h2>Run Query</h2>

                <select id = "query">
                    <option>Enemies at Night</option>
                    <option>Strongest Enemy</option>
                    <option>Enemies in Player Location</option>
                </select>

                <button>Run</button>
            </div>
            </div>
            `
}
