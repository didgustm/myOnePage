(function(window){

    'use strict';

    // Extend Object
    function extend(a, b){
        let key;
        for(key in b){
            if(b.hasOwnProperty(key)){
                a[key] = b[key]
            }
        }
        return a
    }

    // Object Each
    function each(collection, callback){
        let item;
        collection.forEach(x => {
            item = x;
            callback(item)
        })
    }

    function Fullpage(options){
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    Fullpage.prototype.options = {
        wrapper: '.fullpage',
        speed: 700,
        minHeight: 750
    }

    Fullpage.prototype._init = function(){
        this.wrapper = document.querySelector(this.options.wrapper);
        this.area = this.wrapper.querySelector('.scroll-area');
        this.sector = this.wrapper.querySelectorAll('.sector');
        this.menu = document.querySelectorAll('.menu li');
        this.leng = this.sector.length;
        this.step = window.innerHeight;
        this.num = 0;
        this.isMoving = false;
        this.direction;
        this.area.style.transitionProperty = `transform`;
        if(this.step > this.options.minHeight){
            window.addEventListener('load', () => {
                this.getHash(this.options.speed);
            });
        }
        window.addEventListener('resize', () => {
            this.step = window.innerHeight;
            this.getHash(0);
        })
        this._initEvents();
    }

    Fullpage.prototype._initEvents = function(){
        this.wrapper.addEventListener('wheel', throttle(e => {
            this.direction = e.wheelDelta < 0? 'down': 'up';
            this.move();
        }));
        document.addEventListener('keydown', e => {
            if(e.key == 'ArrowDown' || e.key == 'ArrowUp'){
                e.key == 'ArrowDown' ? this.direction = 'down':
                e.key == 'ArrowUp'? this.direction = 'up': this.direction = null;
                this.move();
            }
        });
        this.menu.forEach((x, i) => {
            x.addEventListener('click', () => {
				this.setHash(this.sector[i]);
                this.num = i;
                this.scrollMove(this.options.speed);
                setActive(this.sector[i], x);
            })
        });
    }

    Fullpage.prototype.on = function(listener, callback){
        this.listeners = this.listener || {};
        this.listeners[listener] = this.listeners[listener] || [];
        this.listeners[listener].push(callback);
    }

    Fullpage.prototype.emit = function(listener){
        this.listeners = this.listeners || {};
        if(listener in this.listeners === false) return;

        for(var i = 0; i < this.listeners[listener].length; i++){
            this.listeners[listener][i].apply(this, [].slice.call(arguments, 1));
        }
    }

    Fullpage.prototype.getData = function(){
        return this.num;
    }

    Fullpage.prototype.getIndex = (arr, target) => [].indexOf.call(arr, target);

    Fullpage.prototype.setHash = hashTarget => {
        const hash = `#${hashTarget.dataset.anchor}`;
        history.pushState({}, '', hash)
    }

    Fullpage.prototype.getHash = function( duration ){
        const target = location.hash.replace('#', '');
        if(target != '') this.num = this.getIndex(this.sector, this.wrapper.querySelector(`.${target}`));
        this.scrollMove(duration);
        setActive(this.sector[this.num], this.menu[this.num]);
    }

    Fullpage.prototype.setDirection = function(num, max){
        if(this.direction == 'down'){
            num >= max? this.num: this.num++;
        } else if(this.direction == 'up'){
            this.num <= 0? this.num: this.num--;
        }
    }    

    Fullpage.prototype.move = function(){
        if(!this.isMoving){
            this.isMoving = true;
            if(this.step > this.options.minHeight){
                this.setDirection(this.num, this.leng - 1);
                this.sector.forEach((x, i) => {
                    if(i == this.num) {
                        setActive(x, this.menu[i]);
                    }
                });
                this.setHash(this.sector[this.num]);
                setTimeout(() => {
                    this.isMoving = false
                }, this.options.speed)
            } else{
                const max = this.area.offsetHeight;
                this.step = max / (this.leng*2);
                const j = this.step * this.num;
                this.setDirection(j, max - window.innerHeight);
                this.sector.forEach((x, i) => {
                    if((this.num * this.step) + (window.innerHeight / 1.2) > x.offsetTop) {
                        setActive(x, this.menu[i]);
                    }
                });
                setTimeout(() => {
                    this.isMoving = false
                }, 100)
            }
            this.scrollMove(this.options.speed);
        }
    }

    Fullpage.prototype.scrollMove = function( duration ){
        this.area.style.transitionDuration = `${duration}ms`;
        this.area.style.transform = `translate3d(0, ${-this.step * this.num}px, 0)`;
        this.emit('scroll', this.getData());
    }

    function setActive(obj, btn){
        obj.classList.add('active');
        btn.classList.add('active');
        siblings(btn).forEach(el => el.classList.remove('active'));
        siblings(obj).forEach(el => el.classList.remove('active'));
    }
    
    function siblings( el ){
        var targets = el.parentElement.children;
        var arr = [];

        Array.from(targets).forEach(x => {
            arr.push(x)
        });

        return arr.filter(node => node != el);
    }

    function throttle(fn, context){
        var wait;
        return function(){
            context = context || null;

            if(!wait){
                fn.apply(context, arguments);
                wait = true;
                return setTimeout(() => {
                    wait = false;
                }, 100)
            }
        }
    }

    window.Fullpage = Fullpage;

})(window);

