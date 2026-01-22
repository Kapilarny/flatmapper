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

const function_with_a_loop_oneliner = () => new Array(1).fill(undefined).map(e =>
        new Array(3).fill(undefined) // bootstrap our first map
            .map((_, idx) => 
                idx == 0 ? [2, 10000] :
                (idx == 1 ? 
                    ([
                        // (m) => m[0][m[0][0][0]][2](m) ? (m[0][1][0](m)) : m[0][0][0]++,
                        (m) => [(m[0][0][0] < 3 && (m[0][m[0][0][0]][2](m) ? (m[0][1][0](m)) : m[0][0][0]++))], // context run
                        (fn) => { while (typeof fn === 'function') fn = fn() },
                        (m, fn) => m[0][1][1](m[0][1][0]) // Entry point for trampolined ctx
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
                        || ((m[0][2][0] == 2 ? (m[0][2][0] = 0) : 1) == 0 ? (m[0][0][1] != 0) : true))) // Loop back + check end
                ])
            )
    )
    .filter((e, idx, m) => e[1][0](m) || true) // run context switcher
    .map(e => 'done')[0] // extract final result (constant)

// console.log(function_with_a_loop_oneliner());

// Unfortunately, TCO is not supported in any major JS engine
// So we'll have to get around it creatively

const tco_test = () => {
    try {
        const tco_test_inner = (n) => {
            if (n == 0) {
                const stack = new Error().stack;

                if (stack.split('\n')[1].includes('tco_test_inner')) {
                    return false;
                }
            }

            return tco_test_inner(n - 1); // Tail call, should be optimized to a jump (if TCO is supported)
        }

        return tco_test_inner(10); 
    } catch (e) {
        return false;
    }
}

console.log('TCO supported:', tco_test());

// Trampolines!
const trampoline = (fn) => { while (typeof fn === 'function') fn = fn() }

// Now we can make any recursive function "use TCO"
const recursive_countdown = (n) => {
    if (n == 0) {
        return 0;
    } 

    console.log(n);

    return () => recursive_countdown(n - 1); // Return a thunk
}

trampoline(() => recursive_countdown(10)); // Works!

// trampoline(() => recursive_countdown(100000)); // No stack overflow!

// Unfortunately, using trampolines requires us to use `while`
// The while keyword `cannot` be used without `{}` in JS

// We could use eval, but thats cheating
// eval("while (true) { console.log('This will not cause a syntax error'); }"); // Works!

// Seems like we hit the limits of JS here :(
// Or have we?

// You probably have seen setTimeout() before, but did you know that
// setTimeout's interval argument is completely optional?
// setTimeout(() => console.log("Hello World"));

// This line of code executes instantly
// But why am i showing you this?
// Well because you can do a small little trick with it

// const x = (i) => setTimeout(() => i != 0 && (console.log(i) || true) && x(i-1));
// x(10000); // This actually does not overflow!

// But why doesn't that overflow?
// Well because all that setTimeout does, is it adds the arrow function to the next event cycle
// So essentially we are doing a sort-of trampoline using js's built-in trampoline; timeouts events

// But it's super slow :(
// Slower than what you would expect, even with the overhead of waiting on the next event cycle
// Let's try measuring the time it takes from call to call

function measure_timeout_delay() {
    let last = 0;

    let results = [];

    const body = () => {
        let t = new Date().getMilliseconds();
        // console.log(t - last);
        results.push(t - last);
        last = t;
    }

    const x = (i) => setTimeout(() => i != 0 && (body() || true) && x(i-1));
    last = new Date().getMilliseconds();
    x(100);

    console.log(results);
}

// It seems that the JS engine is here to destroy our cool idea once more
// after 6 recursive calls of setTimeout, the delay jumps from ~0ms to ~4ms
// someone anticipated this and fucking rate-limited our own code
// https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#reasons_for_longer_delays_than_specified

// So i went scrolling once more through the MDN docs
// and just 15 seconds later i found this little gem: queueMicrotask
// Did you ever hear of queueMicrotask?
// I didn't, but it seems to do pretty much what we want
// It queues a function to be executed at the end of the current event loop cycle
// but before any other events (like setTimeout) are executed
// AND best of all, it has no rate-limiting!

// const x = (i) => queueMicrotask(() => i != 0 && (console.log(i) || true) && x(i-1));
// x(10000); // no overflow, super fast :)

// console.log("e"); // executed before all counts are done because of the microtask queue

// Only downside to this approach is that now we have managed to sucessfully make our loop asynchronous...
// We now also need to somehow capture it synchronously
