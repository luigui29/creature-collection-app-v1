import { showCreatureById } from "./infoHideShow.js";

export function navigateToCreature(button_direction, creature_collection) {
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
    showCreatureById(next_creature_id);
}