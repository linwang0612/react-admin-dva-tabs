#!/bin/bash

export NODE_ENV=development    	&& npm install && npm run dll
export NODE_ENV=production 	&& npm run prod

