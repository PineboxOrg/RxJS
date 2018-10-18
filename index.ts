import { Observable, of, from, fromEvent, concat } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { allBooks, allReaders } from './data';

let button = document.getElementById('readersButton');
/**
 * # Create observable using fromEvent
 * Using static data
*/
fromEvent(button, 'click')
// .subscribe((event) => {
//     console.log(event);

//     let readersDiv = document.getElementById('readers');
//     for (let reader of allReaders) {
//         readersDiv.innerHTML += `${reader.name} <br>`;
//     }
// })

/**
 * # Create observable using fromEvent
 * Getting data from API
 */

fromEvent(button, 'click')
    .subscribe((event) => {
        console.log(event);
        ajax('/api/readers').subscribe((ajaxResponse) => {
            console.log(ajaxResponse);
            let readersDiv = document.getElementById('readers');
            for (let reader of ajaxResponse.response) {
                readersDiv.innerHTML += `${reader.name} <br>`;
            }
        })
    });
