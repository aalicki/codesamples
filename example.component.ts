/**
 * Total Owed
 *
 * Loop through an array of items and get their cost,
 * then add them all up to output into the front-end
 */
totalOwed () {

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
removeItems () {

    // this.items are an array of various products

    // Reiterate to remove categories with no specs.
    this.items.forEach((item, index) => {

        if (!item.name.length) {
            this.item.splice(index, 1);

            // now push it to a remove item list for tracking
            this.removedItems.push(item);
        }
    });
}