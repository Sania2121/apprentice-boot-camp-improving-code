import generator from 'random-seed'

var Game
Game = function () {
  var players = new Array()
  var places = new Array(6)
  var purses = new Array(6)
  var inPenaltyBox = new Array(6)

  var popQuestions = new Array()
  var scienceQuestions = new Array()
  var sportsQuestions = new Array()
  var rockQuestions = new Array()

  var currentPlayer = 0
  var isGettingOutOfPenaltyBox = false

  var didPlayerWin = function () {
    return !(purses[currentPlayer] == 6)
  }

  var currentCategory = function () {
    if (places[currentPlayer] == 0) { return 'Pop' }
    if (places[currentPlayer] == 4) { return 'Pop' }
    if (places[currentPlayer] == 8) { return 'Pop' }
    if (places[currentPlayer] == 1) { return 'Science' }
    if (places[currentPlayer] == 5) { return 'Science' }
    if (places[currentPlayer] == 9) { return 'Science' }
    if (places[currentPlayer] == 2) { return 'Sports' }
    if (places[currentPlayer] == 6) { return 'Sports' }
    if (places[currentPlayer] == 10) { return 'Sports' }
    return 'Rock'
  }

  this.createRockQuestion = function (index) {
    return 'Rock Question ' + index
  }

  for (var index = 0; index < 50; index++) {
    popQuestions.push('Pop Question ' + index)
    scienceQuestions.push('Science Question ' + index)
    sportsQuestions.push('Sports Question ' + index)
    rockQuestions.push(this.createRockQuestion(index))
  }

  // removed below as unused
  // this.isPlayable = function (howManyPlayers) {
  //   return howManyPlayers >= 2
  // }

  this.add = function (playerName) {
    players.push(playerName)
    places[this.howManyPlayers() - 1] = 0
    purses[this.howManyPlayers() - 1] = 0
    inPenaltyBox[this.howManyPlayers() - 1] = false

    console.log(playerName + ' was added')
    console.log('They are player number ' + players.length)

    return true
  }

  this.howManyPlayers = function () {
    return players.length
  }

  var askQuestion = function () {
    if (currentCategory() == 'Pop') { console.log(popQuestions.shift()) }
    if (currentCategory() == 'Science') { console.log(scienceQuestions.shift()) }
    if (currentCategory() == 'Sports') { console.log(sportsQuestions.shift()) }
    if (currentCategory() == 'Rock') { console.log(rockQuestions.shift()) }
  }

  this.roll = function (roll) {
    console.log(players[currentPlayer] + ' is the current player')
    console.log('They have rolled a ' + roll)

    const playersTurn = () => {
      places[currentPlayer] = places[currentPlayer] + roll
      if (places[currentPlayer] > 11) {
        places[currentPlayer] = places[currentPlayer] - 12
      }

      console.log(players[currentPlayer] + '\'s new location is ' + places[currentPlayer])
      console.log('The category is ' + currentCategory())
      askQuestion()
    }
    if (inPenaltyBox[currentPlayer]) {
      if (roll % 2 != 0) {
        isGettingOutOfPenaltyBox = true

        console.log(players[currentPlayer] + ' is getting out of the penalty box')
        playersTurn()
      } else {
        console.log(players[currentPlayer] + ' is not getting out of the penalty box')
        isGettingOutOfPenaltyBox = false
      }
    } else {
      playersTurn()
    }
  }
  const answeredCorrectlyAndCanScore = () => {
    console.log('Answer was correct!!!!')
    purses[currentPlayer] += 1
    console.log(players[currentPlayer] + ' now has ' +
      purses[currentPlayer] + ' Gold Coins.')

    var winner = didPlayerWin()
    currentPlayer += 1
    if (currentPlayer == players.length) { currentPlayer = 0 }

    return winner
  }
  this.wasCorrectlyAnswered = function () {
    if (inPenaltyBox[currentPlayer]) {
      if (isGettingOutOfPenaltyBox) {
        return answeredCorrectlyAndCanScore()
      } else {
        currentPlayer += 1
        if (currentPlayer == players.length) { currentPlayer = 0 }
        return true
      }
    } else {
      return answeredCorrectlyAndCanScore()
    }
  }

  this.wrongAnswer = function () {
    console.log('Question was incorrectly answered')
    console.log(players[currentPlayer] + ' was sent to the penalty box')
    inPenaltyBox[currentPlayer] = true

    currentPlayer += 1
    if (currentPlayer == players.length) { currentPlayer = 0 }
    return true
  }
}

const gameRunner = (i) => {
  var notAWinner = false

  var game = new Game()

  game.add('Chet')
  game.add('Pat')
  game.add('Sue')

  const random = generator.create(i)

  do {
    game.roll(random.range(5) + 1)

    if (random.range(9) == 7) {
      notAWinner = game.wrongAnswer()
    } else {
      notAWinner = game.wasCorrectlyAnswered()
    }
  } while (notAWinner)
}

export default gameRunner
