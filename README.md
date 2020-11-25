# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Data persistence for Node.js

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit.

The data module contains a set of basic primitives for working with and storing data. All other data modules are based on it.

This module contains the following packages:

- **Presistence** - contains two persistence component implementations: one for storing data in-memory, and another for storing data in files in the JSON format
- **Core** - contains interfaces for various design patterns that work with data. 

<a name="links"></a> Quick links:

* [Memory persistence](https://www.pipservices.org/recipies/memory-persistence)
* [Data Microservice. Step 3](https://www.pipservices.org/docs/tutorials/data-microservice/persistence) 
* [API Reference](https://pip-services3-node.github.io/pip-services3-data-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](https://www.pipservices.org/community/help)
* [Contribute](https://www.pipservices.org/community/contribute)

## Use

Install the NPM package as
```bash
npm pip-services3-data-node --save
```

## Develop

For development you shall install the following prerequisites:
* Node.js 10+
* Visual Studio Code or another IDE of your choice
* Docker
* Typescript

Install dependencies:
```bash
npm install
```

Compile the code:
```bash
tsc
```

Run automated tests:
```bash
npm test
```

Generate API documentation:
```bash
./docgen.ps1
```

Before committing changes run dockerized build and test as:
```bash
./build.ps1
./test.ps1
./clear.ps1
```

## Contacts

The Node.js version of Pip.Services is created and maintained by:
- **Volodymyr Tkachenko**
- **Sergey Seroukhov**

The documentation is written by:
- **Mark Makarychev**