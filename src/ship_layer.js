

var ShipLayer = PhysLayer.extend({
  _ship: null,
  

  init:function(){
    this._super()

    /* sprites */
    var cache = cc.SpriteFrameCache.getInstance();
    cache.addSpriteFrames(s_ship_plist, "res/sp_sheet.png");


    var size = cc.Director.getInstance().getWinSize();
    var p = new cc.Point(size.width/2, size.height/2)
    this._ship = new Ship
    this._ship.spawnInWorld(this.getWorld(), p, PTM_RATIO)

    this.addPhysicsChild(this._ship)



    this._ship.scheduleUpdate()
    this.schedule(this.update)

    this.setKeyboardEnabled(true);

    return true
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
    //layer.setDebug(true)
    layer.init()
    this.addChild(layer)
  }
})
