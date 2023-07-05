vite = pnpm exec vite
eslint = pnpm exec eslint
prettier = pnpm exec prettier --ignore-path .eslintignore
typecheck = pnpm exec tsc --noEmit

node_modules: package.json pnpm-lock.yaml
ifeq ($(MAKE_YARN_FROZEN_LOCKFILE), 1)
	pnpm install --frozen-lockfile
else
	pnpm install
endif
	@touch node_modules

dev: node_modules FORCE
	$(vite)

build: node_modules FORCE
	$(vite) build

preview: node_modules FORCE
	$(vite) preview

lint: node_modules
	$(eslint) .

lint.fix: node_modules
	$(eslint) --fix .

format: node_modules
	$(prettier) --write .

format.check: node_modules
	$(prettier) --check .

typecheck: node_modules FORCE
	$(typecheck)

typecheck.watch: node_modules FORCE
	$(typecheck) --watch

FORCE:
