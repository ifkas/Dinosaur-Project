// Select the submit button
const compare = document.getElementById("btn");

// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.where = where;
    this.when = when;
    this.fact = fact;
}

// Create Human Constructor
function Human(species, name, height, weight, diet, image) {
    this.species = species;
    this.name = name;
    this.height = height;
    this.weight = weight;
    this.diet = diet;
    this.image = "human.png";
}

// On click we call this main function
function main(e) {

    // First prevent the default page reloading on click
    e.preventDefault();

    // Let's catch and show validation errors from the form
    const errorMessage = document.getElementById('show-error');

    if (getHumanData().name === "") {
        errorMessage.innerHTML = '<p>Please enter a name, must not be empty.</p>';
        return;
    } else if (getHumanData().height < 1 || getHumanData().height === "") {
        errorMessage.innerHTML = '<p>Please enter a height more than 0</p>';
        return;
    } else if (getHumanData().weight < 1 || getHumanData().weight === "") {
        errorMessage.innerHTML = '<p>Please enter a weight more than 0</p>';
        return;
    }

    fetchDinosaursData().then(data => {
        // Populate and add the data as argument for future use
        generateGrid(getHumanData(), getDinoData(data.Dinos));
    }).catch(error => {
        // handle the error
        alert("There was an error, please try later.");
    });

    // Create Dino Objects
    function getDinoData(dinoArray) {
        // we loop through the array from the JSON with map and we create array of objects
        // for all dinos and we store it in a new array
        const dinoObjects = dinoArray.map((dino) => new Dino(
            dino.species,
            dino.weight,
            dino.height,
            dino.diet,
            dino.where,
            dino.when,
            dino.fact,
            dino.image
            ));

            return dinoObjects;
    }

    // Create Human Object
    function getHumanData() {
        const species = "Human";
        const name = document.getElementById("name").value;
        // Sum the feet and inch and convert to total inches number (1 feet * 12 inches / 1feet =  inches)
        const height = Number(document.getElementById("feet").value) +
        Number(document.getElementById("inches").value) * 12;
        const weight = Number(document.getElementById("weight").value);
        const diet = document.getElementById("diet").value;

        // Get all values from the fields and add them as attributes to the Human constructor
        // and create the Human object
        return new Human(species, name, height, weight, diet);
    }

    // Create Dino Compare Method 1
    function compareDiet(human, dino) {
        if(dino.diet === human.toLowerCase()) {
            return `You and the ${dino.species} have the exact same ${dino.diet} diet!`;
        } else {
            return `You and the ${dino.species} have a very different diet!`;
        }
    };

    // Create Dino Compare Method 2
    function compareWeight(human, dino) {
        const weigthDifference = Math.round(dino.weight / human);
        if (dino.weight > human) {
            return `Of course! The ${dino.species} was ${weigthDifference} times heavier than you`;
        } else {
            return `Interesting! You are ${dino.weight - human} lbs heavier than ${dino.species}`;
        }
    }

    // Create Dino Compare Method 3
    function compareHeight(human, dino) {
        const feetDiff = Math.floor((dino.height - human) / 12);
        const inchesDiff = (dino.height - human) % 12;
        if (dino.height > human) {
            return `Obviously that ${dino.species} is higher! It is ${feetDiff} feet ${inchesDiff} inches taller than you`;
        } else if (dino.height < human) {
            return `Oh, amazing! Are you a giant? You are ${Math.abs(feetDiff)} feet ${Math.abs(inchesDiff)} inches taller than ${dino.species}`;
        } else {
            return `Unbelievable! You are the same height as ${dino.species}`
        }
    }

    // Let's get a random fact
    function getRandomFact(fact) {
        return fact[Math.floor((Math.random() * fact.length))];
    }

    function generateGrid(human, dinos) {
        // Let's mix the position of the dino tiles
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i)
                const temp = array[i]
                array[i] = array[j]
                array[j] = temp
            }
            return array
        }

        shuffle(dinos);

        // Putting the human to be always in the middle of the grid
        dinos.splice(4,0,human);

        // Let's now generate and display the dino tiles
        dinos.map((dino) => {

            // Let's put all the facts into array including the default fact from the object
            const allFacts = function(human, dino){
                const defaultFact = dino.fact;
                const dietFact = compareDiet(human.diet, dino);
                const heightFact = compareHeight(human.height, dino);
                const weightFact = compareWeight(human.weight, dino);

                const facts = [defaultFact, dietFact, heightFact, weightFact];

                return facts;
            };

            const tile = document.createElement('div');

            tile.classList.add('grid-item');

            if(dino.species == "Human") {
                tile.innerHTML = `
                <h3>${human.name}</h3>
                <img src="images/${human.image}">
                <h3 class="fact">The Human</h3>
                `;
            }
            else if(dino.species == "Pigeon") {
                tile.innerHTML = `
                <h3>This is a bird</h3>
                <img src="images/${dino.species.toLowerCase()}.png">
                <h3 class="fact">${dino.fact}</h3>
                `;
            } else {
                tile.innerHTML = `
                <h3>${dino.species}</h3>
                <img src="images/${dino.species.toLowerCase()}.png">
                <h3 class="fact">${getRandomFact(allFacts(human, dino))}</h3>
                `;
            }

            // Add tiles to DOM
            document.getElementById("grid").appendChild(tile);
        });
    }

    // Remove form from screen and display the grid with the tiles
    document.getElementById("dino-compare").classList.add("hidden");
    document.getElementById("grid").style.display = "flex";
}

// Fetch the dinosaur data from the JSON
async function fetchDinosaursData() {
    const response = await fetch("dino.json");
    return await response.json();
}

// On button click, prepare and display infographic
compare.addEventListener("click", main);