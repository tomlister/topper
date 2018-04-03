# Topper
## Networking Protocol

### Notes
* All requests and replies are terminated with ";" this acts as a delimeter when concurrent packets get bundled together.
* The data format used is JSON.
* For data types refrenced in this document for example: World[], refer to datatypes.MD

### Handshaking
#### Serverbound
|type           |
| ------------- |
| "handshake"   |

#### Clientbound
|type           |token          |
| ------------- | ------------- |
| "handshake"   | "XXXXX"       |

### World Retrieval
#### Serverbound
|type           |token          |
| ------------- | ------------- |
| "getworld"    | "XXXXX"       |

#### Clientbound
|type           |data           |
| ------------- | ------------- |
| "world"       | World[]       |


### Tile Retrieval
#### Serverbound
|type           |token          |
| ------------- | ------------- |
| "gettiles"    | "XXXXX"       |

#### Clientbound
|type           |data           |
| ------------- | ------------- |
| "tiles"       | Tiles{}       |

### Get the Initial Player
#### Serverbound
|type             |token          |
| --------------- | ------------- |
| "getinitplayer" | "XXXXX"       |

#### Clientbound
|type           |data           |
| ------------- | ------------- |
| "player"      | Player{}      |

### Overlay
#### Clientbound
|type           |data           |
| ------------- | ------------- |
| "overlaydata" | OverlayData{} |