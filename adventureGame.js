"use strict";

//UI variables
let textArea = document.getElementById("textArea");
let createPartyButton = document.getElementById("createParty");
let encounterButton = document.getElementById("encounter");
let encounterTextArea = document.getElementById("encounterText");
let fightButton = document.getElementById("fight");
let runButton = document.getElementById("run");
let character1Text = document.getElementById("character1Text");
let character2Text = document.getElementById("character2Text");
let monsterText = document.getElementById("monsterText");

encounterButton.style.display = 'none';
fightButton.style.display = 'none';
runButton.style.display = 'none';
character1Text.style.display = 'inline';
character2Text.style.display = 'inline';
monsterText.style.display = 'inline';

//applicaton variables
let locationDescription = ["a square room",
                           "a round room",
                           "a star shaped room",
                           "a cavern",
                           "a long coridor"];

let kobold = {
  name: "kobold",
  speed: 4,
  health: 3
};

let goblin = {
  name: "goblin",
  speed: 3,
  health: 4
};

let beholder = {
  name: "beholder",
  speed: 2,
  health: 6
};

let dragon = {
  name: "dragon",
  speed: 2,
  health: 10
};

let monsterType =  [kobold,
                   goblin,
                   beholder,
                   dragon];
                          
let isLose = false;
let character1;
let character2;
let monster;
let encounterEnded = false;
let numberOfEncounters = 0

//UI call eventlisteners
createPartyButton.addEventListener("click", function() {
  createParty();
  encounterButton.style.display = 'inline';
  createPartyButton.style.display = 'none';
});

encounterButton.addEventListener("click", function() {
  numberOfEncounters++;
  encounterEnded = false;
  encounterTextArea.innerText = "";
  roomEncounter();
  combat();
  updateUI();
});

fightButton.addEventListener('click', function(){
  encounterTextArea.innerText = "";
  combat();
  updateUI();
});


//constructors
var Character = ( function() {
  var priv = new WeakMap();
  
  function Character(name, characterClass, strength, health, stealth, speed) {
    var privateProperties = { 
      name: name,
      characterClass: characterClass,
      strength: strength,    
      health: health,
      stealth: stealth,
      speed: speed,
      money: 0,
      isDead: false
    };
    priv.set(this, privateProperties);
  }
  
  Character.prototype.getName = function() {
    return priv.get(this).name;
  };
  
  Character.prototype.getStrength = function() {
    return priv.get(this).strength;
  };
  
  Character.prototype.setStrength = function(str) {
    priv.get(this).strength = str;
  };

  Character.prototype.getHealth = function() {
    return priv.get(this).health;
  };
  
  Character.prototype.reduceHealth = function() {
    var hitPoints = priv.get(this).health - 1;
    priv.get(this).health = hitPoints;
    if(hitPoints===0)
    {
      priv.get(this).isDead = true;
    }
  };

  Character.prototype.getSpeed = function() {
    return priv.get(this).speed;
  };
  
  Character.prototype.setMoney = function(gold) {
    priv.get(this).money =  priv.get(this).money + gold;
  };
  
  Character.prototype.getMoney = function() {
    return priv.get(this).money;
  };
  
  Character.prototype.getIsDead = function() {
    return priv.get(this).isDead;
  };
  
  
  return Character;
}());


var Monster = ( function () {
  var priv = new WeakMap();
    
  function Monster(monsterType) {
    var privateProperties = { 
      name: monsterType.name,
      speed: monsterType.speed,
      health: monsterType.health,
      isDead: false
    };
    priv.set(this, privateProperties);
  }
  
  Monster.prototype.getName = function() {
    return priv.get(this).name;
  };
  
  Monster.prototype.getSpeed = function() {
    return priv.get(this).speed;
  };
  
  Monster.prototype.getHealth = function() {
    return priv.get(this).health;
  };
  
  Monster.prototype.reduceHealth = function() {
    var hitPoints = priv.get(this).health - 1;
    priv.get(this).health = hitPoints;
    if(hitPoints===0)
    {
      priv.get(this).isDead = true;
    }
  };
  
  Monster.prototype.getIsDead = function() {
    return priv.get(this).isDead;
  }
  
  return Monster;
}());


var Location = ( function () {
  var priv = new WeakMap();
    
  function Location(description) {
    var privateProperties = { 
      description: description
    };
    priv.set(this, privateProperties);
  }
  
  Location.prototype.getDescription = function() {
    return priv.get(this).description;
  };
  
  return Location;
}());


//application functions
function getRandomNumber(highestPossibleNumber)
{
  return Math.round(Math.random() * highestPossibleNumber);
}

function startAdventure() {
  textArea.innerText += "As a farm hand in the valley of Eastern Hagley there are not many ways to earn fame and fortune so you start on a regime of training to "
  + "become a skilled warrior.  The day has now come to put those skills to the test, to go forth and your rightful place in society.  You pack up your belongings and " 
  + "head to the local dungeon (lets face it there is one near every village) that is teaming with evil creatures.";
}

function createCharacter(character, position){
  var name = window.prompt("What is your " + position + " character's name?");
  if(name === "")
  {
    if(position === "first") {
      name = "Bob";
    }
    else
    {
      name = "Frank";
    }
    window.alert("You're " + position + " character's name is " + name);
  }
  
  var validClass = false;
  
  while(!validClass) {
    var characterClass = window.prompt("What was the character before the war? (Choose from: soldier, doctor,  politician)").toLowerCase();
    
    switch(characterClass){
      case "soldier":
        character = new Character(name, characterClass, 5, 5, 0, 3);
        validClass = true;
        break;
      case "doctor":
        character = new Character(name, characterClass, 0, 9, 0, 10);
        validClass = true;
        break;
      case "politician":
        character = new Character(name, characterClass, 0, 5, 5, 6);
        validClass = true;
        break;
      default:
        window.alert("I said enter an occuption, you moron");
        break;
    }
  }
  return  character;
}

function createParty() {
  character1 = createCharacter(character1, "first");
  character2 = createCharacter(character2, "second");
}

function roomEncounter() {
  var location = new Location(locationDescription[getRandomNumber(locationDescription.length - 1 )]); 
  monster = new Monster(monsterType[getRandomNumber(monsterType.length - 1)]);
  encounterTextArea.innerText = "You enter " + location.getDescription() + " and see a " + monster.getName();
}

function combat() {
  encounterTextArea.innerText += "\nYou fight the " + monster.getName();

  var combatants = [monster];
  if(!character1.getIsDead())
  {
    combatants.push(character1);
  }
  
  if(!character2.getIsDead())
  {
    combatants.push(character2);
  }

  combatants.sort(function(a, b) {return b.getSpeed() - a.getSpeed()});
  for(let i = 0; i < combatants.length; i++)
  { 
    var hitResult = "misses";
    
    var attackRoll = getRandomNumber(20) + 1;
    if(attackRoll > 10 && !combatants[i].getIsDead())
    {
      hitResult = "hits";
      
      if(combatants[i].constructor.name === "Character")
      {
        monster.reduceHealth();
      }
      else 
      {
        if(getRandomNumber(1) === 0)
        {
          character1.reduceHealth();
        }
        else
        {
          character2.reduceHealth();
        }
      }
    }
    encounterTextArea.innerText += "\n" + combatants[i].getName() + " strikes and " + hitResult;
  }
  
  if (character1.getIsDead() && character2.getIsDead())
  {
    isLose = true;
    encounterEnded=true;
  }
  else if(monster.getIsDead() )
  {
    lootMonster();    
    encounterEnded=true;
  }
}

function lootMonster() {
    encounterTextArea.innerText += "\n\n\nYou have killed the " + monster.getName();
    var gold = getRandomNumber( 20 ) + 1;
    encounterTextArea.innerText += "\nYou search its body and find " + gold + " gold pieces";
    character1.setMoney(gold);
    encounterTextArea.innerText += "\nYou now have " + character1.getMoney() + " gold pieces";
}

function updateUI() {
  if(!encounterEnded){
    encounterButton.style.display = 'none';  
    fightButton.style.display = 'inline';
    runButton.style.display = 'inline'; 
    updateHealthText();
  }
  else
  {
    if(isLose) {
      encounterButton.style.display = 'none';  
      fightButton.style.display = 'none';
      runButton.style.display = 'none';
      updateHealthText();
      endLose();
    }
    else if (numberOfEncounters === 5) {
      encounterButton.style.display = 'none';  
      fightButton.style.display = 'none';
      runButton.style.display = 'none';
      updateHealthText();
      endWin();
    }
    else
    {
      encounterButton.style.display = 'inline';  
      fightButton.style.display = 'none';
      runButton.style.display = 'none';
      updateHealthText();
    }
  }
}

function updateHealthText() {
  displayCharacterHealth(character1, character1Text);
  displayCharacterHealth(character2, character2Text);

  if(monster.getIsDead()) {
    monsterText.innerText = ""; 
  } 
  else 
  {
    monsterText.innerText = monster.getName() + "   Health: " + monster.getHealth() + "\n";
  }
}
 
function endWin() {
  encounterTextArea.innerText = "After all that fighting you decide that's enough for one day. " +
  "You head off to the pub with your " + character1.getMoney() + " which is probably enough to get " +
  "you drunk enough that the tails you tell will live on in legend for...well at least 5 mins.\n THE END";
}

function endLose() {
  encounterTextArea.innerText = "The party wiped....no drinks, no fame, no nothing\n THE END";
}

function displayCharacterHealth(character, characterText)
{
  if(character.getIsDead())
  {
    characterText.innerText = character.getName() + "   Health: DEAD\n";
  }
  else
  {
    characterText.innerText = character.getName() + "   Health: " + character.getHealth() + "\n";
  }
}

// Game
startAdventure();

