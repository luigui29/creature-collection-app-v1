/*Step-by-Step for the app.js*/
/*TODO: Pass this to the README.md*/
let main = document.querySelector('main');


function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
    })
}

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

    let showcase_container = document.querySelector('.showcase-container');
    let loading = document.querySelector('#loading');
    
    /* FETCH DATA FROM SERVER */
    try {
        const response = await fetch('/api/creatures'); // -- Should return JSON with all data from creatures.
        if (!response.ok) { throw new Error(`Server error: ${response.status}`); }
        const creatures = await response.json(); // -- Parse JSON into JS array.

        /* Case: Creatures JSON is empty */
        if (creatures.length === 0) { // -- Check for empty array of creatures.
            showcase_container.insertAdjacentHTML("afterbegin", `
                <div class="text-container">
                    <h1>You open the encyclopedia, only to find that it's wiped...</h1>
                </div>
            `);
            return;
        }

        /* Await all creature image data, map to image_load_promises */
        const image_load_promises = creatures.map(creature => {
            const image_name = creature.name 
            ? creature.name.toLowerCase() 
            : `unknown`;

            const ideal_image_path = `../images/picture_gallery/${image_name}/${image_name}_1.png`
            return loadImage(ideal_image_path);
        });
        const image_load_results = await Promise.allSettled(image_load_promises);
        
        console.log(`image_load_promises` , image_load_promises);
        console.log(`image_load_results` , image_load_results);
        
        /* Build in-memory element containing all cards that will be sent to DOM once fully loaded */
        const fragment = document.createDocumentFragment();
        const fallback_image_path = `../images/picture_gallery/unknown/unknown_1.png`;
        await loadImage(fallback_image_path);

        creatures.forEach((creature, index) => {
            let image_source = (image_load_results[index].status === `fulfilled`)
            ? image_load_results[index].value
            : fallback_image_path;

            /* Defining the Elements to be built inside fragment */
            let creature_card = document.createElement(`div`);
            creature_card.className = `creature-card`;
            creature_card.innerHTML = `
                <div class="creature-card-img">
                    <img 
                        src = "${image_source}"
                        alt = "Sprite of ${creature.name || 'Unknown'}"
                    >
                </div>
                <div class="text-container">
                    <h1><span> Creature ${creature.id} </span> <br> ${creature.name || 'Unknown'}</h1>
                </div>
            
            `

            fragment.appendChild(creature_card);
        });

        showcase_container.appendChild(fragment);
        loading.style.display = "none";

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
