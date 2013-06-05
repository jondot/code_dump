var PTM_RATIO = 32;

var Ship = cc.Sprite.extend({
  _rot:0,
  _keystate: {},
  _gas: false,
  _banking: 'neut',
  _x:0,
  _y:0,
  _rotSpeed: 6,
  _viewport:null,
  _gasAnim:null,

  createGasAnim:function(state){
    an = cc.Animation.create([ sc.getSpriteFrame("sp_"+state+"_g2.png"),sc.getSpriteFrame("sp_"+state+"_g1.png") ], 0.2)
    return cc.RepeatForever.create(cc.Animate.create( an ))
  },
  ctor:function(){
    this._super()
    this.initWithSpriteFrameName("sp_"+this._banking+"_g0"+".png")
    sc = cc.SpriteFrameCache.getInstance()

    this._gasAnim = {
     'neut': this.createGasAnim('neut'),
     'right': this.createGasAnim('right'),
     'left': this.createGasAnim('left')
    }


    this._viewport = cc.Director.getInstance().getWinSize();
    this._x = this._viewport.width/2
    this._y = this._viewport.height/2
  },
  update:function(dt){

    if(this._keystate[cc.KEY.up]){
      if(!this._gas)
      {
        this._gas = true
        this.runAction(this._gasAnim[this._banking])
        console.log("gas on")
        console.log("vector", this._rot)
      }
    }
    else{
      if(this._gas)
      {
        this._gas = false
        console.log("gas off")
        this.stopAction(this._gasAnim[this._banking])
        this.initWithSpriteFrameName("sp_"+this._banking+"_g0"+".png")
      }
    }
    
    bank = null
    if(this._keystate[cc.KEY.left]){
      this._rot = this._rot - this._rotSpeed
      bank = 'left'
    }
    else if(this._keystate[cc.KEY.right]){
      this._rot = this._rot + this._rotSpeed
      bank = 'right'
    }
    else{
      bank = 'neut'
    }

    if(this._banking != bank){
      if(this._gas){
        this.stopAction(this._gasAnim[this._banking])
        this.runAction(this._gasAnim[bank])
      }
      else{
        this.initWithSpriteFrameName("sp_"+bank+"_g0"+".png")
      }

      this._banking = bank
    }


    if(this._rot > 360){
      console.log(this._rot);
      this._rot = 0
    }else if(this._rot < 0){
      this._rot = 360
    }
    this.setRotation(this._rot)

    //if(!this._gas)
     // this.initWithSpriteFrameName("sp_"+this._banking+"_g0"+".png")

  },

  onKeyUp: function(e){
    this._keystate[e] = false
  },
  onKeyDown:function(e){
    this._keystate[e] = true

  }
})

var ShipLayer = cc.Layer.extend({
  _ship: null,
  init:function(){


  /* physics */
        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var screenSize = cc.Director.getInstance().getWinSize();
        this.world = new b2World(new b2Vec2(0, -9.8), true);
        this.world.SetContinuousPhysics(true);
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var bodyDef = new b2BodyDef;

        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(20, 2);
        // upper
        bodyDef.position.Set(10, screenSize.height / PTM_RATIO + 1.8);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // bottom
        bodyDef.position.Set(10, -1.8);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        fixDef.shape.SetAsBox(2, 14);
        // left
        bodyDef.position.Set(-1.8, 13);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // right
        bodyDef.position.Set(26.8, 13);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);




    /* sprites */

    var cache = cc.SpriteFrameCache.getInstance();
    cache.addSpriteFrames(s_ship_plist, "res/sp_sheet.png");

    this._ship = new Ship
    var size = cc.Director.getInstance().getWinSize();
        this.setKeyboardEnabled(true);
    
    this.addChild(this._ship)
    var p = new cc.Point(size.width/2, size.height/2)
    this._ship.setPosition(p)




    /* sprite-physics */

    var sprite = this._ship

    var b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.Set(p.x / PTM_RATIO, p.y / PTM_RATIO);
    bodyDef.userData = sprite;
    bodyDef.linearDamping = 0.5
    var body = this.world.CreateBody(bodyDef);

    // Define another box shape for our dynamic body.
    var dynamicBox = new b2PolygonShape();
    dynamicBox.SetAsBox(0.5, 0.5);//These are mid points for our 1m box

    // Define the dynamic body fixture.
    var fixtureDef = new b2FixtureDef();
    fixtureDef.shape = dynamicBox;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.3;
    body.CreateFixture(fixtureDef);
    this._shipBody = body






    this._ship.scheduleUpdate()
    this.schedule(this.update)
    return true
  },
  update: function(dt){
    //arrange
    if(this._ship._gas){
      var gaspower = 20
      var b2Vec2 = Box2D.Common.Math.b2Vec2
      var rot = cc.DEGREES_TO_RADIANS(this._ship._rot)
      this._shipBody.ApplyForce(new b2Vec2(Math.sin(rot)*gaspower, Math.cos(rot)*gaspower), this._shipBody.GetWorldCenter())
    }



    //apply
        var velocityIterations = 8;
        var positionIterations = 1;

        // Instruct the world to perform a single step of simulation. It is
        // generally best to keep the time step and iterations fixed.
        this.world.Step(dt, velocityIterations, positionIterations);

        //Iterate over the bodies in the physics world
        for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() != null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var myActor = b.GetUserData();
                myActor.setPosition(cc.p(b.GetPosition().x * PTM_RATIO, b.GetPosition().y * PTM_RATIO));
                //myActor.setRotation(-1 * cc.RADIANS_TO_DEGREES(b.GetAngle()));
                //console.log(b.GetAngle());
            }
        }
        this.world.ClearForces()
  },
  onKeyDown:function(e){
    this._ship.onKeyDown(e)
  },
  onKeyUp:function(e){
    this._ship.onKeyUp(e)
  },
  onEnter: function(){
    this._super();
  }
});

ShipScene = cc.Scene.extend({
  onEnter: function(){
    this._super();
    var layer = new ShipLayer
    layer.init()
    this.addChild(layer)
  }
})
