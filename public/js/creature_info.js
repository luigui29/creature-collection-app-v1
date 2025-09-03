let main = document.querySelector('main');

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

    try {
        const fetch_response = await fetch('/api/creature-1') 
        //console.log(fetch_response);
        
        if (!fetch_response.ok) { 
            throw new Error(`Server error: ${response.status}`); 
        }
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