/*Step-by-Step for the app.js*/
/*TODO: Pass this to the README.md*/
let main = document.querySelector('main');

async function allCreatures() {
    
    main.insertAdjacentHTML("afterbegin", `
        <div class="outer-container">
            <div class="showcase-container">
                <div class="text-container" id="loading">
                    <h1>Fetching the Creature Collection! Please wait...</h1>
                </div>
            </div>
        </div>
    `);

    let outer_container = document.querySelector('.outer-container');
    let showcase_container = document.querySelector('.showcase-container');
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
            showcase_container.insertAdjacentHTML("afterbegin", `
                <div class="text-container">
                    <h1>You open the encyclopedia, only to find that it's wiped...</h1>
                </div>
            `);
            return;
        }

        creatures.forEach(creature => {
            let image_folder = creature.name ?
                creature.name.toLowerCase() : `unknown` 
            
            showcase_container.insertAdjacentHTML("beforeend", `
                <div class="creature-card">
                    <div class="creature-card-img">
                        <img 
                            src = "../images/picture_gallery/${image_folder}/${image_folder.replace(/$/, "_1.png")}"
                            onerror = "this.onerror = null; this.src = '../images/picture_gallery/unknown/unknown_1.png'"
                            alt = "Sprite of ${creature.name}"
                        >
                    </div>
                    <div class="text-container">
                        <h1><span> Creature ${creature.id} </span> <br> ${creature.name}</h1>
                    </div>
                </div>
            `);
        });

    } catch (error) { 
        loading.style.display = "none";
        showcase_container.insertAdjacentHTML("afterbegin", `
            <div class="text-container" id="errors">
                <h1>The creatures are missing... Come back when we find them.</h1>
            </div>
        `);

        console.error("Failed to fetch and display creatures: ", error);
    }
}

allCreatures();
