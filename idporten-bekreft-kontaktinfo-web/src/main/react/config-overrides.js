/* https://github.com/arackaf/customize-cra */

const {
    override,
    addDecoratorsLegacy,
    disableEsLint,
    addBundleVisualizer,
    // useBabelRc,
    addBabelPlugin
} = require("customize-cra");

module.exports = (webpack, ...args) => {

    const overriddenConf = override(
        addDecoratorsLegacy(),
        disableEsLint(),
        // useBabelRc(),
        // add webpack bundle visualizer if BUNDLE_VISUALIZE flag is enabled
        process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),
        addBabelPlugin(
            ["@babel/plugin-transform-react-jsx", {"throwIfNamespace": false}]
        )
    )(webpack, ...args);

    return overriddenConf;
};
