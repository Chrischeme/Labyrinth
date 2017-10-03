var style;

// this is a wrapped function
(function () {

    // the variables declared here will not be scoped anywhere and will only be accessible in this wrapped function
    var defaultColor = "#000000",
      highlightColor = "#FEFFD5";

    style = {
        navitem: {
            base: {
                font: '30pt ffType',
                marginBottom: '10px',
                align: 'left',
                srokeThickness: 4
            },
            default: {
                fill: defaultColor,
                stroke: '#000000'
            },
            hover: {
                fill: highlightColor,
                stroke: 'rgba(200,200,200,0.5)'
            }
        }
    };

    Object.assign(style.navitem.hover, style.navitem.base);
    Object.assign(style.navitem.default, style.navitem.base);

})();