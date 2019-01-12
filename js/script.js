var script = (function () {

    /* Utilities */
    var utils = {
        /**
         * Returns offset from html page top-left corner for some element
         *
         * @param node {HTMLElement} - html element
         * @returns {Object} - object with offsets, e.g. {x: 100, y: 200}
         */
        getOffset : function(node) {
            var boxCoords = node.getBoundingClientRect();

            return {
                x : Math.round(boxCoords.left + window.pageXOffset),
                y : Math.round(boxCoords.top + window.pageYOffset)
            };
        },

        /**
         * Returns correct coordinates (incl. offsets)
         *
         * @param x {number} - x-coordinate
         * @param y {number} - y-coordinate
         * @returns {Object} - object with recalculated coordinates, e.g. {x: 100, y: 200}
         */
        getRightCoords : function(x, y) {
            return {
                x : x - app.getOffset('x'),
                y : y - app.getOffset('y')
            };
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        id : function (str) {
            return document.getElementById(str);
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        hide : function(node) {
            node.style.display = 'none';

            return this;
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        show : function(node) {
            node.style.display = 'block';

            return this;
        },

        /**
         * Escape < and > (for code output)
         *
         * @param str {string} - a string with < and >
         * @returns {string} - a string with escaped < and >
         */
        encode : function(str) {
            return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        foreach : function(arr, func) {
            for(var i = 0, count = arr.length; i < count; i++) {
                func(arr[i], i);
            }
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        foreachReverse : function(arr, func) {
            for(var i = arr.length - 1; i >= 0; i--) {
                func(arr[i], i);
            }
        },

        /**
         * Display debug info to some block
         */
        debug : (function() {
            var output = document.getElementById('debug');

            return function() {
                output.innerHTML = [].join.call(arguments, ' ');
            };
        })(),

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        stopEvent : function(e) {
            e.stopPropagation();
            e.preventDefault();

            return this;
        },

        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        extend : function(obj, options) {
            var target = {};

            for (var name in obj) {
                if(obj.hasOwnProperty(name)) {
                    target[name] = options[name] ? options[name] : obj[name];
                }
            }

            return target;
        },

        inherits : (function() {
            var F = function() {};

            return function(Child, Parent) {
                F.prototype = Parent.prototype;
                Child.prototype = new F();
                Child.prototype.constructor = Child;
            };
        })()
    };

    /* Get image form */
    var get_image = (function() {
        var block = utils.id('get_image_wrapper'),
            close_button = block.querySelector('.close_button'),
            loading_indicator = utils.id('loading'),
            button = utils.id('button'),
            filename = null,
            last_changed = null;

        // Drag'n'drop - the first way to loading an image
        var drag_n_drop = (function() {
            var dropzone = utils.id('dropzone'),
                dropzone_clear_button = dropzone.querySelector('.clear_button'),
                sm_img = utils.id('sm_img');

            function testFile(type) {
                switch (type) {
                    case 'image/jpeg':
                    case 'image/gif':
                    case 'image/png':
                        return true;
                }
                return false;
            }

            dropzone.addEventListener('dragover', function(e){
                utils.stopEvent(e);
            }, false);

            dropzone.addEventListener('dragleave', function(e){
                utils.stopEvent(e);
            }, false);

            dropzone.addEventListener('drop', function(e){
                utils.stopEvent(e);

                var reader = new FileReader(),
                    file = e.dataTransfer.files[0];

                if (testFile(file.type)) {
                    dropzone.classList.remove('error');

                    reader.readAsDataURL(file);

                    reader.onload = function(e) {
                        sm_img.src = e.target.result;
                        sm_img.style.display = 'inline-block';
                        filename = file.name;
                        utils.show(dropzone_clear_button);
                        last_changed = drag_n_drop;
                    };
                } else {
                    clearDropzone();
                    dropzone.classList.add('error');
                }

            }, false);

            function clearDropzone() {
                sm_img.src = '';

                utils.hide(sm_img)
                    .hide(dropzone_clear_button);

                dropzone.classList.remove('error');

                last_changed = url_input;
            }

            dropzone_clear_button.addEventListener('click', clearDropzone, false);

            return {
                clear : clearDropzone,
                init : function() {
                    dropzone.draggable = true;
                    this.clear();
                    utils.hide(sm_img)
                        .hide(dropzone_clear_button);
                },
                test : function() {
                    return Boolean(sm_img.src);
                },
                getImage : function() {
                    return sm_img.src;
                }
            };
        })();

        /* Set a url - the second way to loading an image */
        var url_input = (function() {
            var url = utils.id('url'),
                url_clear_button = url.parentNode.querySelector('.clear_button');

            function testUrl(str) {
                var url_str = str.trim(),
                    temp_array = url_str.split('.'),
                    ext;

                if(temp_array.length > 1) {
                    ext = temp_array[temp_array.length-1].toLowerCase();
                    switch (ext) {
                        case 'jpg':
                        case 'jpeg':
                        case 'gif':
                        case 'png':
                            return true;
                    }
                }

                return false;
            }

            function onUrlChange() {
                setTimeout(function(){
                    if(url.value.length) {
                        utils.show(url_clear_button);
                        last_changed = url_input;
                    } else {
                        utils.hide(url_clear_button);
                        last_changed = drag_n_drop;
                    }
                }, 0);
            }

            url.addEventListener('keypress', onUrlChange, false);
            url.addEventListener('change', onUrlChange, false);
            url.addEventListener('paste', onUrlChange, false);

            function clearUrl() {
                url.value = '';
                utils.hide(url_clear_button);
                url.classList.remove('error');
                last_changed = url_input;
            }

            url_clear_button.addEventListener('click', clearUrl, false);

            return {
                clear : clearUrl,
                init : function() {
                    this.clear();
                    utils.hide(url_clear_button);
                },
                test : function() {
                    if(testUrl(url.value)) {
                        url.classList.remove('error');
                        return true;
                    } else {
                        url.classList.add('error');
                    }
                    return false;
                },
                getImage : function() {
                    var tmp_arr = url.value.split('/');
                    filename = tmp_arr[tmp_arr.length - 1];

                    return url.value.trim();
                }
            };
        })();


        /* Block init */
        function init() {
            utils.hide(loading_indicator);
            drag_n_drop.init();
            url_input.init();
        }
        init();

        /* Block clear */
        function clear() {
            drag_n_drop.clear();
            url_input.clear();
            last_changed = null;
        }

        /* Selected image loading */
        function onButtonClick(e) {
            if (last_changed === url_input && url_input.test()) {
                app.loadImage(url_input.getImage()).setFilename(filename);
            } else if (last_changed === drag_n_drop && drag_n_drop.test()) {
                app.loadImage(drag_n_drop.getImage()).setFilename(filename);
            }

            e.preventDefault();
        }

        button.addEventListener('click', onButtonClick, false);

        close_button.addEventListener('click', hide, false);

        function show() {
            clear();
            utils.show(block);
        }

        function hide() {
            utils.hide(block);
        }

        /* Returned object */
        return {
            show : function() {
                app.hide();
                show();

                return this;
            },
            hide : function() {
                app.show();
                hide();

                return this;
            },
            showLoadIndicator : function() {
                utils.show(loading_indicator);

                return this;
            },
            hideLoadIndicator : function() {
                utils.hide(loading_indicator);

                return this;
            }
        };
    })();
    get_image.show();
})();