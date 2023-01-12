//Copyright (C) 2023 thefloppypig - All Rights Reserved

class Proj {

    constructor(color, x, y, rot, speed, bounces = 0, range = 10) {
        this.x = x;
        this.y = y;
        this.range = range;
        this.speed = speed;
        this.color = color;
        this.rot = rot;
        this.bounces = bounces;
        this.range = range;
        projs.add(this);
    }

    move() {
        const xm = this.speed * Math.cos(this.rot);
        const ym = this.speed * Math.sin(this.rot);
        if (this.x + xm < 0 || this.x + xm > canvas.width) {
            this.x = this.x - xm;
            if (this.bounces === 0)  {
                this.destroy();
            }
            else {
                this.rot = Math.PI - this.rot;
                this.bounces--;
            }        
        }
        else {
            this.x = this.x + xm;
        }
        if (this.y + ym < 0 || this.y + ym > canvas.height) {
            this.y = this.y - ym;
            if (this.bounces === 0) {
                this.destroy();
            }
            else {
                this.rot = 2 * Math.PI - this.rot;
                this.bounces--;
            }        
        }
        else {
            this.y = this.y + ym;
        }   
        this.checkCollision()
    }

    checkCollision() {
        if (player != null && Math.abs(player.x - this.x) < this.range && Math.abs(player.y - this.y) < this.range) {
            player.destroy();
            this.destroy();
        }
    }

    draw() {
        drawCircle(this.x, this.y, this.range, this.color)
    }

    destroy() {
        projs.delete(this);
    }
}

class ProjPlayer extends Proj {
    checkCollision() {
        ships.forEach(ship => {
            if (ship.isEnemy() && Math.abs(ship.x - this.x) < 10 && Math.abs(ship.y - this.y) < 10) {
                ship.destroy();
                this.destroy();
            }
        });
    }
}