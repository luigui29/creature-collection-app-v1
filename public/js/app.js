/*Step-by-Step for the app.js*/
/*TODO: Pass this to the README.md*/
let main = document.querySelector('main');
const fallback_image_path = `../images/picture_gallery/unknown/unknown_1.png`;


function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
    })
}

async function createCreatureCards(image_load_promises, creature_data, showcase_container){
    await loadImage(fallback_image_path);
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
                    <div class="text-container">
                        <h1><span> Creature ${creature.id} </span> <br> ${creature.name || 'Unknown'}</h1>
                    </div>
                
                `
                fragment.appendChild(creature_card);
            });
                
            loading.style.display = "none";
            showcase_container.appendChild(fragment);
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
        const fetch_response = await fetch('/api/creatures') // -- Should return JSON with all data from creatures.
            .then((response) => {

                if (!response.ok) { 
                    throw new Error(`Server error: ${response.status}`); 
                }

                const creatures = response.json();

                creatures.then((data) => {
                    if (data.length === 0) { // -- Check for empty array of creatures.
                        showcase_container.insertAdjacentHTML("afterbegin", `
                            <div class="text-container">
                                <h1>You open the encyclopedia, only to find that it's wiped...</h1>
                            </div>
                        `);
                    
                        return;
                    }

                    const image_load_promises = data.map(creature => {
                        const image_name = creature.name 
                        ? creature.name.toLowerCase() 
                        : `unknown`;

                        const ideal_image_path = loadImage(`../images/picture_gallery/${image_name}/${image_name}_1.png`);
                        return ideal_image_path;
                    });

                    createCreatureCards(image_load_promises, data, showcase_container);                    
                });
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
