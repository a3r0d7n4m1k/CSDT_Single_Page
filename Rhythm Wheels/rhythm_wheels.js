let RhythmWheels = function() {
    // List of HTML element names to make it easier to refactor
    let constants = {
        sound_palette_id: 'sound_palette',
        sound_tile_class: 'sound_tile',
        wheels_container_id: 'wheels',
        wheelContainer_class: 'wheelContainer',
        wheel_class: 'wheel',
        loop_length_option_class: 'loop_length_option',
        num_wheels_id: 'num_wheels',
        sound_category_id: 'sound_category',
        play_button_id: 'play_button',
        stop_button_id: 'stop_button',
        tempo_slider_id: 'tempo',
        save_button_id: 'save',
    };

    let flags = {
        dragging: null,
        playing: false,
    };

    let sounds = {};

    let libraries = {
        'HipPop': ['rest', 'scratch11', 'scratch12', 'scratch13', 'hup1',
                   'clap1', 'tube1', 'bassdrum1', 'hihat1'],
        'LatinoCarribean': ['rest', 'open1', 'tip1', 'slap1', 'heel1', 'neck1',
                            'mouth1', 'clave1', 'maracas1', 'tamborine1'],
        'Rock': ['rest', 'acousticbass1', 'acousticsnare1', 'electricsnare1',
                 'lowfloortom1', 'openhighconga1', 'hihato1', 'splash1',
                 'crash1'],
        'Electro': ['electrocowbell1', 'electrotap1', 'electroclap1',
                 'electrokick1', 'electrosnare1'],
    };

    let globals = {
        bpm: 120,
    };

    /**
     * Contructs and manages the sound palette
     */
    function SoundPalette() {
        this.domelement = document.getElementById(constants.sound_palette_id);
        this.soundTiles = [];
    }

    SoundPalette.prototype.newSoundTile = function(opts) {
        let st = new SoundTile(opts);
        this.soundTiles.push(st);

        this.domelement.appendChild(st.domelement);
    };

    SoundPalette.prototype.clearPalette = function() {
        this.soundTiles = [];
        this.domelement.innerHTML = '';
    };

    SoundPalette.prototype.loadLibrary = function(opts) {
        this.clearPalette();

        let _self = this;
        libraries[opts.library].forEach(function(type) {
            _self.newSoundTile({type: type});
        });
    };

    // - This whole constructor just build the domelement and binds them to
    //   some member variables
    // - SoundTiles are only in the sound the palette
    /**
     * @param {Object} opts
     *  opts.type: type of Sound tile to create. Is the key
     *      in the catalog
     */
    function SoundTile(opts) {
        let container = document.createElement('div');
        this.domelement = container;
        container.setAttribute('class', constants.sound_tile_class);

        let sprite = document.createElement('div');
        sprite.style['background-image'] = 'url(images/base.png)';
        sprite.style['width'] = '50px';
        sprite.style['height'] = '50px';

        sprite.style.color = 'white';
        sprite.style.textAlign = 'center';

        let img = document.createElement('img');
        img.setAttribute('src', sounds[opts.type].icon);
        img.style['position'] = 'relative';
        img.style['top'] = '10px';

        sprite.appendChild(img);

        this.type = opts.type;

        let label = document.createTextNode(sounds[opts.type].name);
        container.appendChild(sprite);
        container.appendChild(label);

        this.tmpSprite = sprite.cloneNode(true);
        this.tmpSprite.style['position'] = 'absolute';
        this.tmpSprite.style['display'] = 'none';
        document.getElementsByTagName('body')[0].appendChild(this.tmpSprite);

        let _self = this;

        this.domelement.addEventListener('mousedown', function(event) {
            _self.tmpSprite.style['display'] = 'block';
            _self.tmpSprite.style['left'] = event.clientX - 25 + 'px';
            _self.tmpSprite.style['top'] = event.clientY - 25 + 'px';
            flags.dragging = _self;
            captureMouseEvents(event);
        });
    }

    /**
     * Constructs, manages, and contains all the wheels
     */
    function WheelsContainer() {
        this.domelement =
            document.getElementById(constants.wheels_container_id);
        this.wheels = [];
        this.wheelCount = 1;

        // keep track of spacers to hide them when not needed
        // and maintain layout
        this.spacers = [];
    }

    // Only used internally during initialization
    WheelsContainer.prototype.newWheel = function() {
        let newWheel = new Wheel();
        this.wheels.push(newWheel);

        // required for equally spacing the wheels
        let spacer = document.createElement('span');
        spacer.innerText = '\xa0';
        this.spacers.push(spacer);

        this.domelement.appendChild(newWheel.domelement);
        this.domelement.appendChild(spacer);
    };

    WheelsContainer.prototype.setWheelCount = function(wheelCount) {
        this.wheelCount = wheelCount;

        // inactive wheels are just hidden

        for (let i = 0; i < wheelCount; i++) {
            this.wheels[i].domelement.style.display = 'inline-block';
            this.spacers[i].style.display = 'inline';
        }

        for (i = wheelCount; i < this.wheels.length; i++) {
            this.wheels[i].domelement.style.display = 'none';
            this.spacers[i].style.display = 'none';
        }

        this.domelement.style.width = 270 * wheelCount - 20 + 'px';
    };

    WheelsContainer.prototype.update = function() {
        for (let i = 0; i < this.wheels.length; i++) {
            this.wheels[i].update();
        }
    };

    //  These are sound tiles on the wheel
    /**
     * Constructs and manages the sound tiles that are on the wheels
     * @param {*} opts
     *  opts.parent: the wheel that contains the node
     *  opts.type: type of sound tile to set this node to
     */
    function Node(opts) {
        this.parent = opts.parent;

        this.radius = 100;
        this.rotation = 0;

        let sprite = document.createElement('div');
        sprite.style['background-image'] = 'url(images/base.png)';
        sprite.style['width'] = '50px';
        sprite.style['height'] = '50px';

        sprite.style.color = 'white';
        sprite.style.textAlign = 'center';

        sprite.style.width = '50px';
        sprite.style.textAlign = 'center';
        sprite.style.position = 'absolute';

        this.domelement = sprite;

        this.setType(opts.type);

        let _self = this;

        this.domelement.addEventListener('drop', function() {
            interrupt();
            _self.setType(flags.dragging.type);
            flags.dragging = null;
        });
        this.domelement.addEventListener('dragover', function(event) {
            event.preventDefault();
        });
    }

    //  Set the sound/sprite this node is associated with
    Node.prototype.setType = function(type) {
        this.type = type;
        if (this.domelement.hasChildNodes()) {
            this.domelement.removeChild(this.domelement.lastChild);
        }

        let img = document.createElement('img');
        img.setAttribute('src', sounds[type].icon);
        img.style['position'] = 'relative';
        img.style['top'] = '10px';

        let _self = this;
        img.addEventListener('drop', function() {
            _self.domelement.dispatchEvent(new DragEvent('drop'));
        });

        img.addEventListener('dragover', function() {
            _self.domelement.dispatchEvent(new DragEvent('dragover'));
        });

        this.domelement.appendChild(img);
    };

    // Used internally by wheel. Indicated that this node is playing
    Node.prototype.setHighlighted = function(highlighted) {
        if (highlighted) {
            this.domelement.style['background-image'] =
                'url(images/base-inverted.png)';
        } else {
            this.domelement.style['background-image'] = 'url(images/base.png)';
        }
    };

    Node.prototype.update = function() {
        let parentRect = this.parent.domelement.getBoundingClientRect();
        let x = (parentRect.left + parentRect.right) / 2 + window.scrollX;
        let y = (parentRect.bottom + parentRect.top) / 2 + window.scrollY;

        this.domelement.style.left = x + 'px';
        this.domelement.style.top = y - this.radius + 'px';

        this.domelement.style['transform-origin'] = '0 ' + this.radius + 'px';

        let offset = (10 * this.parent.nodeCount + 85);

        let scale = 1;
        if (this.parent.nodeCount > 8) {
            scale = 1-(this.parent.nodeCount/20) + 0.4;
        } else {
            scale = 1;
        }

        // translate to correct for offset
        this.domelement.style['transform'] = 'scale(' + scale + ') rotate(' +
            this.rotation + 'rad) translate(-25px, ' + offset + 'px)';
    };

    /**
     * Creates and manages the wheel. Contains and stores data about nodes as
     * well.
     * @param {*} opts
     *  opts.nodeCount: initial node count/loop length
     */
    function Wheel(opts) {
        if (opts === undefined) opts = {};
        let nodeCount = opts.nodeCount !== undefined ? opts.nodeCount : 4;

        let wheelContainer = document.createElement('div');
        this.domelement = wheelContainer;
        wheelContainer.setAttribute('class', constants.wheelContainer_class);

        // create loop length control box

        let _self = this;
        let loopLengthDiv = document.createElement('div');
        let optDivs = [];
        for (let i = 1; i <= 16; i++) {
            let opt = document.createElement('span');
            opt.classList.add(constants.loop_length_option_class);
            opt.innerText = i;

            loopLengthDiv.appendChild(opt);
            optDivs.push(opt);

            // anonymous function makes sure the
            // value of j is separate from the iterator i
            (function(j) {
                opt.addEventListener('click', function() {
                    interrupt();
                    if (!loopLengthDiv.disabled) {
                        _self.setNodeCount(j);
                    }
                });
            })(i);
        }
        optDivs[nodeCount - 1].classList.add('selected');

        wheelContainer.appendChild(loopLengthDiv);
        this.domelement.loopLengthControl = loopLengthDiv;
        this.domelement.loopLengthControl.optDivs = optDivs;

        //  create wheel

        let wheel = document.createElement('div');
        wheel.classList.add(constants.wheel_class);

        // circle outline
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style['position'] = 'relative';
        svg.setAttribute('width', 250);
        svg.setAttribute('height', 300);

        svg.innerHTML += '<circle'
                            + 'cx="125"'
                            + 'cy="150"'
                            + 'r="80"'
                            + 'stroke="#0038b9"'
                            + 'stroke-width="2"'
                            + 'fill="transparent"'
                        + '/>';
        this.svg = svg;
        this.svg.circle = svg.lastChild;

        wheelContainer.appendChild(svg);

        // create nodes
        this.nodes = [];
        for (i = 0; i < 16; i++) {
            let node = new Node({parent: this, type: 'rest'});
            wheel.appendChild(node.domelement);
            this.nodes.push(node);
        }
        this.setNodeCount(nodeCount);

        wheelContainer.appendChild(wheel);

        // more controls
        let loopCountControlSpan = document.createElement('span');
        let loopCountControl = document.createElement('input');
        loopCountControl.style['width'] = '2em';
        loopCountControl.value = '1';
        loopCountControl.addEventListener('keypress', function(event) {
            if (!(event.charCode >= 48 && event.charCode <= 57)) {
                event.preventDefault();
                return false;
            }
        });
        loopCountControl.addEventListener('keyup', function() {
            interrupt();
            if (loopCountControl.value) {
                _self.loopCount = parseInt(loopCountControl.value);
            }
        });

        loopCountControlSpan.appendChild(document.createTextNode('Play '));
        loopCountControlSpan.appendChild(loopCountControl);
        loopCountControlSpan.appendChild(document.createTextNode(' time(s)'));
        wheelContainer.appendChild(loopCountControlSpan);

        this.domelement.loopCountControl = loopCountControl;

        this.rotation = 0;
        this.isPlaying = false;

        this.loopCount = 1;
    }

    Wheel.prototype.setNodeCount = function(nodeCount) {
        // hide nodes that are over the nodeCount
        // i.e. inactive nodes are merely hidden
        for (let i = 0; i < nodeCount; i++) {
            this.nodes[i].domelement.style.display = 'inline-block';
        }
        for (i = nodeCount; i < 16; i++) {
            this.nodes[i].domelement.style.display = 'none';
        }
        this.nodeCount = nodeCount;

        // adjust graphics
        let offset = (10 * nodeCount + 35);
        let scale = 1;
        if (nodeCount > 8) {
            scale = 1-(nodeCount/20) + 0.4;
        } else {
            scale = 1;
        }

        this.svg.circle.setAttribute('r', offset * scale);

        // update node count button grid
        for (let k = 0; k < 16; k++) {
            this.domelement
                .loopLengthControl.optDivs[k].classList.remove('selected');
        }
        this.domelement
            .loopLengthControl.optDivs[nodeCount - 1].classList.add('selected');

        this.update();
    };

    Wheel.prototype.setLoopCount = function(loopCount) {
        this.loopCount = loopCount;
        this.domelement.loopCountControl.value = loopCount;
    };

    Wheel.prototype.setPlaying = function(isPlaying) {
        this.isPlaying = isPlaying;
        this.rotation = 0;

        if (!isPlaying) {
            for (let i = 0; i < this.nodes.length; i++) {
                this.nodes[i].setHighlighted(false);
            }
        }
    };

    Wheel.prototype.update = function() {
        // stop animation
        if (this.isPlaying) {
            this.rotation +=
                globals.bpm / 60.0 * (Math.PI * 2.0 / this.nodeCount) / 60;
            if (this.rotation >= this.loopCount * Math.PI * 2) {
                this.setPlaying(false);
            }
        }

        // highlights current node
        if (this.isPlaying) {
            let currentPos = this.rotation / (Math.PI * 2) * this.nodeCount;
            this.nodes[Math.floor(currentPos) % this.nodeCount]
                .setHighlighted(currentPos - Math.floor(currentPos) < 0.7);
        }

        // updates notes
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes[i].rotation =
                this.rotation - Math.PI * 2 * i / this.nodeCount;
            this.nodes[i].update();
        }
    };

    // helper functions and variables

    let ac; // Initialized as AudioContext in init
    let sp; // initialized as SoundPalette in init
    let wc; // initialized as WheelContainer in init

    let loadSounds = function() {
        let loadSound = function(req, res) {
            let request = new XMLHttpRequest();
            request.open('GET', req.url, true);
            request.responseType = 'arraybuffer';

            request.onload = function() {
                let success = function(buffer) {
                    res({buffer: buffer});
                };

                let error = function(err) {
                    res(null, err);
                };

                ac.decodeAudioData(request.response, success, error);
            };

            request.send();
        };

        let keys = Object.keys(sounds);
        for (let j = 0; j < keys.length; j++) {
            (function(i) {
                loadSound({url: sounds[keys[i]].url}, function(res, err) {
                    if (err) {
                        console.error('[!] Error loading sound: ' + keys[i]);
                        return;
                    }
                    console.log('Loaded sound: ' + keys[i]);
                    sounds[keys[i]].buffer = res.buffer;
                });
            })(j);
        }
    };

    let interrupt = function() {
        if (flags.playing) stop();
    };

    // keep a list of active sounds so they can be aborted when stopped while
    // playing
    let activeBuffers = [];

    let play = function() {
        let time = 0;
        let compile = function() {
            let sequences = [];
            for (let i = 0; i < wc.wheelCount; i++) {
                let sequenceTime =
                    wc.wheels[i].loopCount
                    * wc.wheels[i].nodeCount
                    * 60.0 / globals.bpm;
                if (sequenceTime > time) time = sequenceTime;

                sequences.push([]);
                for (let k = 0; k < wc.wheels[i].loopCount; k++) {
                    for (let j = 0; j < wc.wheels[i].nodeCount; j++) {
                        sequences[i].push(wc.wheels[i].nodes[j].type);
                    }
                }
            }
            return sequences;
        };

        // plays a single sound
        let playSound = function(name, delay) {
            let source = ac.createBufferSource();
            source.buffer = sounds[name].buffer;
            source.connect(ac.destination);
            source.start(ac.currentTime + delay);
            activeBuffers.push(source);
        };

        let sequences = compile();

        for (let i = 0; i < sequences.length; i++) {
            for (let j = 0; j < sequences[i].length; j++) {
                playSound(sequences[i][j], j * 60.0 / globals.bpm);
            }
            wc.wheels[i].setPlaying(true);
        }

        flags.playing = true;
    };

    let stop = function() {
        for (let i = 0; i < wc.wheels.length; i++) {
            wc.wheels[i].setPlaying(false);
        }
        flags.playing = false;

        activeBuffers.forEach(function(source) {
            source.stop();
        });
        activeBuffers = [];
    };

    // generates and downloads string
    let save = function() {
        let output = 'rw v0.0.1\n';
        output += 'tempo:' + globals.bpm + '\n';
        output += 'wheels:' + wc.wheelCount + '\n';
        for (let i = 0; i < wc.wheelCount; i++) {
            output += 'wheel' + i + ':\n';
            output += '  size:' + wc.wheels[i].nodeCount + '\n';
            output += '  loop:' + wc.wheels[i].loopCount + '\n';
            output += '  nodes:\n';
            for (let j = 0; j < wc.wheels[i].nodeCount; j++) {
                output += '    ' + wc.wheels[i].nodes[j].type + '\n';
            }
        }
        download('save.rw', output);
    };

    // loads a rythm wheels instance from text
    let load = function(opts) {
        interrupt();

        if (opts === undefined) {
            return alert('Could not parse: Undefined parameter');
        }
        if (opts.text === undefined) {
            return alert('Could not parse: Empty string');
        }

        let lines = opts.text.split('\n');

        if (lines[0] != 'rw v0.0.1') {
            return alert('Could not parse: Invalid format');
        }

        let stack = [];
        lines.forEach(function(line) {
            let lr = line.split(':');
            let lhs = lr[0].trim();
            let rhs = lr[1];

            if (stack[stack.length - 1] == 'nodes') {
                if (stack[stack.length - 2]
                    == wc.wheels[stack[stack.length - 4]].nodeCount) {
                    stack.pop();
                    stack.pop();
                } else {
                    wc.wheels[stack[stack.length - 4]]
                        .nodes[stack[stack.length - 2]].setType(line.trim());
                    stack[stack.length - 2]++;
                }
            }

            if (stack[stack.length - 1] == 'wheel') {
                switch (lhs) {
                case 'size':
                    wc.wheels[stack[stack.length - 2]]
                        .setNodeCount(parseInt(rhs));
                    break;
                case 'loop':
                    wc.wheels[stack[stack.length - 2]]
                        .setLoopCount(parseInt(rhs));
                    break;
                case 'nodes':
                    stack.push(0);
                    stack.push('nodes');
                    break;
                default:
                    stack.pop();
                    stack.pop();
                    break;
                }
            }

            if (stack.length == 0) {
                switch (lhs) {
                case 'tempo':
                    globals.bpm = parseFloat(rhs);
                    document.getElementById(constants.tempo_slider_id).value =
                        Math.log10(globals.bpm / 120);
                    break;
                case 'wheels':
                    wc.setWheelCount(parseInt(rhs));
                    document.getElementById(constants.num_wheels_id).value =
                        parseInt(rhs);
                    break;

                case 'wheel0':
                    stack.push(0);
                    stack.push('wheel');
                    break;
                case 'wheel1':
                    stack.push(1);
                    stack.push('wheel');
                    break;
                case 'wheel2':
                    stack.push(2);
                    stack.push('wheel');
                    break;

                default:
                    alert('Could not parse: Unknown parameter "' + lhs + '"');
                    return;
                }
            }
        });
    };

    // modified from stackoverflow - used to load files
    let readSingleFile = function(e) {
        let file = e.target.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onload = function(e) {
            let contents = e.target.result;
            load({text: contents});
        };
        reader.readAsText(file);
    };

    // modified from stackoverflow - essential for fixing the cursor while
    // dragging

    const EventListenerMode = {capture: true};

    let preventGlobalMouseEvents = function() {
        document.body.style['pointer-events'] = 'none';
    };

    let restoreGlobalMouseEvents = function() {
        document.body.style['pointer-events'] = 'auto';
    };

    let mousemoveListener = function() {
        e.stopPropagation();

        flags.dragging.tmpSprite.style['left'] = e.clientX - 25 + 'px';
        flags.dragging.tmpSprite.style['top'] = e.clientY - 25 + 'px';
    };

    let mouseupListener = function() {
        restoreGlobalMouseEvents();
        document.removeEventListener('mouseup', mouseupListener,
            EventListenerMode);
        document.removeEventListener('mousemove', mousemoveListener,
            EventListenerMode);
        e.stopPropagation();

        flags.dragging.tmpSprite.style['display'] = 'none';

        document.elementFromPoint(e.clientX, e.clientY)
            .dispatchEvent(new DragEvent('drop'));
    };

    let captureMouseEvents = function() {
        preventGlobalMouseEvents();
        document.addEventListener('mouseup', mouseupListener,
            EventListenerMode);
        document.addEventListener('mousemove', mousemoveListener,
            EventListenerMode);
        e.preventDefault();
        e.stopPropagation();
    };

    // from stackoverflow - for saving

    let download = function() {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,'
            + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    //

    this.initialize = function(opts) {
        if (opts === undefined) opts = {};
        if (opts.sounds !== undefined) sounds = opts.sounds;

        sp = new SoundPalette();
        sp.loadLibrary({library: 'HipPop'});

        wc = new WheelsContainer();

        wc.newWheel();
        wc.newWheel();
        wc.newWheel();
        wc.setWheelCount(1);

        wc.update();

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        ac = new AudioContext();

        loadSounds();

        //  bind events
        document.body.onresize = function() {
            wc.update();
        };

        document.body.onscroll = function() {
            wc.update();
        };

        document.getElementById(constants.num_wheels_id)
            .addEventListener('change', function(event) {
            wc.setWheelCount(event.target.value);
            wc.update();
        });

        document.getElementById(constants.sound_category_id)
            .addEventListener('change', function(event) {
            sp.loadLibrary({library: event.target.value});
        });

        document.getElementById(constants.play_button_id)
            .addEventListener('click', function() {
            interrupt();
            play();
        });

        document.getElementById(constants.stop_button_id)
            .addEventListener('click', function() {
            stop();
        });

        document.getElementById(constants.save_button_id)
            .addEventListener('click', function() {
            save();
        });

        document.getElementById(constants.tempo_slider_id)
            .addEventListener('change', function(event) {
            interrupt();
            globals.bpm = 120 * Math.pow(10, event.target.value);
        });

        document.getElementById('load')
            .addEventListener('change', readSingleFile, false);

        (function anim() {
            wc.update();
            requestAnimationFrame(anim);
        })();
    };
};

let rw;

// temporary structure for testing
(function() {
    rw = new RhythmWheels();
    rw.initialize({sounds: catalog});
})();
