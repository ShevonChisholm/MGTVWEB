import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {routeContract} from './route-contract.mjs';
const text=await readFile('src/app/routes.tsx','utf8');
const original=routeContract(text);
assert.deepEqual(routeContract(text.replaceAll('\r\n','\n')),original);
for(const [from,to] of [['path: "/auth"','path: "/wrong"'],['Component: AuthLayout','Component: MainLayout'],['"@/pages/HomePage"','"@/pages/MoviesPage"']]){
 assert.notEqual(text.replace(from,to),text);assert.notDeepEqual(routeContract(text.replace(from,to)),original);
}
console.log('Route contract guards reject URL, layout and module changes while ignoring line endings.');
