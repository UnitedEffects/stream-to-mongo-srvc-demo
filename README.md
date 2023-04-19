# Stream Listener and API Demo

This is a simple demo service that listens to a configured [UE Streams](https://uestreams.com) data stream and writes everything it sees to a mongodb database.
The project is written in TypeScript ESM. It was generated using a [boilerplate](https://twitter.com/theboeffect/boilerplate), but the important files/directories are:

* ./env_ci/env.dev.json
* ./src/listener.ts
* ./src/datalake/

There is additional and optional functionality as part of the boilerplate to secure this or any service with [UE Auth](https://ueauth.com). For help with that contact us at help@unitedeffects.com.

#### follow us:
* [twitter](https://twitter.com/ueffectsllc)
* [linkedIn](https://www.linkedin.com/company/unitedeffects)
* [medium](https://blog.unitedeffects.com)
* [United Effects](https://unitedeffects.com)

## Quickstart Run

* clone your project to your machine
* start mongodb on port 27017
  * I find the easiest way to do this is via docker in a terminal
  * docker run -p 27017:27017 mongo
* Copy ./.env_ci to ./.env and modify env.dev.json
* Create a stream in UE Streams and copy the appropriate access data into ./env/env.dev.json
  * Detailed instructions [here](https://docs.unitedeffects.com/docs/connect-to-a-stream)
  * Demo video of the result [here](https://www.loom.com/share/09deec3f04c3473eaa746cd5dcad4355)
* yarn test (will run yarn and build)
* yarn dev
* navigate to localhost:3000

## Some References

### oData Spec

https://www.odata.org/documentation/

### JSON Patch

http://jsonpatch.com/