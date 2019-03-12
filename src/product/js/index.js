$(function() {
    function pageInit() {
        // window.toast('你好');
        // window.toast(args.name);
        window.toast(args.age);
        fetchData();
    }

    function fetchData() {
        var params = {"detail":{"model":"Shopv2","action":"getDetail","parameters":{"gid":"105553"}},"comment":{"model":"Comment","action":"getList","parameters":{"goods_id":"105553","orderby":"1","pageindex":"0","pagesize":3}},"activity":{"model":"Activity","action":"getAct","parameters":{"gid":"105553"}}};
        $.Ajax(params, function(data) {
            render(data);
        }, () => toast('加载活动列表失败'), '/app/shop/pipe');
    }

    function render(datauuu) {
        console.log(datauuu);
        let detail = datauuu.detail.etag;
        let etag = document.querySelector('#etag');
        etag.innerHTML = detail;

        let time = document.querySelector('#time');
        let now = datauuu.detail.data.now;
        time.innerHTML = now;

        let img = document.querySelector('#img');
        let logo = datauuu.detail.data.brand.logo;
        img.src = logo

    }
    

    pageInit();
});
