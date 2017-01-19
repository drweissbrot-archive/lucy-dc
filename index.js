const Lucy = require('./Lucy/Lucy')

const cfg = require('./cfg.json')

const lcy = new Lucy(cfg)

lcy.login()
