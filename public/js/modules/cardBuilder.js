import { loadImage } from './imageLoader.js';

const fallback_image_path = `../images/picture_gallery/unknown/unknown_1.png`;
await loadImage(fallback_image_path); // -- Must wait to avoid loading after creature collection is shown

export async function buildCreatureCards(image_load_promises, creature_data, showcase_container){
    Promise.allSettled(image_load_promises) // -- Wait for all promises before proceeding
        .then((response) => {
            // -- About DocumentFragment : https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
            const fragment = document.createDocumentFragment();

            // -- forEach parameters = (element, index of element, origin array)
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

                /* Click on card to transport to respective creature info */
                creature_card.addEventListener(`click`, () => {
                    window.location.href = `../pages/creature_info.html#creature-${creature.id}`;
                });

                fragment.appendChild(creature_card);
            });
                
            loading.style.display = "none";
            showcase_container.appendChild(fragment);
        })
}
