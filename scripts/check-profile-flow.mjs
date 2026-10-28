import assert from "node:assert/strict";
import {loadModule} from "./load-module.mjs";
const {profileDestination,profileHasRoom}=await loadModule("src/lib/profileFlow.ts");
for(const unsafe of [null,"https://outside.invalid/","//outside.invalid/","/auth/sign-in","/profiles","/profiles/manage","/profiles?returnTo=/movies","/profiles/unlock/example","/\\outside.invalid"]){assert.equal(profileDestination(unsafe),"/",String(unsafe))}
for(const safe of ["/movies","/watch/episodes/test?preview=1","/account","/shop/orders"]){assert.equal(profileDestination(safe),safe)}
for(const limit of [1,3,5]){assert.equal(profileHasRoom(limit-1,limit),true);assert.equal(profileHasRoom(limit,limit),false);assert.equal(profileHasRoom(limit+1,limit),false)}
assert.equal(profileHasRoom(5,1),false);assert.equal(profileHasRoom(0,0),false);assert.equal(profileHasRoom(5,9),false);
console.log("Profile flow: safe return destinations, chooser-loop prevention, tier boundaries and retained excess profiles passed.");
