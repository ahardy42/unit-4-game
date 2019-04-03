$(document).ready(function () {
    // all functions go here! 

    // global variables go here

    // this variable will hold the object which is in the attack position
    var attackCharacter = {};

    // this variable will hold the object which is in the defend position
    var defendCharacter = {};

    // will use this to check if an attacker has been set.
    var clickCounter = 0;

    // character objects go here

    // constructor for each character object. this makes it easier to modify code for methods without having
    // to cut and past a million times. and, looks better. 
    function Character(playerName, playerClass, pic, health, attack, power, counterAttack) {
        this.name = playerName;
        this.className = playerClass;
        this.picture = pic;
        this.healthPoints = health;
        this.attackPoints = attack;
        this.attackPower = power;
        this.counterAttackPower = counterAttack;
        this.attackIncrease = function () {
            // increases attackpoints by adding attackpower to the value
            this.attackPoints += this.attackPower;
        };
        this.attack = function () {
            // this is the function that removes healthPoints from the enemy
            defendCharacter.healthPoints -= this.attackPoints;
            $(defendCharacter.className).find("h6.character-health").text(defendCharacter.healthPoints);
            if (defendCharacter.healthPoints <= 0) {
                defendCharacter.killCharacter();
            } else {
                this.attacked();
            }
            this.attackIncrease();
        };
        this.attacked = function () {
            // this function removes the player's health points based on the other character's attackPoints value 
            this.healthPoints -= defendCharacter.attackPoints;
            $(this.className).find("h6.character-health").text(this.healthPoints);
            if (this.healthPoints <= 0) {
                this.killCharacter();
            }
        };
        this.chosenForAttack = function () {
            // this is an animate function that moves the opponent to the attack position for the game, and sets
            // the value of the attackCharacter object. 
            attackCharacter = this;
            $(this.className).animate({
                // move to the attack position on the board.
                left: "85%",
                top: "60%"
            });
        };
        this.chosenForDefend = function () {
            // this is the animate function that moves the enemy to the defending position, and sets the value of 
            // the defendCharcter object. 
            defendCharacter = this;
            $(this.className).animate({
                // move to defend position on the board.
                left: "55%",
                top: "60%"
            });
            $(".character").removeClass("defend");
        };
        this.killCharacter = function () {
            // this is called when healthPoints are zero, it runs code that removes the character from the defend position.
            $(this.className).animate({
                opacity: "0",
                top: "0",
                left: "0"
            });
            // this allows you to click on a new character after winning.
            clickCounter = 1;
        };
    }

    // creating some instances of the characters which I will use to populate HTML in the game
    var hanSolo = new Character("Han Solo", ".han", "assets/images/Han_Solo.jpg", 150, 20, 5, 25);
    var lukeSkywalker = new Character("Luke Skywalker", ".luke", "assets/images/luke.jpg", 130, 25, 3, 20);
    var jarJar = new Character("Jar-Jar Binks", ".jar-jar", "assets/images/jar-jar-binks.jpg", 100, 10, 15, 5);
    var darthVader = new Character("Darth Vader", ".vader", "assets/images/Vader.jpg", 140, 15, 10, 30);

    // putting the character objets into an array so that I can build the page info with an array iterator. 
    var characters = [hanSolo, lukeSkywalker, jarJar, darthVader];


    // global functions go here

    // this runs the code which displays a game over screen when the attacker has no healthPoints
    function gameOver() {

    }

    // this runs the code which displays a "you win" screen when all enemies have been defeated. 
    function youWin() {

    }

    // page building code goes here

    // displaying information about each character on the page. 
    characters.forEach(function(character) {
        $(character.className).find("h5").text(character.name);
        $(character.className).find("img").attr("src", character.picture);
        $(character.className).find("h6.character-health").text(character.healthPoints);
        $(character.className).find("h6.character-attack-points").text(character.attackPoints);
    });

    // onclick functions go here 

    // this is the onclick function logic for picking the attack player, and the defenders
    $(".character").on("click", function () {
        if (clickCounter === 0) {
            index = $(this).attr("value");
            characters[index].chosenForAttack();
            clickCounter++;
            console.log("attack character is", attackCharacter);
        } else if (clickCounter === 1) {
            index = $(this).attr("value");
            characters[index].chosenForDefend();
            clickCounter++;
            console.log("defend character is", defendCharacter);
            // code to build and show the attack button when the defend character is chosen.
            var button = $(".attack-button");
            // button.attr("onclick", "attackCharacter.attack()");
            button.fadeIn("slow");
            console.log("health points were", defendCharacter.healthPoints);
            // attackCharacter.attack();
            console.log("health points are", defendCharacter.healthPoints);
        } else {
            alert("you have already picked the players");
        }
    });

    // the attack function tied to the attack button. 
    $(".attack-button").on("click", function() {
        console.log(clickCounter);
        if (clickCounter === 2) {
            attackCharacter.attack();
        }
    });








});