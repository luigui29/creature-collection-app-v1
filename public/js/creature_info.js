let main = document.querySelector('main');

import { showCreatureById } from "./modules/infoHideShow.js";
import { navigateToCreature } from "./modules/infoNavigator.js";

async function fetchCreatureInfo() {
    main.insertAdjacentHTML("afterbegin", `
        <div class="outer-container">
            <div class="showcase-container">
                <div class="text-container" id="loading">
                    <h1>Fetching the Creature Info! Please wait...</h1>
                </div>
            </div>
        </div>
    `);

    let showcase_container = document.querySelector('.showcase-container');
    let loading = document.querySelector('#loading');

    let next_btn = document.querySelector('#next-button');
    let prev_btn = document.querySelector('#prev-button');

    try {
        const fetch_response = await fetch('/api/creatures') 
        //console.log(fetch_response);
        
        if (!fetch_response.ok) { 
            throw new Error(`Server error: ${response.status}`); 
        }

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

        /* Making all Divs for each Creature */
        loading.style.display = 'none';

        creatures.forEach(creature => {
            const entry_div = document.createElement('div');
            
            entry_div.className = `creature-entry hidden`;
            entry_div.id = `creature-${creature.id}`;
            
            entry_div.innerHTML = `
                <h1>${creature.name}</h1>
                <div class="creature-stats">
                    <div class="stats-shape">
                        <div class="hexagon">
                            <div class="hexagon inner">
                                <div class="hexagon innermost">
                                </div>
                            </div>
                        </div>
                        <div class="star">
                        </div>
                    </div>
                </div>
            `
            showcase_container.appendChild(entry_div);
        });

        /* Current ID */

        const initial_id = parseInt(window.location.hash.replace(`#creature-`, ` `));
        // -- will return NaN (Not a Number) if user enters uncompatible url
        // -- in the case of such then default to first creature
        if ( !isNaN(initial_id)) { showCreatureById(initial_id); }
        else                     { showCreatureById(creatures[0].id); }

        /* Button Event Listeners */
        next_btn.addEventListener('click', () => navigateToCreature('next', creatures));
        prev_btn.addEventListener('click', () => navigateToCreature('previous', creatures));

    } catch (error) { 
        loading.style.display = "none";
        showcase_container.insertAdjacentHTML("afterbegin", `
            <div class="text-container" id="errors">
                <h1>The creatures are missing... Come back when we find them.</h1>
            </div>
        `);

        console.error("Failed to fetch and display creatures: ", error);
    };
}

fetchCreatureInfo();