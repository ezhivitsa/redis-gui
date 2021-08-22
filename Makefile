.PHONY: deps
deps:
	yarn

.PHONY: app-deps
app-deps:
	npx electron-builder install-app-deps

.PHONY: yarn-deduplicate
yarn-deduplicate:
	npx yarn-deduplicate yarn.lock

.PHONY: build
build:
	make -j 2 build-main build-renderer

.PHONY: build-main
build-main:
	npx cross-env NODE_ENV=production webpack --config ./configs/webpack.config.main.prod.babel.js

.PHONY: build-renderer
build-renderer:
	npx cross-env NODE_ENV=production webpack --config ./configs/webpack.config.renderer.prod.babel.js

.PHONY: build-dev-dll-renderer
build-dev-dll-renderer:
	npx cross-env NODE_ENV=development webpack --config ./configs/webpack.config.renderer.dev.dll.babel.js

.PHONY: electron-build
electron-build:
	electron-builder build --publish never

.PHONY: electron-rebuild
electron-rebuild:
	npx electron-rebuild --parallel --types prod,dev,optional --module-dir src

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

.PHONY: clear-dist
clear-dist:
	rm -rf src/dist

.PHONE: package
package: clear-dist build electron-rebuild

.PHONY: start-dev-renderer
start-dev-renderer:
	npx cross-env NODE_ENV=development webpack serve --config ./configs/webpack.config.renderer.dev.babel.js

.PHONY: start-main
start-main:
	npx cross-env NODE_ENV=development electron -r ./scripts/BabelRegister ./src/main.dev.ts

.PHONY: check-port
check-port:
	node -r @babel/register ./scripts/CheckPortInUse.js

.PHONY: check-native-deps
check-native-deps:
	node -r @babel/register scripts/CheckNativeDep.js

.PHONY: dev
dev: check-port start-dev-renderer

.PHONY: postinstall
postinstall: check-native-deps app-deps build-dev-dll-renderer yarn-deduplicate
