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
// console.log(
(new Array(1)).fill(undefined) // bootstrap our first map
    .map(e => new Array(6).fill([]).fill(undefined, 1)) // Create the arr + 0-5 iteration points
    .map(e => e.map((v, i, a) => i === 0 ? v : (a[0].push(Math.floor(Math.random() * 5+1)) && 0))) // Fill with random numbers
    [0][0] // Extract the result
// )


const a_function_with_a_loop = () => {
    let running = true;
    let i = 10;

    while (running) {
        console.log(i);
        i--;
    }

    return 'done';
}

// Lets rewrite it
console.log(
(new Array(1)).fill(undefined) // bootstrap our first map
    .map(e => new Array(3).fill(undefined).map((_, i) => i == 0 ? true : i == 1 ? 10 : 
    (a, b) => 
        new Array(3).fill(undefined).map((_, j) => j == 0 ? () => a == 0 : j == 1 ? () => console.log(b) : () => b--))
    .map((e, idx, a) => idx != 2 ? e : e(a[0], a[1]) ) // Populate the loop structure
    [2][1]()
    // .map((e) => idx != 2 ? e : e[2](e[0], e[1])
))