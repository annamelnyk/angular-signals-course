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