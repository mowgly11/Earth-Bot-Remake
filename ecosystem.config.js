module.exports = {
  apps : [{
    name   : "earth",
    script : "./index.js",
    instances: "max",
    exec_mode: "cluster"
  }]
}
