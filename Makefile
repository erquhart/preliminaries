install:
	cd preliminaries && npm install -d && cd ..
	cd preliminaries && npm link
	cd preliminaries-parser-toml && npm link preliminaries
	cd preliminaries-parser-toml && npm install -d && cd ..
	cd preliminaries-parser-yaml && npm link preliminaries
	cd preliminaries-parser-yaml && npm install -d && cd ..
	cd preliminaries-parser-json5 && npm link preliminaries
	cd preliminaries-parser-json5 && npm install -d && cd ..

lint:
	cd preliminaries && npm run lint && cd ..
	cd preliminaries-parser-toml && npm run lint && cd ..
	cd preliminaries-parser-yaml && npm run lint && cd ..
	cd preliminaries-parser-json5 && npm run lint && cd ..

test:
	cd preliminaries && npm test && cd ..
	cd preliminaries-parser-toml && npm test && cd ..
	cd preliminaries-parser-yaml && npm test && cd ..
	cd preliminaries-parser-json5 && npm test && cd ..

all: lint test

publish: all
	cd preliminaries && npm publish && cd ..
	cd preliminaries-parser-toml && npm publish && cd ..
	cd preliminaries-parser-yaml && npm publish && cd ..
	cd preliminaries-parser-json5 && npm publish && cd ..

.PHONY: install lint test publish all
