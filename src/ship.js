var Ship = PhysSprite.extend({
  _rot:0,
  _keystate: {},
  _gas: false,
  _banking: 'neut',
  _rotSpeed: 6,
  _gasPower: 20,
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
  },

  applyForces: function(){
    if(this._gas){
      this.forceAtAngleDegrees(this._gasPower, this._rot)
    }
  },


  update:function(dt){

    if(this._keystate[cc.KEY.up] && !this._gas){
      this._gas = true
      this.runAction(this._gasAnim[this._banking])
      console.log("gas on")
      console.log("vector", this._rot)
    }
    else if(!this._keystate[cc.KEY.up] && this._gas){
      this._gas = false
      console.log("gas off")
      this.stopAction(this._gasAnim[this._banking])
      this.initWithSpriteFrameName("sp_"+this._banking+"_g0"+".png")
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
      this._rot = 0
    }else if(this._rot < 0){
      this._rot = 360
    }

    this.setRotation(this._rot)
  },

  onKeyUp: function(e){
    this._keystate[e] = false
  },
  onKeyDown:function(e){
    this._keystate[e] = true

  }
})
