CUBE_ENTRYPOINTS = [
  "gantt"
]

CUBE_TESTING_ENTRYPOINTS = [
    "core/testing",
]

CUBE_ENTRYPOINTS_WITH_STYLES = [

]

CUBE_SCSS_LIBS = [
    "//src/cube/%s:%s_scss_lib" % (p, p.replace("-", "_"))
    for p in CUBE_ENTRYPOINTS_WITH_STYLES
]

CUBE_TARGETS = ["//src/cube"] + \
                   ["//src/cube/%s" % ep for ep in CUBE_ENTRYPOINTS]

CUBE_TESTING_TARGETS = ["//src/cube/%s" % ep for ep in CUBE_TESTING_ENTRYPOINTS]
