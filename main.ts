class Orientation {
    static NORTH = 1 as number;
    static EAST = 2 as number;
    static SOUTH = 3 as number;
    static WEST = 4 as number;
    
    static get(){
        let heading = input.compassHeading()
        if(heading > 315 || heading < 45 + 1){
            return Orientation.NORTH;
        }else if(heading > 45 && heading < 135 + 1){
            return Orientation.EAST;
        }else if(heading > 135 && heading < 225 + 1){
            return Orientation.SOUTH;
        }else{
            return Orientation.WEST;
        }
    }
    static equals(orientation: number){
        if(orientation == Orientation.get()) return true;
        return false;
    }
}

class MovableGrid{
    _pos = [0, 0];
    _points = {} as any;

    constructor(x: number, y: number){
        this._pos = [x, y];
    }

    addPoint(name: string, x: number, y:number){
        this._points[name] = {x: x, y: y};
        led.plot(x, y)
    }
    getPointPos(name: string){
        return this._points[name];
    }
    equalsPoint(a: string, b: string){
        if(this._points[a].x == this._points[b].x && this._points[a].y == this._points[b].y) return true;
        return false;
    }
    movePoint(name: string, x: number, y: number){
        led.unplot(this._points[name].x, this._points[name].y)
        this._points[name] = {
            x: x != null ? x : this._points[name].x,
            y: y != null ? y : this._points[name].y
        };
        led.plot(this._points[name].x, this._points[name].y)
    }
    removePoint(name: string){
        delete this._points[name];
    }
}

class TwoInOne{
    movableGrid = null as MovableGrid;
    _started = false as boolean;
    _inAnimation = false as boolean;

    constructor(){
        basic.forever(() => {this.forever()})
        input.onButtonPressed(Button.A, () => {this.onLeftPressed(); this.onPointMoved();});
        input.onButtonPressed(Button.B, () => {this.onRightPressed(); this.onPointMoved();});
        
        this.movableGrid = new MovableGrid(0, 0);
    }

    forever(){
        if(this._started || this._inAnimation) return;

        if(Orientation.equals(Orientation.NORTH)){
            for(let y = 0; y < 5; y++){
                for(let x = 0; x < 5; x++){
                    led.plot(x, y);
                }
                basic.pause(175);
            }

            basic.clearScreen();

            this.movableGrid.addPoint("A", 0, 0);
            this.movableGrid.addPoint("B", 3, 3);

            this._started = true;
        }
    }
    onLeftPressed(){
        if(!this._started || this._inAnimation) return;
        let x, y = null;

        if(Orientation.equals(Orientation.NORTH)) x = 0
        else if(Orientation.equals(Orientation.SOUTH)) x = 4
        else if(Orientation.equals(Orientation.WEST)) y = 4
        else y = 0

        this.movableGrid.movePoint("A", x, y);
        this.movableGrid.movePoint("B", x, y);
    }
    onRightPressed(){
        if(!this._started || this._inAnimation) return;
        let x, y = null;

        if(Orientation.equals(Orientation.NORTH)) x = 4
        else if(Orientation.equals(Orientation.SOUTH)) x = 0
        else if(Orientation.equals(Orientation.WEST)) y = 0
        else y = 4

        this.movableGrid.movePoint("A", x, y);
        this.movableGrid.movePoint("B", x, y);
    }
    onPointMoved(){
        if(!this._started || this._inAnimation) return;

        if(this.movableGrid.equalsPoint("A", "B")){
            this._inAnimation = true;
            this._started = false;

            basic.pause(150);

            for(let i = 0; i < 3; i++)
                led.plot(Math.abs(this.movableGrid.getPointPos("A").x-i), 2)
            for(let i = 0; i < 2; i++)
                led.plot(2, Math.abs(this.movableGrid.getPointPos("A").y-i))

            basic.pause(250);

            for(let i = 0; i < 5; i++)
                led.plot(Math.abs(this.movableGrid.getPointPos("A").x-4), Math.abs(this.movableGrid.getPointPos("A").y-i))
            for(let i = 0; i < 4; i++)
                led.plot(Math.abs(this.movableGrid.getPointPos("A").x-i), Math.abs(this.movableGrid.getPointPos("A").y-4))

            basic.pause(550);

            basic.clearScreen();

            this._inAnimation = false;
        }
    }
}

new TwoInOne();