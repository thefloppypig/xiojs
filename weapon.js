//Copyright (C) 2023 thefloppypig - All Rights Reserved

class Weapon {
    constructor(cooldown, speed, projFunction) {
        this.lastShootTime = Date.now();
        this.cooldown = cooldown;
        this.speed = speed;
        this.projFunction = projFunction;
    }

    shoot(x,y,rot) {
        if (this.lastShootTime + this.cooldown <= Date.now()) {
            this.projFunction(x,y,rot);
            this.lastShootTime = Date.now();
        }
    }


    static PlayerWeaponDefault() {
        return new Weapon(250, 10, function(x,y,rot) {new ProjPlayer("#5f5",x,y,rot,this.speed)})
    }
    static PlayerWeaponShotgun() {
        return new Weapon(2000, 10, function(x,y,rot) {
            new ProjPlayer("#5f5",x,y,rot + 0.3,this.speed);
            new ProjPlayer("#5f5",x,y,rot + 0.2,this.speed);
            new ProjPlayer("#5f5",x,y,rot + 0.1,this.speed);
            new ProjPlayer("#5f5",x,y,rot,this.speed);
            new ProjPlayer("#5f5",x,y,rot - 0.1,this.speed);
            new ProjPlayer("#5f5",x,y,rot - 0.2,this.speed);
            new ProjPlayer("#5f5",x,y,rot - 0.3,this.speed);
        })
    }
    static PlayerWeaponMachine() {
        return new Weapon(75, 10, function(x,y,rot) {new ProjPlayer("#5f5",x,y,rot,this.speed)})
    }


    static EnemyWeaponDefault() {
        return new Weapon(1000, 5, function(x,y,rot) {new Proj("#f55",x,y,rot,this.speed)})
    }

    static EnemyWeaponBig() {
        return new Weapon(5000, 5, function(x,y,rot) {new Proj("#f55",x,y,rot,this.speed, 1, 25)})
    }

    static EnemyWeaponShot() {
        return new Weapon(2000, 5, function(x,y,rot) {
            new Proj("#f55",x,y,rot + 0.2,this.speed);
            new Proj("#f55",x,y,rot + 0.1,this.speed);
            new Proj("#f55",x,y,rot,this.speed);
            new Proj("#f55",x,y,rot - 0.1,this.speed);
            new Proj("#f55",x,y,rot - 0.2,this.speed);
        })
    }
    
    static EnemyWeaponMachine() {
        return new Weapon(250, 2.5, function(x,y,rot) {
            new Proj("#f55",x,y,rot + Math.random() * 0.5 -0.25,this.speed);
        })
    }
}