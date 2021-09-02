let player_config = {
    player_speed: 150,
    player_jumpspeed: -600,
}

let config = {
    type: Phaser.AUTO,
    scale: {
        // mode: Phaser.Scale.FIT,
        width: 1370,
        height: innerHeight - 5,
    },
    backgroundColor: '#049cd8',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000,
            },
            // debug: true
        }
    },
    scene: { preload, create, update, }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.image("ground", "assets/ground.png");
    this.load.image("apple", "assets/apple.png");
    this.load.image("cloud", "assets/cloud.png");
    this.load.image("plants", "assets/plants.png");
    this.load.image("plant2", "assets/plant2.png");
    this.load.image("gemBlock", "assets/gemBlock.png");
    this.load.image("block", "assets/block.png");
    this.load.spritesheet('hero', 'assets/hero.png', {
        frameWidth: 57, frameHight: 90
    });
}

function create() {
    W = game.config.width;
    H = game.config.height;



    let ground = this.add.tileSprite(0, H - 48, W, 48, 'ground');
    ground.setOrigin(0, 0);
    this.physics.add.existing(ground, true);           // ground.body.allowGravity = false; // ground.body.immovable = true;


    let cloud = this.add.sprite(500, 280, "cloud").setScale(0.75, 0.75)
    let plants = this.add.sprite(650, H - 70, "plants");
    let plant2 = this.add.sprite(150, H - 80, "plant2").setScale(0.75, 1);

    this.player = this.physics.add.sprite(40, 90, 'hero', 8)
    this.player.setBounce(0.3)
    this.player.setCollideWorldBounds(true);

    //Player animation and Player movement

    //animation
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('hero', {
            start: 0, end: 7
        }),
        frameRate: 10,
        repate: -1
    })

    this.anims.create({
        key: 'center',
        frames: this.anims.generateFrameNumbers('hero', {
            start: 8, end: 8
        }),
        frameRate: 10
    })

    this.anims.create({
        key: 'rigth',
        frames: this.anims.generateFrameNumbers('hero', {
            start: 9, end: 15
        }),
        frameRate: 10,
        repate: -1
    })
    //Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();









    let fruits = this.physics.add.group({
        key: "apple",
        repeat: 8,
        setScale: { x: 0.05, y: 0.05 },
        setXY: { x: 200, y: 0, stepX: 100 },

    })

    fruits.children.iterate((f) => {
        f.setBounce(Phaser.Math.FloatBetween(0.4, 0.7))
    })


    let blocks = this.physics.add.staticGroup();
    blocks.create(900, 490, "gemBlock").refreshBody();
    blocks.create(1050, 490, "block").refreshBody()
    blocks.create(1110, 490, "gemBlock").refreshBody();
    blocks.create(1167, 490, "block").refreshBody()
    blocks.create(1227, 490, "gemBlock").refreshBody();
    blocks.create(1284, 490, "block").refreshBody()
    blocks.create(1167, 350, "gemBlock").refreshBody();


    let platforms = this.physics.add.staticGroup();
    // platforms.create(600, 400, 'ground').setScale(3, 0.75).refreshBody()
    // platforms.create(700, 300, 'ground').setScale(3, 0.75).refreshBody();
    // platforms.create(290, 320, 'ground').setScale(3, 0.75).refreshBody()
    platforms.add(ground);

    //add a collision detection 
    this.physics.add.collider(platforms, this.player)
    this.physics.add.collider(platforms, fruits);
    this.physics.add.collider(blocks, fruits);
    this.physics.add.overlap(this.player, fruits, eatFruit, null, this);
    this.physics.add.collider(this.player, blocks);





    this.cameras.main.setBounds(0, 0, W, H);
    this.physics.world.setBounds(0, 0, W, H);

    this.cameras.main.startFollow(this.player, true, true);
    this.cameras.main.setZoom(1.5);


}

function update() {

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-player_config.player_speed);
        this.player.anims.play('left', true)
    }
    else if (this.cursors.right.isDown) {
        this.player.setVelocityX(player_config.player_speed);
        this.player.anims.play('rigth', true)
    }
    else {
        this.player.setVelocityX(0);
        this.player.anims.play('center', 'true')
    }

    //add jumping ablility
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(player_config.player_jumpspeed)
    }
}

function eatFruit(player, fruit) {
    fruit.disableBody(true, true)
}