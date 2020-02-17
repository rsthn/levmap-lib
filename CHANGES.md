# Changes

## 1.0.2

**Important**
- Updated lib-animations to comply with latest Levmap export schema which added 'loop:int' field to animation sequences.
- Updated Animation class to allow parameter 'name' be a string in the use() method.
- Renamed all getTexture* to getDrawable* since on CherryJS we have drawables instead of textures.
- Added appropriate support for collision fragments.
- Renamed parameter 'count' of onFrameCallback on the Animation class to 'lastFrame', now that is totalFrames-1.

**Internal**
- Changed Animation class to use System.frameDeltaMillis instead of System.dt.
- Added proper destructor code to DisplayObject.
- Removed __ctor from Element class to allow parent destructor to be called instead.
