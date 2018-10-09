/**
 * 基于jQuery的树形菜单
 * @author 余鹏
 * @param {Object} containerId	容器ID
 * @param {Object} menuData	菜单数据
 * @param {Object} toggleSpeed	菜单展开速度 毫秒
 */
var basePath='http://192.168.1.98/chat';
var TreeMenu = function (containerId,menuData,toggleSpeed) {
    this.containerId = containerId;
    this.data = menuData || [];
    this.toggleSpeed = toggleSpeed || 300;
    this.init=function(){
        if(!this.containerId){
            console.error("请指定菜单容器");
            return;
        }
        if(this.data.length==0){
            console.error("没有菜单原数据");
            return;
        }
        var childrentListHtml='';
        for(var i=0;i<this.data.length;i++){
            var child = this.data[i];
            if(child.children && child.children.length>0){
                getChildrenHtml(child);
            }
            child.iconSvg=child.icon?svgStore.menuIcon[child.icon]:"";
            childrentListHtml+=replaceHtmlTemplate("",menuTemp.menuParent,child);
        }
        var $mainContainer = $(menuTemp.mainMenuContainer);
        $mainContainer.html(childrentListHtml+menuTemp.static());
        $(this.containerId).html($mainContainer);
        evetHandler(this);
    }

    function evetHandler(obj) {
        $(".mainMenu .menu-title,.mainMenu .menu-child-title").on("click",function () {
            var target = $(this);
            target.parent().addClass("active");
            hiddenSibblings(target.parent().siblings(),obj);
            unActive(target.parent().siblings());
            target.find(".menu-arrow").toggleClass("rotate180");
            target.next(".menu-children").slideToggle(obj.toggleSpeed);

        });
        $(".mainMenu .menu-last").on("click",function () {
            var target = $(this);
            target.addClass("active");
            unActive(target.siblings());
        })
    }

    function unActive(sibblings) {
        for(var i=0;i<sibblings.length;i++){
            var $sibl = $(sibblings[i]);
            $sibl.removeClass("active");
        }
    }
    
    function hiddenSibblings(sibblings,obj) {
        for(var i=0;i<sibblings.length;i++){
            var $sibl = $(sibblings[i]);
            var $mainMenuIcon = $sibl.find(".mainMenu-icon");
            if($mainMenuIcon.hasClass("active"))$mainMenuIcon.removeClass("active");
            if($sibl.find(".menu-arrow").hasClass("rotate180"))$sibl.find(".menu-arrow").removeClass("rotate180");
            $sibl.find(".menu-children").slideUp(obj.toggleSpeed);
        }
    }

    function getChildrenHtml(child){
        var html='';
        if(child.children && child.children.length>0){
            for(var i=0;i<child.children.length;i++){
                var chil = child.children[i];
                chil.iconSvg=chil.icon?svgStore.menuIcon[chil.icon]:"";
                if(chil.children && chil.children.length>0){
                    getChildrenHtml(chil);
                    html+=replaceHtmlTemplate("",menuTemp.menuChildParent,chil);
                }else{
                    chil.iconSvg = svgStore.menuIcon["caret-right"];
                    chil.url = basePath+"/"+chil.url;
                    html+=replaceHtmlTemplate("",menuTemp.menuLast,chil);
                }
            }
            child.childrenList = html;
        }
    }

};

