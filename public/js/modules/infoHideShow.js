export function showCreatureById(id) {
    const all_entries = document.querySelectorAll(`.creature-entry`);
    console.log(all_entries);

    all_entries.forEach(entry => {
        if      (entry.id === `creature-${id}`)     { entry.classList.remove(`hidden`); }
        else /* (entry doesn't match current id) */ { entry.classList.add(`hidden`); }
    });
}