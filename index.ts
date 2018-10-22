import { Observable, of, from, fromEvent, concat, interval, timer, throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, filter, tap, catchError, take, map } from 'rxjs/operators';
import { allBooks, allReaders } from './data';

//#region Creating Observables from UI...
// let button = document.getElementById('readersButton');
// /**
//  * # Create observable using fromEvent
//  * Using static data
// */
// fromEvent(button, 'click')
//     .subscribe((event) => {
//         console.log(event);

//         let readersDiv = document.getElementById('readers');
//         for (let reader of allReaders) {
//             readersDiv.innerHTML += `${reader.name} <br>`;
//         }
//     })

// /**
//  * # Create observable using fromEvent
//  * Getting data from API
//  */

// fromEvent(button, 'click')
//     .subscribe((event) => {
//         console.log(event);
//         ajax('/api/readers').subscribe((ajaxResponse) => {
//             console.log(ajaxResponse);
//             let readersDiv = document.getElementById('readers');
//             for (let reader of ajaxResponse.response) {
//                 readersDiv.innerHTML += `${reader.name} <br>`;
//             }
//         })
//     });
//#endregion

//#region Subscribing to Observables with Observers

// let books$ = from(allBooks);

// let bookObserver = {
//     next: book => console.log(`Title: ${book.title}`),
//     error: err => console.error(`Error ${err}`),
//     complete: () => console.log('All done!')
// }

// books$.subscribe(bookObserver);

// books$.subscribe(
//     book => console.log(`Title: ${book.title}`),
//     err => console.error(`Error ${err}`),
//     () => console.log('All done!')
// )

// books$.subscribe(
//     null,
//     null,
//     () => console.log('All done!')
// )

// let currentTime$ = Observable.create(subscriber => {
//     const timeString = new Date().toLocaleTimeString();
//     subscriber.next(timeString);
//     subscriber.complete();
// })

// currentTime$.subscribe(console.log);

// setTimeout(() => {
//     currentTime$.subscribe(console.warn)
// }, 1000);

// setTimeout(() => {
//     currentTime$.subscribe(console.error)
// }, 2000);

//#endregion

//#region Cancel observable from subscription

// let timesDiv = document.getElementById('times');
// let button = document.getElementById('timerButton');

// // let timer$ = interval(1000);

// let timer$ = Observable.create(subscriber => {
//     let i = 0;
//     let intervalID = setInterval(() => {
//         subscriber.next(i++);
//     }, 1000);

//     return () => {
//         console.log('Executing teardown code');
//         clearInterval(intervalID)
//     }
// })

// let timeSubscription = timer$.subscribe(
//     value => timesDiv.innerHTML += `${new Date().toLocaleTimeString()} {${value}} <br/>`,
//     null,
//     () => console.log('All done!')
// );

// let timerConsoleSubscription = timer$.subscribe(
//     value => console.log(`${new Date().toLocaleTimeString()} {${value}} <br/>`),
//     null,
//     () => console.log('All done!')
// );

// timeSubscription.add(timerConsoleSubscription);
// // timeSubscription.remove(timerConsoleSubscription);

// fromEvent(button, 'click')
//     .subscribe(
//         event => timeSubscription.unsubscribe()
//     )
//#endregion

//#region Using operators
// ajax('/api/errors/500').pipe(
//     mergeMap((ajaxResponse) => ajaxResponse.response),
//     filter((book: any) => book.publicationYear < 1950),
//     tap((book: any) => console.log(book.title)),
//     // catchError(error => of({ title: 'Error Book', author: 'Sebastián G' }))
//     // catchError(error, caught) => caught)
//     catchError(error => throwError('An error occurrred'))
// ).subscribe(
//     value => console.log(`%c Final Value ${value.title}`, 'background-color: orange; color: black'),
//     error => console.error
// );

// let timesDiv = document.getElementById('times');
// let button = document.getElementById('timerButton');

// let timer$ = Observable.create(subscriber => {
//     let i = 0;
//     let intervalID = setInterval(() => {
//         subscriber.next(i++);
//     }, 1000);

//     return () => {
//         console.log('Executing teardown code');
//         clearInterval(intervalID)
//     }
// })

// timer$.
//     pipe(take(3)).subscribe(
//         value => timesDiv.innerHTML += `${new Date().toLocaleTimeString()} {${value}} <br/>`,
//         null,
//         () => console.log('All done!')
//     );
//#endregion


//#region Creating Operators
// let source$ = of(1, 2, 3, 4, 5);

// function doublerOperator() {
//     return map((value: number) => value * 2)
// }

// source$.pipe(doublerOperator())
//     .subscribe(console.log)
function grabAndLogClassics(year, log) {
    return source$ => {
        return Observable.create((subscriber) => {
            return source$.subscribe(
                book => {
                    if (book.publicationYear < year) {
                        subscriber.next(book);
                    }
                    if (log) {
                        console.log(`Classic: ${book.title}`);
                    }
                },
                (err) => subscriber.error(err),
                () => subscriber.complete()

            );
        })
    }
}

function grabClassics(year) {
    return filter((book: any) => book.publicationYear < year)
}

function grabAndLogClassicsWithPipe(year, log) {
    return source$ => source$.pipe(
        filter((book: any) => book.publicationYear < year),
        tap((classicBook: any) => log ? console.log(`Tile: ${classicBook.title}`) : null)
    )
}

ajax('/api/books').pipe(
    mergeMap((ajaxResponse) => ajaxResponse.response),
    // filter((book: any) => book.publicationYear < 1950),
    // tap((book: any) => console.log(book.title)),
    //grabAndLogClassics(1930, false),
    // grabClassics(1950),
    grabAndLogClassicsWithPipe(1930, true),
    //catchError(error => of({ title: 'Error Book', author: 'Sebastián G' }))
    //catchError(error, caught) => caught)
    catchError(error => throwError('An error occurrred'))
).subscribe(
    (value: any) => console.log(`%c Final Value ${value.title}`, 'background-color: orange; color: black'),
    err => console.log(err)
);
//#endregion