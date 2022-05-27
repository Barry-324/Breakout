const scoreDisplay = document.querySelector('#score')
const GameWidth = 800, GameHeight = 600
const BrickWidth = 100, BrickHeight = 30
const StickWidth = 150, StickHeight = 30
const BrickRow = 3, BrickColumn = 6, BrickGap = 30
const BrickXStart = 25, BrickYStart = 50
const COLOR = ["red","orange","yellow","green","blue"]
const BallDiameter = 20
let xDirection = 2, yDirection = 2

const userStart = [325,40]
let userPosition = userStart

const ballStart = [390, 70]
let ballPosition = ballStart

let timerId
let score = 0

const container = document.querySelector('#container')
container.style.width = GameWidth + "px"
container.style.height = GameHeight + "px"

//set Component
class Component {
    constructor() {
        this.coor = {x:0, y:0}
        this.node = document.createElement('div')
        container.appendChild(this.node)
    }
    setXY(x,y) {
        this.coor.x = x;
        this.coor.y = y;
        this.node.style.left = x + "px";
        this.node.style.top = y + "px";
    }
}

//set Bricks
class Brick extends Component {
    constructor() {
        super();
        this.level = Math.floor(Math.random()*5)+1
        this.node.className = 'Brick'
        this.node.style.x = BrickWidth + "px"
        this.node.style.y = BrickHeight + "px"
        this.node.style.backgroundColor = COLOR[this.level-1]
    }
}

//set ball
class Ball extends Component {
    constructor() {
        super();
        this.node.className = 'Ball'
        this.node.style.backgroundColor = 'black'
        this.node.style.left = ballPosition[0] + 'px'
        this.node.style.bottom = ballPosition[1] + 'px'
    }
}

//set Stick(user)
class Stick extends Component {
    constructor() {
        super();
        this.node.className = 'Stick'
        this.node.style.backgroundColor = 'purple'
        this.node.style.left = userPosition[0] + 'px'
        this.node.style.bottom = userPosition[1] + 'px'
    }
}

//create Bricks
for (let i=0; i<BrickRow; i++) {
    for (let j=0,brick; j<BrickColumn; j++) {
        brick = new Brick();
        brick.setXY(BrickXStart + (BrickWidth + BrickGap)*j, BrickYStart + (BrickHeight + BrickGap)*i);
    }
}

//create Stick(user)
let stick = new Stick();
//create ball
let ball = new Ball();

//move Stick(user)
document.addEventListener('mousemove', function(e) {
    var LeftMargin = (document.getElementsByTagName('body')[0].clientWidth - GameWidth)/2
    if (e.clientX < LeftMargin + StickWidth/2) {
        userPosition[0] = 0
    }else if (e.clientX > LeftMargin + GameWidth - 75) {
        userPosition[0] = GameWidth - 150
    }else {
        userPosition[0] = e.clientX - LeftMargin -75
    }
    //remove old stick(user)
    var OldStick = document.getElementsByClassName('Stick')
    OldStick[0].remove()
    let stick = new Stick
})

//move ball
function moveBall() {
    ballPosition[0] += xDirection
    ballPosition[1] += yDirection
    var OldBall = document.getElementsByClassName('Ball')
    OldBall[0].remove()
    let ball = new Ball
    checkForCollisions()
}
timerId = setInterval(moveBall, 8)

//check collisions
function checkForCollisions() {
    //check for brick collosions
    const allBricks = document.getElementsByClassName('Brick')
    for (let i=0; i<allBricks.length; i++) {
        if(
            (ballPosition[0] > allBricks[i].style.left.replace('px','')*1  - BallDiameter && ballPosition[0] < allBricks[i].style.left.replace('px','')*1 + BrickWidth) &&
            ((ballPosition[1] + BallDiameter) > GameHeight - allBricks[i].style.top.replace('px','')*1 - BrickHeight && ballPosition[1] < GameHeight - allBricks[i].style.top.replace('px','')*1) 
        ) {
            if (allBricks[i].style.backgroundColor == COLOR[0]) {
                score +=1
            }
            if (allBricks[i].style.backgroundColor == COLOR[1]) {
                score +=2
            }
            if (allBricks[i].style.backgroundColor == COLOR[2]) {
                score +=3
            }
            if (allBricks[i].style.backgroundColor == COLOR[3]) {
                score +=4
            }
            if (allBricks[i].style.backgroundColor == COLOR[4]) {
                score +=5
            }
            allBricks[i].remove()
            changeDirection()

            scoreDisplay.innerHTML = 'Your Socre: ' + score + ' pt'

            if (allBricks.length == 0) {
                scoreDisplay.innerHTML = 'Congratulation! Your Final Score is ' + score + ' pt'
                clearInterval(timerId)
            }
        }
    }
    //check for wall collisions
    if (ballPosition[0] >= (GameWidth - BallDiameter) || ballPosition[0] <= 0 || ballPosition[1] >= (GameHeight - BallDiameter)) {
        changeDirection()
    }
    //check for user collisions
    if
    ((ballPosition[0] > userPosition[0] && ballPosition[0] < userPosition[0] + StickWidth) &&
     (ballPosition[1] > userPosition[1] && ballPosition[1] < userPosition[1] + StickHeight ) ){
      changeDirection()
    }
    //check for game over
    if (ballPosition[1] <= 0) {
        clearInterval(timerId)
        scoreDisplay.innerHTML = 'Oops, You lose! ' + 'Your Final Score is ' + score + ' pt'
      }
}

//change ball direction
function changeDirection() {
    if (xDirection == 2 && yDirection == 2 ) {
        yDirection = -2
        return
    }
    if (xDirection == 2 && yDirection == -2) {
        xDirection = -2
        return
    }
    if (xDirection == -2 && yDirection == -2) {
        yDirection = 2
        return
    }
    if (xDirection == -2 && yDirection == 2) {
        xDirection = 2
        return
    }
}