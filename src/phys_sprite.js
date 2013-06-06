// because PhysicsSprite + box2d is broken.
var PhysSprite = cc.Sprite.extend({
  _body:null,
  _ptm: 32,

  forceAtAngleDegrees: function(power, angle){
    var rot = cc.DEGREES_TO_RADIANS(angle)
    var body = this._body
    body.ApplyForce(new Box2D.Common.Math.b2Vec2(Math.sin(rot)*power, Math.cos(rot)*power),
                    body.GetWorldCenter())
  },
  sync: function(){
    this.setPosition(cc.p(this._body.GetPosition().x * this._ptm, this._body.GetPosition().y * this._ptm));
  },
  setPTMRatio: function(ptm){
    this._ptm = ptm;
  },
  setPTMRatio: function(){
    return this._ptm;
  },
  setBody: function(body){
    this._body = body
  },
  getBody: function(){
    return this._body;
  },
  spawnInWorld:function(world, pos, PTM_RATIO){
    this.setPTMRatio(PTM_RATIO)
    var b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

    var bodyDef = new b2BodyDef()
    bodyDef.type = b2Body.b2_dynamicBody
    bodyDef.position.Set(pos.x / PTM_RATIO, pos.y / PTM_RATIO)
    bodyDef.userData = this
    bodyDef.linearDamping = 0.5
    var body = world.CreateBody(bodyDef)

    // Define another box shape for our dynamic body.
    var dynamicBox = new b2PolygonShape()
    dynamicBox.SetAsBox(0.5, 0.5);//These are mid points for our 1m box

    // Define the dynamic body fixture.
    var fixtureDef = new b2FixtureDef()
    fixtureDef.shape = dynamicBox
    fixtureDef.density = 1.0
    fixtureDef.friction = 0.3
    body.CreateFixture(fixtureDef)
    this.setBody(body)
    // XXX see if we can derive this from body position
    this.setPosition(pos)
  },

})

