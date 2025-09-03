let main = document.querySelector('main');

function showCreatureById(id) {
    const all_entries = document.querySelectorAll(`.creature-entry`);

    all_entries.forEach(entry => {
        if      (entry.id === `creature-${id}`)     { entry.classList.remove(`hidden`); }
        else /* (entry doesn't match current id) */ { entry.classList.add(`hidden`); }
    });
}

function navigateToCreature(button_direction, creature_collection) {
    const current_hash = window.location.hash; // -- Get url hash of creature
    const current_id = parseInt(current_hash.replace(`#creature-`, ` `)); // -- Isolate ID from hash and pass it to a constant as an int
    const current_index = creature_collection.findIndex(creature => creature.id === current_id);

    if (current_index === -1) return; // -- Index not found in creature collection

    let next_index;
    const last_index = creature_collection.length - 1;

    switch (button_direction) {
    /* Set up to loop when on last or first index upon pressing next or previous respectively*/
        case 'next':
            next_index = (current_index === last_index) 
            ? 0
            : current_index + 1;
            break;
        
        case 'previous':
            next_index = (current_index === 0)
            ? last_index
            : current_index - 1;
            break;
        
        default:
            throw new Error(`
                Invalid navigation direction: ${button_direction}.
                Please review the function call on creature_info.js
            `);       
    }

    /* Transform window URL to match the desired creature to be viewed */
    const next_creature_id = creature_collection[next_index].id;
    window.location.hash = `#creature-${next_creature_id}`;
}

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

        creatures.forEach(creature => {
            const entry_div = document.createElement('div');
            
            entry_div.className = `creature-entry hidden`;
            entry_div.id = `creature-${creature.id}`;
            
            entry_div.innerHTML = `
                <h1>${creature.name}</h1>
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