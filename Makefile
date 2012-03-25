.PHONY: clean test dist
all: clean build test dist
build: mkdirBuild compileGrammar copyToBuild
dist: mkdirDist uglify
clean:
	rm -rf build/
	rm -rf dist/
mkdirBuild:
	mkdir -p build
mkdirDist:
	mkdir -p dist
compileGrammar:
	./node_modules/.bin/pegjs ./src/grammar.pegjs ./build/datr.parser.js
copyToBuild:
	cp ./src/datr.core.js ./build/
test: testParser testCore
testParser:
	./node_modules/.bin/nodeunit ./test/test.parser.js
testCore:
	./node_modules/.bin/nodeunit ./test/test.core.js
uglify: uglifyCore uglifyParser
uglifyCore:
	./node_modules/.bin/uglifyjs --output ./dist/datr.core.min.js ./build/datr.core.js
uglifyParser:
	./node_modules/.bin/uglifyjs --output ./dist/datr.parser.min.js ./build/datr.parser.js