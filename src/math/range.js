/**
 * Manages a minimum and maximum limit within one dimension.
 */
class Range {
    constructor( min, max ) {
        this.min = min || 0;
        this.max = max || 0;
    }

    random() {
        const range = this.max - this.min;
        return this.min + Math.random() * range;
    }
}