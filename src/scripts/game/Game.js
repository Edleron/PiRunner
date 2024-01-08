import { Scene } from "../system/Scene";
import { Background } from "./Background";
import { Hero } from "./Hero";
import { Platforms } from "./Platforms";
import { App } from "../system/App";
import * as Matter from "matter-js";
import { LabelScore } from "./LabelScore";

export class Game extends Scene {
    create() {
        this.createBackground();
        this.createPlatforms();
        this.createHero();
        this.setEvents();
        this.createUI();
    }

    createUI() {
        this.labelScore = new LabelScore();
        this.container.addChild(this.labelScore);

        this.hero.sprite.on("score", () => {
            this.labelScore.renderScore(this.hero.score);
        });
    }

    setEvents() {
        Matter.Events.on(App.physics, "collisionStart", this.onCollisionStart.bind(this));
    }

    onCollisionStart(event) {
        const colliders = [event.pairs[0].bodyA, event.pairs[0].bodyB];
        const hero = colliders.find(body => body.gameHero);
        const platform = colliders.find(body => body.gamePlatform);
        const diamond = colliders.find(body => body.gameDiamond);

        if (hero && platform) {
            this.hero.stayOnPlatform(platform.gamePlatform);
        }

        if (hero && diamond) {
            this.hero.collectDiamond(diamond.gameDiamond);
        }
    } 

    createPlatforms() {
        this.platforms = new Platforms();
        this.container.addChild(this.platforms.container);
    }

    createHero() {
        this.hero = new Hero();
        this.container.addChild(this.hero.sprite);

        this.container.interactive = true;
        this.container.on("pointerdown", () => {
            this.hero.startJump();
        });
    }

    update(dt) {
        this.bg.update(dt);
        this.platforms.update(dt);
    }

    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }


}
