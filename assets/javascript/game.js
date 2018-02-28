$(document).ready(function(){

  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'assets/sounds/Batman - The Animated Series.mp3');

  $('#musicControls').on('click', '.theme-button', function () {
    audioElement.play();
  }).on('click', '.pause-button', function () {
    audioElement.pause();
  });


  function Player (name, hP, attackPowerStrength, counterPowerStrength, image) {
      this.name = name;
      this.hP = hP;
      this.attackPowerStrength = attackPowerStrength;
      this.counterPowerStrength = counterPowerStrength;
      this.earnedAttackStrength = attackPowerStrength;
      this.image = image;
  }
   
 
  $.extend(Player.prototype, {

    attack: function(defender) {
      defender.hP = defender.hP - this.earnedAttackStrength;
      this.hP = this.hP - defender.counterPowerStrength;
    },

    earnAttackPower: function(){
      this.earnedAttackStrength += this.attackPowerStrength;
    }
  });

  var rpgGame = {

    players : {},
    hero: null,
    defender: null,
    enemies: null,

    initialize: function(){
      this.reset();
    },

    reset: function(){
      this.hero = null;
      this.enemies = null;
      this.defender = null;

      var player1 = new Player("Batman", 100, 6, 10, "batman.jpg");
      var player2 = new Player("Deathstroke", 120, 8, 15, "deathstroke.jpg");
      var player3 = new Player("Joker", 150, 10, 20, "joker.jpg");
      var player4 = new Player("Red Hood", 180, 15, 25, "redHood.jpg");
      
      this.players[player1.name] = player1;
      this.players[player2.name] = player2;
      this.players[player3.name] = player3;
      this.players[player4.name] = player4;

      this.enemies = this.players;

      this.playerDisplay();
      this.pressRestartButton();
      this.message("");
      this.disableAttackButton(true);
    },

    playerDisplay: function(){
      for (var playerName in this.players) {     
        var playerObj = this.players[playerName];

        var player = $("<div>");
        player.attr("player-name", playerName);
        player.append("<section id='name'>" + playerName + "</section>");
        player.addClass("character");
        player.addClass("player");

        var playerImg = $("<img>");
        playerImg.attr("src", "assets/images/" + playerObj.image);
        playerImg.addClass("player-image");
        player.append(playerImg);
        
        player.append("<section id='hp'>" + playerObj.hP + "</section>");
        $("#select-character").append(player);
      }
    },

    pickHeroAndEnemies: function(player){
      if(this.hero !== null){
        this.message("You have already selected your character!");
      }
      else{
        var heroName = $(player).attr("player-name");
        this.hero = this.players[heroName];
        console.log("Your character: " + this.hero.name);
        delete this.enemies[heroName];


        $("#select-character > div").each(function () {
          var playerName = $(this).attr("player-name");
          $(this).removeClass("player");

          if(playerName === heroName){
            $(this).addClass("hero");
          }
          else{
            $(this).addClass("enemy");
            $("#enemies-lists").append(this);
          }
        });
      }
    },

    pickDefender: function(player){
      if(this.defender !== null){
        this.message("You have already selected a defender");
      }
      else{
        this.disableAttackButton(false);
      
        $(".defender").remove();
        var defender = $(player).attr("player-name");
        this.defender = this.players[defender];
        delete this.enemies[defender];
        console.log("Defender: " + this.defender.name);
        console.log("enemies list: " + this.enemies)

        $(player).addClass("defender");
        $(player).removeClass("enemy");
        $("#opponent").append(player);
        this.message("Start fight by pressing Attack");
      }
    },

    attack: function(){
      var message = "";

      this.hero.attack(this.defender);
      this.updateHealthPoints();
      
      if(this.hero.hP <= 0 || this.defender.hP <= 0)
      {
        var isHeroWinner = this.hero.hP > this.defender.hP;
        if(isHeroWinner){
          if(this.hero.hP <= 0){
            message = "You have lost all of your Health. Press Restart to play again!";
            this.pressRestartButton();
          }
          else if(Object.keys(this.enemies).length === 0){
            message = "You Won! Press Restart to play again";
            this.pressRestartButton();
          }
          else{
            message = "You have beat " + this.defender.name + ", you can choose to fight another enemy."
            this.defender = null;
          }
        }
        else{
          message = "You been lost... GAME OVER! Press Restart to play again!"
          this.pressRestartButton();
        }
        this.disableAttackButton(true);
      }
      else{ 
        message = "You attacked " + this.defender.name + " for " + this.hero.earnedAttackStrength 
        + " damage. " + this.defender.name + " attacked you back for " + this.defender.counterPowerStrength 
        + " damage.";
      }

      this.hero.earnAttackPower();
      this.message(message);
    },

    clearCharacters: function(){
      $( ".character" ).remove();
    },

    pressRestartButton: function(){
      $("#button-restart").toggle();
    },

    updateHealthPoints: function(){
      $(".hero").children("#hp").text(this.hero.hP);
      $(".defender").children("#hp").text(this.defender.hP);
    },

    message: function(message){
      $(".message").text(message);
    },

    disableAttackButton: function(status){
      $("#button-attack").attr("disabled", status);
    }

  };

  rpgGame.initialize();

  $("#select-character").on("click", ".player", function(){
    rpgGame.pickHeroAndEnemies(this);
  });

  $("#enemies-lists").on("click", ".enemy", function(){
    rpgGame.pickDefender(this);
  });

  $("#button-attack").on("click", function(){
    rpgGame.attack();
  });

  $("#button-restart").on("click", function(){
    rpgGame.clearCharacters();
    rpgGame.reset();

  });

});