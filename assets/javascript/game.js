$(document).ready(function () {
    // ------------------------------- all code goes inside! ----------------------------

    // ------------------------------- global variables go here ---------------------------

    // this variable will hold the object which is in the attack position
    var attackCharacter = {};

    // this variable will hold the object which is in the defend position
    var defendCharacter = {};

    // will use this to check if an attacker has been set.
    var clickCounter = 0;

    // used to check how many characters have been killed
    var deathToll = 0;

    // instructions paragraph html strings
    var instructions = [
        "Click to go through instructions.",
        "Each character has a set amount of <span style='color: red'>Health Points</span> and <span style='color: green'>Attack Points</span>.<br><br> An attack will reduce the attacked player’s <span style='color: red'>Health Points</span> by the value of <span style='color: green'>Attack Points</span>.",
        "First, click on a character you want to be the <span style='color: red'>Attacker</span>. Then, click on the character you want to be the first <span style='color: green'>Defender</span>.",
        "Each attack, the <span style='color: red'>Attacker</span> gains attack points, but, the <span style='color: green'>Defender</span> doesn’t. Choose your <span style='color: red'>Attacker</span> wisely...<br><br> Defeat all <span style='color: green'>Defenders</span> and you win!  <br><br>Lose all your Health Points and you lose...",
        "Each time you click the Attack button, the defender is attacked by a droid...<br><br> <span style='font-size: 1.2em'>but...</span><br><br> the droid is then taken over by the <span style='color: green'>Defender</span> briefly, and forces it to counter-attack...",
        "Good Luck, and... <br><br><span style='font-size: 2em; text-align: center; color: rgb(253,206,3)'>May the force be with you!</span>",
    ];

    // this is used in the onclick function for the instructions to scroll through the paragraphs
    var instructionsIndex = 0;

    // ------------------------------- character objects go here ----------------------------------

    // constructor for each character object. this makes it easier to modify code for methods without having
    // to cut and past a million times. and, looks better. 
    function Character(playerName, playerClass, pic, health, attack, power) {
        this.name = playerName;
        this.className = playerClass;
        this.picture = pic;
        this.healthPoints = health;
        this.attackPoints = attack;
        this.attackPower = power;
        this.isDead = false;
        this.attackIncrease = function () {
            // increases attackpoints by adding attackpower to the value and then displays the new value
            this.attackPoints += this.attackPower;
            $(this.className).find("h6.character-attack-points").text("Attack Points: " + this.attackPoints);
        };
        this.attack = function () {
            // this is the function that removes healthPoints from the enemy
            // then decrement defendCharacter HP
            defendCharacter.healthPoints -= this.attackPoints;
            $(defendCharacter.className).find("h6.character-health").text("Health Points: " + defendCharacter.healthPoints);
            if (defendCharacter.healthPoints <= 0) {
                defendCharacter.killCharacter();
            } else {
                // then, shoot the laser at the attackCharacter
                var thisObject = this;
                setTimeout(function () {
                    shootLaserTwo();
                    thisObject.attacked();
                }, 1000);
            }
            // increases attackpoints for the attacking character
            this.attackIncrease();
        };
        this.attacked = function () {
            // this function removes the player's health points based on the other character's attackPoints value 
            this.healthPoints -= defendCharacter.attackPoints;
            $(this.className).find("h6.character-health").text("Health Points: " + this.healthPoints);
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
        };
        this.killCharacter = function () {
            // this is called when healthPoints are zero, it runs code that removes the character from the defend position.
            // it also runs code that blows the character up, and increases deathToll which is used to determine if you 
            // won.  this.isDead is used to determine if you lost (if you're in the attacking position)
            this.isDead = true;
            deathToll++;
            $(this.className).animate({
                opacity: "0"
            }, 200);
            var blowUpCharacter = $(".explosion > img")
            if (this === defendCharacter) {
                blowUpCharacter.css({
                    display: "block",
                    left: "55%",
                    top: "70%",
                });
                blowUpCharacter.animate({
                    width: "300px",
                    margin: "-150px 0 0 -100px"
                }, 200);
                blowUpCharacter.fadeOut(500);
            } else {
                blowUpCharacter.css({
                    display: "block",
                    left: "85%",
                    top: "70%",
                });
                blowUpCharacter.animate({
                    width: "300px",
                    margin: "-150px 0 0 -100px"
                }, 200);
                blowUpCharacter.fadeOut(500);
            }
            // this allows you to click on a new character after winning.
            clickCounter = 1;
        };
    }

    // creating some instances of the characters which I will use to populate HTML in the game
    var hanSolo = new Character("Han Solo", ".han", "assets/images/Han_Solo.jpg", 150, 20, 5);
    var lukeSkywalker = new Character("Luke Skywalker", ".luke", "assets/images/luke.jpg", 130, 25, 3);
    var jarJar = new Character("Jar-Jar Binks", ".jar-jar", "assets/images/jar-jar-binks.jpg", 115, 10, 15);
    var darthVader = new Character("Darth vader", ".vader", "assets/images/Vader.jpg", 140, 15, 10);

    // putting the character objets into an array so that I can build the page info with an array iterator. 
    var characters = [hanSolo, lukeSkywalker, jarJar, darthVader];


    // ---------------------------- global functions go here -----------------------------

    // this runs the code which displays a game over screen when the attacker has no healthPoints
    function gameOver() {
        // first, remove all the characters from the screen, leave reset button
        $(".character").fadeOut(2000);
        $("#button").animate({ opacity: "0" }, 1000);
        setTimeout(function () {
            // then show the game over text
            $(".battlefield").append("<div class='game-over'>");
            var gameOverDiv = $(".battlefield").find(".game-over");
            gameOverDiv.append("<p>You Lose!!!</p>");
        }, 2001);
    }

    // this runs the code which displays a "you win" screen when all enemies have been defeated. 
    function youWin() {
        // first, remove all the characters from the screen
        $(".character").fadeOut(2000);
        $("#button").animate({ opacity: "0" }, 1000);
        setTimeout(function () {
            // then show the game over text
            $(".battlefield").append("<div class='game-over'>");
            var gameOverDiv = $(".battlefield").find(".game-over");
            gameOverDiv.append("<p>You Win!!!</p>");
        }, 2001);
        // then show reset button 
    }

    // sharks with fricken laser beams
    function shootLaserOne() {
        var laserBeam = $(".laser-one");
        laserBeam.fadeIn(10);
        laserBeam.animate({
            left: "60%",
            top: "60%",
        }, 100);
        laserBeam.fadeOut(10);
        laserBeam.css({ top: "45%", left: "72%" });
    }

    function shootLaserTwo() {
        var laserBeam = $(".laser-two");
        laserBeam.fadeIn(10);
        laserBeam.animate({
            left: "85%",
            top: "60%",
        }, 100);
        laserBeam.fadeOut(10);
        laserBeam.css({ top: "45%", left: "72%" });
    }

    // ------------------------    page building code goes here -------------------------

    // display the initial instructions to the screen
    $("#instructions-header").text("How To Play:");
    $("#instructions").html(instructions[instructionsIndex]);

    // displaying information about each character on the page. 
    characters.forEach(function (character) {
        $(character.className).find("h5").text(character.name);
        $(character.className).find("img").attr("src", character.picture);
        $(character.className).find("h6.character-health").text("Health Points: " + character.healthPoints);
        $(character.className).find("h6.character-attack-points").text("Attack Points: " + character.attackPoints);
    });

    // creating the "laser" 
    var laserOne = $(".battlefield").append("<div class='laser-one'>");
    var laserTwo = $(".battlefield").append("<div class='laser-two'>");

    // creating the explosion div and image w/ jQuery just for funsies
    var explosion = $(".battlefield").append("<div class='explosion'>");
    $(".explosion").append("<img>");
    var explosionImg = $(".explosion").find("img");
    explosionImg.attr("src", "assets/images/explosion.png");


    // ---------------------------- onclick functions go here ------------------------------

    // onclick functions for the instructions screen
    $(".instructions").on("click", function () {
        instructionsIndex++;
        if (instructionsIndex < instructions.length) {
            $("#instructions").html(instructions[instructionsIndex]);
            console.log(instructionsIndex);
            // on the second paragraph this highlights the healt and attack points on a character
            if (instructionsIndex === 1) {
                $(".han > .character-health").css({
                    "border-style": "solid",
                    "border-width": "5px",
                    "border-color": "red",
                    "border-radius": "10px",
                    "padding": "1em",
                });
                $(".han > .character-attack-points").css({
                    "border-style": "solid",
                    "border-width": "5px",
                    "border-color": "green",
                    "border-radius": "10px",
                    "padding": "1em",
                });
            // then remove the highlighting from the character
            } else if (instructionsIndex === 2) {
                $(".han > .character-health").removeAttr("style");
                $(".han > .character-attack-points").removeAttr("style");
            }
        } else {
            // when you get to the end of the instructions, hide them!
            $(".instructions").animate({ opacity: "0" });
        }
    });

    // this is the onclick function logic for picking the attack player, and the defenders
    $(".character").on("click", function () {
        console.log($(this).find("character-name").text());
            console.log(attackCharacter.className);
            console.log(clickCounter);
        if (clickCounter === 0) {
            index = $(this).attr("value");
            characters[index].chosenForAttack();
            clickCounter++;
            // show that this is the "attacker"
            $(attackCharacter.className).children("h6:first").before("<h5 class='attacker'>Attacker</h5>");
            // hide instructions
            instructionsIndex = 0;
            $(".instructions").animate({ opacity: "0" });
            $(".han > .character-health").removeAttr("style");
            $(".han > .character-attack-points").removeAttr("style");
        } else if ($(this).find(".character-name").text() === attackCharacter.name) {
            alert("you can't click the same character twice!");
        } else if (clickCounter === 1) {
            index = $(this).attr("value");
            characters[index].chosenForDefend();
            clickCounter++;
            // show that this is the "defender"
            $(defendCharacter.className).children("h6:first").before("<h5 class='defender'>Defender</h5>");
            // code to build and show the attack button when the defend character is chosen.
            var buttons = $(".attack-button");
            buttons.fadeIn(2000);
        } else {
            alert("you have already picked the players, it's time to attack!");
        }
    });

    // the attack function tied to the attack button. 
    $("#button").on("click", function () {
        // it's not visible, but it's still there so this makes sure you can't attack w/out choosing players
        if (clickCounter === 2) {
            // first the attack droid flies in from the right
            $(".attack-droid > img").animate({ left: "70%" }, 2000);
            // then the attack sequence is carried out
            setTimeout(function () {
                shootLaserOne();
                attackCharacter.attack();
            }, 2500);
            // then the droid flies back to the right
            setTimeout(function () {
                $(".attack-droid > img").animate({ left: "110%" }, 2000);
            }, 4000);
        }
        // checks to see if you won or lost, after the droid flies away. then displays win or lose screen. 
        setTimeout(function () {
            if (attackCharacter.isDead) {
                gameOver();
            } else if (deathToll === 3) {
                youWin();
            }
        }, 4001);
    });

    $("#reset").on("click", function () {
        // reset players position and values. this works, but should be updated at some point to make it easier to 
        // modify the values (and not have to do it above as well)
        hanSolo.healthPoints = 150;
        hanSolo.attackPoints = 20;
        lukeSkywalker.healthPoints = 130;
        lukeSkywalker.attackPoints = 25;
        jarJar.healthPoints = 115;
        jarJar.attackPoints = 10;
        darthVader.healthPoints = 140;
        darthVader.attackPoints = 15;

        // display values and reset this.isDead to false
        characters.forEach(function (character) {
            character.isDead = false;
            $(character.className).find(".attacker, .defender").remove();
            $(character.className).removeAttr("style");
            $(character.className).find("h6.character-health").text("Health Points: " + character.healthPoints);
            $(character.className).find("h6.character-attack-points").text("Attack Points: " + character.attackPoints);
        });

        // reset opacity of the attack button and instructions
        $(".instructions").removeAttr("style");
        $("#button").removeAttr("style");
        // hide buttons and win/lose message
        $(".attack-button").removeAttr("style");
        $(".game-over").remove();
        // show instructions
        $("#instructions-header").text("How To Play:");
        instructionsIndex = 0;
        $("#instructions").html(instructions[instructionsIndex]);
        $(".instructions").removeAttr("style");

        // reset characters and declaration of attack + defend
        attackCharacter = {};
        defendCharacter = {};
        // reset clickCounter and deathToll
        clickCounter = 0;
        deathToll = 0;

    });
})
