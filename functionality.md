# Game functionality

1. Render the snake on the first x number of cells, be sure to make note of the first and last cells.
2. Change Direction:
    it is key for the front cell and last cell to have separate navigation systems
    (i) Front Cell
        When the user selects a new direction:
            - check whether it is the same as the current direction
            if same direction:
                ignore it
            if not same direction:
                - update the front cell direction buffer, which is an array with the subsequent directions that the
                snake should follow
            - For each of the snake's movements take the first value of the front cell direction buffer (if any),
            then remove it from the buffer and use this as the direction when moving the first cell

    (ii) Last Cell
        - When a user had entered a new direction and the
        front cell makes the change in direction, we need to log the cell the front cell has moved from,
        log both the direction and the cell coordinates inside the last cell direction buffer
        - For each of the last cell's movements, check whether the current cell coordinates match the first value in
        the last cell direction buffer, if so, use this new direction to move the last cell and remove the value from
        the last cell direction buffer

3. Move the snake:
    - Here, we need to move two things, the front and last cell. This will entail giving the two new values, the
    coordinates of the cells will change to whatever is evaluated to be the next respectively
    - The only changing item for both is the direction so we need to evaluate what the direction is and then we will
    feed this into a function that will get the next cell's coordinates.

    (i) Front cell
    - To determine what will be the next front cell, 
    - If the front cell direction buffer is not empty:
        change the front cell direction to the value in the first index of the front cell direction buffer 
    - If not:
        do not change the front cell direction
    
    - Get the next direction from the get next cell function

    - Next we need to check whether there actually is a cell with those particular coordinates that is available
    ("that is not shaded")
    - If it is possible to move to the next cell:
        change the front cell coordinates to be the new cell
    - if not:
        stop the game

    (ii) Last Cell
    - To determine what will be the next last cell,
    - If the last cell direction buffer is not empty:
        - If the first item in the last cell direction buffer has the same coordinates as the current cell:
            change the last cell direction to the direction value
        - If not:
            keep the last cell direction
    - If not:
        keep the last cell direction

4. Food
    The snake gets bigger by eating food. The food should be placed randomly on the board, when the head(front cell) of the snake
    occupies a cell with the food, the snake gets one cell bigger.

    (i) Positioning food
    - Check the cells within the board that do not have the SHADED_CLASS and choose one randomly then add the food class.

    With every snake movement, at the start of the game, position food somewhere within the playground
    
    (ii) Eating food
    - When eating, skip all the activities for the last cell, the unshading and changing of last cell coordinates. This delay should
    carry foward to the next sequence.

    - We could have a property to the game class called isEating which when true, the last cell functionalities don't happen, but also
    is turned back on when they don't happend. It will be turned off by default and will be turned on when the front cell lands on a
    cell with the class FOOD