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

    let showcase_container = document.querySelector('.showcase-container'); // A generic container that tells the user data is being loaded is created.
    let loading = document.querySelector('#loading');                       // Then the elements of this container are stored into these variables to
                                                                            // later add creature data to them or hide them once this data is laoded.
    let next_btn = document.querySelector('#next-button');                  // The buttons for navigation are also queried which are static elements
    let prev_btn = document.querySelector('#prev-button');                  // already in the .html file.

    try {
        /* =====[ FETCHING CREATURES FROM SERVER ]===== */
        // -- Fetch creature data
        let fetch_creatures = await fetch('/api/creatures');
        if (!fetch_creatures.ok) { 
            throw new Error(`Server error: ${fetch_creatures.status}`);
        }

        const creatures = await fetch_creatures.json();
        if (creatures.length === 0) {                     
            showcase_container.insertAdjacentHTML("afterbegin", `
                <div class="text-container">
                    <h1>You open the encyclopedia, only to find that it's wiped...</h1>
                </div>
            `);
            return;
        }

        // -- Fetch creature data
        let fetch_creatures2 = await fetch('/api/creatures/info');
        if (!fetch_creatures2.ok) {
            throw new Error(`Server error: ${fetch_creatures2.status}`);
        }

        const creatures2 = await fetch_creatures2.json();
        console.log(creatures2);

        /* ============================================= */

        /* =====[ CREATING CREATURE DATA HYPERTEXT WOOOW ]===== */
        loading.style.display = 'none';

        creatures.forEach(creature => {
            const entry_div = document.createElement('div'); // Each creature is inside a parent "creature-entry"
            entry_div.className = `creature-entry hidden`;   // They are all display: none by default. Only active creature should be viewable
            entry_div.id = `creature-${creature.id}`;        // Id is for telling which entry-div should be active


            entry_div.innerHTML = `
                <h1>${creature.name}</h1>
                <div class="creature-types-and-others">
                    <div class="creature-types-container">
                        <div class="creature-type">$</div>
                        <div class="creature-type"></div>
                        <div class="creature-type"></div>
                    </div>
                </div>
                <div class="creature-stats">
                    <div class="stats-shape">
                        <div class="hexagon">
                            <div class="hexagon inner">
                                <div class="hexagon innermost"></div>
                            </div>
                            <div class="star"></div>
                        </div>
                    </div>
                    <h5>HEALTH</h5>      <h5>STRENGTH</h5> 
                    <h5>RESISTANCE</h5>  <h5>SPEED</h5> 
                    <h5>FLEXIBILITY</h5> <h5>INTELLIGENCE</h5>
                </div>
                <div class="creature-baby-and-adult">
                    <div class="creature-baby-container">
                        <h5>evolves from...</h5>
                        <div class="creature-circle">
                            <div class="creature-image"></div>
                        </div>
                    </div>
                    <div class="creature-adult-container">
                        <div class="creature-circle">
                            <div class="creature-image"></div>
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