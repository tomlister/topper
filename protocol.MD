# Topper
## Networking Protocol

### Notes
* All requests are terminated with ";", this acts as a delimeter when concurrent packets get bundled together.
* The data format used is JSON.

### Handshake
#### Serverbound
|type           |
| ------------- |
| "handshake"   |

#### Clientbound
|type           |token          |
| ------------- | ------------- |
| "handshake"   | "XXXXX"       |