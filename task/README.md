# progulp with Tasks

This is an experimental implementation of `pro-gulp` that uses `Task` from the [folktale/data.task](https://github.com/folktale/data.task) library internally.

Functions that are registered with the `proGulp.task` method are converted to a `Task` instead that being wrapped in a function that return a `Promise`.

This allows better internal composition with the use of standard functions such as `map` and `chain` that `Task` implements, since its compliance to the [Fantasy Land Specification](https://github.com/fantasyland/fantasy-land). 
Also, the `Task` abstraction allows to use generic and powerful monadic operations to generate sequential and parallel execution of tasks.

Wrapping operations in Task ensures that nothing is executed while building the computation by composing and sequencing, (in contrast to Promises) allowing to abstract over synchronous and asynchronous tasks.
The computation is finally explicitly started by the Task consumer, that has full control over the performed side effects.

Finally, this is just another way to learn functional programming concepts, apply them to Javascript and experiment with great libraries such as [Ramda](https://github.com/ramda/ramda) and the [Folktale](https://github.com/folktale) suite. :smiley:

## Benchmarks

Overhead and speed of this new implementation are benchmarked against the original one, in order to keep the same level of performance.
To run the benchmark:

`npm run benchmark`

Current results on my development machine are:

```
Benchmark Suite: Serial

Task x 3.26 ops/sec ±0.53% (20 runs sampled)
Promise x 3.24 ops/sec ±0.76% (20 runs sampled)

Fastest is Task,Promise
------------------------------------------------

Benchmark Suite: Parallel

Task x 9.89 ops/sec ±0.27% (48 runs sampled)
Promise x 9.81 ops/sec ±0.31% (47 runs sampled)

Fastest is Task
------------------------------------------------

```

## Development 

`npm run dev-task`

## Test 

`npm run test-task`

## References and other resources

- [data.task API Reference](http://docs.folktalejs.org/en/latest/api/data/task/index.html)
- [Folktale](http://folktalejs.org/)
- [Fantasy Land Specification](https://github.com/fantasyland/fantasy-land)
- [Ramda](http://ramdajs.com/)
- [Mostly adequate guide to FP (in javascript)](https://github.com/MostlyAdequate/mostly-adequate-guide)