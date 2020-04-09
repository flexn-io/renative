// @todo - replace following test with isCliLinked('{{RNV_PACKAGE_BASE}}') after an rnv publish
if (!'{{RNV_PACKAGE_BASE}}'.includes('node_modules/')) {
    const mock = require('mock-require');
    mock('rnv', '{{RNV_PACKAGE_BASE}}');
}
