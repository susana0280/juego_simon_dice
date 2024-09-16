

// Selecciona los elementos del DOM que se utilizarán en el juego
const round = document.querySelector("#round"); // Elemento para mostrar el número de ronda
const buttonsSimon = document.querySelectorAll(".square"); // Botones que el usuario puede presionar
const startButton = document.querySelector("#start"); // Botón para iniciar el juego

// Clase principal del juego Simon
class Simon {
    constructor(round, buttonsSimon, startButton) {
        // Inicializa variables del juego
        this.round = 0; // Ronda actual
        this.userPosition = 0; // Posición del usuario en la secuencia
        this.totalRounds = 10; // Rondas totales del juego
        this.sequence = []; // Secuencia de colores generada
        this.speed = 1000; // Velocidad de la secuencia
        this.buttons = Array.from(buttonsSimon); // Convierte NodeList a Array para facilitar manipulación
        this.display = {
            startButton, // Almacena el botón de inicio
            round // Almacena el elemento que muestra la ronda
        };
    }

    // Función para inicializar el juego
    init() {
        // Añade un evento al botón de inicio para comenzar el juego
        this.display.startButton.addEventListener("click", e => {
            this.startGame(); // Llama a la función para iniciar el juego
        });
    }

    // Función para comenzar el juego
    startGame() {
        this.display.startButton.disabled = true; // Desactiva el botón de inicio
        this.updateRound(0); // Actualiza la ronda a 0
        this.userPosition = 0; // Reinicia la posición del usuario
        this.sequence = this.createSequence(); // Crea la secuencia de colores
        // Añade eventos a cada botón
        this.buttons.forEach((button, index) => {
            button.addEventListener("click", e => {
                button.classList.remove("winner"); // Elimina la clase 'winner' para reiniciar estilos
                this.buttonClick(index); // Llama a la función buttonClick con el índice del botón
            });
        });
        this.showSequence(); // Muestra la secuencia al usuario
    }

    // Función para actualizar el número de ronda en pantalla
    updateRound(value) {
        this.round = value; // Actualiza la propiedad 'round'
        round.textContent = `Round ${value}`; // Actualiza el contenido del elemento DOM
    }

    // Función para crear una secuencia de colores aleatoria
    createSequence() {
        return Array.from({ length: this.totalRounds }, () =>
            this.getRandomColor()
        );
        // Nota: El siguiente console.log no se ejecutará porque está después del return
        console.log(this.sequence); // Muestra la secuencia creada en la consola (sin ejecutar)
    }

    // Función para obtener un color aleatorio (0 a 3)
    getRandomColor() {
        return Math.floor(Math.random() * 4);
    }

    // Función llamada cuando un botón es presionado por el usuario
    buttonClick(index) {
        this.validateChosenColor(index); // Valida el color elegido por el usuario
    }

    // Función para mostrar la secuencia al usuario
    showSequence() {
        let sequenceIndex = 0; // Índice actual de la secuencia

        const timer = setInterval(() => {
            let button = this.buttons[this.sequence[sequenceIndex]]; // Selecciona el botón correspondiente en la secuencia
            this.toggleButtonStyle(button); // Activa el estilo del botón

            setTimeout(() => {
                this.toggleButtonStyle(button); // Desactiva el estilo del botón después de un tiempo
            }, this.speed / 2);

            sequenceIndex++; // Avanza al siguiente índice de la secuencia
            // Si ya se mostró toda la secuencia, detiene el intervalo
            if (sequenceIndex > this.round) {
                clearInterval(timer);
            }
        }, this.speed);
    }

    // Función para alternar el estilo del botón
    toggleButtonStyle(value) {
        value.classList.toggle("active"); // Alterna la clase 'active' para animaciones
    }

    // Función para validar si el color elegido por el usuario es correcto
    validateChosenColor(value) {
        if (this.sequence[this.userPosition] === value) {
            // Si el color elegido es correcto
            if (this.round === this.userPosition) {
                this.updateRound(this.round + 1); // Si el usuario completó la ronda, incrementa la ronda
                this.speed /= 1.02; // Aumenta la velocidad de la secuencia
                this.isGameOver(); // Llama a la función para verificar si el juego terminó
            } else {
                this.userPosition++; // Si no, avanza a la siguiente posición del usuario
            }
        } else {
            this.gameLost(); // Si el color es incorrecto, llama a la función de pérdida
        }
    }

    // Función para verificar si el juego terminó
    isGameOver() {
        if (this.round === this.totalRounds) {
            this.gameWon(); // Si el usuario ganó, llama a la función de victoria
        } else {
            this.userPosition = 0; // Reinicia la posición del usuario
            this.showSequence(); // Vuelve a mostrar la secuencia
        }
    }

    // Función para manejar la victoria del juego
    gameWon() {
        this.buttons.forEach(button => {
            button.classList.add("winner"); // Añade la clase 'winner' a los botones
            this.updateRound("🏆"); // Actualiza el número de ronda a un ícono de victoria
        });
    }

    // Función para manejar la pérdida del juego
    gameLost() {
        this.display.startButton.disabled = true; // Desactiva el botón de inicio
        const lost = `<div class="lost"><p>LOST</p></div>`; // Crea un elemento que muestra 'PERDIDO'
        round.innerHTML = lost; // Inserta el elemento en el DOM
    }
}

// Inicializa una nueva instancia del juego Simon
const simon = new Simon(round, buttonsSimon, startButton);
simon.init(); // Llama a la función init para inicializar el juego

