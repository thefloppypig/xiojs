//Copyright (C) 2023 thefloppypig - All Rights Reserved

class Ship {

    constructor(imageName, x, y, maxSpeed, turnSpeed, weapon) {
        this.x = x;
        this.y = y;
        this.speed = 0;
        this.maxSpeed = maxSpeed;
        this.turnSpeed = turnSpeed;
        this.imageName = imageName;
        this.scale = objScale;
        this.rot = 0;
        this.tx = 0;
        this.ty = 0;
        this.weapon = weapon;
        ships.add(this);
    }

    isPlayer() {
        return false;
    } 
    
    isEnemy() {
        return false;
    }

    moveTarget(tx, ty) {
        this.tx = tx;
        this.ty = ty;
    }

    moveTowards() {
        let dx = this.tx - this.x;
        let dy = this.ty - this.y;
        const accDist = 4 * this.maxSpeed;
        if ((dx > accDist || dx < -accDist) || (dy > accDist || dy < -accDist)) {//accelerate if close
            this.speed = (this.speed + this.maxSpeed/150).clamp(0, this.maxSpeed);
        }
        else {
            this.speed = (this.speed - this.maxSpeed/60).clamp(0, this.maxSpeed);
        }
        let prevRot = this.rot;
        let newRot = Math.atan2(dy, dx);
        this.rot = rLerp(prevRot, newRot, this.turnSpeed);
        const xm = this.speed * Math.cos(this.rot);
        const ym = this.speed * Math.sin(this.rot);
        if (this.x + xm < 0 || this.x + xm > canvas.width) {
            this.x = this.x - xm;
            this.rot = Math.PI - this.rot;//bounce
        }
        else {
            this.x = this.x + xm;
        }
        if (this.y + ym < 0 || this.y + ym > canvas.height) {
            this.y = this.y - ym;
            this.rot = 2 * Math.PI - this.rot;//bounce
        }
        else {
            this.y = this.y + ym;
        }   
    }

    shootWeapon() {
        this.weapon.shoot(this.x,this.y,this.rot);
    }

    draw() {
        drawImage(images[this.imageName], this.x, this.y, this.scale, this.rot + Math.PI/2);
    }

    destroy() {
        ships.delete(this);
        playBoom();
    }
}

class Player extends Ship {

    constructor(imageName, x, y, maxSpeed, turnSpeed, weapon) {
        super(imageName, x, y, maxSpeed, turnSpeed, weapon);
    }

    isPlayer() {
        return true;
    }

    isEnemy() {
        return false;
    }

    moveTowards() {
        super.moveTowards();
    }

    destroy() {
        super.destroy();
        player = null;
        lose();
    }
}

class Enemy extends Ship {
    constructor(imageName, x, y, maxSpeed, turnSpeed, weapon) {
        super(imageName, x, y, maxSpeed, turnSpeed, weapon);
    }

    isPlayer() {
        return false;
    }

    isEnemy() {
        return true;
    }

    moveTowards() {
        super.moveTowards();
        this.shootWeapon();
    }

    destroy() {
        clearInterval(this.shootTimer);
        super.destroy();
    }

    static Spawn(imageName, mode, maxSpeed, turnSpeed, weapon = null) {
        let x;
        let y;
        switch (mode) {
            case SpawnMode.AnyEdge:
                if (randomBool()){//horizontal
                    x = Math.random() * canvas.width;
                    y = randomBool() ? 0 : canvas.height;
                }
                else {
                    x = randomBool() ? 0 : canvas.width;
                    y = Math.random() * canvas.height;
                }
                break;
            case SpawnMode.TopBottomEdge:
                x = Math.random() * canvas.width;
                y = randomBool() ? 0 : canvas.height;
                break;
            case SpawnMode.LeftRightEdge:
                x = randomBool() ? 0 : canvas.width;
                y = Math.random() * canvas.height;
                break;
            default:
                break;
        }
        let enemy = new Enemy(imageName, x, y, maxSpeed, turnSpeed, weapon)
        enemy.rot =  Math.atan2(player?.y - enemy.y, player?.x - enemy.x);
    }

    static SpawnCulex() {
        Enemy.Spawn("st", SpawnMode.LeftRightEdge, 1, 0.005, Weapon.EnemyWeaponDefault()); 
    }
    
    static SpawnDorcus() {
        Enemy.Spawn("g", SpawnMode.TopBottomEdge, 2, 0.005, Weapon.EnemyWeaponBig()); 
    }

    static SpawnVenari() {
        Enemy.Spawn("v", SpawnMode.AnyEdge, 3, 0.02, Weapon.EnemyWeaponShot()); 
    }

    static SpawnAnisotera() {
        Enemy.Spawn("d", SpawnMode.LeftRightEdge, 1, 0.02, Weapon.EnemyWeaponMachine()); 
    }
}

const SpawnMode = {
    AnyEdge: 'AnyEdge',
    TopBottomEdge: 'TopBottomEdge',
    LeftRightEdge: 'LeftRightEdge',
};

function randomBool() {
    return Math.random() < 0.5;
}