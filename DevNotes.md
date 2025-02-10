### afterRender and afterNextRender
- not specific component hook but **application-wide hook**
- The `afterRender`(called after each render) and `afterNextRender`(called once)  - functions let you register a render callback to be invoked after Angular has finished rendering **all** components on the page into the DOM.
- `afterRender` and `afterNextRender` must be called in an injection context, typically a component's constructor.

### Places to retrieve initial component data
- in ngOnInit
- in afterNextRender hook
- in constructor

### Rxjs operations
- convert Observable to Promise with `firstValueFrom`/`lastValueFrom` - in example below they equal as httpClient returns only one value
`const response = await firstValueFrom(coursesResponse$)`
- for async operations `return await` is redundant. It can be simplified to `return <promise comes here>`, We need to do `return await` only when request is wrapped into `try catch`, because it adds possibility that error response will be caught and transformed via local `catch` block code

### API calls
- The benefit of moving api call into separate method (inside component) is in implementing proper error handling

### Router
- angular router provides Promise based API, need to `await this.router.navigate(...)`
**Data retrieving with router**
- to handle data via router - create file `entity.resolver.ts`

### Signals
- **input**
- **model** - bi-directional writable signal property, which represents 2 ways contract between `child` and `parent` component
- **signals template query**: let us query html elements or components instance:
*#input* `in component template`
`inputElement = viewChild<ElementRef | Component>('input)`
`inputElements = viewChildren<ElementRef | Component>('inputs)`
**viewChildren/viewChild** - Query results are represented as a signal of a read-only collection containing all (if viewChildren) matched elements.
- **toObservable** - converts signal into observable value. Works as effect. After subscribe will wait until signal value will stabilized and change detection cycle triggering will be
ended => will get the last emitted value!
- **toObservable/toSignal/effect** if used outside of initialization phase (constructor) - must be provided **injector** - injection context for optimization purposes - to avoid memory leaks. Angular need to know when to unsubscribe and clean up dependencies linked to this effect/signal.

