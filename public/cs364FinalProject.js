//get values from form elements
let health = document.getElementById('Health').value;
let armour = document.getElementById('Armour').value;
let mana = document.getElementById('Mana').value;
let weaponDamage = document.getElementById('WeaponDamage').value;
let weaponName = document.getElementById('WeaponName').value;
let weaponRange = document.getElementById('WeaponRange').value;
let biome = document.getElementById('Location').value;
let EnemyName = document.getElementById('EnemyName').value;

//show diff form based on what user wants to do
let submit = document.getElementById('Submit')
let body = document.getElementsByID('body');
let command = document.getElementById('SelectCommand').value;
submit.addEventListener('click',function(){
    //change form based on value
    if(command === 'Fight'){
        showFight();
    }
});

//make request to sever based on whats selected

//send request to game endpoint
try {
    const response = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:{
            'health': health,
            'armour': armour,
            'mana': mana,
            'weaponDamage': weaponDamage,
            'weaponRange': weaponRange,
            'weaponName': weaponName,
            'location': biome,
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

function showFight(){
    body.innerhtml= 
    `
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
};