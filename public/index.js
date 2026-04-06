

//show diff form based on what user wants to do
let submit = document.getElementById('SubmitCommand');
let command = document.getElementById('SelectCommand');

submit.addEventListener('click', function () {
    const selectedCommand = command.value;
    
    //change form based on value
    if (selectedCommand === 'Create') {
        console.log('show Create');
        showCreate();
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

    <h2>Enter Enemy</h2>
    <div id="inputEnemyDiv">
        <label for="EnemyName">Enemy Name</label>
        <input type="text" id="EnemyName" />
    </div>

    <div id="submitDiv">
        <button type="submit" id = "Submit">Submit Form</button>
    </div>
    `

    //get submit and send req when clicked
    let submitCreate = document.getElementById('Submit');
    submitCreate.addEventListener('click', async function () {
        //get values from form elements
        const health = document.getElementById('Health').value;
        const armour = document.getElementById('Armour').value;
        const mana = document.getElementById('Mana').value;
        const weaponDamage = document.getElementById('WeaponDamage').value;
        const weaponName = document.getElementById('WeaponName').value;
        const weaponRange = document.getElementById('WeaponRange').value;
        const EnemyName = document.getElementById('EnemyName').value;

        //send request to game endpoint
        try {
            const response = await fetch('/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    'health': health,
                    'armour': armour,
                    'mana': mana,
                    'weaponDamage': weaponDamage,
                    'weaponRange': weaponRange,
                    'weaponName': weaponName,
                    'enemyName': EnemyName,

                }
            });

            if (!response.ok) {
                throw new Error("Request failed with status: 200");
            }

            const game = await response.json();

        } catch (err) {
            console.log("bad request:", err);
        }
    });
};