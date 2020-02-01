import {
    Component,
    OnInit,
    Input,
    ViewChild
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient}     from '@angular/common/http';

@Component({
    selector: 'main',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.css']
})

export class ExampleComponent implements OnInit {
    @Input() outsideVar = 'Testing';
    itemList: any[];
    items: any[];
    removedItems: any[];
    amountOwed = 0;
    showExampleButton = true;

    /**
     *
     * @param route
     * @param http
     */
    constructor(
        public route: ActivatedRoute,
        public http: HttpClient) {
    }

    onInt() {

        this.showExampleButton = false; // Let's hide the button!

        console.log('Testing this example component!');
    }

    /**
     * Total Owed
     *
     * Loop through an array of items and get their cost,
     * then add them all up to output into the front-end
     */
    totalOwed() {

        let due;

        this.itemList.forEach(item => {
            due += item.cost;
        });

        this.amountOwed = parseInt(due, 10);
    }

    /**
     * Remove items without a name, then
     * adds them into a removed item list
     * incase we need to remember which were removed
     */
    removeItems() {

        // this.items are an array of various products

        // Reiterate to remove categories with no specs.
        this.items.forEach((item, index) => {

            if (!item.name.length) {
                this.items.splice(index, 1);

                // now push it to a remove item list for tracking
                this.removedItems.push(item);
            }
        });
    }

}