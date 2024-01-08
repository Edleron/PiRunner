import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import { App } from "../system/App";
import { Diamond } from "./Diamond";

export class Hero {
    constructor() {
        this.createSprite();
        this.createBody();
        App.app.ticker.add(this.update.bind(this));

        this.dy = App.config.hero.jumpSpeed;
        this.maxJumps = App.config.hero.maxJumps;
        this.jumpIndex = 0;
        this.score = 0;
    }

    collectDiamond(diamond) {
        console.log(diamond);
        Matter.World.remove(App.physics.world, diamond.body);
        diamond.sprite.destroy();
        diamond.sprite = null;
        ++this.score;
        this.sprite.emit("score");

    }

    startJump() {
        if (this.platform || this.jumpIndex === 1) {
            ++this.jumpIndex;
            this.platform = null;
            Matter.Body.setVelocity(this.body, {x: 0, y: -this.dy});
        }
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(
            this.sprite.x + this.sprite.width / 2,
            this.sprite.y + this.sprite.height / 2,
            this.sprite.width,
            this.sprite.height,
            {friction: 0}
        );
        Matter.World.add(App.physics.world, this.body);
        this.body.gameHero = this;
        this.body.render.fillStyle = "#000000";
    }

    stayOnPlatform(platform) {
        this.platform = platform;
        this.jumpIndex = 0;
    }

    createSprite() {
        this.sprite = new PIXI.AnimatedSprite([
            App.res("walk1"),
            App.res("walk2")
        ]);

        this.sprite.x = App.config.hero.position.x;
        this.sprite.y = App.config.hero.position.y;
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
    }

    update() {
        this.sprite.x = this.body.position.x - this.sprite.width / 2;
        this.sprite.y = this.body.position.y - this.sprite.height / 2;
    }


}