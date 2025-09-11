export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();         // Create an image element with the following attributes:
                                         // functions in place of the attributes to be executed later
        img.onload = () => resolve(src); // function() { resolve(src) };
        img.onerror = () => reject(src); // function() { reject(src) };
        img.src = src;
    })
}