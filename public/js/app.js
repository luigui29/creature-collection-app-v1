/*Step-by-Step for the app.js*/
/*TODO: Pass this to the README.md*/
let main = document.querySelector('main');
const fallback_image_path = `../images/picture_gallery/unknown/unknown_1.png`;


function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();         // Create an image element with the following attributes:
                                         // functions in place of the attributes to be executed later
        img.onload = () => resolve(src); // function() { resolve(src) };
        img.onerror = () => reject(src); // function() { reject(src) };
        img.src = src;
    })
}

async function buildCreatureCards(image_load_promises, creature_data, showcase_container){
    Promise.allSettled(image_load_promises)
        .then((response) => {

            const fragment = document.createDocumentFragment();

            creature_data.forEach((creature, index) => {
                let image_source = (response[index].status === `fulfilled`)
                ? response[index].value
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
                    <div class="creature-card-name">
                        <h1> Creature ${creature.id} </h1>
                        <span> ${creature.name || 'Unknown'} </span> 
                    </div>
                `
                fragment.appendChild(creature_card);
            });
                
            loading.style.display = "none";
            showcase_container.appendChild(fragment);
        })
}

async function fetchCreatureData() {

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
        // -- Should return response data along database query result.
        const fetch_response = await fetch('/api/creatures') 
        //console.log(fetch_response);

        if (!fetch_response.ok) { 
            throw new Error(`Server error: ${response.status}`); 
        }

        // -- Wait for the program to get the JSON data from the response.
        const creatures = await fetch_response.json();      
        //console.log(creatures); 

        if (creatures.length === 0) {                     
            showcase_container.insertAdjacentHTML("afterbegin", `
                <div class="text-container">
                    <h1>You open the encyclopedia, only to find that it's wiped...</h1>
                </div>
            `);
        
            return;
        }

        const image_load_promises = creatures.map(creature => {
            const image_name = creature.name 
            ? creature.name.toLowerCase() 
            : `unknown`;

            const ideal_image_path = loadImage(`../images/picture_gallery/${image_name}/${image_name}_1.png`);
            return ideal_image_path;
        });

        await loadImage(fallback_image_path);

        buildCreatureCards(image_load_promises, creatures, showcase_container);                    
                
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

fetchCreatureData();
