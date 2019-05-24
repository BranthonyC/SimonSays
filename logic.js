//Constantes de los elementos del HTML
const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const btnEmpezar = document.getElementById('btnEmpezar')
const scoreboard = document.getElementById('score-board')
const levelboard = document.getElementById('level-board')
const LAST_LEVEL = 10;

//Clases
class Juego {

  constructor() {
    this.inicializar()
    this.generateSecuense()
    this.nextLevel()
  }
  
  inicializar() {
    this.pickColor = this.pickColor.bind(this)
    this.nextLevel = this.nextLevel.bind(this)
    this.removeClickEvent = this.removeClickEvent.bind(this)
    //Atamos el metodo pickColor a This del juego entonces 
    //el this sera siempre la clase Juego y no el boton que 
    //desencadena la accion.
    this.toggleBtnEmpezar()
    this.nivel = 1
    this.score = scoreboard
    this.lever = levelboard
    this.colores = {
      celeste,
      violeta,
      naranja,
      verde
    }
  }

  toggleBtnEmpezar(){
    if(btnEmpezar.classList.contains('hide')){
      btnEmpezar.classList.remove('hide')
    }else{
      btnEmpezar.classList.add('hide')
    }

  }

  generateSecuense(){
    this.secuencia = new Array(LAST_LEVEL).fill(0).map( n => Math.floor(Math.random()*4) )
  }

  nextLevel(){
    this.subnivel = 0
    scoreboard.innerHTML = `${this.subnivel}`
    this.lightSecuence()
    this.agregateEnvetClick()
  }

  lightSecuence(){
    for (let i = 0; i < this.nivel; i++) {
      const color = this.transformNumberToColor(this.secuencia[i])
      setTimeout( () => this.lightColor(color), i*1000)
    }
    levelboard.innerHTML = `${this.nivel}`
  }

  lightColor(color){
    console.log(this.colores[color])
    this.colores[color].classList.add('light')
    setTimeout( () => this.lightOff(color) , 350)
  }

  lightOff(color){
    this.colores[color].classList.remove('light')
  }

  transformNumberToColor(number){
    switch (number){
      case 0:
      return 'celeste'
      case 1:
      return 'violeta'
      case 2:
      return 'naranja'
      case 3:
      return 'verde'
    }
  }

  transformColorToNumber(color){
    switch (color){
      case 'celeste':
      return 0
      case 'violeta':
      return 1
      case 'naranja':
      return 2
      case 'verde':
      return 3
    }
  }

  agregateEnvetClick(){
    this.colores.celeste.addEventListener('click', this.pickColor)
    this.colores.verde.addEventListener('click', this.pickColor)
    this.colores.violeta.addEventListener('click', this.pickColor)
    this.colores.naranja.addEventListener('click', this.pickColor)
  }
  //Quita los eventos en el click cuando el usuario ha pasado de nivel.
  removeClickEvent(){
    this.colores.celeste.removeEventListener('click', this.pickColor)
    this.colores.verde.removeEventListener('click', this.pickColor)
    this.colores.violeta.removeEventListener('click', this.pickColor)
    this.colores.naranja.removeEventListener('click', this.pickColor)
  }

  win(){
    Swal.fire(
      'Simon says',
      'Good job! You have finished the game',
      'success'
      )
    .then(this.inicializar())
  }
  loss(){
    console.log(this)
    Swal('Simon says', 'You have loss the game :(','error')
    .then(() =>{
      this.removeClickEvent()
      this.inicializar()
    })
  }

  pickColor(ev){
    const colorName = ev.target.dataset.color
    const colorNumber = this.transformColorToNumber(colorName)
    this.lightColor(colorName)
    if(colorNumber === this.secuencia[this.subnivel]){
      this.subnivel++
      scoreboard.innerHTML = `${this.subnivel}`
        //scoreboard.innerHTML='Muy bien! Sigue asi'
        if (this.subnivel === this.nivel){
          let timerInterval
          Swal.fire({
            title: 'Simon says',
            html: 'Good job! next level is coming',
            timer: 500,
            onBeforeOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
                Swal.getContent().querySelector('strong')
                .textContent = Swal.getTimerLeft()
              }, 100)
            },
            onClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            this.nivel++
            this.removeClickEvent()
            if(this.nivel===LAST_LEVEL+1){
              this.win()
            }else{
              console.log('iniciando siguiente nivel')
              setTimeout(this.nextLevel,1000)
            }
          })
        }
      }else{
        this.loss()
      }

    }

  }

  function empezarJuego(){
    window.juego = new Juego()
  }