# Sass Lint Auto Fix

[![NPM Version](https://badge.fury.io/js/spruce.svg?style=flat)](https://npmjs.org/package/spruce)
![npm](https://img.shields.io/npm/dm/spruce.svg)
[![Build Status](https://travis-ci.org/srowhani/spruce.svg?branch=master)](https://travis-ci.org/srowhani/spruce/)
[![dependencies Status](https://david-dm.org/srowhani/spruce/status.svg)](https://david-dm.org/srowhani/spruce) [![Coverage Status](https://coveralls.io/repos/github/srowhani/spruce/badge.svg?branch=master)](https://coveralls.io/github/srowhani/spruce?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


![](https://i.imgur.com/mpxlhLX.png)

## Description
This package serves as a compliment to [sass-lint](https://github.com/sasstools/sass-lint), giving you the ability to resolve
simple linting issues with an easy to use command line interface. Issues are resolved by parsing the `s(a|c)ss` as an [ast](https://github.com/tonyganch/gonzales-pe), traversing through it, and modifying certain branches to be in accordance to the `.sass-lint.yml` standards.

## Getting Started

### Usage

```
  Usage: spruce "<pattern>" [options]

  Options:

    -V, --version        output the version number
    -c, --config <path>  custom config path (e.g /path/to/spruce.yml)
    -s, --silent         runs in silent mode
    -h, --help           output usage information
```    


### Installing as a dependency

To begin install the package as a dev-dependency for your repository.

```
npm install --save-dev spruce
```

Modify `package.json` scripts to include `lint:fix`

```
{
  ...,
  "scripts": {
    "lint": "sass-lint -v",
    "lint:fix": "spruce"
  }
}
```

`lint:fix` works really well with [husky](https://github.com/typicode/husky), which allows you to run commands on hooks that fire when
running git commands

Add the following to your `package.json`
```
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint:fix && npm run lint",
      "pre-push": "npm test",
      "...": "..."
    }
  }
}
```

### Installing globally

```
npm install -g spruce
```

## Configuration

Configuration can be provided through as either json, yml, or js.

The generic structure of the configuration file you would provide would look something like [this](https://github.com/srowhani/spruce/blob/master/src/config/default.yml):

```yml
files:
  include: "**/*.s+(a|c)ss"
  ignore: []
syntax:
    include:
      - scss
      - sass
resolvers:
  property-sort-order: 1
  attribute-quotes: 1
  border-zero: 1
  no-color-keywords: 1
  no-css-comments: 1
  no-important: 1
  no-trailing-zero: 1
  space-after-bang: 1
  space-before-bang: 1
  space-after-colon: 1
  space-before-colon: 1
  hex-length: 1
```

#### Disabling Rules

```yml
resolvers:
  property-sort-order: 1
  attribute-quotes: 0
```

By default, all rule "resolvers" are enabled. If you wish to change that, specify a config file when running.
Configuration of resolvers only allows you to enable or disable rules.


```
  spruce -c path/to/config.file
```

#### Configuring which rules to run against
By default, sass-lint will look for a `.sass-lint.yml` or `.sasslintrc`, or an entry in your `package.json`.
When applying the resolver to a given rule, **configuration is parsed from one of the above files.**.

More information is specified [here](https://github.com/srowhani/spruce/issues/10).

In this snippet example, the only rule enabled is `property-sort-order`. If you wish to manually enable certain resolvers, you would do so for each one you wish to include.

For more information about the rules themselves, you can read the [documentation from sass-lint](https://github.com/sasstools/sass-lint/tree/develop/docs/rules)

#### Opt out of error reporting

By default, all errors captured while attempting to resolve issues are reported by sentry.

You can opt out by adding a `optOut` flag in your spruce config file (yml, json, js, ts)

E.g
```yml
files:
  include: "**/*.s+(a|c)ss"
  ignore:
    - node_modules/**
syntax:
    include:
      - scss
resolvers:
  property-sort-order: 1
  attribute-quotes: 1
  ...
optOut: true
```

## Developing

### Setup
```
git clone https://github.com/srowhani/spruce.git;
npm install;
npm run build;
```

### Contributing

This project uses [semantic-release](https://github.com/semantic-release/commit-analyzer#rules-matching). Scope of the commit's included in a pull request will decide whether a new release is warranted.

More information can be found [here](https://github.com/semantic-release/commit-analyzer/blob/master/lib/default-release-rules.js).

### Testing

```
npm run test
```
