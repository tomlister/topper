# Topper
## Data Types

### World[]
World is just a simple 2D array.
```js
var world = [
	["","","","","","",""],
	["","","","","","",""],
	["","","","","","",""],
	["","","","","","",""],
	["","","","","","",""],
	["","","","","","",""],
	["","","","","","",""]
];
```

### Tiles{}
The tiles data type is a object that contains tiles.
Each tile has it's own set of attributes, like colour (ANSI) and type. The attribute "is_tile:true" is used by the renderer (remember to include it).
```js
var tiles = {
	"#": {
		colour:"",
		type:"wall",
		is_tile:true
	}, ".": {
		colour:"\x1b[90m",
		type:"stone",
		is_tile:true
	}, " ": {
		colour:"",
		type:"air",
		is_tile:true
	}
}
```

### Player{}
The player datatype contains information about the player such as it's coordinates in 2d space relative to the world origin, health and it's renderable character. It's just a JSON/JavaScript object.
```js
var player = {
	"x":5, 
	"y":5,
	"health": 100,
	"renderable": "@"
}
```