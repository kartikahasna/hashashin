/*jslint browser: true, vars: true*/
/*global define, module*/
(function (root, factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.hashashin = factory();
    }
}(this, function () {
    "use strict";

    function exists(obj) {
        return obj !== undefined && obj !== null && (Array.isArray(obj) || typeof obj === "function" || obj.length === undefined || obj.length > 0);
    }

    function getKeyValuePairsFromString(string) {
        if (!exists(string)) {
            return {};
        }

        var dictionary = {},
            parts = string.split("&"),
            i,
            part,
            keyValuePair,
            key,
            value;

        for (i = 0; i < parts.length; i += 1) {
            part = parts[i];
            keyValuePair = part.split("=");
            key = keyValuePair[0];
            value = decodeURIComponent(keyValuePair[1]);
            if (exists(key)) {
                dictionary[key] = value;
            }
        }

        return dictionary;
    }

    function updateHash(obj) {
        var result = "",
            property,
            decodedUriComponent;

        for (property in obj) {
            if (obj.hasOwnProperty(property)) {
                decodedUriComponent = decodeURIComponent(obj[property]);
                if (exists(decodedUriComponent)) {
                    if (result.length > 0) {
                        result += "&";
                    }
                    result += property + "=" + encodeURIComponent(decodedUriComponent);
                }
            }
        }

        if (result.length === 0 && typeof window.history.replaceState === "function") {
            window.location.hash = "";
            window.history.replaceState({}, "", window.location.href.slice(0, -1));
        } else {
            window.location.hash = result;
        }
    }

    return {
        get: function (key) {
            var hash = window.location.hash,
                dictionary = getKeyValuePairsFromString(hash.substring(1, hash.length)),
                value = dictionary[key];
            
            return value === "undefined" ? undefined : value === "null" ? null : value;
        },
        set: function (key, value) {
            var hash = window.location.hash,
                dictionary = getKeyValuePairsFromString(hash.substring(1, hash.length));
            
            dictionary[key] = value;
            updateHash(dictionary);
        },
        remove: function (key) {
            var hash = window.location.hash,
                dictionary = getKeyValuePairsFromString(hash.substring(1, hash.length));
            
            dictionary[key] = undefined;
            updateHash(dictionary);
        },
        fromObject: function (obj) {
            var result = "",
                property;
            
            for (property in obj) {
                if (obj.hasOwnProperty(property)) {
                    result += property + "=" + encodeURIComponent(obj[property]) + "&";
                }
            }

            result = result.slice(0, -1);
            window.location.hash = result;
        },
        toObject: function () {
            var r = window.location.hash,
                dictionary = getKeyValuePairsFromString(r.substring(1, r.length)),
                key;
            for (key in dictionary) {
                if (dictionary.hasOwnProperty(key)) {
                    if (dictionary[key] === "undefined") {
                        dictionary[key] = undefined;
                    } else if (dictionary[key] === "null") {
                        dictionary[key] = null;
                    }
                }
            }

            return dictionary;
        }
    };
}));
