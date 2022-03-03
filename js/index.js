window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  const myCanvas = document.querySelector('#canvas')
  const scoreElt = document.querySelector('#score')
  const myCanvasWidth = Number(myCanvas.width)
  const myCanvasHeight = Number(myCanvas.height)
  console.log(`myCanvas dimension: ${myCanvasWidth} x ${myCanvasHeight}`)
  const myContext = myCanvas.getContext('2d')
  const carImage = new Image()
  carImage.src = './images/car.png'
  let myInterval
  function clearCanvas(){
    myContext.clearRect(0,0,myCanvasWidth,myCanvasHeight)
  }

  const car = {
    x:225,
    y:600,
    w:50,
    l:100,
    xSpeed: 10,
    draw(){
      clearCanvas()
      myContext.drawImage(carImage,this.x, this.y, this.w,this.l)
    }
  }

  class Obstacles{
    constructor(x, w , y=0){
      this.x = x
      this.w = w
      this.y = y
      this.ySpeed = 10
    }
    draw(){
      //console.log('drawing')
      myContext.lineWidth = 10
      myContext.beginPath()
      myContext.moveTo(this.x, this.y)
      myContext.lineTo(this.x + this.w, this.y)
      myContext.stroke()
      myContext.closePath()
    }
    move(){
      this.y += this.ySpeed
    }
  }
  const obsArray = []

  function drawAll(){
    car.draw()
    obsArray.forEach( obs => obs.draw() )
  }
  
  //we don't want to add an obstacle too frequently, only once in obstacleInterval times
  const obstacleInterval = 20
  let iObstacle = 0
  let score = 0
  function refresh(){
    obsArray.forEach( obs => obs.move() )
    drawAll()
    const hasCollidedBoolean = hasCollided(obsArray)
    if ( hasCollided(obsArray) ){
      clearInterval(myInterval)
    }
    else{score += 10}
    scoreElt.textContent = score
    console.log('score:', score)
    if(iObstacle<obstacleInterval){
      iObstacle++
    }
    else{
      const xRandom = Number(Math.floor(Math.random()*200))
      const yRandom = Number(Math.floor(Math.random()*200))
      const obs = new Obstacles(50+xRandom,150+yRandom,10)
      obsArray.push(obs)
      console.log(obsArray)
      iObstacle = 0
    }
  
  function hasCollided(obsArray){
    //collision if range(car.x to car.x + car.w) overlaps with range(obs.x to obs.x + obs.w)
    //and range(car.y to car.y + car.l) overlaps with obs.y
    let hasCollided = false
    for (let i=0 ; i<obsArray.length ; i++){
        const obs =  obsArray[i]
        const withinX = (car.x > obs.x) && (car.x < obs.x + obs.w) 
        const withinY = (obs.y > car.y) && (obs.y < car.y + car.l)
        hasCollided = withinX && withinY
        if (hasCollided) {break}
    }

    //console.log(`withinX: ${withinX}, withinY: ${withinY}`)
    return hasCollided
    }
  }




  function startGame() {
    console.log('----------')

    const obs1 = new Obstacles(50,150,10)
    obsArray.push(obs1)
    drawAll()
    document.addEventListener('keydown', moveCar)
    function moveCar(e) {
      const key = e.key
      //console.log(key)
      switch(key){
        case 'ArrowRight':
          if (car.x <= myCanvasWidth - car.xSpeed - car.w){car.x += car.xSpeed}
          break
        case 'ArrowLeft':
          if (car.x >= car.xSpeed){car.x -= car.xSpeed}
          break
      }
      
      //console.log('coordinate :', car.x, car.y)
      drawAll()
    }

    myInterval = setInterval(refresh,100)
  }
};
