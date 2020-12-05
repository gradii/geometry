# List of all entry-points of the Angular CDK package.
DIAGRAM_ENTRYPOINTS = [
    "geometry",
    "canvas-core",
    "defaults",
    "diagram-core",
    "diagram-engine",
]

DIAGRAM_TESTING_ENTRYPOINTS = [
]

DIAGRAM_ENTRYPOINTS_WITH_STYLES = [
]

DIAGRAM_SCSS_LIBS = [
    "//src/diagram/%s:%s_scss_lib" % (p, p.replace("-", "_"))
    for p in DIAGRAM_ENTRYPOINTS_WITH_STYLES
]

DIAGRAM_TARGETS = ["//src/diagram"] + \
                  ["//src/diagram/%s" % ep for ep in DIAGRAM_ENTRYPOINTS]

DIAGRAM_TESTING_TARGETS = ["//src/diagram/%s" % ep for ep in DIAGRAM_TESTING_ENTRYPOINTS]
