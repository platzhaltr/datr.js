.PHONY: clean test
all: clean build test
clean:
	rm -rf build/
build:
	mkdir -p build
	./node_modules/.bin/pegjs ./src/grammar.pegjs ./build/datr.parser.js
	cp ./src/datr.core.js ./build/
test:
	./node_modules/.bin/nodeunit ./test/test.parser.js