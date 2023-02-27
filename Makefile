.PHONY: deps
deps:
	npm ci

# Build rules

.PHONY: build
build:
	make -j 2 build-main build-renderer

.PHONY: build-main
build-main:
	npx cross-env NODE_ENV=production TS_NODE_TRANSPILE_ONLY=true webpack --config ./.erb/configs/webpack.config.main.prod.ts

.PHONY: build-renderer
build-renderer:
	npx cross-env NODE_ENV=production TS_NODE_TRANSPILE_ONLY=true webpack --config ./.erb/configs/webpack.config.renderer.prod.ts

.PHONY: build-dev-dll-renderer
build-dev-dll-renderer:
	npx cross-env NODE_ENV=development TS_NODE_TRANSPILE_ONLY=true webpack --config ./.erb/configs/webpack.config.renderer.dev.dll.ts

.PHONY: electron-build
electron-build:
	npx electron-builder build --publish never

.PHONY: electron-rebuild
electron-rebuild:
	npx electron-builder build --publish never

.PHONY: rebuild
rebuild:
	npx electron-rebuild --parallel --types prod,dev,optional --module-dir release/app

# Lint rules

.PHONY: lint-eslint
lint-eslint:
	npx cross-env NODE_ENV=development eslint "src/**/*.{ts,tsx}"

.PHONY: lint-ts
lint-ts:
	npx cross-env NODE_ENV=development npx tsc --noEmit --project tsconfig.json

.PHONY: lint-stylelint
lint-stylelint:
	npx stylelint "src/**/*.pcss"

.PHONY: lint
lint: lint-eslint lint-ts lint-stylelint

# Package rules

.PHONY: clear-dist
clear-dist:
	rm -rf dist

.PHONE: package
package: clear-dist build electron-rebuild

# Start rules

.PHONY: start-renderer
start-dev-renderer:
	npx cross-env NODE_ENV=development TS_NODE_TRANSPILE_ONLY=true webpack serve --config ./.erb/configs/webpack.config.renderer.dev.ts

.PHONY: start-main
start-main:
	npx cross-env NODE_ENV=development electronmon -r ts-node/register/transpile-only .

.PHONY: start-preload
start-preload:
	npx cross-env NODE_ENV=development TS_NODE_TRANSPILE_ONLY=true webpack --config ./.erb/configs/webpack.config.preload.dev.ts

.PHONY: check-port
check-port:
	npx ts-node ./.erb/scripts/check-port-in-use.js

.PHONY: dev
dev: check-port start-renderer

# Postinstall rules

.PHONY: check-native-deps
check-native-deps:
	npx ts-node .erb/scripts/check-native-dep.js

.PHONY: app-deps
app-deps:
	npx electron-builder install-app-deps

.PHONY: postinstall
postinstall: check-native-deps app-deps build-dev-dll-renderer
