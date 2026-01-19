const a_function_with_a_loop = () => {
    let i = 10;

    while (i != 0) {
        console.log(i);
        i--;
    }

    return 'done';
}

// Lets rewrite it

// Boilerplate:
// a[0] -> variable storage, a[0][0] reserved for program counter
// a[1] -> context switcher functions
// a[2] -> contexts list

// Context:
// c[0] -> context instr counter
// c[1] -> context instructions
// c[2] -> context step
console.log(
    new Array(1).fill(undefined).map(e =>
        new Array(3).fill(undefined) // bootstrap our first map
            .map((_, idx) => 
                idx == 0 ? [2, 10] :
                (idx == 1 ? 
                    ([
                        (m) => (m[0][0][0] < 3 && (m[0][m[0][0][0]][2](m) ? (m[0][1][1](m)) : m[0][0][0]++)), // context run
                        (m) => m[0][1][0](m) // Entry point
                    ]) : 
                [
                    0, 
                    [
                        (m) => console.log(m[0][0][1]), // log current value
                        (m) => m[0][0][1]--, // decrement
                    ],
                    (m) => 
                        (((m[0][2][1][m[0][2][0]](m) && false) // execute current step
                        || ((m[0][2][0]++) && false) // increment step
                        || ((m[0][2][0] == 2 ? (m[0][2][0] = 0) : 0)) && false) || true) // loop back if needed
                        && m[0][0][1] != 0, // condition to continue loop
                ])
            )
    )
    .filter((e, idx, m) => e[1][1](m) || true) // run context switcher
    .map(e => 'done')[0] // extract final result (constant)
)