fish-interpreter
================

The interpreter for [https://fishlanguage.com](https://github.com/Suppen/fishlanguage.com)

Usage
-----

```javascript
const FishExecutor = require("fish-interpreter");

const source = `"hello, world"rv
          o;!?l<`;

const executor = new FishExecutor(source);

executor.intervalTime = 0;

executor.onUpdate((e) => {
	// `e` is the executor
	if (e.hasTerminated) {
		console.log(e.output);
	}
});

executor.run();
```

See the documentation in `doc/`. See the files of [https://fishlanguage.com](https://github.com/Suppen/fishlanguage.com) for some more advanced usage
