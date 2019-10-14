/*
 * 원페이지 스크롤
 * FIREFOX, IE 추가 안했음..
 * FIREFOX = mousewheel => DOMMouseScroll
 * IE = options = Object.assign error!
 * 높이 minHeight 일때 addClass 타이밍 잡아야함
 */
function onePage(options){
	/* 옵션(호출 시 변경 가능) */
	options = Object.assign({
		menu: false,
		gnb: '.anc',
		timing: 600,
		speed: 600,
		easing: 'ease',
		minHeight: 720,
		minTiming: 200,
		minScroll: 400
	}, options);
	/* //옵션(호출 시 변경 가능) */

	var wrap = document.getElementById('wrap');
	var sections = wrap.children;
	var height = window.innerHeight;
	var step = 0;
	var ing = false;

	/* section높이 세팅 */
	var setHeight = function(event){
		height = window.innerHeight;
		wrap.style.transition = 'none';
		wrap.style.transform = 'translate(0, -'+step*height+'px)';
		for(var i=0; i<sections.length; i++){
			sections[i].style.height = height+'px';
		}
		if(height < options.minHeight){
			for(var i=0; i<sections.length; i++){
				sections[i].style.height = options.minHeight+'px';
			}
		}
	}
	window.addEventListener('load', setHeight, false);
    window.addEventListener('resize', setHeight, false);
	/* //section높이 세팅 */

	/* 마우스휠 */
	wrap.addEventListener('mousewheel', function(e){
		let wheel = e.wheelDelta;
		this.style.transition = 'transform '+options.speed/1000+'s '+options.easing;
		/*
		 * 높이 100%
		 */
		if(height>options.minHeight){
			if(wheel<0 && !ing){
				ing=true;
				step<sections.length-1? step++: step=sections.length-1;
				addActive(sections[step], sections[step-1]);
				setTimeout(function(){
					ing=false;
				}, options.timing);
			} else if(wheel>0 && !ing){
				ing=true;
				step>0? step--: step=0;
				addActive(sections[step], sections[step+1]);
				setTimeout(function(){
					ing=false;
				}, options.timing);
			}
			if(options.menu){
				for(var i = 0; i < menulist.length; i++){
					menulist[i].className = menulist[i].className.replace(' active', '');
				}
				menulist[step].className += ' active';
			}
			this.style.transform = 'translate(0, -'+step*height+'px)';
		}
		/*
		 * 높이가 작아져서 화면에 100% 안찰 경우(options.minHeight 로 조절)
		 */
		else{
			var max = options.minHeight*sections.length - height;
			if(wheel<0 && !ing){
				ing=true;
				step<(max/options.minScroll)-1? step++: step=max/options.minScroll;
				setTimeout(function(){
					ing=false;
				}, options.minTiming);
			} else if(wheel>0 && !ing){
				ing=true;
				step<=0? step=0: step--;
				setTimeout(function(){
					ing=false;
				}, options.minTiming);
			}
			this.style.transform = 'translate(0, -'+step*options.minScroll+'px)';
			// console.log(step, (max/options.minScroll)/step);
		}
		if(ing){
			e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
		}		
	});
	/* //마우스휠 */

	/* 메뉴 */
	if(options.menu){
		var anchor = document.querySelectorAll(options.gnb);
		var menulist = [];
		for(var i = 0; i < anchor.length; i++){
			menulist[i] = anchor[i];
		}
		menulist.forEach(function(anchor){
			anchor.addEventListener('click', function(){
				wrap.style.transition = 'transform '+options.speed/1000+'s '+options.easing;
				var num = parseInt(this.dataset.anc);
				step = num;
				for(var i = 0; i < menulist.length; i++){
					menulist[i].className = menulist[i].className.replace(' active', '');
				}
				if(this.className.split(' ').indexOf('active') == -1){
					this.className += ' active';
				}
				wrap.style.transform = 'translate(0, -'+step*height+'px)';
			});
		});
	}
	/* //메뉴 */

	/* 키보드 */
	window.addEventListener('keydown', function(e){
		wrap.style.transition = 'transform '+options.speed/1000+'s '+options.easing;
		var k = e.keyCode;
		if(k==40 & !ing){
			ing=true;
			step<sections.length-1? step++: step=sections.length-1;
			addActive(sections[step], sections[step-1]);
			setTimeout(function(){
				ing=false;
			}, options.timing);
		} else if(k==38 & !ing){
			ing=true;
			step>0? step--: step=0;
			addActive(sections[step], sections[step+1]);
			setTimeout(function(){
				ing=false;
			}, options.timing);
		}
		if(ing){
			e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
		}
		if(options.menu){
			for(var i = 0; i < menulist.length; i++){
				menulist[i].className = menulist[i].className.replace(' active', '');
			}
			menulist[step].className += ' active';
		}
		wrap.style.transform = 'translate(0, -'+step*height+'px)';
	});
	/* //키보드 */
}

function addActive(me, sibling){
	if(me.className.split(' ').indexOf('active')==-1){
		me.className+=' active';
		sibling.className = sibling.className.replace(' active', '');
	}
}