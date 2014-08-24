window.SB = window.SB || {};
SB.color = {};
(function() {
    var a, b = {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrodyellow: "#fafad2",
        lightgray: "#d3d3d3",
        lightgreen: "#90ee90",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370db",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#db7093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32"
    };
    SB.color.rgbToHsv = function(a) {
        var b, c, d;
        b = a.r / 255, c = a.g / 255, d = a.b / 255;
        var e = Math.max(b, c, d),
            f = Math.min(b, c, d),
            g = 0;
        switch (e) {
            case f:
                break;
            case b:
                g = 60 * (c - d) / (e - f);
                break;
            case c:
                g = 60 * (2 + (d - b) / (e - f));
                break;
            case d:
                g = 60 * (4 + (b - c) / (e - f))
        }
        0 > g && (g += 360);
        var h = e ? 1 - f / e : 0;
        return {
            h: g,
            s: h,
            v: e
        }
    }, SB.color.rgbaToHsva = function(a) {
        var b = this.rgbToHsv(a);
        return b.a = a.a, b
    }, SB.color.hsvToRgb = function(a) {
        var b = a.h,
            c = a.s,
            d = 255 * a.v,
            e = Math.floor(b / 60),
            f = b / 60 - e,
            g = parseInt(d * (1 - c) + .5, 10),
            h = parseInt(d * (1 - c * f) + .5, 10),
            i = parseInt(d * (1 - c * (1 - f)) + .5, 10);
        switch (d = parseInt(d + .5, 10), e) {
            case 1:
                return {
                    r: h,
                    g: d,
                    b: g
                };
            case 2:
                return {
                    r: g,
                    g: d,
                    b: i
                };
            case 3:
                return {
                    r: g,
                    g: h,
                    b: d
                };
            case 4:
                return {
                    r: i,
                    g: g,
                    b: d
                };
            case 5:
                return {
                    r: d,
                    g: g,
                    b: h
                };
            default:
                return {
                    r: d,
                    g: i,
                    b: g
                }
        }
    }, SB.color.hsvaToRgba = function(a) {
        var b = this.hsvToRgb(a);
        return b.a = a.a, b
    }, SB.color.hsvToHsl = function(a) {
        var b = parseFloat(a.s),
            c = parseFloat(a.v),
            d = (2 - b) * c;
        return {
            h: a.h,
            s: b * c / (1 > d ? d : 2 - d),
            l: d / 2
        }
    }, SB.color.hslToHsv = function(a) {
        var b = parseFloat(a.s),
            c = parseFloat(a.l);
        return c *= 2, b *= 1 > c ? c : 2 - c, {
            h: a.h,
            s: 2 * b / (c + b),
            v: (c + b) / 2
        }
    }, SB.color.parseRgba = function(a) {
        if (a = a.replace(/ +/g, "").replace(/^rgba\(/, "").replace(/\)$/, "").split(","), !(4 == a.length && a[0].length && a[1].length && a[2].length && a[3].length)) return null;
        for (var b = 0; b < a.length; b++) /%/.test(a[b]) && (a[b] = 2.55 * parseInt(a[b], 10)), a[b] = +a[b];
        return this.rgbaToHsva({
            r: parseInt(a[0] + .5, 10),
            g: parseInt(a[1] + .5, 10),
            b: parseInt(a[2] + .5, 10),
            a: parseFloat(a[3])
        })
    }, SB.color.parseRgb = function(a) {
        return this.parseRgba(a.replace("rgb(", "rgba(").replace(")", ",1)"))
    }, SB.color.parseHsla = function(a) {
        if (a = a.replace(/ +/g, "").replace(/^hsla\(/, "").replace(/\)$/, "").split(","), 4 != a.length) return null;
        a[0] = parseInt(a[0], 10) % 360, a[0] < 0 && (a[0] += 360);
        var b = this.hslToHsv({
            h: a[0],
            s: parseInt(a[1], 10) / 100,
            l: parseInt(a[2], 10) / 100
        });
        return b.a = parseFloat(a[3]), b
    }, SB.color.parseHsl = function(a) {
        return this.parseHsla(a.replace("hsl(", "hsla(").replace(")", ",1)"))
    }, SB.color.parseHex = function(a) {
        var b, c, d;
        return a = a.replace("#", ""), 3 == a.length ? (b = parseInt("" + a[0] + a[0], 16), c = parseInt("" + a[1] + a[1], 16), d = parseInt("" + a[2] + a[2], 16)) : (b = parseInt("" + a[0] + a[1], 16), c = parseInt("" + a[2] + a[3], 16), d = parseInt("" + a[4] + a[5], 16)), this.rgbaToHsva({
            r: b,
            g: c,
            b: d,
            a: 1
        })
    }, SB.color.parseColorName = function(a) {
        return a = a.toLowerCase().replace("grey", "gray"), "transparent" == a ? {
            h: 0,
            s: 0,
            v: 0,
            a: 0
        } : b[a] ? this.parseHex(b[a]) : null
    }, SB.color.parseColor = function(a) {
        return a ? /^rgba\(/.test(a) ? this.parseRgba(a) : /^rgb\(/.test(a) ? this.parseRgb(a) : /^hsla\(/.test(a) ? this.parseHsla(a) : /^hsl\(/.test(a) ? this.parseHsl(a) : /^#?([a-fA-F0-9]{3}){1,2}$/.test(a) ? this.parseHex(a) : /^[a-zA-Z]+$/.test(a) ? this.parseColorName(a) : null : null
    }, SB.color.hsvToCssString = SB.color.hsvaToCssString = function(c, d, e) {
        var f = this.hsvToRgb(c);
        if (0 === c.a) return d ? "transparent" : "rgba(0, 0, 0, 0)";
        if (c.hasOwnProperty("a") && 1 != c.a && !Ext.isIE7 && !Ext.isIE8) return "rgba(" + f.r + "," + f.g + "," + f.b + "," + c.a + ")";
        var g = "#";
        f.r < 16 && (g += "0"), g += f.r.toString(16), f.g < 16 && (g += "0"), g += f.g.toString(16), f.b < 16 && (g += "0"), g += f.b.toString(16);
        var h = !1;
        if (d) {
            if (!a) {
                a = {};
                for (var i in b) b.hasOwnProperty(i) && (a[b[i]] = i)
            }
            a[g] && (g = a[g], h = !0)
        }
        return !h && e && (g = "rgba(" + f.r + "," + f.g + "," + f.b + "," + (c.a || "1") + ")"), g
    }, SB.color.normalizeColor = function(a) {
        var b;
        return "object" == typeof a ? (b = a.hasOwnProperty("v") ? a : a.hasOwnProperty("l") ? this.hslToHsv(a) : this.rgbToHsv(a), b.a = a.hasOwnProperty("a") ? a.a : 1) : b = this.parseColor(a), b
    }, SB.color.calculateBrightness = function(a, b) {
        a = this.hsvaToRgba(this.normalizeColor(a));
        var c = (.213 * a.r + .715 * a.g + .072 * a.b) / 255;
        return b && a.hasOwnProperty("a") && 1 != a.a && (b = this.hsvaToRgba(this.normalizeColor(b)), c = a.a * c + (1 - a.a) * this.calculateBrightness(b)), c
    }
})();
