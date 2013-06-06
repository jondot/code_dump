var PTM_RATIO = 32;

var PhysLayer = cc.Layer.extend({
  _physicsObjects: [],
  _velocityIterations: 8,
  _positionIterations: 1,
  _world: null,

  init:function(){
    var b2Vec2 = Box2D.Common.Math.b2Vec2
      , b2World = Box2D.Dynamics.b2World
    this._world = new b2World(new b2Vec2(0, -9.8), true);
    this._world.SetContinuousPhysics(true);

    this.setupWorld()
  },

  getWorld:function(){
    return this._world
  },

  // override to set up own world
  setupWorld:function(){
  /* physics */
      var b2Vec2 = Box2D.Common.Math.b2Vec2
          , b2BodyDef = Box2D.Dynamics.b2BodyDef
          , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

    var screenSize = cc.Director.getInstance().getWinSize();
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
    this._world.CreateBody(bodyDef).CreateFixture(fixDef);
    // bottom
    bodyDef.position.Set(10, -1.8);
    this._world.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape.SetAsBox(2, 14);
    // left
    bodyDef.position.Set(-1.8, 13);
    this._world.CreateBody(bodyDef).CreateFixture(fixDef);
    // right
    bodyDef.position.Set(26.8, 13);
    this._world.CreateBody(bodyDef).CreateFixture(fixDef);
  },

  addPhysicsChild: function(obj){
    this.addChild(this._ship)
    this._physicsObjects.push(obj)
  },

  update: function(dt){
    for (var i = 0; i < this._physicsObjects.length; i++) {
      this._physicsObjects[i].applyForces()
    }

    this._world.Step(dt, this._velocityIterations, this._positionIterations);

    for (var i = 0; i < this._physicsObjects.length; i++) {
      this._physicsObjects[i].sync()
    }

    this._world.ClearForces()
  }

})
