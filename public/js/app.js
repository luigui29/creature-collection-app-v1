/*Step-by-Step for the app.js*/
/*TODO: Pass this to the README.md*/
let main = document.querySelector('main');

async function allCreatures() {
    
    main.insertAdjacentHTML("afterbegin", `
        <div class="outer-container">
            <div class="text-container" id="loading">
                <h1>Fetching the Creature Collection! Please wait...</h1>
            </div>
        </div>
    `);

    let outer_container = document.querySelector('.outer-container');
    let loading = document.querySelector('#loading');
    
    /* FETCH DATA FROM SERVER */
    try {
        const response = await fetch('/api/creatures'); // -- Should return JSON with all data from creatures.

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const creatures = await response.json(); // -- Parse JSON into JS array.
        loading.style.display = "none";

        if (creatures.length === 0) { // -- Check for empty array of creatures.
            outer_container.insertAdjacentHTML("afterbegin", `
                <div class="text-container">
                    <h1>You open the encyclopedia, only to find that it's wiped...</h1>
                </div>
            `);
            return;
        }

        creatures.forEach(creature => {
            outer_container.insertAdjacentHTML("beforeend", `
                <div class="text-container">
                    <h1>Creature ${creature.id}: ${creature.name}</h1>
                </div>
            `);
        });

    } catch (error) { 
        loading.style.display = "none";
        outer_container.insertAdjacentHTML("afterbegin", `
            <div class="text-container" id="errors">
                <h1>The creatures are missing... Come back when we find them.</h1>
            </div>
        `);

        console.error("Failed to fetch and display creatures: ", error);
    }
}

allCreatures();

