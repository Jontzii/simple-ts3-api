# Simple TS3 API

Simple API for checking who's online on a TeamSpeak 3 server currently.

## Running

The API needs .env file or the variables can be set manually.

Run with `docker run -d --name simple-ts3-api -p 80:80 --env-file .env --restart unless-stopped jontzii/simple-ts3-api:latest`.

## Data model

The API returns an object containing list of channels. Each channel contains an array of clients connected to that channel.

|Name|Type|Description|
|--|--|--|
|createdAt|Date|Document creation date|
|channels|Array[ChannelData]|An array containing the current channels|

### ChannelData

|Name|Type|Description|
|--|--|--|
|cid|string|ID of the channel|
|channelName|String|Name of the channel shown to clients|
|clients|Array[ClientData]|An array containing the current clients on the channel|

### ClientData

|Name|Type|Description|
|--|--|--|
|clid|String|ID of the client|
|clientNickname|String|Name of the client shown to other clients|
|clientInputMuted|Boolean|Client has input muted|
|clientOutputMuted|Boolean|Client has output muted|
|clientInputHardware|Boolean|Client has input hardware connected|
|clientOutputHardware|Boolean|Client has output hardware connected|
|clientIsRecording|Boolean|Client is currently recording|
|clientServergroups|Array[String]|An array containing IDs of the client's server groups|
