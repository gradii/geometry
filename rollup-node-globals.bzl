

# Base rollup globals for everything in the repo. Note that we want to disable
# sorting of the globals as we manually group dict entries.
# buildifier: disable=unsorted-dict-items
ROLLUP_GLOBALS = {
    "@gradii/annotation": "gradii.annotation",
    "@gradii/check-type": "gradii.check-type",
    "@gradii/color": "gradii.color",
    "@gradii/diagram": "gradii.diagram",
    "@gradii/easing": "gradii.easing",
    "@gradii/interpolate": "gradii.interpolate",
    "@gradii/stream-buffer": "gradii.streamBuffer",
    "@gradii/vector-math": "gradii.vectorMath",

    # Third-party libraries.
    "closest": "closest",
    "date-fns": "date-fns",
    "lodash": "lodash",
    "moment": "moment",
    "protractor": "protractor",
    "rxjs": "rxjs",
    "rxjs/operators": "rxjs.operators",
    "tslib": "tslib",
    "uuid": "uuid",
    "ix": "ix",
    "ix/iterable": "ix.iterable",
    "ix/iterable/operators": "ix.iterable.operators",
    "sqlite3": "sqlite3",
    "mysql2": "mysql2",
}

# Converts a string from dash-case to lower camel case.
def to_camel_case(input):
    segments = input.split("-")
    return segments[0] + "".join([x.title() for x in segments[1:]])

# Converts an entry-point name to a UMD module name.
# e.g. "snack-bar/testing" will become "snackBar.testing".
def to_umd_name(name):
    segments = name.split("/")
    return ".".join([to_camel_case(x) for x in segments])

# Creates globals for a given package and its entry-points.
def create_globals(packageName, entryPoints):
    ROLLUP_GLOBALS.update({
        "@gradii/%s/%s" % (packageName, ep): "gradii.%s.%s" % (to_umd_name(packageName), to_umd_name(ep))
        for ep in entryPoints
    })
