multiplayer:

refactor:

state updates should be:
central, overall state updates per entity.
this means: 
- what state am i (which affects which animation to stop, which to run)
- rotation
- new position (as result of forces)
this may also mean that sprite should not register update, and only
layer should update ALL things

so pulling in the model state into physics-like update:

p.applyforces

world.step
updates = p.step

p.applyUpdate(position, updates)
          ^--world    ^--gameplay

this way, we can inject updates gotten from multiplay,
as well as give out our updates over multiplay





### over LAN

2 loops / 2 connections

1. player state (sync animations, rotation, etc)
2. physics state (sync position after world step)

* can optionally be combined to one channel

### over net

use Valve Source theory.
server computes physics, again 2 loops fast/slow




