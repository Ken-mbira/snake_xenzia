const SHADED_CLASS = "shadedCell";
const FOOD_CLASS = "foodCell";

export class Cell {
    constructor(id) {
        this.id = id;
        this.element = document.createElement("div");
        this.element.className = "cell";
        this.element.id = id;
    }

    shadeCell() {
        this.element.classList.add(SHADED_CLASS);
    }

    unShadeCell() {
        this.element.classList.remove(SHADED_CLASS);
    }

    setFood() {
        this.element.classList.add(FOOD_CLASS);
    }

    eatFood() {
        this.element.classList.remove(FOOD_CLASS);
    }

    get isOccupied() {
        return this.element.classList.contains(SHADED_CLASS);
    }

    get hasFood() {
        return this.element.classList.contains(FOOD_CLASS);
    }
}
