import { Observable, of, from, fromEvent, concat } from 'rxjs';
import { allBooks, allReaders } from './data';

/**
 * ## Create a observable using new keyword or create
 * new Observable() === Observable.create()
 */
let allBooksObservable$ = Observable.create(subscriber => {
    if (document.title !== 'RxBookTracker') {
        subscriber.error('Incorrect page title');
    }
    for (let book of allBooks) {
        subscriber.next(book);
    }
    setTimeout(() => {
        subscriber.complete();
    }, 2000);
    return () => console.log('Clean up');
});

// allBooksObservable$.subscribe((book: any) => console.log(book.title))

/**
 * ## Create observable using of
 */
let source1$ = of('hello', 10, true, allReaders[0].name);

// source1$.subscribe((value) => console.log(value));

/**
 * ## Create observable using from
 */

let source2$ = from(allBooks);
// source2$.subscribe((value) => console.log(value));


/**
 * ## Combine observables using concat
 */

concat(source1$, source2$)
    .subscribe((value) => console.log(value));