AFRAME.registerComponent('isvr-init-assets', {

    schema: {
        url: {
            default: ''
        }
    },

    init: function() {

        this.xmlhttp = new XMLHttpRequest();
        this.xmlhttp.onreadystatechange = this.responseHandler.bind(this);
        this.xmlhttp.open('GET', this.data.url, true);
        this.xmlhttp.send();
    },

    responseHandler: function() {

        if (this.xmlhttp.readyState == 4 && this.xmlhttp.status == 200) {

            var obj = JSON.parse(this.xmlhttp.responseText);

            /* 1st photo sphere asset, to show immediately */
            var photosphere_image = new Image();
            photosphere_image.onload = (function(content_id) {
                return function() {
                    var image_elem = document.createElement('img');
                    image_elem.setAttribute('id', 'img-photosphere-1');
                    image_elem.setAttribute('data-content-id', content_id);
                    image_elem.setAttribute('src', this.src);

                    var assets = document.querySelector('a-assets');
                    assets.appendChild(image_elem);

                    var sphere = document.querySelector('#photosphere');
                    sphere.setAttribute('material', 'src', '#img-photosphere-1');
                    document.querySelector('#photosphere-loading').setAttribute('visible', false);
                    document.querySelector('#photosphere-loading-anim').stop();

                    var hotspots = document.querySelectorAll('.hotspot-content-id-' + content_id);
                    for (var i = 0; i < hotspots.length; i++) {
                        hotspots[i].setAttribute('visible', 'true');
                    }

                    sphere.emit('photosphere-fading');
                }
            }(obj['photo-spheres'][0]['photo-sphere']['#content-id']));
            photosphere_image.src = obj['photo-spheres'][0]['photo-sphere']['#uri']['#value'];


            /* photo sphere thumbnail assets */
            for (var i=0; i<obj['photo-spheres'].length; i++) {

                var id = obj.from + i;

                var photosphere_thumb_image = new Image();
                photosphere_thumb_image.onload = (function(id, i, content_id) {
                    return function() {
                        var image_elem = document.createElement('img');
                        image_elem.setAttribute('id', 'img-photosphere-thumb-' + id);
                        image_elem.setAttribute('data-content-id', content_id);
                        image_elem.setAttribute('src', this.src);
                        var assets = document.querySelector('a-assets');
                        assets.appendChild(image_elem);

                        var thumb = document.querySelector('#photosphere-thumb-' + (i+1));

                        /* img-photosphere-1 has already been loaded */
                        if (id != 1) {

                            var photosphere_image = new Image();
                            photosphere_image.onload = (function(id, thumb, content_id) {
                                return function() {
                                    var image_elem = document.createElement('img');
                                    image_elem.setAttribute('id', 'img-photosphere-' + id);
                                    image_elem.setAttribute('data-content-id', content_id);
                                    image_elem.setAttribute('src', this.src);
                                    var assets = document.querySelector('a-assets');
                                    assets.appendChild(image_elem);

                                    document.querySelector('#photosphere-loading-' + (i+1)).setAttribute('visible', false);
                                    document.querySelector('#photosphere-loading-anim-' + (i+1)).stop();
                        
                                    thumb.setAttribute('material', 'src', '#img-photosphere-thumb-' + id);
                                    thumb.setAttribute('visible', true);
                                }
                            }(id, thumb, content_id));
                            photosphere_image.src = obj['photo-spheres'][i]['photo-sphere']['#uri']['#value'];

                        } else {

                          document.querySelector('#photosphere-loading-' + (i+1)).setAttribute('visible', false);
                          document.querySelector('#photosphere-loading-anim-' + (i+1)).stop();

                          thumb.setAttribute('material', 'src', '#img-photosphere-thumb-' + id);
                          thumb.setAttribute('visible', true);
                        } 
                    }
                }(id, i, obj['photo-spheres'][i]['photo-sphere']['#content-id']));
                photosphere_thumb_image.src = obj['photo-spheres'][i]['photo-sphere']['photo-sphere-navigation-preview-image']['#uri']['#value'];

            } /* for */ 


        } /* if */

    }

});


