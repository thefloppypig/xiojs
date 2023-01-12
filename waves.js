//Copyright (C) 2023 thefloppypig - All Rights Reserved

//wait until no enemies, then advance wave
async function awaitWaveNoEnemies() {
    await sleep(5);
    while (ships.size > 1) {
        await sleep(0.5);
    }
    waveNext();
    return;
}

//wait until no enemies
async function awaitNoEnemies() {
    await sleep(5);
    while (ships.size > 1) {
        await sleep(0.5);
    }
    return;
}

//wait seconds and then advance wave
async function awaitWaveTime(time) {
    await sleep(time);
    waveNext();
    return;
}

async function enemySpawning() {
    Enemy.SpawnCulex();
    await awaitWaveNoEnemies();
    Enemy.SpawnCulex();
    for (let j = 1; j < 5; j++) {
        await awaitWaveTime(10);
        for (let i = 0; i < j; i++) {
            Enemy.SpawnCulex();
        }
    }
    await awaitWaveNoEnemies();
    for (let j = 1; j < 6; j++) {
        if (j > 1) await awaitWaveTime(10);
        for (let i = 0; i < j; i++) {
            Enemy.SpawnDorcus();
        }
    }
    for (let j = 1; j < 5; j++) {
        await awaitWaveNoEnemies();
        for (let i = 0; i < j; i++) {
            Enemy.SpawnDorcus();
            Enemy.SpawnCulex();
            await sleep(2);
        }
    }
    await awaitWaveNoEnemies();
    Enemy.SpawnVenari();
    for (let j = 2; j < 7; j++) {
        await awaitWaveNoEnemies();
        for (let i = 0; i < j; i++) {
            randomBool ? Enemy.SpawnDorcus() : Enemy.SpawnCulex();
            Enemy.SpawnVenari();
            await sleep(2);
        }
    }
    await awaitWaveNoEnemies();
    Enemy.SpawnAnisotera();
    await awaitWaveNoEnemies();
    Enemy.SpawnAnisotera();
    Enemy.SpawnAnisotera();
    Enemy.SpawnAnisotera();
    for (let j = 3; j < 8; j++) {
        await awaitWaveNoEnemies();
        Enemy.SpawnAnisotera();
        for (let i = 0; i < j; i++) {
            Enemy.SpawnDorcus();
            Enemy.SpawnCulex();
            Enemy.SpawnVenari();
            await sleep(2);
        }
    }
    //win condition
    await awaitNoEnemies();
    win();
}