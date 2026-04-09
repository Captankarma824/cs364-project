

//show diff form based on what user wants to do
let submit = document.getElementById('SubmitCommand');
let command = document.getElementById('SelectCommand');

submit.addEventListener('click', function () {
    const selectedCommand = command.value;

    //change form based on value
    if (selectedCommand === 'Create') {
        console.log('show Create');
        showCreate();
    } else if (selectedCommand === 'Find') {
        console.log('show Find');
        showFind();
    }
});

//make request to sever based on whats selected

function showCreate() {
    document.getElementById('app').innerHTML =
        `
    <h1>Create Player</h1>
    <h2>Enter Player Character</h2>
    <div id=inputPlayerDiv>
        <label for="Health">Health</label>
        <input type="number" id="Health" />
        <label for="Mana">Mana</label>
        <input type="number" id="Mana" />
        <label for="Armour">Armour</label>
        <input type="number" id="Armour" />
    </div>

    <h2>Enter Weapon Stats</h2>
    <div id="inputWeaponDiv">
        <label for="WeaponName">Weapon Name</label>
        <input type="text" id="WeaponName" />
        <label for="WeaponDamage">Weapon Damage</label>
        <input type="number" id="WeaponDamage" />
        <label for="WeaponRange">Weapon Range (in tiles)</label>
        <input type="number" id="WeaponRange" />
    </div>

    <div id ="outputDiv">
    </div>
    <div id="submitDiv">
        <button type="submit" id = "Submit">Create Character</button>
    </div>
    <div id = "backDiv">
        <button type="submit" id = "Back">Go Back</button>
    </div>
    `

    //go back to index form
    const backButton = document.getElementById('Back');
    backButton.addEventListener('click', function () {
        showIndex();
    });

    //get submit and send req when clicked
    let submitCreate = document.getElementById('Submit');
    submitCreate.addEventListener('click', async function () {
        console.log('create character');
        //get values from form elements
        const health = document.getElementById('Health').value;
        const armour = document.getElementById('Armour').value;
        const mana = document.getElementById('Mana').value;
        const weaponDamage = document.getElementById('WeaponDamage').value;
        const weaponName = document.getElementById('WeaponName').value;
        const weaponRange = document.getElementById('WeaponRange').value;

        //output div
        const outputDiv = document.getElementById('outputDiv');

        //send request to game endpoint
        try {
            //url for fetch
            const url = new URL('/create/player', window.location.origin);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'health': health,
                    'armour': armour,
                    'mana': mana,
                    'weaponDamage': weaponDamage,
                    'weaponRange': weaponRange,
                    'weaponName': weaponName,
                })
            });

            if (!response.ok) {
                throw new Error("Request failed with status: 400");
            }
            //else put what is returned into outputDiv
            let output = await response.json();
            console.log(output);

            //show player Id to user
            const pId = document.createElement('p');
            pId.textContent = 'PlayerId is: ' + output.PlayerId;

            //put on display
            outputDiv.appendChild(pId);

        } catch (err) {
            console.log("bad request:", err);
        }
    });
};

//function to show find
function showFind() {
    const app = document.getElementById('app');
    app.innerHTML =
        `<h1>what would you like to find</h1>
    <div id="findDiv">
        <select name="Find" id="SelectFind">
            <option value="Player">Player</option>
            <option value="Enemy">Enemy</option>
            <option value="Location">Location</option>
            <option value="Custom">Custom</option>
        </select>
            
    </div>
    <div id="submitDiv">
        <button type="submit" id = "Submit">Submit Form</button>
    </div>

    <div id = "backDiv">
        <button type="submit" id = "Back">Go Back</button>
    </div>
    `

    //get submit and send req when clicked
    const submitFind = document.getElementById('Submit');

    //go back to index form
    const backButton = document.getElementById('Back');
    backButton.addEventListener('click', function () {
        showIndex();
    });

    submitFind.addEventListener('click', async function () {
        const selectFind = document.getElementById('SelectFind').value;

        //change form based on what is selected
        if (selectFind === 'Player') {
            console.log('player');
            app.innerHTML =
                `
            <h1>Find Player Character</h1>
            <div id=inputPlayerDiv>
            <label for="PlayerId">Player Id</label>
            <input type="text" id="PlayerId" />
              </div>
              <div id="submitDiv">
             <button type="submit" id = "Submit">Submit Form</button>
             </div>
             <div id = "outputDiv"> 
             </div>

             <button type="submit" id = "Back">Go Back</button>
            `;

            //get form elements
            const playerIdInput = document.getElementById('PlayerId');
            const outputDiv = document.getElementById('outputDiv');

            //go back to select form
            const backButton = document.getElementById('Back');
            backButton.addEventListener('click', function () {
                showFind();
            });

            //get submit and send req when clicked
            const submitCreate = document.getElementById('Submit');
            submitCreate.addEventListener('click', async function () {

                //send playerId to server to find player
                try {
                    const params = { PlayerId: playerIdInput.value };
                    const url = new URL('/find/player', window.location.origin);
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

                    //else put what is returned into outputDiv
                    let output = await response.json();
                    console.log(output);

                    //display all the info in outputDiv
                    const h = document.createElement('p');
                    h.textContent = 'Player Health: ' + output.Health;
                    const m = document.createElement('p');
                    m.textContent = 'Player Mana: ' + output.Mana;

                    //put into output div
                    outputDiv.appendChild(h);
                    outputDiv.appendChild(m);

                } catch (err) {
                    console.log("bad request:", err);
                }
            });

        } else if (selectFind === 'Enemy') {
            //display find enemy form
            console.log('Enemy');
            app.innerHTML =
                `
             <h1>Find Enemy</h1>
              <label for="EnemyName">Input Enemy Name</label>
             <input type="text" name="EnemyName" id = "EnemyName">
             <div id="submitDiv">
               <button type="submit" id = "Submit">Submit Form</button>
            </div>
             <br>
             <div id ="outputDiv">
        
            </div>

            <button type="submit" id = "Back">Go Back</button>
            `;

            //get form elements
            const EnemyNameInput = document.getElementById('EnemyName');
            const outputDiv = document.getElementById('outputDiv');

            //go back to select form
            const backButton = document.getElementById('Back');
            backButton.addEventListener('click', function () {
                showFind();
            });

            //get submit and send req when clicked
            const submitCreate = document.getElementById('Submit');
            submitCreate.addEventListener('click', async function () {

                //send enemyname to server to find enemy
                try {
                    const params = { EnemyName: EnemyNameInput.value };
                    const url = new URL('/find/enemy', window.location.origin);
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

                    //else put what is returned into outputDiv
                    let output = await response.json();
                    console.log(output);
                    //display all the info in outputDiv
                    const spawn = document.createElement('p');
                    spawn.textContent = 'Spawns in: ' + output.BiomeId;
                    const damage = document.createElement('p');
                    damage.textContent = 'Damage: ' + output.Damage;
                    const health = document.createElement('p');
                    health.textContent = 'Health: ' + output.Health;
                    const name = document.createElement('p');
                    name.textContent = 'Name: ' + output.EnemyName;
                    const loot = document.createElement('p');
                    loot.textContent = 'Loot: ' + output.Loot;
                    const lootPer = document.createElement('p');
                    lootPer.textContent = 'Drop Percentage: ' + output.LootPerc;

                    //put into div
                    outputDiv.appendChild(name);
                    outputDiv.appendChild(spawn);
                    outputDiv.appendChild(health);
                    outputDiv.appendChild(damage);
                    outputDiv.appendChild(loot);
                    outputDiv.appendChild(lootPer);

                } catch (err) {
                    console.log("bad request:", err);
                }
            });

        } else if (selectFind === 'Location') {
            console.log('Location');
            app.innerHTML =
                `
            <h1>Find Location</h1>
             <label for="LocationName">Input Location Name</label>
             <input type="text" name="LocationName" id ="LocationName">
             <div id="submitDiv">
             <button type="submit" id = "Submit">Submit Form</button>
             </div>
             <br>
             <div id ="outputDiv">
        
            </div>

            <button type="submit" id = "Back">Go Back</button>
            `;

            //get form elements
            const LocationName = document.getElementById('LocationName');
            const outputDiv = document.getElementById('outputDiv');

            //go back to select form
            const backButton = document.getElementById('Back');
            backButton.addEventListener('click', function () {
                showFind();
            });

            //get submit and send req when clicked
            const submitCreate = document.getElementById('Submit');
            submitCreate.addEventListener('click', async function () {
                //send enemyname to server to find enemy
                try {
                    const params = { LocationName: LocationName.value };
                    const url = new URL('/find/location', window.location.origin);
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

                    //else put what is returned into outputDiv
                    let output = await response.json();
                    console.log(output);
                    //display all the info in outputDiv
                    const biomeName = document.createElement('p');
                    biomeName.textContent = 'Biome: ' + output.Background;
                    const biomeId = document.createElement('p');
                    biomeId.textContent = 'BiomeId: ' + output.BiomeId;

                    //put into div
                    outputDiv.appendChild(biomeName);
                    outputDiv.appendChild(biomeId);

                } catch (err) {
                    console.log("bad request:", err);
                }
            });
        } else if (selectFind === 'Custom') {
            console.log('Custom');
            app.innerHTML = ``;
        }

    });

}

//function to show index
function showIndex() {
    document.getElementById('app').innerHTML =
        `
    <h1>Terraria Calculator</h1>

        <h2> What would you like to do</h2>
        <div id="commandDiv">
            <select name="SelectComputer" id="SelectCommand">
                <option value="Find">Find</option>
                <option value="Create">Create</option>
            </select>
        </div>

        <br>
        <div id="submitDiv">
            <button type="submit" id="SubmitCommand">Submit Form</button>
        </div>
    `

    //show diff form based on what user wants to do
    let submit = document.getElementById('SubmitCommand');
    let command = document.getElementById('SelectCommand');

    submit.addEventListener('click', function () {
        const selectedCommand = command.value;

        //change form based on value
        if (selectedCommand === 'Create') {
            console.log('show Create');
            showCreate();
        } else if (selectedCommand === 'Find') {
            console.log('show Find');
            showFind();
        }
    });
}