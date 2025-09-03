/*Step-by-Step for the index.js*/
/*TODO: Pass this to the README.md*/
let main = document.querySelector('main');

import { loadImage } from './modules/imageLoader.js';
import { buildCreatureCards } from './modules/cardBuilder.js';

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
        console.log(creatures); 

        if (creatures.length === 0) {                     
            showcase_container.insertAdjacentHTML("afterbegin", `
                <div class="text-container">
                    <h1>You open the encyclopedia, only to find that it's wiped...</h1>
                </div>
            `);
        
            return;
        }

        // -- Create a map where each creature is given their ideal image path as a value
        const image_load_promises = creatures.map(creature => {
            const image_name = creature.name 
            ? creature.name.toLowerCase() 
            : `unknown`;

            const ideal_image_path = loadImage(`../images/picture_gallery/${image_name}/${image_name}_1.png`);
            return ideal_image_path;
        });
        //console.log(image_load_promises);

        buildCreatureCards(image_load_promises, creatures, showcase_container);                    
        // check modules for info

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
