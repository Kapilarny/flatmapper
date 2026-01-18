// Let's have an example function
// This function generates an array of 5 random numbers between 0-5
const generate_random_array = () => {
    const arr = [];

    for(let i = 0; i < 5; i++) {
        arr.push(Math.floor(Math.random() * 5+1));
    }

    return arr;
}

// Other way to write it is:
console.log(
(new Array(1)).fill(undefined) // bootstrap our first map
    .map(e => new Array(6).fill([]).fill(undefined, 1)) // Create the arr + 0-5 iteration points
    .map(e => e.map((v, i, a) => i === 0 ? v : (a[0].push(Math.floor(Math.random() * 5+1)) && 0))) // Fill with random numbers
    [0][0] // Extract the result
)
