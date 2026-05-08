const axios = require('axios');

// ── Data extracted from terraria_players PDF ──────────────────────────────────
const players = [
  { PlayerName: "Toxicbane",       WeaponName: "Bananarang",                  ClassName: "Melee"    },
  { PlayerName: "Vera the Gilded", WeaponName: "Last Prism",                  ClassName: "Mage"     },
  { PlayerName: "Fernheart",       WeaponName: "Vortex Beater",               ClassName: "Ranged"   },
  { PlayerName: "Eirasinger",      WeaponName: "Stardust Cell Staff",         ClassName: "Summoner" },
  { PlayerName: "Emberrunner",     WeaponName: "Chlorophyte Shotbow",         ClassName: "Ranged"   },
  { PlayerName: "Nox the Deep",    WeaponName: "Heat Ray",                    ClassName: "Mage"     },
  { PlayerName: "Solarcaller",     WeaponName: "Flairon",                     ClassName: "Melee"    },
  { PlayerName: "Colt the Solar",  WeaponName: "Amarok",                      ClassName: "Melee"    },
  { PlayerName: "Jaxblade",        WeaponName: "Yelets",                      ClassName: "Melee"    },
  { PlayerName: "Colebane",        WeaponName: "Bone Javelin",                ClassName: "Ranged"   },
  { PlayerName: "Sky the Deep",    WeaponName: "Onyx Blaster",                ClassName: "Ranged"   },
  { PlayerName: "Daxkeeper",       WeaponName: "Hel-Fire",                    ClassName: "Melee"    },
  { PlayerName: "Duskslayer",      WeaponName: "Laser Machinegun",            ClassName: "Mage"     },
  { PlayerName: "Lyric the Void",  WeaponName: "Scourge of the Corruptor",   ClassName: "Melee"    },
  { PlayerName: "Cadeheart",       WeaponName: "Poison Dart",                 ClassName: "Ranged"   },
  { PlayerName: "Rook the Dark",   WeaponName: "Dark Lance",                  ClassName: "Melee"    },
  { PlayerName: "Bonecaller",      WeaponName: "Pirate Staff",                ClassName: "Summoner" },
  { PlayerName: "Aria the Arcane", WeaponName: "Hornet Staff",                ClassName: "Summoner" },
  { PlayerName: "Sage the Spore",  WeaponName: "Pirate Staff",                ClassName: "Summoner" },
  { PlayerName: "Thunderravager",  WeaponName: "Book of Skulls",              ClassName: "Mage"     },
  { PlayerName: "Lyric the Dark",  WeaponName: "Paladin's Hammer",            ClassName: "Melee"    },
  { PlayerName: "Kael the Solar",  WeaponName: "Stardust Cell Staff",         ClassName: "Summoner" },
  { PlayerName: "Phantomfallen",   WeaponName: "Magnet Sphere",               ClassName: "Mage"     },
  { PlayerName: "Lyric the Crimson", WeaponName: "Excalibur",                 ClassName: "Melee"    },
  { PlayerName: "Cryptstriker",    WeaponName: "Shadowflame Knife",           ClassName: "Melee"    },
  { PlayerName: "Roan the Hollow", WeaponName: "Star Cannon",                 ClassName: "Ranged"   },
  { PlayerName: "Arcaneprowler",   WeaponName: "Magnet Sphere",               ClassName: "Mage"     },
  { PlayerName: "Raze the Cursed", WeaponName: "Valor",                       ClassName: "Melee"    },
  { PlayerName: "Lyra the Thunder",WeaponName: "Hornet Staff",                ClassName: "Summoner" },
  { PlayerName: "Emberheart",      WeaponName: "Magnet Sphere",               ClassName: "Mage"     },
  { PlayerName: "Sporeterror",     WeaponName: "Thorn Chakram",               ClassName: "Melee"    },
  { PlayerName: "Grimwraith",      WeaponName: "Ball O' Hurt",                ClassName: "Melee"    },
  { PlayerName: "Dax the Spore",   WeaponName: "Rotten Egg",                  ClassName: "Ranged"   },
  { PlayerName: "Lyra the Wild",   WeaponName: "Sanguine Staff",              ClassName: "Summoner" },
  { PlayerName: "Dusk the Hollow", WeaponName: "Phantasm",                    ClassName: "Ranged"   },
  { PlayerName: "Corruptravager",  WeaponName: "Death Sickle",                ClassName: "Melee"    },
  { PlayerName: "Lunebreaker",     WeaponName: "Scourge of the Corruptor",   ClassName: "Melee"    },
  { PlayerName: "Duskrider",       WeaponName: "Explosive Jack 'O Lantern",  ClassName: "Ranged"   },
  { PlayerName: "Stormstriker",    WeaponName: "Flamelash",                   ClassName: "Mage"     },
  { PlayerName: "Crixborn",        WeaponName: "Water Bolt",                  ClassName: "Mage"     },
  { PlayerName: "Vexhunter",       WeaponName: "Yelets",                      ClassName: "Melee"    },
  { PlayerName: "Vextide",         WeaponName: "Flairon",                     ClassName: "Melee"    },
  { PlayerName: "Starprowler",     WeaponName: "Cascade",                     ClassName: "Melee"    },
  { PlayerName: "Runicclaw",       WeaponName: "Zenith",                      ClassName: "Melee"    },
  { PlayerName: "Kalguard",        WeaponName: "Shuriken",                    ClassName: "Ranged"   },
  { PlayerName: "Rex the Toxic",   WeaponName: "S.D.M.G.",                    ClassName: "Ranged"   },
  { PlayerName: "Deepmarked",      WeaponName: "Terrarian",                   ClassName: "Melee"    },
  { PlayerName: "Nyx the Spore",   WeaponName: "Pygmy Staff",                 ClassName: "Summoner" },
  { PlayerName: "Lostward",        WeaponName: "Stardust Cell Staff",         ClassName: "Summoner" },
  { PlayerName: "Hexstone",        WeaponName: "Heat Ray",                    ClassName: "Mage"     },
  { PlayerName: "Sable the Radiant", WeaponName: "Daedalus Stormbow",         ClassName: "Ranged"   },
  { PlayerName: "Finnbane",        WeaponName: "Molotov Cocktail",            ClassName: "Ranged"   },
  { PlayerName: "Duskrisen",       WeaponName: "Star Wrath",                  ClassName: "Melee"    },
  { PlayerName: "Emberbound",      WeaponName: "Grenade Launcher",            ClassName: "Ranged"   },
  { PlayerName: "Sage the Hallow", WeaponName: "Influx Waver",                ClassName: "Melee"    },
  { PlayerName: "Coltstriker",     WeaponName: "Chain Gun",                   ClassName: "Ranged"   },
  { PlayerName: "Sol the Magma",   WeaponName: "KO Cannon",                   ClassName: "Melee"    },
  { PlayerName: "Noxsinger",       WeaponName: "Sanguine Staff",              ClassName: "Summoner" },
  { PlayerName: "Sera the Toxic",  WeaponName: "True Excalibur",              ClassName: "Melee"    },
  { PlayerName: "Aria the Wild",   WeaponName: "Fiery Greatsword",            ClassName: "Melee"    },
  { PlayerName: "Runicshade",      WeaponName: "Poison Dart",                 ClassName: "Ranged"   },
  { PlayerName: "Fen the Mystic",  WeaponName: "Molten Fury",                 ClassName: "Melee"    },
  { PlayerName: "Lyra the Shadow", WeaponName: "Flinx Staff",                 ClassName: "Summoner" },
  { PlayerName: "Obsidianreaper",  WeaponName: "Flairon",                     ClassName: "Melee"    },
  { PlayerName: "Roan the Hallow", WeaponName: "Muramasa",                    ClassName: "Melee"    },
  { PlayerName: "Solarfang",       WeaponName: "Chlorophyte Partisan",        ClassName: "Melee"    },
  { PlayerName: "Ashcaller",       WeaponName: "Dao of Pow",                  ClassName: "Melee"    },
  { PlayerName: "Emberseeker",     WeaponName: "Chain Gun",                   ClassName: "Ranged"   },
  { PlayerName: "Daxhunter",       WeaponName: "Cutlass",                     ClassName: "Melee"    },
  { PlayerName: "Vexrisen",        WeaponName: "Rocket Launcher",             ClassName: "Ranged"   },
  { PlayerName: "Kal the Dark",    WeaponName: "Tempest Staff",               ClassName: "Summoner" },
  { PlayerName: "Silversworn",     WeaponName: "Spider Staff",                ClassName: "Summoner" },
  { PlayerName: "Iris the Night",  WeaponName: "Terraprisma",                 ClassName: "Summoner" },
  { PlayerName: "Rookfallen",      WeaponName: "Chain Gun",                   ClassName: "Ranged"   },
  { PlayerName: "Hallowrider",     WeaponName: "Influx Waver",                ClassName: "Melee"    },
  { PlayerName: "Lyricchaser",     WeaponName: "Breaker Blade",               ClassName: "Melee"    },
  { PlayerName: "Thunderstone",    WeaponName: "Xeno Staff",                  ClassName: "Summoner" },
  { PlayerName: "Dusk the Hollow", WeaponName: "Daybreak",                    ClassName: "Melee"    },
  { PlayerName: "Kal the Mystic",  WeaponName: "Fetid Baghnakhs",             ClassName: "Melee"    },
  { PlayerName: "Sablestalker",    WeaponName: "Raven Staff",                 ClassName: "Summoner" },
  { PlayerName: "Dax the Golden",  WeaponName: "Fetid Baghnakhs",             ClassName: "Melee"    },
  { PlayerName: "Nebuladancer",    WeaponName: "Xeno Staff",                  ClassName: "Summoner" },
  { PlayerName: "Vilebound",       WeaponName: "Dao of Pow",                  ClassName: "Melee"    },
  { PlayerName: "Swifthunter",     WeaponName: "KO Cannon",                   ClassName: "Melee"    },
  { PlayerName: "Sagehunter",      WeaponName: "Nebula Blaze",                ClassName: "Mage"     },
  { PlayerName: "Vex the Gilded",  WeaponName: "Vilethorn",                   ClassName: "Mage"     },
  { PlayerName: "Mysticravager",   WeaponName: "Elf Melter",                  ClassName: "Mage"     },
  { PlayerName: "Rookrider",       WeaponName: "Betsy's Wrath",               ClassName: "Mage"     },
  { PlayerName: "Brix the Blaze",  WeaponName: "Eye of Cthulhu (Yoyo)",      ClassName: "Melee"    },
  { PlayerName: "Darkcaller",      WeaponName: "Laser Rifle",                 ClassName: "Mage"     },
  { PlayerName: "Roanchosen",      WeaponName: "Razorblade Typhoon",          ClassName: "Mage"     },
  { PlayerName: "Rue the Storm",   WeaponName: "Death Sickle",                ClassName: "Melee"    },
  { PlayerName: "Lostbound",       WeaponName: "Flower of Fire",              ClassName: "Mage"     },
  { PlayerName: "Ariafire",        WeaponName: "KO Cannon",                   ClassName: "Melee"    },
  { PlayerName: "Vale the Shadow", WeaponName: "Nebula Blaze",                ClassName: "Mage"     },
  { PlayerName: "Darkcrusher",     WeaponName: "Heat Ray",                    ClassName: "Mage"     },
  { PlayerName: "Pikebender",      WeaponName: "Throwing Knife",              ClassName: "Ranged"   },
  { PlayerName: "Terraterror",     WeaponName: "Megashark",                   ClassName: "Ranged"   },
  { PlayerName: "Serarift",        WeaponName: "Death Sickle",                ClassName: "Melee"    },
  { PlayerName: "Phantomrisen",    WeaponName: "Scourge of the Corruptor",   ClassName: "Melee"    },
];

// ── Stat ranges per class ─────────────────────────────────────────────────────
const classStats = {
  Melee: {
    Health:     [200, 500],
    Mana:       [20,  100],
    Armour:     [30,  80],
    WeaponDam:  [40,  120],
    WeaponRange:[2,   6],
  },
  Ranged: {
    Health:     [150, 400],
    Mana:       [20,  80],
    Armour:     [20,  60],
    WeaponDam:  [30,  100],
    WeaponRange:[8,   20],
  },
  Mage: {
    Health:     [100, 300],
    Mana:       [150, 400],
    Armour:     [10,  40],
    WeaponDam:  [50,  150],
    WeaponRange:[10,  25],
  },
  Summoner: {
    Health:     [120, 350],
    Mana:       [80,  250],
    Armour:     [15,  50],
    WeaponDam:  [20,  80],
    WeaponRange:[5,   15],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPayload() {
  const template = randFrom(players);
  const stats    = classStats[template.ClassName];

  return {
    PlayerName: template.PlayerName,
    WeaponName: template.WeaponName,
    ClassName:  template.ClassName,
    Health:     randInt(...stats.Health),
    Mana:       randInt(...stats.Mana),
    Armour:     randInt(...stats.Armour),
    WeaponDam:  randInt(...stats.WeaponDam),
    WeaponRange:randInt(...stats.WeaponRange),
  };
}

// ── Main seeder ───────────────────────────────────────────────────────────────
async function seedPlayers(count = 10, baseUrl = 'http://localhost:3000') {
  console.log(`\nSeeding ${count} player(s) → ${baseUrl}/player\n`);

  let ok = 0, fail = 0;

  for (let i = 0; i < count; i++) {
    const payload = buildPayload();

    try {
      const { data } = await axios.post(`${baseUrl}/player`, payload);
      console.log(`[${i + 1}/${count}] ✓ ${payload.PlayerName} (${payload.ClassName}) → PlayerId: ${data.PlayerId}`);
      ok++;
    } catch (err) {
      const msg = err.response?.data?.details ?? err.message;
      console.error(`[${i + 1}/${count}] ✗ ${payload.PlayerName} → ${msg}`);
      fail++;
    }
  }

  console.log(`\nDone. ${ok} inserted, ${fail} failed.\n`);
}

// ── CLI: node seedPlayers.js <count> <baseUrl> ────────────────────────────────
const [,, countArg, urlArg] = process.argv;
seedPlayers(
  countArg ? parseInt(countArg, 10) : 10,
  urlArg   ?? 'http://localhost:3000'
);
