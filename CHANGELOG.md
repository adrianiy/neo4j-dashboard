# [1.9.0](https://github.com/AdrianInsua/neo4j-dashboard/compare/v1.8.1...v1.9.0) (2020-05-02)


### Bug Fixes

* **ux/ui:** remove menu icon ([#86](https://github.com/AdrianInsua/neo4j-dashboard/issues/86)) ([3260f52](https://github.com/AdrianInsua/neo4j-dashboard/commit/3260f52a1a601acdd8ff1eabc5c7c59b0c06ba14))


### Features

* add zoom buttons ([#87](https://github.com/AdrianInsua/neo4j-dashboard/issues/87)) ([f5c33df](https://github.com/AdrianInsua/neo4j-dashboard/commit/f5c33df62bfe42369af26c05bddf6fa691763721))

## [1.8.1](https://github.com/AdrianInsua/neo4j-dashboard/compare/v1.8.0...v1.8.1) (2020-04-28)


### Bug Fixes

* full size card z-index position ([#79](https://github.com/AdrianInsua/neo4j-dashboard/issues/79)) ([a48cacd](https://github.com/AdrianInsua/neo4j-dashboard/commit/a48cacd1ca604599fdd763e82b651989e28c984e))
* restore query from card header ([#82](https://github.com/AdrianInsua/neo4j-dashboard/issues/82)) ([e1e478b](https://github.com/AdrianInsua/neo4j-dashboard/commit/e1e478b13dc3a3fe2fa78c1e05a96e5f88b432de))

# [1.8.0](https://github.com/AdrianInsua/neo4j-dashboard/compare/v1.7.0...v1.8.0) (2020-04-28)


### Bug Fixes

* fix fullscreen transition ([#73](https://github.com/AdrianInsua/neo4j-dashboard/issues/73)) ([f897f0d](https://github.com/AdrianInsua/neo4j-dashboard/commit/f897f0de18c9b0bc222bd11b10100f8ad4752961))
* hide scrolls in all browsers ([#74](https://github.com/AdrianInsua/neo4j-dashboard/issues/74)) ([43d1539](https://github.com/AdrianInsua/neo4j-dashboard/commit/43d153996045b296376dec7b87a52f8d7950486c))


### Features

* add sidebar menu ([#75](https://github.com/AdrianInsua/neo4j-dashboard/issues/75)) ([2ec463d](https://github.com/AdrianInsua/neo4j-dashboard/commit/2ec463df536e59b90305b65e98285571e224cb93))
* improve graph rendering speed with image nodes ([#72](https://github.com/AdrianInsua/neo4j-dashboard/issues/72)) ([22f1c96](https://github.com/AdrianInsua/neo4j-dashboard/commit/22f1c96382008f730ea3c43ce88920c85c819fb4))
* manage styles with global css variables ([#70](https://github.com/AdrianInsua/neo4j-dashboard/issues/70)) ([1e2350d](https://github.com/AdrianInsua/neo4j-dashboard/commit/1e2350d897b86898a0b905da434530093731c108))

# [1.7.0](https://github.com/AdrianInsua/neo4j-dashboard/compare/v1.6.0...v1.7.0) (2020-04-27)


### Bug Fixes

* update graph styles on theme change ([#58](https://github.com/AdrianInsua/neo4j-dashboard/issues/58)) ([2aa2d76](https://github.com/AdrianInsua/neo4j-dashboard/commit/2aa2d76dc6d1bb1b72a059808a98b1a6e47f9622))


### Features

* add default hints using cypher-codemirror ([#59](https://github.com/AdrianInsua/neo4j-dashboard/issues/59)) ([9f6b5b3](https://github.com/AdrianInsua/neo4j-dashboard/commit/9f6b5b394da3cb8906b6369a6417b98ab782eb2a))
* add download options ([#62](https://github.com/AdrianInsua/neo4j-dashboard/issues/62)) ([968a96e](https://github.com/AdrianInsua/neo4j-dashboard/commit/968a96e669677d2f2866b4ac563644c9dd0c75a4))
* add graph configuration in summary side bar ([#64](https://github.com/AdrianInsua/neo4j-dashboard/issues/64)) ([eb48ba9](https://github.com/AdrianInsua/neo4j-dashboard/commit/eb48ba9b3a8c54f876fb3b85175b69d7d133879e))
* add theme hook ([0ba2281](https://github.com/AdrianInsua/neo4j-dashboard/commit/0ba228174a8a84912751715ca05f9c5165b707d4))
* get db schema to improve cmd hints ([#61](https://github.com/AdrianInsua/neo4j-dashboard/issues/61)) ([8a28f03](https://github.com/AdrianInsua/neo4j-dashboard/commit/8a28f0378cd83214269129aef137518d3d47eb80))

# [1.6.0](https://github.com/AdrianInsua/neo4j-dashboard/compare/v1.5.0...v1.6.0) (2020-04-24)


### Features

* add theme hook. Fixes auto theming after midnight ([22d97a2](https://github.com/AdrianInsua/neo4j-dashboard/commit/22d97a29a857b87c6c164c2f372fac08ef7028b4)), closes [#53](https://github.com/AdrianInsua/neo4j-dashboard/issues/53)

# [1.5.0](https://github.com/AdrianInsua/neo4j-dashboard/compare/v1.4.0...v1.5.0) (2020-04-23)


### Bug Fixes

* improve graph rendering performance ([4fc9cc3](https://github.com/AdrianInsua/neo4j-dashboard/commit/4fc9cc36d1cb2e13c44dcf79b3a00ea0d40eac4b))


### Features

* add methods to get images as property instead of caption ([b0a038d](https://github.com/AdrianInsua/neo4j-dashboard/commit/b0a038d268265d263e7600cb419139c76842e887))
* autoconfigure theme based on user's system hour ([#46](https://github.com/AdrianInsua/neo4j-dashboard/issues/46)) ([306c987](https://github.com/AdrianInsua/neo4j-dashboard/commit/306c98777f59ed75042a9a7b6316dd1c9e4c4f02))
* simplify card's summary styles ([#45](https://github.com/AdrianInsua/neo4j-dashboard/issues/45)) ([91ae858](https://github.com/AdrianInsua/neo4j-dashboard/commit/91ae8583ca7e3a8d04d61fa53fd333e87c0f7fc0))

# [1.4.0](https://github.com/AdrianInsua/neo4j-dashboard/compare/v1.3.0...v1.4.0) (2020-04-21)


### Bug Fixes

* card animations are smoother now ([#34](https://github.com/AdrianInsua/neo4j-dashboard/issues/34)) ([c28493e](https://github.com/AdrianInsua/neo4j-dashboard/commit/c28493e20994b3edc215e1829dfb729a13e9102d))


### Features

* add theme changer in header ([#35](https://github.com/AdrianInsua/neo4j-dashboard/issues/35)) ([19d4f48](https://github.com/AdrianInsua/neo4j-dashboard/commit/19d4f48a2fd7552151879372195c7bd1ae466491))

# [1.3.0](https://github.com/AdrianInsua/neo4j-dashboard/compare/v1.2.0...v1.3.0) (2020-04-21)


### Features

* add autosuggest in login URIs ([#30](https://github.com/AdrianInsua/neo4j-dashboard/issues/30)) ([79bf0e6](https://github.com/AdrianInsua/neo4j-dashboard/commit/79bf0e68a8bad986fe0c13ec799a2dc5e96b1f33))
* add resize options in cards and improve summary styles ([#31](https://github.com/AdrianInsua/neo4j-dashboard/issues/31)) ([20da53f](https://github.com/AdrianInsua/neo4j-dashboard/commit/20da53fc62a2ad35f993d75d5aa6ec514d612d22))

# [1.2.0](https://github.com/AdrianInsua/neo4j-dashboard/compare/v1.1.0...v1.2.0) (2020-04-18)


### Features

* show graph objects details in a side bar ([#25](https://github.com/AdrianInsua/neo4j-dashboard/issues/25)) ([f3e76cb](https://github.com/AdrianInsua/neo4j-dashboard/commit/f3e76cb53364adb92061702204a8a2134d3038d1))

# [1.1.0](https://github.com/AdrianInsua/neo4j-dashboard/compare/v1.0.0...v1.1.0) (2020-04-17)


### Features

* improve main page styles ([0612473](https://github.com/AdrianInsua/neo4j-dashboard/commit/0612473d0c7208bc936f467b94cd82b60f77bb0a))

# 1.0.0 (2020-04-17)


### Features

* improve main page styles ([6b43b94](https://github.com/AdrianInsua/neo4j-dashboard/commit/6b43b949736b7248d27859985330d29aed932126))
